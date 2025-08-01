import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { PageStore } from "~/types/page"
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
  const { pages } = await pull({
    id: chats.id,
    uid: chats.uid,
    pages: chats.pages
  })

  return {
    success: true,
    data: pages,
  } satisfies BaseResponse<PageStore>
})