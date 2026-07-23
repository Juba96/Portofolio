import { createFileRoute } from "@tanstack/react-router";

import { GEMINI_MODEL, chatInput, geminiRequestBody } from "@/lib/api/chat-prompt";
import { checkChatRequest } from "@/lib/api/rate-limit";

// Streaming chat endpoint: proxies Gemini's SSE stream to the browser as plain
// text chunks, so replies start rendering in ~0.5s instead of after the full
// generation. Non-2xx responses tell the client to fall back to the
// non-streaming askPortfolioChat server function (and then the keyword matcher).
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rejected = checkChatRequest(request);
        if (rejected) return rejected;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return new Response("LLM not configured", { status: 503 });

        let parsed;
        try {
          parsed = chatInput.safeParse(await request.json());
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        if (!parsed.success) return new Response("Invalid request", { status: 400 });

        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`,
          {
            method: "POST",
            headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify(geminiRequestBody(parsed.data.messages)),
          },
        );
        if (!upstream.ok || !upstream.body) {
          console.error("portfolio chat stream: Gemini", upstream.status, await upstream.text());
          return new Response("Upstream error", { status: 502 });
        }

        // Re-encode Gemini's SSE events ("data: {json}\n\n") as raw text.
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const stream = new ReadableStream<Uint8Array>({
          async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              try {
                const event = JSON.parse(line.slice(6)) as {
                  candidates?: { content?: { parts?: { text?: string }[] } }[];
                };
                const text = (event.candidates?.[0]?.content?.parts ?? [])
                  .map((p) => p.text ?? "")
                  .join("");
                if (text) controller.enqueue(encoder.encode(text));
              } catch {
                // Partial/keep-alive line — skip.
              }
            }
          },
          cancel() {
            void reader.cancel();
          },
        });

        return new Response(stream, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
