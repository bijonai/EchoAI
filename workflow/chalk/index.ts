import type { Message } from "xsai"
import { message } from "@xsai/utils-chat"
import { embed } from "@xsai/embed"
import { streamText } from "@xsai/stream-text"
import type { ChalkRequestBody, Operation } from "~/types"
import { prompt } from "~/utils"
import { SYSTEM, INTERACTIVE_REFERENCE, LAYOUT_REFERENCE, USER } from "./prompts"
import { EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY, EMBEDDING_MODEL, QDRANT_URL, QDRANT_API_KEY } from "~/utils/env"
import { CHALK_MODEL_BASE_URL, CHALK_MODEL_API_KEY, CHALK_MODEL } from "~/utils/env"
import { parse } from "./parse"
import { latest, search } from "~/utils"

const env = {
  baseURL: CHALK_MODEL_BASE_URL,
  apiKey: CHALK_MODEL_API_KEY,
  model: CHALK_MODEL,
}
const embeddingEnv = {
  baseURL: EMBEDDING_MODEL_BASE_URL,
  apiKey: EMBEDDING_MODEL_API_KEY,
  model: EMBEDDING_MODEL,
}
const searchEnv = {
  baseURL: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
}

export function createChalk(context: Message[]) {
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
    const { embedding } = await embed({
      ...embeddingEnv,
      input: options.layout,
    })
    const { chunks } = await search({
      ...searchEnv,
      embedding,
      collections: ['refers', 'apis'],
    })
    console.log(chunks)
    context.push(message.user(prompt(USER, {
      page_id: options.page_id ?? '',
      document: options.document ?? '',
      requirement: options.layout,
      references: [chunks].map((chunk) => chunk.text).join('\n\n'),
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
        }
        onEnd?.(operations, content)
      }
    })
  }
}
