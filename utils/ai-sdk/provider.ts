import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { AGENT_MODEL, AGENT_MODEL_API_KEY, CHALK_MODEL, CHALK_MODEL_API_KEY, LAYOUT_MODEL, LAYOUT_MODEL_API_KEY } from "~/utils/env";

const agentProvider = createGoogleGenerativeAI({
  apiKey: AGENT_MODEL_API_KEY,
})

export const agentModel = agentProvider(AGENT_MODEL)

const chalkProvider = createGoogleGenerativeAI({
  apiKey: CHALK_MODEL_API_KEY,
})

export const chalkModel = chalkProvider(CHALK_MODEL)

const layoutProvider = createGoogleGenerativeAI({
  apiKey: LAYOUT_MODEL_API_KEY,
})

export const layoutModel = layoutProvider(LAYOUT_MODEL)