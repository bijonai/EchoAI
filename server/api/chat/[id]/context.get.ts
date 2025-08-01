import { Message } from "ai"
import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { ChatMessage } from "~/types/message"
import { BaseResponse } from "~/types/response"
import { getUserId } from "~/utils"

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const chatId = getRouterParam(event, 'id')

  if (!chatId || !userId) {
    return createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const { pull } = useChat(db, {
    userId, chatId,
  })
  const { context } = await pull({
    id: chats.id,
    uid: chats.uid,
    context: chats.context
  })

  return {
    success: true,
    data: context,
  } satisfies BaseResponse<Message[]>
})