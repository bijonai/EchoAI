import { UNAUTHORIZED_USER } from "./env"

export function latest<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

export function getUserId(event: any) {
  if (UNAUTHORIZED_USER) return UNAUTHORIZED_USER
  return event['userId'] as string
}
