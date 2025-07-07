import { createOpenAI } from "@ai-sdk/openai";
import { SPEAKER_MODEL, SPEAKER_MODEL_API_KEY, SPEAKER_MODEL_BASE_URL } from "~/utils/env";

const provider = createOpenAI({
  apiKey: SPEAKER_MODEL_API_KEY,
  baseURL: SPEAKER_MODEL_BASE_URL,
  compatibility: 'strict',
})

export const speakerModel = provider(SPEAKER_MODEL)
