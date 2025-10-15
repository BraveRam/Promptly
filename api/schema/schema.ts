import { pgTable, serial, text, timestamp, integer, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegram_id: text("telegram_id").notNull(),
  username: text("username"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  created_at: timestamp("created_at").defaultNow(),
});