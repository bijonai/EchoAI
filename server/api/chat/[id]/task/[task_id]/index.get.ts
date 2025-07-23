import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { getUserId } from "~/utils/tool"

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const params = getRouterParams(event)
  const chatId = params.id
  const taskId = params.task_id

  const { pull } = useChat(db, { chatId, userId })
  const { tasks } =  await pull({
    id: chats.id,
    uid: chats.uid,
    tasks: chats.tasks,
  })
  const task = tasks.find(task => task.id === taskId)
  if (!task) {
    return {
      success: false,
      data: null,
      message: 'Task not found',
    }
  }
  return {
    success: true,
    data: task,
  }
})