// import { prompt } from "@/utils"
// import { SYSTEM, USER } from "./prompts"
// import { speaker, SPEAKER_MODEL } from "@/utils"
// import type { ChatCompletionMessageParam } from "openai/resources.mjs"
// import type { SpeakerRequestBody } from "@/types"

import type { Message } from "xsai";
import { message } from "@xsai/utils-chat";
import { streamText } from "@xsai/stream-text"
import type { SpeakerRequestBody } from "~/types";
import { prompt } from "~/utils";
import { SYSTEM, USER } from "./prompts";

// const provider = speaker()
// const defaultModel = SPEAKER_MODEL

// export type SpeakerWorkflowOptions = Omit<SpeakerRequestBody, 'chat_id'>

// export async function startSpeakerWorkflow(
//   context: ChatCompletionMessageParam[],
//   options: SpeakerWorkflowOptions,
// ) {
//   const { step, problem, knowledge, explanation, conclusion, prompt: userPrompt, model: modelOption, stream = false } = options
//   const model = modelOption ?? defaultModel

//   if (context.length === 0) {
//     context.push(
//       { role: 'system', content: prompt(SYSTEM) },
//     )
//   }
//   context.push({
//     role: 'user',
//     content: prompt(USER, { step, problem, knowledge, explanation, conclusion, prompt: userPrompt ?? 'NEXT' }),
//   })

//   const response = await provider.chat.completions.create({
//     model,
//     messages: context,
//     stream: stream
//   })

//   if (!stream) {
//     const message = (response as any).choices[0].message;
//     context.push(message)
//     return message.content
//   }

//   // 创建一个 ReadableStream 来处理流式响应
//   return new ReadableStream({
//     async start(controller) {
//       let fullMessage = { role: 'assistant', content: '' };
      
//       try {
//         for await (const part of response as any) {
//           if (part.choices && part.choices[0]?.delta?.content) {
//             const content = part.choices[0].delta.content;
//             fullMessage.content += content;
//             controller.enqueue(content);
//           }
//         }
//       } catch (error) {
//         console.error('Error in stream processing:', error);
//         controller.error(error);
//       } finally {
//         context.push(fullMessage as ChatCompletionMessageParam);
//         controller.close();
//       }
//     }
//   });
// }

// export * from './prompts'

const env = {
  baseURL: SPEAKER_MODEL_BASE_URL,
  apiKey: SPEAKER_MODEL_API_KEY,
  model: SPEAKER_MODEL,
}

export function createSpeaker(context: Message[]) {
  return async (options: SpeakerRequestBody) => {
    if (context.length === 0)
      context.push(message.system(prompt(SYSTEM)))
    context.push(message.user(prompt(USER, options.step as unknown as Record<string, string>)))
    const { textStream } = await streamText({
      messages: context,
      ...env,
    })
    return textStream
  }
}
