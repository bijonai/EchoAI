import { prompt } from "@echoai/utils"
import { SYSTEM, USER } from "./prompts"
import { layout, LAYOUT_MODEL } from "@echoai/utils"
import { ChatCompletionMessageParam } from "openai/resources.mjs"
import { PageSwitch } from "@echoai/shared"
import tools from "./tools"

const provider = layout()
const defaultModel = LAYOUT_MODEL

export interface LayoutWorkflowOptions {
  prompt: string
  step: string
  problem: string
  knowledge: string
  explanation: string
  conclusion: string
  interaction: string
  model?: string
  pageIdWillBeUsed?: string
}

export interface LayoutWorkflowResult {
  content: string
  operation?: PageSwitch
}

export async function startLayoutWorkflow(
  context: ChatCompletionMessageParam[],
  options: LayoutWorkflowOptions
): Promise<LayoutWorkflowResult> {
  const { prompt: promptOption, step, problem, knowledge, explanation, conclusion, interaction, model: modelOption } = options
  const model = modelOption ?? defaultModel

  if (context.length === 0)
    context.push({
      role: 'system',
      content: prompt(SYSTEM),
    })
  context.push({
    role: 'user',
    content: prompt(USER, { step, problem, knowledge, explanation, conclusion, prompt: promptOption, interaction }),
  })
  const response = await provider.chat.completions.create({
    model,
    messages: context,
    tools,
  })

  const result: LayoutWorkflowResult = {
    content: ''
  }
  if (response.choices[0].message.tool_calls) {
    const toolCall = response.choices[0].message.tool_calls[0]
    const toolName = toolCall.function.name
    const toolArgs = JSON.parse(toolCall.function.arguments)
    let content = ''
    if (toolName === 'add-page') {
      result.operation = {
        type: 'new-page',
        title: toolArgs.title
      }
      content = `
      > Page ID: ${options.pageIdWillBeUsed}
      > Page Title: ${toolArgs.title}
      `.trim()
    } else if (toolName === 'switch-page') {
      result.operation = {
        type: 'switch-page',
        pageId: toolArgs.pageId
      }
      content = `Successfully switched to page ${toolArgs.pageId}`
    }
    context.push(response.choices[0].message)
    context.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content,
    })
    const toolResponse = await provider.chat.completions.create({
      model,
      messages: context
    })
    context.push(toolResponse.choices[0].message)
    result.content = toolResponse.choices[0].message.content!
    return result
  }
  result.content = response.choices[0].message.content!
  context.push(response.choices[0].message)
  return result
}

export * from './prompts'
