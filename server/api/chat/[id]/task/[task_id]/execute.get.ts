import db, { chats } from "~/db";
import { useChat } from "~/db/composables/useChat";
import { Operation } from "~/types/operation";
import { Status } from "~/types/shared";
import { getUserId } from "~/utils/tool";
import { createChalk } from "~/workflow/chalk";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const params = getRouterParams(event)
  const chatId = params.id
  const taskId = params.task_id

  console.log(chatId, taskId)

  const { pull, apply, updateTaskStatus, updatePageChalkContext, updatePageOperation } = useChat(db, { chatId, userId })
  let task, tasks, pages;
  try {
    ({ tasks, pages } = await pull({
      id: chats.id,
      uid: chats.uid,
      tasks: chats.tasks,
      pages: chats.pages,
    }))
    task = tasks.find(task => task.id === taskId)
    if (!task) {
      throw new Error('Task not found')
    }
  } catch (error) {
    return new Response('Task not found', { status: 404 })
  }
  

  updateTaskStatus(taskId, Status.PENDING)
  await apply()

  const stream = createEventStream(event);

  (async () => {
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

        let operations: Operation[] = []

        for await (const action of generator) {
          if (!action.success) {
            updateTaskStatus(taskId, Status.FAILED)
            await apply()
            break
          }
          if (action.type === 'chalk-context-update') {
            updatePageChalkContext(task.data.page, action.data.context)
            await apply()
            continue
          } else if (action.type === 'chalk-operate') {
            operations.push(action.data.operation)
          } else if (action.type === 'chalk-end') {
            updateTaskStatus(taskId, Status.COMPLETED)
            await apply()
          }
          await stream.push(JSON.stringify(action))
        }

        updatePageOperation(task.data.page, operations)
        await apply()
        break
      default:
        updateTaskStatus(taskId, Status.FAILED)
        await apply()
        break
    }

    await stream.close();
  })()

  return stream.send();
})