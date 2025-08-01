import db, { chats } from "~/db";
import { BaseResponse } from "~/types/response";
import { getUserId } from "~/utils/tool";

export interface CreateChatParams { }

export type CreateChatResponse = BaseResponse<{
  id: string
}>

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const [{ id }] = await db.insert(chats).values({
    uid: userId,
    title: 'New Chat',
    status: 'init',
    pages: {},
    context: '[]',
    messages: '[]',
    design: {},
    tasks: '[]',
    current: {},
  }).returning({ id: chats.id })
  if (!id) {
    return {
      success: false,
      message: 'Create chat failed',
    }
  }
  return {
    success: true,
    data: { id },
  }
})
