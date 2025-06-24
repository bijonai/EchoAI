import { eq } from "drizzle-orm";
import { table as chats } from "@/db/chats";
import db from "@/db";

export default function createUpdate(id: string) {
  return async (payload: object) => {
    await db.update(chats)
      .set(payload)
      .where(eq(chats.id, id))
    console.log(`[${Date.now()}] UPDATE ${id}`)
  }
}