import type { Message } from "xsai"

const _env = {
  apiKey: AGENT_MODEL_API_KEY,
  baseURL: AGENT_MODEL_BASE_URL,
  model: AGENT_MODEL,
}

export interface AgentOptions {
  input: string
}
export function createAgent(
  context: Message[]
) {
  return function* (options: AgentOptions) {}
}
