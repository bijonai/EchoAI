import { chat } from "~/endpoint"
import chalkHandler from "./tasks/chalkHandler"
import type { AgentEnvironment } from "."
import type { BoardHandler } from "./useBoard"

export default function useTask(info: ChatInfo, environment: AgentEnvironment, boardHandler: BoardHandler) {
  async function taskHandler(taskId: string) {
    try {
      const taskInfo = await chat.taskInfo(info, taskId)
      switch (taskInfo.type) {
        case 'chalk':
          for await (const action of chat.taskExecute(info, taskId)) {
            chalkHandler(action, environment, boardHandler)
          }
      }
    } catch (error) {
      console.error('Failed to handle task', error)
    }
  }

  return {
    taskHandler
  }
}