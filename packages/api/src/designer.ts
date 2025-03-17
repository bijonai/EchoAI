import { DesignerRequestBody, DesignerResponse } from '@echoai/shared'
import { API_URL } from "@echoai/utils";

export default async function fetchDesigner(body: DesignerRequestBody, token?: string): Promise<DesignerResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}/chat/designer`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  return await response.json() as DesignerResponse
}
