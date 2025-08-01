import type { BaseResponse } from "~/types/response"

export * as chat from "./chat"
export * as resource from "./resource"

export function unwrap<T>(response: BaseResponse<T>): [T, string?] {
  if (response.success) return [response.data]
  else return [response.data, response.message]
}
