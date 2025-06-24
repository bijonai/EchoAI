import { chat } from "~/api";
import type { ChatInfo } from ".";
import type { Message } from "~/types";
import type { Branch } from "~/types/timeline";

export default function useHistory(info: ChatInfo) {
  async function get() {
    const result = await chat.get({
      chat_id: info.chat_id,
    }, info.token)
    return result
  }

  async function apply(
    messages: Ref<Message[]>,
    branches: Ref<Branch[]>,
  ) {
    const result = await chat.get({
      chat_id: info.chat_id,
    }, info.token)
    messages.value.length = 0
    messages.value.push(...result.messages)
    branches.value.length = 0
    branches.value.push(...result.branches)
  }

  return {
    get,
    apply,
  }
}