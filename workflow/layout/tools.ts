// import type { ChatCompletionTool } from "openai/resources.mjs"

// export const addPage: ChatCompletionTool = {
//   type: 'function',
//   function: {
//     name: 'add-page',
//     description: 'Add a new page with a primary document and switch to it.',
//     parameters: {
//       type: 'object',
//       properties: {
//         title: {
//           type: 'string',
//           description: 'The title or main topic of the page',
//         },
//       },
//       required: ['title'],
//     }
//   }
// }

// export const switchPage: ChatCompletionTool = {
//   type: 'function',
//   function: {
//     name: 'switch-page',
//     description: 'Switch to a page with page id.',
//     parameters: {
//       type: 'object',
//       properties: {
//         id: {
//           type: 'string',
//           description: 'The id of the page to switch to',
//         },
//       },
//       required: ['id'],
//     }
//   }
// }

// export default [addPage, switchPage]

import { tool } from '@xsai/tool'
import { type as t } from 'arktype'
import type { LayoutRequestBody } from '~/types'

export const tools = (options: LayoutRequestBody) => {
  const addPage = tool({
    name: 'add-page',
    description: 'Add a new page with a primary document and switch to it.',
    parameters: t({
      title: t.string,
    }),
    execute(input) {
      return `
      ADD PAGE > ${options.page_id_will_be_used}
      TITLE > ${input.title}
      `.trim()
    },
  })

  const switchPage = tool({
    name: 'switch-page',
    description: 'Switch to a page with page id.',
    parameters: t({
      id: t.string,
    }),
    execute(input) {
      return `
      SWITCH PAGE > ${input.id}
      `.trim()
    },
  })

  return Promise.all([addPage, switchPage])
}