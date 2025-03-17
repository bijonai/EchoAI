export interface TipMessageBoxType {
  role: 'tip'
  content: string
  isLoading?: boolean
  key?: number
}

export interface ChatMessageBoxType {
  avatar?: string
  role: 'user' | 'assistant'
  content: string
  key?: number
}

export type MessageBoxType = TipMessageBoxType | ChatMessageBoxType

export const END = Symbol('END_FLAG')

