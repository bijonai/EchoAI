import type { Message } from "ai"

export interface BaseMessage {
  type: string
  id: string
}

export interface UserMessage extends BaseMessage {
  type: 'user'
  content: string
}

export interface AgentMessage extends BaseMessage {
  type: 'agent'
  content: string
}

export interface TaskMessage extends BaseMessage {
  type: 'task'
  task_id: string
}

export type ChatMessage = UserMessage | AgentMessage | TaskMessage
