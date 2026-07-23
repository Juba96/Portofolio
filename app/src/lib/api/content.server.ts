import { db, schema } from "@/db";
import { DEFAULT_CONTENT } from "@/content/defaults";
import { siteContentSchema, type SiteContent } from "@/content/schema";

// Server-side content access with an in-memory cache (single Railway
// instance). Saved content deep-merges over DEFAULT_CONTENT so a partial or
// stale document can never break rendering; any DB failure falls back to the
// defaults — the portfolio always renders.

let cache: SiteContent | null = null;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Objects merge key-by-key; arrays and scalars replace wholesale.
function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return (patch === undefined ? base : (patch as T)) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] = deepMerge((base as Record<string, unknown>)[key], value);
  }
  return out as T;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (cache) return cache;
  try {
    const rows = await db().select().from(schema.siteContent).limit(1);
    if (rows.length === 0) {
      cache = DEFAULT_CONTENT;
      return cache;
    }
    const merged = deepMerge(DEFAULT_CONTENT, rows[0].data);
    const parsed = siteContentSchema.safeParse(merged);
    cache = parsed.success ? parsed.data : DEFAULT_CONTENT;
    if (!parsed.success) {
      console.error("site content in DB failed validation; serving defaults", parsed.error);
    }
  } catch (error) {
    console.error("site content read failed; serving defaults", error);
    return DEFAULT_CONTENT; // don't cache failures — retry next request
  }
  return cache;
}

export function invalidateContentCache() {
  cache = null;
}
