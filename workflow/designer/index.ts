// import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"
// import { SYSTEM, USER, SYSTEM_ADDITION, ADDITION } from "./prompts"
// import { prompt } from "@/utils";
// import { designer, DESIGNER_MODEL } from "@/utils";
// import type { DesignerStep } from "@/types";

import type { DesignerRequestBody } from "~/types";
import { message } from "@xsai/utils-chat";
import { type Message } from "xsai";
import { DESIGNER_MODEL, DESIGNER_MODEL_API_KEY, DESIGNER_MODEL_BASE_URL } from "~/utils";
import { prompt } from "~/utils";
import { SYSTEM, USER } from "./prompts";
import { structure } from "./structure";
import { generateObject } from "@xsai/generate-object";
import type { Step } from "~/types/timeline";

// const provider = designer()
// const defaultModel = DESIGNER_MODEL

// export interface DesignerWorkflowOptions {
//   prompt: string
//   refs?: string
//   step?: string
//   model?: string
// }

// export async function startDesignerWorkflow(
//   context: ChatCompletionMessageParam[],
//   options: DesignerWorkflowOptions,
// ) {
//   const { prompt: userPrompt, refs, step, model: modelOption } = options;
//   const model = modelOption ?? defaultModel

//   // Workflow Start
//   if (context.length === 0) {
//     context.push(
//       {
//         role: 'system',
//         content: prompt(SYSTEM) + (refs ? prompt(SYSTEM_ADDITION, { refs: refs! }) : ''),
//       },
//       {
//         role: 'user',
//         content: prompt(USER, { prompt: userPrompt }),
//       }
//     )
//   } else if (context[context.length - 1].role !== 'user') {
//     context.push({
//       role: 'user',
//       content: prompt(ADDITION, { step: step!, prompt: userPrompt }),
//     })
//   }

//   const response = await provider.chat.completions.create({
//     model,
//     messages: context,
//   })

//   context.push(response.choices[0].message)

//   const { content } = response.choices[0].message

//   return JSON.parse(content?.match(/```json\n([\s\S]*)\n```/)?.[1] ?? '') as DesignerStep[]
// }

// export * from './prompts'

const env = {
  baseURL: DESIGNER_MODEL_BASE_URL,
  apiKey: DESIGNER_MODEL_API_KEY,
  model: DESIGNER_MODEL,
}

export function createDesigner(context: Message[]) {
  return async (options: DesignerRequestBody) => {
    if (context.length === 0)
      context.push(message.system(prompt(SYSTEM)))
    context.push(message.user(prompt(USER, {
      prompt: options.prompt,
    })))
    const { object, messages } = await generateObject({
      messages: context,
      schema: structure,
      ...env,
    })
    context.push(messages[messages.length - 1])
    return object as unknown as Step[]
  }
}
