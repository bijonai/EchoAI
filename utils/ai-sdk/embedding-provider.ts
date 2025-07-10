import { createOpenAI } from "@ai-sdk/openai";
import { EMBEDDING_MODEL, EMBEDDING_MODEL_API_KEY, EMBEDDING_MODEL_BASE_URL } from "~/utils/env";

const provider = createOpenAI({
  apiKey: EMBEDDING_MODEL_API_KEY,
  baseURL: EMBEDDING_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const embeddingModel = provider.embedding(EMBEDDING_MODEL)