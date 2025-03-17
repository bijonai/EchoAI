import { prompt } from "@echoai/utils"
import { SYSTEM, USER } from "./prompts"
import { speaker, SPEAKER_MODEL } from "@echoai/utils"
import { ChatCompletionMessageParam } from "openai/resources.mjs"
import { SpeakerRequestBody } from "@echoai/shared"

const provider = speaker()
const defaultModel = SPEAKER_MODEL

export type SpeakerWorkflowOptions = Omit<SpeakerRequestBody, 'chat_id'>

export async function startSpeakerWorkflow(
  context: ChatCompletionMessageParam[],
  options: SpeakerWorkflowOptions,
) {
  const { step, problem, knowledge, explanation, conclusion, prompt: userPrompt, model: modelOption, stream = false } = options
  const model = modelOption ?? defaultModel

  if (context.length === 0) {
    context.push(
      { role: 'system', content: prompt(SYSTEM) },
    )
  }
  context.push({
    role: 'user',
    content: prompt(USER, { step, problem, knowledge, explanation, conclusion, prompt: userPrompt ?? 'NEXT' }),
  })

  const response = await provider.chat.completions.create({
    model,
    messages: context,
    stream: stream
  })

  if (!stream) {
    const message = (response as any).choices[0].message;
    context.push(message)
    return message.content
  }

  // 创建一个 ReadableStream 来处理流式响应
  return new ReadableStream({
    async start(controller) {
      let fullMessage = { role: 'assistant', content: '' };
      
      try {
        for await (const part of response as any) {
          if (part.choices && part.choices[0]?.delta?.content) {
            const content = part.choices[0].delta.content;
            fullMessage.content += content;
            controller.enqueue(content);
          }
        }
      } catch (error) {
        console.error('Error in stream processing:', error);
        controller.error(error);
      } finally {
        context.push(fullMessage as ChatCompletionMessageParam);
        controller.close();
      }
    }
  });
}

export * from './prompts'
