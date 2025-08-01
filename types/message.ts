import type { Message } from "ai"
import type { Status } from "./shared"

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

export interface LayoutMessage extends BaseMessage {
  type: "layout";
  complete: boolean;
  result?: string;
  chalk_task_id?: string;
}

export interface DesignMessage extends BaseMessage {
  type: "design";
}

export interface StepMessage extends BaseMessage {
  type: "step";
  step: string;
}

export interface PageMessage extends BaseMessage {
  type: "page";
  page: number;
}

export type ChatMessage =
  | UserMessage
  | AgentMessage
  | LayoutMessage
  | DesignMessage
  | StepMessage
  | PageMessage;
