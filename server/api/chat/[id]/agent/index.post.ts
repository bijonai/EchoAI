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
  const chatId = getRouterParam(event, 'id')!
  const { pull, apply, addPage, updateCurrentStep } = useChat(db, { chatId, userId })
  const { tasks, pages, context, design } = await pull({
    id: chats.id,
    uid: chats.uid,
    pages: chats.pages,
    context: chats.context,
    tasks: chats.tasks,
    design: chats.design,
  })

  const agent = createAgent(context)
  for await (const act of agent({
    input: params.input,
    pages,
    design,
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
    } else if (act.type === 'create-page') {
      if (!act.success) return
      addPage(act.data.title)
    } else if (act.type === 'design-branch') {
      if (!act.success) return
      // TODO: design branch
    } else if (act.type === 'step-to') {
      if (!act.success) return
      updateCurrentStep(act.data.step)
    }
    await apply()
    stream.push(JSON.stringify(action))
  }

  return stream
})