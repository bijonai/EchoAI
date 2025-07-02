import type { AssistantMessage, Message } from 'xsai'
import { generateText } from '@xsai/generate-text'
import { message } from '@xsai/utils-chat'
import type { LayoutRequestBody, PageSwitch } from '~/types'
import { SYSTEM, USER } from './prompts'
import { prompt } from '~/utils'
import { tools as toolsGenerator } from './tools'
import { latest } from '~/utils'
import { LAYOUT_MODEL_BASE_URL, LAYOUT_MODEL_API_KEY, LAYOUT_MODEL } from '~/utils/env'

const env = {
  baseURL: LAYOUT_MODEL_BASE_URL,
  apiKey: LAYOUT_MODEL_API_KEY,
  model: LAYOUT_MODEL,
}

export function createLayout(context: Message[]) {
  return async (options: LayoutRequestBody): Promise<{
    content: string
    operations: PageSwitch[]
  } | null> => {
    const tools = await toolsGenerator(options)
    if (context.length === 0)
      context.push(message.system(prompt(SYSTEM)))
    context.push(message.user(prompt(USER, {
      ...options.step,
      id: options.page_id,
    })))
    const { text, messages, steps } = await generateText({
      messages: context,
      tools,
      maxSteps: 3,
      ...env,
    })
    const toolCalls = steps.map(step => step.toolCalls).flat()
    context.length = 0
    context.push(...messages)
    return {
      content: text!,
      operations: toolCalls.map(call => ({
        type: call.toolName,
        ...JSON.parse(call.args),
      })),
    }
  }
}
