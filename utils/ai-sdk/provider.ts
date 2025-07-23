import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import {
  AGENT_MODEL, AGENT_MODEL_API_KEY,
  CHALK_MODEL, CHALK_MODEL_API_KEY,
  LAYOUT_MODEL, LAYOUT_MODEL_API_KEY,
  AGENT_MODEL_BASE_URL,
  CHALK_MODEL_BASE_URL,
  LAYOUT_MODEL_BASE_URL,
} from "~/utils/env";

// const agentProvider = createGoogleGenerativeAI({
//   apiKey: AGENT_MODEL_API_KEY,
// })

// export const agentModel = agentProvider(AGENT_MODEL)

// const chalkProvider = createGoogleGenerativeAI({
//   apiKey: CHALK_MODEL_API_KEY,
// })

// export const chalkModel = chalkProvider(CHALK_MODEL)

// const layoutProvider = createGoogleGenerativeAI({
//   apiKey: LAYOUT_MODEL_API_KEY,
// })

// export const layoutModel = layoutProvider(LAYOUT_MODEL)

const agentProvider = createOpenAI({
  apiKey: AGENT_MODEL_API_KEY,
  baseURL: AGENT_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const agentModel = agentProvider(AGENT_MODEL)

const chalkProvider = createOpenAI({
  apiKey: CHALK_MODEL_API_KEY,
  baseURL: CHALK_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const chalkModel = chalkProvider(CHALK_MODEL)

const layoutProvider = createOpenAI({
  apiKey: LAYOUT_MODEL_API_KEY,
  baseURL: LAYOUT_MODEL_BASE_URL,
  compatibility: 'compatible',
})

export const layoutModel = layoutProvider(LAYOUT_MODEL)