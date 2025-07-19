import { message, streamText, type Message } from "xsai"
import { SYSTEM, USER_DOUBT, USER_NEXT } from "./prompts"
import { drawTool } from "./tools/draw"
import { action, type Action, type AgentActions, type PageActions, type DesignActions, type LayoutActions, type StepActions } from "~/types/agent"
import type { PageStore } from "~/types/page"
import { prompt } from "~/utils"
import { designTool, wrapper } from "./tools/design"
import type { Branch, Design } from "~/types/design"
import type { z } from "zod"
import { createPageTool } from "./tools/page"
import { stepToTool } from "./tools/step"
import { AGENT_MODEL, AGENT_MODEL_API_KEY, AGENT_MODEL_BASE_URL } from '~/utils/env'

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
    const createPage = await createPageTool(options.pages)
    const stepTo = await stepToTool()
    const tools = [draw, design, createPage, stepTo]

    if (options.input) context.push(
      message.user(prompt(USER_DOUBT, {
        input: options.input,
      }))
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

    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        yield action<AgentActions>('agent-message-chunk', {
          chunk: chunk.text,
        })
      } else {
        if (chunk.type === 'tool-result') {
          const { toolName, result, args } = chunk
          if (toolName === 'draw') {
            const { content } = JSON.parse(result as string)
            yield action<LayoutActions>('layout-done', {
              layout: content,
              page: args.page,  
            })
          } else if (toolName === 'create-page') {
            const { data } = JSON.parse(result as string)
            yield action<PageActions>('create-page', {
              id: data.id,
              title: data.title,
            })
          } else if (toolName === 'step-to') {
            const { data } = JSON.parse(result as string)
            yield action<StepActions>('step-to', {
              step: data.step,
            })
          }
        } else if (chunk.type === 'tool-call') {
          const { toolName, args } = chunk
          const { elements, from, to } = <z.infer<typeof wrapper>>JSON.parse(args)
          if (toolName === 'design') {
            yield action<DesignActions>('design-branch', {
              design: {
                steps: elements,
                from,
                to,
              } satisfies Branch,
            })
          } else if (toolName === 'draw') {
            yield action<LayoutActions>('layout-start', {})
          }
        }
      }
    }

    context.length = 0
    context.push(...(await messages))
  }
}
