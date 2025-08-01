import type { TaskResultActions } from "~/types/agent";
import { baseFetch, baseSSEFetch, type FetchParams, type FetchResponse } from ".";
import type { Task } from "~/types/task";

export async function* execute(taskId: string, { chatId, token }: FetchParams): AsyncGenerator<TaskResultActions> {
  const response = baseSSEFetch(`${chatId}/task/${taskId}/execute`, 'GET', token)
  for await (const action of response) {
    yield action satisfies TaskResultActions
  }
}

export async function get(taskId: string, { chatId, token }: FetchParams): FetchResponse<Task> {
  const response = await baseFetch(`${chatId}/task/${taskId}`, 'GET', token)
  return await response.json() as FetchResponse<Task>
}
