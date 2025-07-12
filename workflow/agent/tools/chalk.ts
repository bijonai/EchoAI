import { tool } from "xsai";
import { z } from "zod";
import type { PageStore } from "~/types/page";
import { createChalk } from "~/workflow/chalk";

export function chalkTool(
  store: PageStore,
  send: (message: string) => void
) {
  return tool({
    name: 'chalk',
    description: 'Tool to generate interactive figures according to natural language.',
    parameters: z.object({
      input: z.string()
        .describe('The description of the whiteboard to be generated or changed.'),
      page: z.number()
        .describe('The page number of the target page.'),
    }),
    execute: async (input) => {
      const page = store[input.page.toString()]
      const chalk = createChalk({
        chalk: page.chalk_context,
        layout: page.layout_context,
      })
      const generator = chalk({
        input: input.input,
        page: input.page,
        chunks: page.knowledge,
      })
      const result = async () => {
        for await (const chunk of generator) {
          send(JSON.stringify(chunk))
          if (chunk.type === 'chalk-layouted') {
            result()
            return
          }
        }
      }
      return await result()
    }
  })
}