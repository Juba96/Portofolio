import { and, eq, gt } from "drizzle-orm";

import { db, schema } from "@/db";
import type { ChatTurn } from "./chat-prompt";

// Post-processing for chat exchanges: transcript logging and in-chat lead
// capture. Everything here is fire-and-forget — errors are logged and
// swallowed so the visitor's reply is never delayed or broken.

export function logChatExchange(question: string, answer: string, provider: string) {
  db()
    .insert(schema.chatLogs)
    .values({ question: question.slice(0, 4000), answer: answer.slice(0, 8000), provider })
    .then(() => {})
    .catch((error) => console.error("chat log insert failed", error));
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

// If the visitor's latest message contains an email address, record it as a
// lead (source 'chat') with recent conversation context. Deduped per email
// per 24h so an enthusiastic visitor doesn't create a pile of rows.
export async function captureChatLead(messages: ChatTurn[]) {
  try {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") return;
    const email = last.content.match(EMAIL_RE)?.[0];
    if (!email) return;

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await db()
      .select({ id: schema.contactMessages.id })
      .from(schema.contactMessages)
      .where(
        and(
          eq(schema.contactMessages.email, email),
          gt(schema.contactMessages.createdAt, dayAgo),
        ),
      )
      .limit(1);
    if (existing.length > 0) return;

    // Recent user turns as context, so the lead row explains what they wanted.
    const context = messages
      .filter((m) => m.role === "user")
      .slice(-3)
      .map((m) => m.content)
      .join("\n");

    await db().insert(schema.contactMessages).values({
      name: "Chat visitor",
      email,
      message: context.slice(0, 4000),
      source: "chat",
    });
  } catch (error) {
    console.error("chat lead capture failed", error);
  }
}
