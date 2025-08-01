import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { BaseResponse } from "~/types/response"
import { Status } from "~/types/shared"
import { Task } from "~/types/task"
import { getUserId } from "~/utils/tool"

export interface CreateTaskParams {
  task: Task
}
export type CreateTaskResponse = BaseResponse<Task>

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const params = getRouterParams(event)
  const chatId = params.id

  const { task } = await readBody<CreateTaskParams>(event)
  const { addTask, pull, apply } = useChat(db, { chatId, userId })
  await pull({
    id: chats.id,
    uid: chats.uid,
    tasks: chats.tasks,
  })
  const taskId = crypto.randomUUID()
  const taskResult: Task = { ...task, id: taskId, status: Status.PENDING, createAt: new Date() }
  addTask(taskResult)
  await apply()
  return {
    success: true,
    data: taskResult,
  } satisfies CreateTaskResponse
})