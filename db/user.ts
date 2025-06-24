import { pgTable, text, timestamp, uuid, json, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const table = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  plan: text("plan").notNull().default('free'),
  credits: numeric("credits").notNull().default('0'),
  resources: json("resources").notNull().default([]),
  available_models: json("available_models").notNull().default([]),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});