import { message, streamText, type Message, type StreamTextStep } from "xsai"
import { SYSTEM, USER_DOUBT, USER_NEXT } from "./prompts"
import { drawTool } from "./tools/draw"
import { action, type Action, type AgentActions } from "~/types/agent"
import type { PageStore } from "~/types/page"
import { prompt } from "~/utils"
import { ReadableStream } from "node:stream/web"
import { mergeReadableStreams } from "../utils/merge-stream"
import { createChalk } from "../chalk"

const _env = {
  apiKey: AGENT_MODEL_API_KEY,
  baseURL: AGENT_MODEL_BASE_URL,
  model: AGENT_MODEL,
}

export interface AgentOptions {
  input?: string
  pages: PageStore
}
export function createAgent(
  context: Message[]
) {
  if (context.length === 0) {
    context.push(message.system(SYSTEM))
  }
  return async function* (options: AgentOptions) {
    const resultQueue: Action<string, any>[] = []
    let lastResultQueueLength = resultQueue.length
    const draw = await drawTool(options.pages, (action) => resultQueue.push(action))
    const tools = [draw]

    if (options.input) context.push(
      message.user(prompt(USER_DOUBT))
    )
    else context.push(
      message.user(prompt(USER_NEXT))
    )

    const { textStream, stepStream } = await streamText({
      ..._env,
      messages: context,
      tools,
      maxSteps: 8
    })

    const allStream = mergeReadableStreams({
      text: textStream,
      step: stepStream,
    })
    for await (const chunk of <ReadableStream<StreamTextStep | string>>allStream) {
      if (resultQueue.length > lastResultQueueLength) {
        lastResultQueueLength = resultQueue.length
        yield resultQueue.at(-1)!
      }
      if (typeof chunk === 'string') {
        yield action<AgentActions>('agent-message-chunk', {
          chunk,
        })
      } else {
        if (chunk.stepType === 'tool-result') {
          const { toolName, result, args } = chunk.toolResults.at(-1)!
          if (toolName === 'draw') {
            const { input, page: pageId } = <{ input: string, page: number }>args
            const page = options.pages[pageId.toString()]
            const chalk = createChalk(page.chalk_context)
            const content = chalk({
              page: pageId,
              input,
              chunks: page.knowledge
            });
            (async () => {
              for await (const op of content) {
                resultQueue.push(op)
              }
            })()
          }
        }
      }
    }
  }
}
