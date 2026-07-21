import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { db, schema } from "@/db";

// Server functions backed by Neon via Drizzle. Call from any component:
//   await submitContactMessage({ data: { name, email, message } })
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(200),
      email: z.string().email().max(320),
      message: z.string().min(1).max(5000),
    }),
  )
  .handler(async ({ data }) => {
    const [row] = await db()
      .insert(schema.contactMessages)
      .values(data)
      .returning({ id: schema.contactMessages.id });
    return { ok: true, id: row.id };
  });

export const listContactMessages = createServerFn({ method: "GET" }).handler(async () => {
  return db()
    .select()
    .from(schema.contactMessages)
    .orderBy(desc(schema.contactMessages.createdAt))
    .limit(50);
});
