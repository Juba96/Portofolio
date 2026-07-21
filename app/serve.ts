// Production server for Railway (or any Bun host).
//
// `bun run build` emits:
//   dist/client/  — hashed static assets
//   dist/server/server.js — the SSR handler (`export default { fetch }`)
//
// This wrapper serves static files from dist/client and falls through to the
// SSR handler for everything else — mirroring what the Cloudflare ASSETS
// binding did in the original Workers deploy target.
import { join, normalize } from "node:path";

import server from "./dist/server/server.js";

const CLIENT_DIR = join(import.meta.dir, "dist", "client");
const port = Number(process.env.PORT ?? 3000);

const ctx = { waitUntil() {}, passThroughOnException() {} };

Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname !== "/" && !pathname.includes("\0")) {
      const filePath = normalize(join(CLIENT_DIR, pathname));
      if (filePath.startsWith(CLIENT_DIR)) {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          return new Response(file, {
            headers: {
              // Vite hashes /assets/* filenames — cache those forever.
              "cache-control": pathname.startsWith("/assets/")
                ? "public, max-age=31536000, immutable"
                : "public, max-age=3600",
            },
          });
        }
      }
    }

    return server.fetch(request, process.env, ctx);
  },
});

console.log(`Portfolio listening on http://0.0.0.0:${port}`);
