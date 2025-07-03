import type { PublicResource, ResourceQueryRequestBody, ResourceQueryResponse, ResourceUploadRequestBody, ResourceUploadResponse } from "~/types/resource"

export function query(body: ResourceQueryRequestBody, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(`/api/resource?limit=${body.limit}&offset=${body.offset}`, {
    headers,
    method: 'GET',
  }).then(res => res.json()) satisfies Promise<ResourceQueryResponse>
}

export function upload(body: ResourceUploadRequestBody, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch('/api/resource', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  }).then(res => res.json()) satisfies Promise<ResourceUploadResponse>
}

export function get(id: string, token?: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(`/api/resource/${id}`, {
    headers,
    method: 'GET',
  }).then(res => res.json()) satisfies Promise<PublicResource>
}

export * as content from "./content"
