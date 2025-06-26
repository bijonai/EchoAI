import type { AddNodeOperation, ChalkRequestBody, CreateChatRequestBody, CreateChatResponse, DesignerRequestBody, DesignerResponse, GetChatRequestBody, GetChatResponse, HistoryResponse, LayoutResponse, RemoveNodeOperation, SetContentOperation, SpeakerRequestBody, RemovePropOperation, ChalkResponseStream, LayoutRequestBody, SetPropOperation, PageSwitch, Operation } from "~/types";

export async function create(body: CreateChatRequestBody, token?: string): Promise<CreateChatResponse> {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch('/api/chat/create', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  }).then(res => res.json()) satisfies Promise<CreateChatResponse>
}

export async function get(body: GetChatRequestBody, token?: string): Promise<GetChatResponse> {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch('/api/chat/get', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  }).then(res => res.json()) satisfies Promise<GetChatResponse>
}

export async function history(token?: string): Promise<HistoryResponse> {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch('/api/chat/history', {
    headers,
    method: 'GET',
  }).then(res => res.json()) satisfies Promise<HistoryResponse>
}

export type LayoutCallbacks = {
  onOperate?(operation: PageSwitch): void
}
export async function layout(body: LayoutRequestBody, callbacks: LayoutCallbacks = {}, token?: string): Promise<LayoutResponse> {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch('/api/chat/layout', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
  const result = await response.json() satisfies Promise<LayoutResponse>
  if (result.operation) callbacks.onOperate?.(result.operation)
  return result
}

export async function designer(body: DesignerRequestBody, token?: string): Promise<DesignerResponse> {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch('/api/chat/designer', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
  return await response.json() satisfies DesignerResponse
}

export type SpeakerCallbacks = {
  onChunk?(chunk: string): void
}
export async function speaker(body: SpeakerRequestBody, callbacks: SpeakerCallbacks = {}, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch('/api/chat/speaker', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder();
  (async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      callbacks.onChunk?.(text)
    }
  })()
  return response
}

export type ChalkCallbacks = {
  onOperate?(operation: Operation): void
}
export async function chalk(body: ChalkRequestBody, callbacks: ChalkCallbacks = {}, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch('/api/chat/chalk', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder();
  (async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      const data = <ChalkResponseStream>JSON.parse(text)
      const { operations } = data.delta
      for (const op of operations) {
        callbacks.onOperate?.(op)
      }
    }
  })()
  return response
}
