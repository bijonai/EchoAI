import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json, numeric } from "drizzle-orm/pg-core";

export const resource = pgTable("resource", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  tags: json("tags").notNull().default([]),
  author: text("author").notNull(),
  author_id: text("author_id").notNull(),
  description: text("description").notNull().default(''),
  readme: text("readme").notNull().default(''),
  sources: json("sources").notNull().default({}),
  metadata: json("metadata").notNull().default({}),
  value: numeric("value").notNull().default('0'),
});