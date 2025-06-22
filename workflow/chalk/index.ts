// import {
//   API_COLLECTION_NAME,
//   KNOWLEDGE_COLLECTION_NAME,
//   prompt,
// } from "@/utils";
// import { INTERACTIVE_REFERENCE, LAYOUT_REFERENCE, SYSTEM, USER } from "./prompts";
// import { chalk, CHALK_MODEL, search, client, embedding } from "@/utils";
// import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
// import type { Position, Operation } from "@/types";
// import { parse } from "./parse";

import { message, type Message } from "xsai"
import { streamText } from "@xsai/stream-text"
import type { ChalkRequestBody, Operation } from "~/types"
import { prompt } from "~/utils"
import { SYSTEM, INTERACTIVE_REFERENCE, LAYOUT_REFERENCE, USER } from "./prompts"
import { parse } from "./parse"

// const provider = chalk()
// const defaultModel = CHALK_MODEL

// export interface ChalkWorkflowOptions {
//   prompt: string;
//   components?: Position[];
//   document?: string;
//   pageId?: string;
//   model?: string;
//   stream?: boolean;
// }

// export interface ChalkWorkflowResultCommon {
//   content: string | null;
//   operations: Operation[];
// }
// export type ChalkWorkflowResult = ChalkWorkflowResultCommon | ReadableStream<string>

// export async function startChalkWorkflow(
//   context: ChatCompletionMessageParam[],
//   options: ChalkWorkflowOptions,
//   callback?: (operations: Operation[]) => any
// ): Promise<ChalkWorkflowResult> {
//   const { prompt: userPrompt, components, model: modelOption, document, stream, pageId } = options;
//   const model = modelOption ?? defaultModel
//   // const referencePromise = new Promise<string[]>((resolve, reject) => {
//   //   search(embedding(), client, {
//   //     collection: API_COLLECTION_NAME,
//   //     query: userPrompt,
//   //     topK: 12,
//   //   }).then(resolve).catch(reject)
//   // })
//   // const knowledgePromise = new Promise<string[]>((resolve, reject) => {
//   //   search(embedding(), client, {
//   //     collection: KNOWLEDGE_COLLECTION_NAME,
//   //     query: userPrompt,
//   //     topK: 3
//   //   }).then(resolve).catch(reject)
//   // })
//   // const [references, knowledge] = await Promise.all([referencePromise, ])
//   const references = ['']
//   const knowledge = ['']

//   if (context.length === 0) {
//     context.push({
//       role: 'system',
//       content: [prompt(SYSTEM), prompt(INTERACTIVE_REFERENCE), prompt(LAYOUT_REFERENCE)].join('\n\n')
//     })
//   }
//   context.push({
//     role: 'user',
//     content: prompt(USER, {
//       page_id: pageId ?? '',
//       document: document ?? '',
//       requirement: userPrompt,
//       references: [...references, ...knowledge].join('\n')
//     }),
//   })

//   const res = await provider.chat.completions.create({
//     model,
//     messages: context,
//     stream: stream ?? false,
//   })

//   // Handle non-stream response
//   if (!stream && 'choices' in res) {
//     // If there is a function call, return the result
//     if (res.choices[0].message.tool_calls) {
//       const toolCall = res.choices[0].message.tool_calls[0]
//       const toolName = toolCall.function.name
//       const toolArgs = JSON.parse(toolCall.function.arguments)
//       return {
//         type: toolName,
//         ...toolArgs
//       }
//     }
//     // If no function call, continue the workflow
//     context.push(res.choices[0].message)
//     const content = res.choices[0].message.content
//     return {
//       content,
//       operations: []
//     }
//   }
//   let content = ''
//   let latestOperationAmount = 0
//   const results: Operation[] = []
//   return new ReadableStream({
//     async start(controller) {
//       try {
//         for await (const chunk of res as any) {
//           if (chunk.choices && chunk.choices[0]?.delta?.content) {
//             content += chunk.choices[0].delta.content
//             const operations = parse(content)
//             if (operations.length > latestOperationAmount) {
//               latestOperationAmount = operations.length

//               results.push({
//                 ...operations[operations.length - 1],
//                 id: crypto.randomUUID() as string,
//               })
//               controller.enqueue(JSON.stringify({
//                 operations: results
//               }))
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error in stream processing:', error);
//         controller.error(error);
//       } finally {
//         context.push({
//           role: 'assistant',
//           content,
//         })

//         callback?.(results)
//         controller.close();
//       }
//     }
//   })
// }

// export * from './prompts'

const env = {
  baseURL: CHALK_MODEL_BASE_URL,
  apiKey: CHALK_MODEL_API_KEY,
  model: CHALK_MODEL,
}
const embedding = {
  baseURL: EMBEDDING_MODEL_BASE_URL,
  apiKey: EMBEDDING_MODEL_API_KEY,
  model: EMBEDDING_MODEL,
}

export function createChalk(context: Message[]) {
  async function embed(content: string): Promise<string[]> {
    return []
  }

  return async (
    options: ChalkRequestBody,
    onEnd?: (operations: Operation[], content: string) => void
  ) => {
    if (context.length === 0)
      context.push(message.system(
        [
          prompt(SYSTEM),
          prompt(INTERACTIVE_REFERENCE),
          prompt(LAYOUT_REFERENCE),
        ].join('\n\n')
      ))
    const refs = await embed(options.layout)
    context.push(message.user(prompt(USER, {
      page_id: options.page_id ?? '',
      document: options.document ?? '',
      requirement: options.layout,
      references: refs.join('\n\n'),
    })))
    const operations: Operation[] = []
    let content = ''
    const { textStream } = await streamText({
      messages: context,
      ...env,
    })
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of textStream) {
          content += <string>chunk
          const newOperations = parse(content)
          if (newOperations.length > operations.length) {
            operations.length = 0
            operations.push(...newOperations)
            controller.enqueue(JSON.stringify({
              operations,
            }))
          }
        }
        onEnd?.(operations, content)
      }
    })
  }
}
