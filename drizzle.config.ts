import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "@/utils/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/chats.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
