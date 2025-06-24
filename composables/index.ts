export type NextType = Ref<'next' | 'doubt' | 'prohibited'>
export interface ChatInfo {
  chat_id: string
  token: string
}

export * from "./useSpeaker"
export * from "./useDesigner"
export * from "./useBoard"
