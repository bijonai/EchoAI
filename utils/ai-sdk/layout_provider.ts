import { createOpenAI } from "@ai-sdk/openai";
import { LAYOUT_MODEL, LAYOUT_MODEL_API_KEY, LAYOUT_MODEL_BASE_URL } from "~/utils/env";

const provider = createOpenAI({
  apiKey: LAYOUT_MODEL_API_KEY,
  baseURL: LAYOUT_MODEL_BASE_URL,
  compatibility: 'strict',
})

export const layoutModel = provider(LAYOUT_MODEL)
