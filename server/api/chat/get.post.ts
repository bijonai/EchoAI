import { and, eq } from "drizzle-orm"
import db from "~/db"
import { ChalkResult, GetChatRequestBody, GetChatResponse, Message } from "~/types"
import { withAuth } from "~/types/auth"
import { chats } from "~/db"
import { Branch } from "~/types/timeline"

export const config = {
  runtime: 'edge'
}

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as GetChatRequestBody
  const userId = (event as unknown as withAuth)['userId']
  const [chat] = await db.select({
    id: chats.id,
    uid: chats.uid,
    messages: chats.context,
    branches: chats.branches,
    chalk_results: chats.chalk_results,
  }).from(chats).where(
    and(eq(chats.uid, userId), eq(chats.id, body.chat_id))
  )
  return {
    chat_id: chat.id,
    messages: chat.messages as Message[],
    branches: chat.branches as Branch[],
    chalk: chat.chalk_results as ChalkResult[],
    pages: [],
  } satisfies GetChatResponse
})
