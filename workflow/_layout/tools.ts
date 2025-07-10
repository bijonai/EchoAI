import { tool } from 'ai'
import type { LayoutRequestBody } from '~/types'
import z from 'zod'

export const tools = (options: LayoutRequestBody) => ({
  'add-page': tool({
    description: 'Add a new page with a primary document and switch to it.',
    parameters: z.object({
      title: z.string().describe('The title of the page to add'),
    }),
    async execute({ title }) {
      return {
        action: 'add-page',
        page_id: options.page_id_will_be_used,
        title,
      }
    }
  }),

  'switch-page': tool({
    description: 'Switch to a page with page id.',
    parameters: z.object({
      id: z.string().describe('The id of the page to switch to'),
    }),
    async execute({ id }) {
      return {
        action: 'switch-page',
        id,
      }
    }
  }),
})
