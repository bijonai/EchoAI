export type BaseChatRequest = {
  chat_id: string
  step_id: string
}
export type NextChatRequest = {
  type: 'next'
} & BaseChatRequest
export type DoubtChatRequest = {
  type: 'doubt',
  input: string
} & BaseChatRequest
export type ChatRequest = NextChatRequest | DoubtChatRequest