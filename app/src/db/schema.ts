import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Starter table: messages sent from the portfolio's contact section.
// Add further tables here, then run `bun run db:push` (dev) or
// `bun run db:generate` + `bun run db:migrate` (versioned migrations).
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
