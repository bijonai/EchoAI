import type { Message } from "xsai";
import { message } from "@xsai/utils-chat";
import { streamText } from "@xsai/stream-text"
import type { SpeakerRequestBody } from "~/types";
import { prompt } from "~/utils";
import { SYSTEM, USER } from "./prompts"; 
import { SPEAKER_MODEL_BASE_URL, SPEAKER_MODEL_API_KEY, SPEAKER_MODEL } from "~/utils/env"

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
