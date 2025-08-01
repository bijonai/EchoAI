import type { AgentEnvironment } from ".."
import type { ChalkActions } from "~/types/agent"
import type { BoardHandler } from "../useBoard"

export default async function chalkHandler(command: string, environment: AgentEnvironment, boardHandler: BoardHandler) {
  try {
    const parsedCommand = JSON.parse(command) as ChalkActions

    if (!parsedCommand.success) {
      console.error('Chalk action failed', parsedCommand.error)
      throw new Error(parsedCommand.error)
    }

    switch (parsedCommand.type) {
      case 'chalk-called':
        if (!(parsedCommand.data.page in environment.pages.value)) {
          boardHandler.createPage(parsedCommand.data.page.toString(), parsedCommand.data.page.toString(), false)
        }
        boardHandler.switchPageTo(parsedCommand.data.page.toString())
        break
      case 'chalk-operate':
        const page = environment.pages.value?.[parsedCommand.data.page]
        if (!page) {
          throw new Error('Page not found')
        }
        page.operations.push(parsedCommand.data.operation)
        break
      case 'chalk-end':
        break
    }
  } catch (error) {
    console.error('Failed to parse command', error)
  }
}