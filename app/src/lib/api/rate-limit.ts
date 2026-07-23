// In-memory rate limiting for the public chat endpoints. The app runs as a
// single Bun instance on Railway, so process memory is an adequate store —
// a restart resetting the counters is acceptable for this threat model
// (quota abuse, not billing-critical accounting).

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10; // per IP per minute
const DAILY_GLOBAL_MAX = 300; // protects the free Gemini tier (~250/day)

const perIp = new Map<string, number[]>();
let dailyCount = 0;
let dailyResetAt = 0;

function clientIp(request: Request): string {
  // Railway's edge sets x-forwarded-for; first entry is the client.
  const fwd = request.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "local";
}

/**
 * Returns a rejection Response if the request should be blocked
 * (rate-limited or cross-origin), or null to let it proceed.
 */
export function checkChatRequest(request: Request): Response | null {
  // Cross-site calls: browsers send an Origin header on cross-origin POSTs.
  // Same-origin requests carry the site's own host; non-browser clients
  // (curl) send none — allowed, they're covered by rate limits below.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return new Response("Forbidden", { status: 403 });
      }
    } catch {
      return new Response("Forbidden", { status: 403 });
    }
  }

  const now = Date.now();

  if (now > dailyResetAt) {
    dailyResetAt = now + 24 * 60 * 60 * 1000;
    dailyCount = 0;
  }
  if (dailyCount >= DAILY_GLOBAL_MAX) {
    return new Response("Chat is resting — try again tomorrow.", { status: 429 });
  }

  const ip = clientIp(request);
  const cutoff = now - WINDOW_MS;
  const recent = (perIp.get(ip) ?? []).filter((t) => t > cutoff);
  if (recent.length >= MAX_PER_WINDOW) {
    perIp.set(ip, recent);
    return new Response("Too many messages — slow down a little.", { status: 429 });
  }

  recent.push(now);
  perIp.set(ip, recent);
  dailyCount += 1;

  // Cheap housekeeping so the map can't grow unboundedly.
  if (perIp.size > 5000) {
    for (const [key, times] of perIp) {
      if (times.every((t) => t <= cutoff)) perIp.delete(key);
    }
  }
  return null;
}
