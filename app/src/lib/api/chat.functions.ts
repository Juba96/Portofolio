import Anthropic from "@anthropic-ai/sdk";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Claude-powered portfolio chat. The API key stays server-side
// (ANTHROPIC_API_KEY in .env locally / Railway variables in prod) — the
// browser only ever talks to this server function. When the key is missing or
// the API call fails we return { reply: null } and the client falls back to
// the built-in keyword matcher, so the chat never breaks.

const PROFILE = `
# Identity
Taha Yasir — AI Product Builder & Senior VAS Product Manager. Based in Baghdad, Iraq.
7+ years shipping carrier billing, VAS, and AI products across MENA with Tier-1 operators.

# Current roles
- Senior VAS & Product Development Manager at Al-Bawaba Telecom (2022–present): partner
  onboarding and account management across Iraq, Saudi Arabia, UAE, and Algeria; technical
  integrations; SLM frameworks for billing & reporting; verticals include E-Sports, Music,
  Video, Gaming, Fitness, and E-Learning.
- Founder of Qaysariya Studio: an independent product studio designing and shipping
  AI-directed, monetized digital products for MENA markets end-to-end.
- Previously: IT Engineer at Metco (2018–2022) supporting Zain Iraq.

# Products (Qaysariya Studio)
- QuizQ — Arabic-first bilingual true-or-false speed-quiz PWA. Timed questions, monthly
  leaderboards, real prizes (phones, cash); game tokens paid via Direct Carrier Billing.
  Flagship POC for the Anthropic Claude Partner Network, prepared for launch on Zain Iraq.
- Ramba — car-wash subscription platform for Iraq. Monthly wash plans redeemable across
  partner car washes, live queue tracking, Wayl payment API with automated settlement via
  FIB / ZainCash.
- OoredooAI — AI-powered VAS & customer-acquisition engine; MVP delivered to Ooredoo
  Tunisia and Algeria. Bilingual chat for subscribers, balance/data queries, image
  generation, daily/weekly plans billed straight to phone credit, AI-driven lead scoring
  and CPA optimization.
- Voyalla — AI-driven travel content app generating cinematic destination media through
  generative-AI video, voice, and character-driven storytelling.
Also led the Ooredoo Algeria Mega Promo Service launch and the Khalaspay carrier billing
integration.

# Skills
Partner development & account management, Direct Carrier Billing & subscription
management, stakeholder management, mobile payments & revenue optimization, technical
onboarding & API integrations, project delivery. Builds with AI tooling (Claude) daily.

# Education & certifications
Al-Iraqia University — College of Engineering, Networks Department (2014–2018).
CS50, Harvard University (2020). Recoded for Entrepreneurship (2018).
Avaya Certified Implementation Specialist & Support Specialist (2020).

# Languages
Arabic — native. English — professional.

# Contact
Email: tahayasser96@gmail.com
Phone / WhatsApp: +964 783 829 1196
LinkedIn: linkedin.com/in/taha-algburi
Location: Baghdad, Iraq
`;

const SYSTEM_PROMPT = `You are the AI assistant on Taha Yasir's portfolio website, speaking AS Taha in the first person ("I", "my"). Visitors are potential clients, employers, and telecom partners.

Everything you know about Taha:
${PROFILE}

Rules:
- Answer only from the facts above. If asked something you don't know about Taha, say so briefly and steer toward what you do know or suggest reaching out directly.
- Keep replies short and conversational: 1–4 sentences for most questions. No markdown formatting, no bullet lists unless listing contact details — the chat UI renders plain text.
- Match the visitor's language (reply in Arabic if they write in Arabic).
- When a visitor sounds like a potential client or partner (mentions a project, hiring, collaboration, telecom/VAS needs), warmly encourage them to reach out: share the email tahayasser96@gmail.com and LinkedIn linkedin.com/in/taha-algburi.
- Never invent projects, numbers, employers, or capabilities. Never discuss topics unrelated to Taha's work — politely redirect.`;

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

type ChatTurn = z.infer<typeof chatInput>["messages"][number];

// Google Gemini — free tier via aistudio.google.com (no credit card), which
// makes it the primary provider for this low-traffic chat.
async function askGemini(messages: ChatTurn[], apiKey: string): Promise<string | null> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        // Thinking off: short factual Q&A doesn't need it, and thinking
        // tokens would eat into the free-tier quota.
        generationConfig: { maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 0 } },
      }),
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
