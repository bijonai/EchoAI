import type { LayoutRequestBody, PageSwitch } from '~/types'
import { SYSTEM, USER } from './prompts'
import { prompt } from '~/utils'
import { message } from '~/utils/ai-sdk/message'
import { layoutModel } from '~/utils/ai-sdk/layout-provider'
import { generateText, type Message } from 'ai'
import { tools } from './tools'

export function createLayout(context: Message[]) {
  return async (options: LayoutRequestBody): Promise<{
    content: string
    operations: PageSwitch[]
  } | null> => {    
    if (context.length === 0) {
      context.push(message.system(prompt(SYSTEM)))
    }

    context.push(message.user(prompt(USER, {
      ...options.step,
      id: options.page_id,
    })))

    const { text, steps, response } = await generateText({
      model: layoutModel,
      messages: context,
      tools: tools(options),
      maxSteps: 2,
    })

    const toolCalls = steps.map(step => step.toolCalls).flat()
    context.push(...response.messages as Message[])

    return {
      content: text!,
      operations: toolCalls.map(call => ({
        type: call.toolName,
        ...(typeof call.args === 'string' ? JSON.parse(call.args) : call.args),
      })),
    }
  }
}
