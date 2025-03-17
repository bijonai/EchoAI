import { API_URL } from '@echoai/utils'

export interface CreateChatRequestBody {
  prompt?: string
}

export interface CreateChatResponse {
  chat_id: string
}

export default async function createChat(body: CreateChatRequestBody, token?: string): Promise<CreateChatResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/chat/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt: body.prompt
    })
  })

  return await response.json() as CreateChatResponse
}
