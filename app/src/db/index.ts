import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Server-only Neon + Drizzle client. The neon-http driver talks to Neon over
// fetch, so it works identically under Bun (Railway), Node, and edge runtimes.
//
// DATABASE_URL is read lazily, per call — not at module scope — so importing
// this file never crashes a build or a request that doesn't touch the DB.
let cached: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env (local) or Railway service variables (production).",
    );
  }
  return drizzle(neon(url), { schema });
}

export function db() {
  cached ??= createDb();
  return cached;
}

export { schema };
