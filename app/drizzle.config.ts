import { defineConfig } from "drizzle-kit";

// Run via `bun run db:*` scripts — Bun auto-loads .env, so DATABASE_URL is
// available without a dotenv import.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
