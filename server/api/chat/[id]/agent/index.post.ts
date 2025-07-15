import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { action, TaskCreatedAction } from "~/types/agent"
import { getUserId } from "~/utils/tool"
import { createAgent } from "~/workflow/agent"

export interface AgentParams {
  input: string
}

export default defineEventHandler(async (event) => {
  const stream = createEventStream(event)
  const userId = getUserId(event)
  const params = await readBody(event)
  const { pull, apply } = useChat(db, { chatId: params.chatId, userId })
  const { tasks, pages, context } = await pull({
    id: chats.id,
    uid: chats.uid,
    pages: chats.pages,
    context: chats.context,
    tasks: chats.tasks,
  })

  const agent = createAgent(context)
  for await (const act of agent({
    input: params.input,
    pages,
  })) {
    if (act.type === 'layout-done') {
      if (!act.success) return
      const { data } = await $fetch('/api/chat/:id/task/create', {
        method: 'POST',
        body: {
          task: {
            type: 'chalk',
            data: {
              input: act.data.layout,
              page: act.data.page,
            }
          }
        }
      })
      stream.push(JSON.stringify(
        action<TaskCreatedAction>('task-created', {
          id: data.id,
        })
      ))
    }
    stream.push(JSON.stringify(action))
  }

  return stream
})