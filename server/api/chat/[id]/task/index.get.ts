import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { BaseResponse } from "~/types/response"
import { Task } from "~/types/task"
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
  const { tasks } = await pull({
    id: chats.id,
    uid: chats.uid,
    task: chats.tasks,
  })

  return {
    success: true,
    data: tasks,
  } satisfies BaseResponse<Task[]>
})