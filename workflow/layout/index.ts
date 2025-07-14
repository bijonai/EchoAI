import { generateText, message, type Message } from "xsai";
import { LAYOUT_MODEL, LAYOUT_MODEL_API_KEY, LAYOUT_MODEL_BASE_URL } from "~/utils/env";
import { SYSTEM } from "./prompts";

const _env = {
  apiKey: LAYOUT_MODEL_API_KEY,
  baseURL: LAYOUT_MODEL_BASE_URL,
  model: LAYOUT_MODEL,
}

export interface LayoutOptions {
  input: string
}
export function createLayout(
  context: Message[]
) {
  if (context.length === 0) {
    context.push(message.system(SYSTEM))
  }
  return async function (options: LayoutOptions) {
    context.push(message.user(options.input))
    const { text: layout, messages } = await generateText({
      ..._env,
      messages: context,
    })
    context.length = 0
    context.push(...messages)
    return layout
  }
}