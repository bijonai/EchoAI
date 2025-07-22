import type { Chat } from "~/endpoint/chat"
import { createRootNode, type AgentEnvironment, type ChatInfo, type Pages } from "./index"
import { chat } from "~/endpoint"

export async function useChat(info: ChatInfo) : Promise<AgentEnvironment> {
  const response = await chat.get(info) as Chat

  let pages: Pages = {}
  for (const page of Object.keys(response.pages)) {
    pages[page] = {
      title: response.pages[page].title,
      operations: response.pages[page].operations,
      knowledge: response.pages[page].knowledge,
      chalk_context: response.pages[page].chalk_context,
      layout_context: response.pages[page].layout_context,
      ast: ref(createRootNode(page)),
      rendered: ref(null),
    }
  } 

  return {
    title: ref(response.title),
    context: ref(response.context),
    messages: ref(response.messages),
    design: ref(response.design),
    step: ref(response.current.step),
    pages: ref(pages),
    activePageId: ref('')
  }
}