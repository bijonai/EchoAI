import db, { chats } from "~/db";
import { useChat } from "~/db/composables/useChat";
import { getUserId } from "~/utils/tool";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const { id } = getRouterParams(event)

  const { pull } = useChat(db, { chatId: id, userId })

  const chat = await pull({
    id: chats.id,
    uid: chats.uid,
    messages: chats.messages,
    pages: chats.pages,
    design: chats.design,
    current: chats.current,
  })

  return {
    success: true,
    data: chat,
  }
})