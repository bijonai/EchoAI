import { createOpenAI } from "@ai-sdk/openai";  
import { DESIGNER_MODEL, DESIGNER_MODEL_API_KEY, DESIGNER_MODEL_BASE_URL } from "~/utils/env";

const provider = createOpenAI({
  apiKey: DESIGNER_MODEL_API_KEY,
  baseURL: DESIGNER_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const designerModel = provider(DESIGNER_MODEL, {
  structuredOutputs: true,
})
