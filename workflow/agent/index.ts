import { message, streamText, type Message, type StreamTextStep } from "xsai"
import { SYSTEM, USER_DOUBT, USER_NEXT } from "./prompts"
import { drawTool } from "./tools/draw"
import { action, type Action, type AgentActions, type LayoutActions } from "~/types/agent"
import type { PageStore } from "~/types/page"
import { prompt } from "~/utils"
import { ReadableStream } from "node:stream/web"
import { mergeReadableStreams } from "../utils/merge-stream"

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
    const draw = await drawTool(options.pages)
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
      text: <ReadableStream<string>>textStream,
      step: <ReadableStream<StreamTextStep>>stepStream,
    })
    for await (const chunk of allStream) {
      if (chunk.source === 'text') {
        yield action<AgentActions>('agent-message-chunk', {
          chunk: chunk.value,
        })
      } else {
        if (chunk.source === 'step') {
          const { toolName, result, args } = chunk.value.toolResults.at(-1)!
          if (toolName === 'draw') {
            yield action<LayoutActions>('layout-done', {
              layout: result,
              page: args.page,
            })
          }
        }
      }
    }
  }
}
