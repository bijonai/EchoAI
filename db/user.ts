import { pgTable, text, timestamp, uuid, json, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const infinityTo2099 = sql`timestamp '2099-12-31 23:59:59'`

export const table = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  plan: text("plan").notNull().default('free'),
  expire: timestamp("expire").notNull().default(infinityTo2099),
  credits: numeric("credits").notNull().default('0'),
  resources: json("resources").notNull().default([]),
  available_models: json("available_models").notNull().default([]),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});