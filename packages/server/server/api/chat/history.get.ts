import db from "../../../db/index";
import { UNAUTHORIZED_MODE } from "@echoai/utils";
import { UNAUTHORIZED_MODE_USER_ID } from "@echoai/utils";
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
