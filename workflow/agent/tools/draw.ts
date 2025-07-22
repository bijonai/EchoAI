import { tool } from "ai";
import { z } from "zod";
import type { PageStore } from "~/types/page";
import { createLayout } from "~/workflow/layout";

export function drawTool(
  getStore: () => PageStore,
) {
  return tool({
    description: 'Tool to generate interactive figures according to natural language.',
    parameters: z.object({
      input: z.string()
        .describe('The description of the whiteboard to be generated or changed.'),
      page: z.number()
        .describe('The page number of the target page.'),
    }),
    execute: async (input) => {
      const store = getStore()
      const page = store[input.page.toString()]
      const layout = createLayout(page?.layout_context ?? [])
      const content = await layout({
        input: input.input
      })
      return { success: true, content: content, message: 'design page successfully' }
    }
  })
}