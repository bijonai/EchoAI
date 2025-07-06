import type { Message } from "~/types";
import type { NextType } from ".";
import type { Step } from "~/types/timeline";
import { chat } from "~/endpoint";

export default function useSpeaker(
  nextType: NextType,
  info: ChatInfo,
) {
  const messages = ref<Message[]>([])

  async function next(step: Step) {
    if (nextType.value !== 'next') return
    nextType.value = 'prohibited'
    messages.value.push({
      role: 'speaker',
      content: '',
    })
    await chat.speaker({
      chat_id: info.chat_id,
      step,
    }, {
      onChunk(chunk) {
        messages.value[messages.value.length - 1].content += chunk
      },
    }, info.token)
    // nextType.value = 'next'
  }

  return {
    messages,
    next,
  }
}