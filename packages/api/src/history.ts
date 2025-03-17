import { API_URL } from "@echoai/utils"

export type HistoryResponse = {
  id: string
  updated_at: string
}[]

export default async function fetchHistory(token?: string): Promise<HistoryResponse> {
  const response = await fetch(`${API_URL}/chat/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json() as Promise<HistoryResponse>
}
  