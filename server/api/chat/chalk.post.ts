import { eq, and } from "drizzle-orm"
import { ChalkRequestBody, ChalkResult, ChatResource, Operation } from "~/types"
import { withAuth } from "~/types/auth"
import db from "~/db"
import { chats } from "~/db"
import { createChalk } from "~/workflow/chalk"
import createUpdate from "~/utils/update"
import { message } from "~/utils/ai-sdk/message"
import { Message } from "ai"

export const config = {
  runtime: 'edge'
}

export default defineEventHandler(async (event) => {
  const stream = createEventStream(event)
  const body = JSON.parse(await readBody(event)) as ChalkRequestBody
  const userId = (event as unknown as withAuth)['userId']
  const [{ readContext, readResults, readResource }] = await db.select({
    readContext: chats.chalk_context,
    readResults: chats.chalk_results,
    readResource: chats.resource,
    id: chats.id,
    uid: chats.uid,
  }).from(chats).where(and(
    eq(chats.uid, userId),
    eq(chats.id, body.chat_id)
  ))

  // Ensure arrays with proper type casting
  const context = Array.isArray(readContext) ? [...readContext] as Message[] : [] as Message[]
  const results = Array.isArray(readResults) ? [...readResults] as ChalkResult[] : [] as ChalkResult[]
  const resource = readResource as ChatResource

  const chalk = createChalk(context, resource.knowledge)
  return chalk(body, (operations, content) => {
    // Create new arrays for updates
    const updatedContext = [...context, message.assistant(content)]
    const updatedResults = [...results, {
      layout: body.layout,
      components: body.components ?? [],
      output: operations,
      step: body.step,
      page: body.page_id,
    }]

    // Use await instead of event.waitUntil for database update
    const update = createUpdate(body.chat_id)
    update({
      chalk_context: updatedContext,
      chalk_results: updatedResults,
      resource: {
        knowledge: resource.knowledge
      }
    })
  })
})
