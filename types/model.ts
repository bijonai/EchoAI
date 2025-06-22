import type { PageSwitch } from './page-switch'
import type { Operation, Position } from './operation'
import type { Branch, Step } from './timeline';

// ===== 基础类型 =====
export type Message = {
  role: 'user' | 'speaker' | 'processor';
  content: string;
  step?: string;
  isLoading?: boolean;
}

export type Context = Message[]

// ===== Designer 相关 =====
// export interface DesignerStep {
//   step: string
//   problem: string
//   knowledge: string
//   explanation: string
//   conclusion: string
//   interaction: string
// }

// export interface StepBranch {
//   steps: DesignerStep[]
//   start?: string
//   end?: string
// }

type Stream<T extends object> = {
  delta: T
  done: boolean
}

export interface DesignerResult {
  prompt: string;
  refs?: string;
  step?: string;
  result: Step[];
}

export interface DesignerRequestBody {
  chat_id: string;
  prompt: string;
  refs?: string;
  step?: string;
  next_step?: string;
}

export interface DesignerResponse {
  branches: Branch[]
  messages: Message[]
}

// ===== Speaker 相关 =====
export interface SpeakerResult {
  prompt?: string;
  model?: string;
  content: string;
  step: Step;
}

export interface SpeakerRequestBody {
  chat_id: string;
  step: Step;
  prompt?: string;
  model?: string;
  stream?: boolean;
}

export interface SpeakerResponse {
  content: string;
}

export type SpeakerResponseStream = Stream<SpeakerResponse>

// ===== Layout 相关 =====
export interface LayoutResult {
  content: string;
  operation?: PageSwitch;
  step: Step;
}

export interface LayoutResponse {
  content?: string;
  operation?: PageSwitch;
}

export interface LayoutRequestBody {
  chat_id: string;
  prompt: string;
  step: Step;
  page_id_will_be_used: string;
}

// ===== Chalk 相关 =====
export interface ChalkResult {
  layout: string;
  components?: Position[];
  output: Operation[];
  step: string;
}

export interface ChalkResponse {
  operations: Operation[];
  page_id: string;
}

export type ChalkResponseStream = Stream<ChalkResponse>

export interface ChalkRequestBody {
  chat_id: string;
  layout: string;
  step: string;
  components?: Position[];
  document?: string;
  page_id?: string;
  stream?: boolean;
}

// ===== 通用/其他类型 =====
export type PageStore = Array<{
  id: string
  title: string
}>

export interface GetChatRequestBody {
  chat_id: string;
}

export interface GetChatResponse {
  chat_id: string;
  messages: Message[];
  branches: Branch[];
  pages: PageStore;
  chalk: ChalkResult[];
}

export interface CreateChatRequestBody {
  prompt: string;
}

export interface CreateChatResponse {
  chat_id: string;
}

export type HistoryResponse = {
  uid: string;
  id: string;
  updated_at: string;
}[]