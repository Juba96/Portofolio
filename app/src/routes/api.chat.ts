import { createFileRoute } from "@tanstack/react-router";

import { GEMINI_MODELS, buildSystemPrompt, chatInput, geminiRequestBody } from "@/lib/api/chat-prompt";
import { captureChatLead, logChatExchange } from "@/lib/api/chat-intel.server";
import { getSiteContent } from "@/lib/api/content.server";
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
        const messages = parsed.data.messages;

        // System prompt is built from the live (cached) site content, so
        // /admin edits change what the agent knows without a redeploy.
        const systemPrompt = buildSystemPrompt(await getSiteContent());

        // Try models in order — quota exhaustion or overload on one model
        // (429/5xx) falls through to the next.
        let upstream: globalThis.Response | null = null;
        for (const model of GEMINI_MODELS) {
          const attempt = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
            {
              method: "POST",
              headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
              body: JSON.stringify(geminiRequestBody(messages, systemPrompt, model)),
            },
          );
          if (attempt.ok && attempt.body) {
            upstream = attempt;
            break;
          }
          console.error("portfolio chat stream:", model, attempt.status, await attempt.text());
        }
        if (!upstream?.body) return new Response("Upstream error", { status: 502 });

        // Re-encode Gemini's SSE events ("data: {json}\n\n") as raw text.
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";
        let fullAnswer = "";

        // Eager read loop (not pull-based): some server runtimes stop calling
        // pull() near stream end, which left the response hanging — visitors
        // saw endless typing dots and post-processing never ran. The loop
        // always observes upstream EOF, closes the response, and then logs.
        const stream = new ReadableStream<Uint8Array>({
          start: async (controller) => {
            try {
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
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
                    if (text) {
                      fullAnswer += text;
                      controller.enqueue(encoder.encode(text));
                    }
                  } catch {
                    // Partial/keep-alive line — skip.
                  }
                }
              }
            } finally {
              try {
                controller.close();
              } catch {
                // Consumer already gone — nothing to close.
              }
              // Post-processing after the reply finished — never blocks it.
              const question = messages[messages.length - 1]?.content ?? "";
              if (fullAnswer.trim()) logChatExchange(question, fullAnswer, "gemini");
              void captureChatLead(messages);
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
