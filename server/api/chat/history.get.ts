import db from "@/db";
import { eq, desc } from "drizzle-orm";
import { chats } from '@/db'
import { withAuth } from "~/types/auth"

export default defineEventHandler(async (event) => {
  const userId = (event as unknown as withAuth)['userId']

  const history = await db
    .select({
      uid: chats.uid,
      id: chats.id,
      updated_at: chats.updated_at,
    })
    .from(chats)
    .where(eq(chats.uid, userId))
    .orderBy(desc(chats.updated_at));

  return history;
});
