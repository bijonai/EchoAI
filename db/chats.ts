import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  uid: text("uid").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  context: json("context").notNull().default([]),
  status: text("status").notNull().default('init'),
  pages: json("pages").notNull().default([]),
  messages: json("messages").notNull().default([]),
  design: json("design").notNull().default({ root: [] }),
  title: text("title").notNull().default(''),
  tasks: json("tasks").notNull().default([]),
  current: json("current").notNull().default({})
});

