import createChat, { type CreateChatRequestBody, type CreateChatResponse } from "./create"
import getChat from "./get-chat"
import fetchDesigner from "./designer"
import fetchSpeaker from "./speaker"
import { ChalkRequestBody, ChalkResponse, DesignerRequestBody, DesignerResponse, GetChatRequestBody, GetChatResponse, LayoutRequestBody, LayoutResponse, SpeakerRequestBody, SpeakerResponse } from "@echoai/shared"
import fetchLayout from "./layout"
import fetchHistory, { type HistoryResponse } from "./history"
import fetchChalk from "./chalk"
export interface ConnectionParams {
  token: string
}

export function createConnection(params: ConnectionParams) {
  const chat = {
    async create(body: CreateChatRequestBody): Promise<CreateChatResponse> {
      return await createChat(body, params.token)
    },
    async get(body: GetChatRequestBody): Promise<GetChatResponse> {
      return await getChat(body, params.token)
    },
    async designer(body: DesignerRequestBody): Promise<DesignerResponse> {
      return await fetchDesigner(body, params.token)
    },
    async speaker(body: SpeakerRequestBody, callback: (chunk: SpeakerResponse) => void = () => {}): Promise<SpeakerResponse> {
      return await fetchSpeaker(body, callback, params.token) as SpeakerResponse
    },
    async layout(body: LayoutRequestBody): Promise<LayoutResponse> {
      return await fetchLayout(body, params.token)
    },
    async history(): Promise<HistoryResponse> {
      return await fetchHistory(params.token)
    },
    async chalk(body: ChalkRequestBody, callback: (chunk: ChalkResponse) => void = () => {}): Promise<ChalkResponse> {
      return await fetchChalk(body, callback, params.token) as ChalkResponse
    }
  }

  return {
    chat,
  }
}

export * from './create'
export * from './get-chat'
export * from './chalk'