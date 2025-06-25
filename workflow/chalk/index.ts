import { message, type Message } from "xsai"
import { streamText } from "@xsai/stream-text"
import type { ChalkRequestBody, Operation } from "~/types"
import { prompt } from "~/utils"
import { SYSTEM, INTERACTIVE_REFERENCE, LAYOUT_REFERENCE, USER } from "./prompts"
import { EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY, EMBEDDING_MODEL } from "~/utils/env"
import { CHALK_MODEL_BASE_URL, CHALK_MODEL_API_KEY, CHALK_MODEL } from "~/utils/env"
import { parse } from "./parse"
import { latest } from "~/utils"

const env = {
  baseURL: CHALK_MODEL_BASE_URL,
  apiKey: CHALK_MODEL_API_KEY,
  model: CHALK_MODEL,
}
const embedding = {
  baseURL: EMBEDDING_MODEL_BASE_URL,
  apiKey: EMBEDDING_MODEL_API_KEY,
  model: EMBEDDING_MODEL,
}

export function createChalk(context: Message[]) {
  async function embed(content: string): Promise<string[]> {
    return []
  }

  return async (
    options: ChalkRequestBody,
    onEnd?: (operations: Operation[], content: string) => void
  ) => {
    if (context.length === 0)
      context.push(message.system(
        [
          prompt(SYSTEM),
          prompt(INTERACTIVE_REFERENCE),
          prompt(LAYOUT_REFERENCE),
        ].join('\n\n')
      ))
    const refs = await embed(options.layout)
    context.push(message.user(prompt(USER, {
      page_id: options.page_id ?? '',
      document: options.document ?? '',
      requirement: options.layout,
      references: refs.join('\n\n'),
    })))
    const operations: Operation[] = []
    let content = ''
    const { textStream } = await streamText({
      messages: context,
      ...env,
    })
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of textStream) {
          content += <string>chunk
          const newOperations = parse(content)
          if (newOperations.length > operations.length) {
            const lastOp = latest(newOperations)!
            lastOp.id = crypto.randomUUID()
            operations.push(lastOp)
            controller.enqueue(JSON.stringify({
              delta: {
                operations,
              }
            }))
          }
          console.log(`[${Date.now()}] ${content}`)
        }
        console.log(`[${Date.now()}] END`)
        onEnd?.(operations, content)
      }
    })
  }
}
