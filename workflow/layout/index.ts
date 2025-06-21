// import { prompt } from "@/utils"
// import { SYSTEM, USER } from "./prompts"
// import { layout, LAYOUT_MODEL } from "@/utils"
// import type { ChatCompletionMessageParam } from "openai/resources.mjs"
// import type { PageSwitch } from "@/types"
// import tools from "./tools"

// const provider = layout()
// const defaultModel = LAYOUT_MODEL

// export interface LayoutWorkflowOptions {
//   prompt: string
//   step: string
//   problem: string
//   knowledge: string
//   explanation: string
//   conclusion: string
//   interaction: string
//   model?: string
//   pageIdWillBeUsed?: string
// }

// export interface LayoutWorkflowResult {
//   content: string
//   operation?: PageSwitch
// }

// export async function startLayoutWorkflow(
//   context: ChatCompletionMessageParam[],
//   options: LayoutWorkflowOptions
// ): Promise<LayoutWorkflowResult> {
//   const { prompt: promptOption, step, problem, knowledge, explanation, conclusion, interaction, model: modelOption } = options
//   const model = modelOption ?? defaultModel

//   if (context.length === 0)
//     context.push({
//       role: 'system',
//       content: prompt(SYSTEM),
//     })
//   context.push({
//     role: 'user',
//     content: prompt(USER, { step, problem, knowledge, explanation, conclusion, prompt: promptOption, interaction }),
//   })
//   const response = await provider.chat.completions.create({
//     model,
//     messages: context,
//     tools,
//   })

//   const result: LayoutWorkflowResult = {
//     content: ''
//   }
//   if (response.choices[0].message.tool_calls) {
//     const toolCall = response.choices[0].message.tool_calls[0]
//     const toolName = toolCall.function.name
//     const toolArgs = JSON.parse(toolCall.function.arguments)
//     let content = ''
//     if (toolName === 'add-page') {
//       result.operation = {
//         type: 'new-page',
//         title: toolArgs.title
//       }
//       content = `
//       > Page ID: ${options.pageIdWillBeUsed}
//       > Page Title: ${toolArgs.title}
//       `.trim()
//     } else if (toolName === 'switch-page') {
//       result.operation = {
//         type: 'switch-page',
//         pageId: toolArgs.pageId
//       }
//       content = `Successfully switched to page ${toolArgs.pageId}`
//     }
//     context.push(response.choices[0].message)
//     context.push({
//       role: 'tool',
//       tool_call_id: toolCall.id,
//       content,
//     })
//     const toolResponse = await provider.chat.completions.create({
//       model,
//       messages: context
//     })
//     context.push(toolResponse.choices[0].message)
//     result.content = toolResponse.choices[0].message.content!
//     return result
//   }
//   result.content = response.choices[0].message.content!
//   context.push(response.choices[0].message)
//   return result
// }

// export * from './prompts'

import type { AssistantMessage, Message } from 'xsai'
import { generateText } from '@xsai/generate-text'
import { message } from '@xsai/utils-chat'
import type { LayoutRequestBody, PageSwitch } from '~/types'
import { SYSTEM, USER } from './prompts'
import { prompt } from '#imports'
import { tools as toolsGenerator } from './tools'
import { latest } from '~/utils'

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
