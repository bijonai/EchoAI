import db, { chats } from "~/db";
import { useChat } from "~/db/composables/useChat";
import { BaseResponse } from "~/types/response";
import { Status } from "~/types/shared";
import { getUserId } from "~/utils/tool";
import { createChalk } from "~/workflow/chalk";

export interface ExecuteTaskParams {

}

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const params = getRouterParams(event)
  const chatId = params.id
  const taskId = params.task_id

  const { pull, apply, updateTaskStatus } = useChat(db, { chatId, userId })
  const { tasks, pages } = await pull({
    id: chats.id,
    uid: chats.uid,
    tasks: chats.tasks,
    pages: chats.pages,
  })
  const task = tasks.find(task => task.id === taskId)!

  updateTaskStatus(taskId, Status.PENDING)
  await apply()

  const stream = createEventStream(event)
  switch (task.type) {
    case 'chalk':
      updateTaskStatus(taskId, Status.RUNNING)
      await apply()
      const page = pages[task.data.page.toString()]!
      const chalk = createChalk(page.chalk_context)
      const generator = chalk({
        input: task.data.input,
        page: task.data.page,
        chunks: page.knowledge,
      })
      for await (const action of generator) {
        stream.push(JSON.stringify(action))
      }
      updateTaskStatus(taskId, Status.COMPLETED)
      await apply()
      break
    default:
      updateTaskStatus(taskId, Status.FAILED)
      await apply()
      break
  }
})