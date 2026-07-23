import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import { checkChatRequest } from "./rate-limit";

// Single-admin auth: ADMIN_PASSWORD lives in env (Railway variables / .env).
// A successful login sets a signed, expiring session token in an httpOnly
// SameSite=Strict cookie — not readable by page scripts, not sent cross-site.
// Every admin server fn calls `await requireAdmin()` first.
//
// Uses Web Crypto (not node:crypto): this module's non-handler code is still
// evaluated in the browser bundle, and importing node builtins there crashes
// the /admin route in dev.

const COOKIE = "admin_session";
const SESSION_DAYS = 30;

const encoder = new TextEncoder();

async function hmacHex(message: string): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pw),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string comparison.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [expiresStr, mac] = token.split(".");
  const expires = Number(expiresStr);
  if (!expires || !mac || expires < Date.now()) return false;
  return safeEqual(mac, await hmacHex(expiresStr));
}

/** Throws unless the request carries a valid admin session cookie.
 * Wrapped as server-only so the client bundle gets a throwing stub instead
 * of a build error over the server-only cookie API. */
export const requireAdmin = createServerOnlyFn(async (): Promise<void> => {
  if (!(await verifyToken(getCookie(COOKIE)))) {
    throw new Error("Unauthorized");
  }
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    // Reuse the chat limiter as brute-force protection.
    if (checkChatRequest(getRequest())) return { ok: false };

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || !safeEqual(data.password, expected)) return { ok: false };

    const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    const token = `${expires}.${await hmacHex(String(expires))}`;
    // Secure flag only over HTTPS — on plain-http localhost dev the browser
    // drops Secure cookies, which silently broke session persistence.
    const req = getRequest();
    const isHttps =
      new URL(req.url).protocol === "https:" ||
      req.headers.get("x-forwarded-proto") === "https";
    setCookie(COOKIE, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

// Lets the /admin page know whether a valid session already exists.
export const adminSession = createServerFn({ method: "GET" }).handler(async () => ({
  authed: await verifyToken(getCookie(COOKIE)),
}));
