import type { SpeakerRequestBody } from "~/types";
import { prompt } from "~/utils";
import { SYSTEM, USER } from "./prompts";
import { speakerModel } from "~/utils/ai-sdk/speaker_provider";
import { streamText, type Message } from "ai";
import { message } from "~/utils/ai-sdk/message";

export function createSpeaker(context: Message[]) {
  return async (options: SpeakerRequestBody) => {
    if (context.length === 0) {
      context.push(message.system(prompt(SYSTEM)))
    }

    context.push(message.user(prompt(USER, options.step as unknown as Record<string, string>)))

    const { textStream } = await streamText({
      model: speakerModel,
      messages: context,
    })

    return textStream
  }
}
