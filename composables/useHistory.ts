import { chat } from "~/endpoint";
import type { ChatInfo } from ".";
import type { Message } from "~/types";
import type { Branch } from "~/types/design";
import { latest } from "~/utils";

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
    step: Ref<string>,
  ) {
    const result = await chat.get({
      chat_id: info.chat_id,
    }, info.token)
    messages.value.length = 0
    messages.value.push(...result.messages)
    branches.value.length = 0
    branches.value.push(...result.branches)
    step.value = latest(result.messages)?.step?.step ?? ''
  }

  return {
    get,
    apply,
  }
}