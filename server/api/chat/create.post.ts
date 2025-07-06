import db from "~/db"
import { CreateChatRequestBody, CreateChatResponse } from "~/types"
import { withAuth } from "~/types/auth"
import { chats } from "~/db"

export const config = {
  runtime: 'edge'
}

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as CreateChatRequestBody
  const userId = (event as unknown as withAuth)['userId']
  const [chat] = await db.insert(chats)
    .values({
      uid: userId,
      context: [{ role: 'user', content: body.prompt }],
    })
    .returning({ id: chats.id })
  return {
    chat_id: chat.id,
  } satisfies CreateChatResponse
})
