import Anthropic from "@anthropic-ai/sdk";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { checkChatRequest } from "./rate-limit";

import {
  GEMINI_MODEL,
  SYSTEM_PROMPT,
  chatInput,
  geminiRequestBody,
  type ChatTurn,
} from "./chat-prompt";

// Non-streaming portfolio chat — the fallback behind the streaming route
// (routes/api.chat.ts). API keys stay server-side (.env locally / Railway
// variables in prod); the browser only ever talks to server endpoints. When no
// provider is available the client falls back to its built-in keyword matcher,
// so the chat never breaks.

async function askGemini(messages: ChatTurn[], apiKey: string): Promise<string | null> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(geminiRequestBody(messages)),
    },
  );
  if (!res.ok) throw new Error(`Gemini API ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (body.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  return text || null;
}

async function askClaude(messages: ChatTurn[]): Promise<string | null> {
  const response = await new Anthropic().messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });
  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  return reply || null;
}

export const askPortfolioChat = createServerFn({ method: "POST" })
  .inputValidator(chatInput)
  .handler(async ({ data }) => {
    // Same abuse guard as /api/chat — server functions are public HTTP
    // endpoints too. A rejected request degrades to the keyword fallback.
    if (checkChatRequest(getRequest())) return { reply: null };

    // Provider chain: Gemini (free tier) → Claude Haiku (if key set) →
    // { reply: null }, which the client turns into the keyword fallback.
    if (process.env.GEMINI_API_KEY) {
      try {
        return { reply: await askGemini(data.messages, process.env.GEMINI_API_KEY) };
      } catch (error) {
        console.error("portfolio chat: Gemini call failed", error);
      }
    }
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        return { reply: await askClaude(data.messages) };
      } catch (error) {
        console.error("portfolio chat: Claude call failed", error);
      }
    }
    return { reply: null };
  });
