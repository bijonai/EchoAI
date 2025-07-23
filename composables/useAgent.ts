import { chat } from "~/endpoint";
import type { AgentEnvironment } from ".";
import type { AgentMessage } from "~/types/message";
import { type BoardHandler } from "./useBoard";
import useTask from "./useTask";

export default function useAgent(info: ChatInfo, environment: AgentEnvironment, boardHandler: BoardHandler) {
  const { taskHandler } = useTask(info, environment, boardHandler)

  async function agent(prompt: string) {
    try {
      for await (const action of chat.agent(info, prompt)) {
        if (!action.success) {
          console.error(action.error)
          continue
        }
        switch (action.type) {
          case 'agent-message-chunk':
            if (environment.messages.value[environment.messages.value.length - 1].type !== 'agent') {
              environment.messages.value.push({
                type: 'agent',
                id: environment.messages.value[environment.messages.value.length - 1].id + 1,
                content: ''
              })
            }
            (environment.messages.value[environment.messages.value.length - 1] as AgentMessage).content += action.data.chunk
            break
          case 'task-created':
            taskHandler(action.data.id)
            break
          case 'design-branch':
            environment.design.value = action.data.design
            break
          case 'step-to':
            environment.step.value = action.data.step
            break
          case 'create-page':
            boardHandler.createPage(action.data.title, action.data.id)
            break
        }
      }
    } catch (error) {
      console.error('Failed to handle agent', error)
    }
  }

  return {
    agent
  }
}