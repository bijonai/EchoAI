import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "@/utils/env";

console.log("DATABASE_URL", DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/chats.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
