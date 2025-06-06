import type { ChatCompletionTool } from "openai/resources.mjs"

export const addPage: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'add-page',
    description: 'Add a new page with a primary document and switch to it.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title or main topic of the page',
        },
      },
      required: ['title'],
    }
  }
}

export const switchPage: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'switch-page',
    description: 'Switch to a page with page id.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The id of the page to switch to',
        },
      },
      required: ['id'],
    }
  }
}

export default [addPage, switchPage]
