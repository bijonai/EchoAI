import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { ChatMessage } from "~/types/message"
import { BaseResponse } from "~/types/response"
import { Status } from "~/types/shared"
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
  const { status } = await pull({
    id: chats.id,
    uid: chats.uid,
    status: chats.status,
  })

  return {
    success: true,
    data: status,
  } satisfies BaseResponse<Status>
})