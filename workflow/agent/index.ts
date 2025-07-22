import { STATUS, SYSTEM, USER_DOUBT, USER_NEXT } from "./prompts"
import { drawTool } from "./tools/draw"
import type { PageStore } from "~/types/page"
import { prompt } from "~/utils"
import { designTool } from "./tools/design"
import type { Design } from "~/types/design"
import { createPageTool } from "./tools/page"
import { stepToTool } from "./tools/step"
import { streamText, type Message } from "ai"
import { message } from "~/utils/ai-sdk/message"
import { agentModel } from "~/utils/ai-sdk/provider"
import { action, type AgentActions, type AgentContextUpdateAction, type DesignActions, type LayoutActions, type PageActions, type StepActions } from "~/types/agent"
import type { Current } from "~/types/current"

export interface AgentOptions {
  input?: string
  pages: PageStore
  design: Design
  current: Current
}
export function createAgent(
  context: Message[]
) {
  if (context.length === 0) {
    context.push(message.system(SYSTEM))
  }

  return async function* (options: AgentOptions) {
    const draw = await drawTool(() => options.pages)
    const design = await designTool(options.design)
    const createPage = await createPageTool(() => options.pages)
    const stepTo = await stepToTool()
    const tools = {
      draw,
      design,
      'create-page': createPage,
      'step-to': stepTo,
    }

    context.push(message.data(prompt(STATUS, {
      design: JSON.stringify(options.design),
      current: JSON.stringify(options.current),
    })))

    if (options.input) {
      context.push(
        message.user(prompt(USER_DOUBT, {
          input: options.input,
        }))
      )
    } else {
      context.push(
        message.user(prompt(USER_NEXT))
      )
    }

    console.log('context =>', context)

    const { fullStream, response } = await streamText({
      model: agentModel,
      messages: context,
      tools,
      maxSteps: 100,
    })

    for await (const chunk of fullStream) {
      console.log('chunk =>', chunk)
      if (chunk.type === 'text-delta') {
        yield action<AgentActions>('agent-message-chunk', {  
          chunk: chunk.textDelta,
        })
      } else {
        if (chunk.type === 'tool-result') {
          const { toolName, result, args } = chunk
          switch (toolName) {
            case 'draw': {
              const { content } = result
              yield action<LayoutActions>('layout-done', {
                layout: content,
                page: args.page,
              })
              break
            }
            case 'create-page': {
              const { data } = result
              options.pages[data.id] = {
                title: data.title,
                layout_context: [],
                chalk_context: [],
                operations: [],
                knowledge: [],
              }
              yield action<PageActions>('create-page', {
                id: data.id,
                title: data.title,
              })
              break
            }
            case 'step-to': {
              const { data } = result
              yield action<StepActions>('step-to', {
                step: data.step,
              })
              break
            }
            case 'design': {
              const { data } = result
              options.design = data
              yield action<DesignActions>('design-branch', {
                design: data,
              })
              break
            }
          }
        } else if (chunk.type === 'tool-call') {
          const { toolName } = chunk
          if (toolName === 'draw') {
            yield action<LayoutActions>('layout-start', {})
          }
        }
      }
    }

    context.push(...(await response).messages.filter((msg) => msg.role !== 'tool') as Message[])
    yield action<AgentContextUpdateAction>('agent-context-update', {
      context,
      response: (await response).messages.filter((msg) => msg.role !== 'tool') as Message[],
    })
  }
}
