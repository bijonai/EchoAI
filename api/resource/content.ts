import type { PrivateResource } from "~/types/resource"

export function get(id: string, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(`/api/resource/${id}/content`, {
    headers,
    method: 'GET',
  }).then(res => res.json()) satisfies Promise<PrivateResource>
}