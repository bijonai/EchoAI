import { API_URL } from "@echoai/utils";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { GetChatRequestBody, GetChatResponse } from '@echoai/shared'



export default async function fetchGetChat(body: GetChatRequestBody, token?: string): Promise<GetChatResponse> {

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/chat/get`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data = await response.json()

  return data as GetChatResponse
}