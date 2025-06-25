import { and, eq } from "drizzle-orm"
import db from "~/db"
import { withAuth } from "~/types/auth"
import { chats } from "~/db"
import { generateObject, Message } from "xsai"
import { Message as ChatMessage, DesignerRequestBody } from "~/types"
import { DesignerResult } from "~/types"
import { createDesigner } from "~/workflow/designer"
import { Branch, Step } from "~/types/timeline"
import createUpdate from "~/utils/update"

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as DesignerRequestBody
  const userId = (event as unknown as withAuth)["userId"]

  const [{ readChatContext, readContext, readResults, readBranches }] = await db.select({
    readChatContext: chats.designer_context,
    readContext: chats.context,
    readResults: chats.designer_results,
    id: chats.id,
    uid: chats.uid,
    readBranches: chats.branches,
  }).from(chats).where(and(eq(chats.uid, userId), eq(chats.id, body.chat_id)))

  const context = (readContext ?? []) as ChatMessage[]
  const chatContext = (readChatContext ?? []) as Message[]
  const results = (readResults ?? []) as DesignerResult[]
  const branches = (readBranches ?? []) as Branch[]

  const designer = createDesigner(chatContext)
  const object = await designer({
    prompt: body.prompt,
    refs: body.refs,
    step: body.step,
    chat_id: body.chat_id,
  })
  results.push({
    prompt: body.prompt,
    result: object,
    step: body.step,
  })
  context.push({
    role: 'processor',
    content: 'Timeline Generated',
    step: object[0],
  })
  branches.push({
    steps: object,
    start: body.step,
    end: body.next_step,
  })
  const update = createUpdate(body.chat_id)
  event.waitUntil(update({
    designer_context: chatContext,
    designer_results: results,
    context,
    branches,
  }))

  return {
    branches,
    messages: context,
  }
})  
