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
    context.push(message.user(prompt(USER, options.step as unknown as Record<string, string>)))
    const response = await generateText({
      messages: context,
      tools,
      ...env,
    })
    const latestMessage = latest(response.messages) as AssistantMessage
    if (!latestMessage) return null
    context.push(latestMessage)
    const operations: PageSwitch[] = []
    const res: {
      content: string
      operations: PageSwitch[]
    } = {
      content: '',
      operations,
    }
    if (latestMessage.tool_calls) {
      const toolCall = latestMessage.tool_calls[0]
      const toolName = toolCall.function.name
      const toolArgs = JSON.parse(toolCall.function.arguments)
      if (toolName === 'add-page') {
        operations.push({
          type: toolName,
          title: toolArgs.title,
        })
      } else if (toolName === 'switch-page') {
        operations.push({
          type: toolName,
          pageId: toolArgs.pageId,
        })
      }
      const tool = tools.find(tool => tool.function.name === toolName)
      if (!tool) return null
      const result = <string> await tool.execute(toolArgs, {
        messages: context,
        toolCallId: toolCall.id,
      })
      context.push(message.tool(result, toolCall))
      const { text } = await generateText({
        messages: context,
        ...env,
      })
      res.content = text!
    }
    res.content = latestMessage.content as string
    return res
  }
}
