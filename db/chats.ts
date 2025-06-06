import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json } from "drizzle-orm/pg-core";

export const table = pgTable("chats", {
  id: uuid("chat_id").primaryKey().default(sql`gen_random_uuid()`),
  uid: text("uid").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  context: json("context").notNull().default([]),
  board: json("board").notNull().default({}),
  branches: json("branches").notNull().default([]),
  designer_context: json("designer_context").notNull().default([]),
  designer_results: json("designer_results").notNull().default([]),
  speaker_context: json("speaker_context").notNull().default([]),
  speaker_results: json("speaker_results").notNull().default([]),
  layout_context: json("layout_context").notNull().default([]),
  layout_results: json("layout_results").notNull().default([]),
  chalk_context: json("chalk_context").notNull().default([]),
  chalk_results: json("chalk_results").notNull().default([]),
});

