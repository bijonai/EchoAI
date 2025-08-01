// import { chat } from "~/endpoint";
// import type { AgentEnvironment } from ".";
// import type { AgentMessage } from "~/types/message";
// import { type BoardHandler } from "./useBoard";
// import useTask from "./useTask";

import { agent } from "~/endpoint/chat";
import type { ChatInfo } from ".";
import { useMessages } from "./useMessages";
import { useTasks } from "./useTasks";
import type { AgentMessage } from "~/types/message";

// export default function useAgent(info: ChatInfo, environment: AgentEnvironment, boardHandler: BoardHandler) {
//   const { taskHandler } = useTask(info, environment, boardHandler)

//   async function agent(prompt: string) {
//     try {
//       for await (const action of chat.agent(info, prompt)) {
//         if (!action.success) {
//           console.error(action.error)
//           continue
//         }
//         switch (action.type) {
//           case 'agent-message-chunk':
//             if (environment.messages.value[environment.messages.value.length - 1].type !== 'agent') {
//               environment.messages.value.push({
//                 type: 'agent',
//                 id: environment.messages.value[environment.messages.value.length - 1].id + 1,
//                 content: ''
//               })
//             }
//             (environment.messages.value[environment.messages.value.length - 1] as AgentMessage).content += action.data.chunk
//             break
//           case 'task-created':
//             taskHandler(action.data.id)
//             break
//           case 'design-branch':
//             environment.design.value = action.data.design
//             break
//           case 'step-to':
//             environment.step.value = action.data.step
//             break
//           case 'create-page':
//             boardHandler.createPage(action.data.title, action.data.id)
//             break
//         }
//       }
//     } catch (error) {
//       console.error('Failed to handle agent', error)
//     }
//   }

//   return {
//     agent
//   }
// }

export function useAgent(info: ChatInfo) {
  const { messages } = useMessages(info)
  const { tasks } = useTasks(info)
  
  async function ask(input?: string) {
    const agentGenerator = agent(info)
    for await (const action of agentGenerator) {
      if (!action.success) return console.error(`[Agent Error] ${action.error}`)
      const latest = messages.value[messages.value.length - 1]
      switch (action.type) {
        case 'agent-message-chunk':
          if (latest.type !== 'agent') {
            messages.value.push({
              type: 'agent',
              content: '',
              id: '',
            })
          }
          (<AgentMessage>messages.value[messages.value.length - 1]).content += action.data.chunk
          break
        case 'task-created':
          setTimeout(() => {
            // TODO: execute task
          })
          break
        case 'create-page':
          messages.value.push({
            type: 'page',
            page: parseInt(action.data.id),
            id: '',
          })
          break
        case 'design-branch':
          messages.value.push({
            type: 'design',
            id: ''
          })
          break
        case 'step-to':
          messages.value.push({
            type: 'step',
            step: action.data.step,
            id: ''
          })
        case 'layout-start':
          messages.value.push({
            type: 'layout',
            complete: false,
            id: ''
          })
          break
        case 'layout-done':
          if (latest.type !== 'layout') {
            messages.value.push({
              type: 'layout',
              complete: false,
              id: ''
            })
          }
          messages.value[messages.value.length - 1] = {
            type: 'layout',
            complete: true,
            id: '',
            result: action.data.layout,
          }
      }
    }
  }

  return {
    ask,
    tasks,
    messages,
  }
}
