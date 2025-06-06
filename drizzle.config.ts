import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv'

dotenv.config({
  path: '../../.env',
})

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/chats.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
