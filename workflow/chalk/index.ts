import type { ChalkRequestBody, Operation } from "~/types"
import { prompt } from "~/utils"
import { SYSTEM, INTERACTIVE_REFERENCE, LAYOUT_REFERENCE, USER } from "./prompts"
import { parse } from "./parse"
import { latest, search } from "~/utils"
import { embed, streamText, type Message } from "ai"
import { embeddingModel } from "~/utils/ai-sdk/embedding_provider"
import { chalkModel } from "~/utils/ai-sdk/chalk_provider"
import { message } from "~/utils/ai-sdk/message"
import { QDRANT_URL, QDRANT_API_KEY } from "~/utils/env"

const searchEnv = {
  baseURL: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
}

export function createChalk(context: Message[]) {
  return async (
    options: ChalkRequestBody,
    onEnd?: (operations: Operation[], content: string) => void
  ) => {
    if (context.length === 0) {
      context.push(message.system(
        [
          prompt(SYSTEM),
          prompt(INTERACTIVE_REFERENCE),
          prompt(LAYOUT_REFERENCE),
        ].join('\n\n')
      ))
    }

    const { embedding } = await embed({
      model: embeddingModel,
      value: options.layout,
    })

    const { chunks } = await search({
      ...searchEnv,
      embedding,
      collections: ['refers', 'comps'],
    })
    console.log(chunks)

    context.push(message.user(prompt(USER, {
      page_id: options.page_id ?? '',
      document: options.document ?? '',
      requirement: options.layout,
      references: Object.values(chunks).flat().map((chunk) => chunk.text).join('\n\n'),
    })))

    const operations: Operation[] = []
    let content = ''
    const { textStream } = streamText({
      model: chalkModel,
      messages: context,
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
