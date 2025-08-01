import { chat, unwrap } from "~/endpoint";
import type { ChatInfo } from ".";
import type { Task } from "~/types/task";

export function useTasks({ chatId, token }: ChatInfo) {
  const tasks = ref<Task[]>([])

  async function pull() {
    const response = await chat.tasks({
      chatId, token
    })
    const [data, error] = unwrap(response)
    if (error) {
      return console.error(error)
    }
    tasks.value = data
  }

  async function get(taskId: string) {
    const response = await chat.task.get(taskId, {
      chatId, token
    })
    const [data, error] = unwrap(response)
    if (error) {
      return new Error(error)
    }
    return data
  }

  async function* execute(taskId: string) {
    const response = chat.task.execute(taskId, {
      chatId, token
    })
    for await (const action of response) {
      yield action
    }
  }

  return {
    tasks, pull, get, execute
  }
}