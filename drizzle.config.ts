import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
const { parsed } = dotenv.config()!;

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: parsed?.DATABASE_URL!,
  },
});
