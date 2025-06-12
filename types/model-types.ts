import type { PageSwitch } from './page-switch'
import type { Operation, Position } from './operation'

// ===== 基础类型 =====
export type Message = {
  role: 'user' | 'speaker' | 'processor';
  content: string;
  step?: string;
  isLoading?: boolean;
}

export type Context = Message[]

// ===== Designer 相关 =====
export interface DesignerStep {
  step: string
  problem: string
  knowledge: string
  explanation: string
  conclusion: string
  interaction: string
}

export interface StepBranch {
  steps: DesignerStep[]
  start?: string
  end?: string
}

export interface DesignerResult {
  prompt: string;
  refs?: string;
  step?: string;
  model?: string;
  result: DesignerStep[];
}

export interface DesignerRequestBody {
  chat_id: string;
  prompt: string;
  refs?: string;
  step?: string;
  next_step?: string;
  model?: string;
}

export interface DesignerResponse {
  steps: DesignerStep[]
  branches: StepBranch[]
  displayed_messages: Message[]
}

// ===== Speaker 相关 =====
export interface SpeakerResult {
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
  prompt?: string;
  model?: string;
  result: string;
}

export interface SpeakerRequestBody {
  chat_id: string;
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
  prompt?: string;
  model?: string;
  stream?: boolean;
}

export interface SpeakerResponse {
  content: string;
}

// ===== Layout 相关 =====
export interface LayoutResult {
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
  model?: string;
  result: string;
}

export interface LayoutResponse {
  chat_id: string;
  prompt: string;
  content: string;
  operation?: PageSwitch;
}

export interface LayoutRequestBody {
  chat_id: string;
  prompt: string;
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
  interaction: string;
  page_id_will_be_used: string;
}

// ===== Chalk 相关 =====
export interface ChalkResult {
  input: string;
  components: Position[];
  output: Operation[];
  step: string;
}

export interface ChalkResponse {
  content: string;
  operations: Operation[];
  delta?: {
    operation: Operation;
  };
}

export interface ChalkRequestBody {
  chat_id: string;
  prompt: string;
  components?: Position[];
  document?: string;
  page_id?: string;
  model?: string;
  stream?: boolean;
  step: string;
}

// ===== 通用/其他类型 =====
export interface GetChatRequestBody {
  chat_id: string;
}

export interface GetChatResponse {
  chat_id: string;
  designer_context: Context;
  designer_results: DesignerResult[];
  speaker_context: Context;
  speaker_results: SpeakerResult[];
  layout_context: Context;
  layout_results: LayoutResult[];
  chalk_context: Context;
  chalk_results: ChalkResult[];
  branches: StepBranch[];
  context: Context;
}