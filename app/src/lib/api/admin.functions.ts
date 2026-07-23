import { createServerFn } from "@tanstack/react-start";
import { asc, count, desc, eq, gt } from "drizzle-orm";
import { z } from "zod";

import { db, schema } from "@/db";
import { siteContentSchema } from "@/content/schema";
import { requireAdmin } from "./admin-auth.functions";
import { getSiteContent, invalidateContentCache } from "./content.server";

// Everything the /admin dashboard reads and writes. Every handler starts with
// requireAdmin() — no session cookie, no data.

export const adminStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const d = db();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [leadsByStatus, chatsTotal, chatsDay, chatsWeek] = await Promise.all([
    d
      .select({ status: schema.contactMessages.status, n: count() })
      .from(schema.contactMessages)
      .groupBy(schema.contactMessages.status),
    d.select({ n: count() }).from(schema.chatLogs),
    d.select({ n: count() }).from(schema.chatLogs).where(gt(schema.chatLogs.createdAt, dayAgo)),
    d.select({ n: count() }).from(schema.chatLogs).where(gt(schema.chatLogs.createdAt, weekAgo)),
  ]);

  return {
    leads: Object.fromEntries(leadsByStatus.map((r) => [r.status, r.n])) as Record<string, number>,
    chats: { total: chatsTotal[0]?.n ?? 0, day: chatsDay[0]?.n ?? 0, week: chatsWeek[0]?.n ?? 0 },
  };
});

export const adminListLeads = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db()
    .select()
    .from(schema.contactMessages)
    .orderBy(desc(schema.contactMessages.createdAt))
    .limit(200);
});

export const adminSetLeadStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ id: z.number().int(), status: z.enum(["new", "contacted", "closed"]) }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await db()
      .update(schema.contactMessages)
      .set({ status: data.status })
      .where(eq(schema.contactMessages.id, data.id));
    return { ok: true };
  });

export const adminListChatLogs = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db().select().from(schema.chatLogs).orderBy(desc(schema.chatLogs.createdAt)).limit(150);
});

export const adminGetContent = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return getSiteContent();
});

export const adminSaveContent = createServerFn({ method: "POST" })
  .inputValidator(siteContentSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const d = db();
    // Keep the previous version as a revision before overwriting.
    const current = await d.select().from(schema.siteContent).limit(1);
    if (current.length > 0) {
      await d.insert(schema.contentRevisions).values({ data: current[0].data });
      // Trim to the newest 20 revisions.
      const old = await d
        .select({ id: schema.contentRevisions.id })
        .from(schema.contentRevisions)
        .orderBy(desc(schema.contentRevisions.savedAt))
        .offset(20);
      for (const row of old) {
        await d.delete(schema.contentRevisions).where(eq(schema.contentRevisions.id, row.id));
      }
    }
    await d
      .insert(schema.siteContent)
      .values({ id: 1, data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.siteContent.id,
        set: { data, updatedAt: new Date() },
      });
    invalidateContentCache();
    return { ok: true };
  });

export const adminListRevisions = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db()
    .select({ id: schema.contentRevisions.id, savedAt: schema.contentRevisions.savedAt })
    .from(schema.contentRevisions)
    .orderBy(desc(schema.contentRevisions.savedAt))
    .limit(20);
});

export const adminRestoreRevision = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const d = db();
    const rows = await d
      .select()
      .from(schema.contentRevisions)
      .where(eq(schema.contentRevisions.id, data.id))
      .limit(1);
    if (rows.length === 0) return { ok: false };
    // Current content becomes a revision; the chosen revision becomes current.
    const current = await d.select().from(schema.siteContent).limit(1);
    if (current.length > 0) {
      await d.insert(schema.contentRevisions).values({ data: current[0].data });
    }
    await d
      .insert(schema.siteContent)
      .values({ id: 1, data: rows[0].data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.siteContent.id,
        set: { data: rows[0].data, updatedAt: new Date() },
      });
    invalidateContentCache();
    return { ok: true };
  });
