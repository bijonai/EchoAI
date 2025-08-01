import { chat, unwrap } from "~/endpoint";
import type { ChatInfo } from ".";
import type { ChatMessage } from "~/types/message";

export function useMessages({ chatId, token }: ChatInfo) {
  const messages = ref<ChatMessage[]>([])

  async function pull() {
    const response = await chat.messages({
      chatId, token
    })
    const [data, error] = unwrap(response)
    if (error) {
      return console.error(error)
    }
    messages.value = data
  }
  
  return {
    messages,
    pull,
  }
}