import { message, streamText, type Message } from "xsai"
import { SYSTEM, USER_DOUBT, USER_NEXT } from "./prompts"
import { drawTool } from "./tools/draw"
import { action, type Action, type AgentActions, type LayoutActions } from "~/types/agent"
import type { PageStore } from "~/types/page"
import { prompt } from "~/utils"
import { ReadableStream } from "node:stream/web"
import { mergeReadableStreams } from "../utils/merge-stream"
import { designTool } from "./tools/design"
import type { Design } from "~/types/design"
import type { StreamTextEvent } from "../types"

const _env = {
  apiKey: AGENT_MODEL_API_KEY,
  baseURL: AGENT_MODEL_BASE_URL,
  model: AGENT_MODEL,
}

export interface AgentOptions {
  input?: string
  pages: PageStore
  design: Design
}
export function createAgent(
  context: Message[]
) {
  if (context.length === 0) {
    context.push(message.system(SYSTEM))
  }
  return async function* (options: AgentOptions) {
    const draw = await drawTool(options.pages)
    const design = await designTool(options.design)
    const tools = [draw, design]

    if (options.input) context.push(
      message.user(prompt(USER_DOUBT))
    )
    else context.push(
      message.user(prompt(USER_NEXT))
    )

    const { fullStream, messages } = await streamText({
      ..._env,
      messages: context,
      tools,
      maxSteps: 8
    })

    for await (const chunk of <ReadableStream<StreamTextEvent>>fullStream) {
      if (chunk.type === 'text-delta') {
        yield action<AgentActions>('agent-message-chunk', {
          chunk: chunk.text,
        })
      } else {
        if (chunk.type === 'tool-result') {
          const { toolName, result, args } = chunk
          if (toolName === 'draw') {
            yield action<LayoutActions>('layout-done', {
              layout: result,
              page: args.page,
            })
          }
        }
      }
    }

    context.length = 0
    context.push(...(await messages))
  }
}
