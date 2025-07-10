import { createOpenAI } from "@ai-sdk/openai";
import { CHALK_MODEL, CHALK_MODEL_API_KEY, CHALK_MODEL_BASE_URL } from "~/utils/env";

const provider = createOpenAI({
  apiKey: CHALK_MODEL_API_KEY,
  baseURL: CHALK_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const chalkModel = provider(CHALK_MODEL)
