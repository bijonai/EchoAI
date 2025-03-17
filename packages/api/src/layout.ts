import { LayoutRequestBody, LayoutResponse } from "@echoai/shared";
import { API_URL } from "@echoai/utils";

export default async function fetchLayout(body: LayoutRequestBody, token?: string): Promise<LayoutResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/chat/layout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return response.json()
}