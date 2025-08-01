import { generateText, type Message } from "ai";
import { LAYOUT_MODEL, LAYOUT_MODEL_API_KEY, LAYOUT_MODEL_BASE_URL } from "~/utils/env";
import { SYSTEM } from "./prompts";
import { message } from "~/utils/ai-sdk/message";
import { layoutModel } from "~/utils/ai-sdk/provider";

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
    const { text: layout, response } = await generateText({
      model: layoutModel,
      messages: context,
    })
    context.push(...(await response).messages as Message[])
    return {
      layout,
      context,
    }
  }
}