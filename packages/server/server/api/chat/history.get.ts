import db from "../../../db/index";
import { eq, desc } from "drizzle-orm";
import { table as chats } from '../../../db/chats'

export default defineEventHandler(async (event) => {
  const userId = event["userId"];

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
