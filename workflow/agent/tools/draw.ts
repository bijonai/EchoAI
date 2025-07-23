import { tool, type Message } from "ai";
import { z } from "zod";
import type { PageStore } from "~/types/page";
import { createLayout } from "~/workflow/layout";

export function drawTool(
  getStore: () => PageStore,
  updatePageLayoutContext: (pageId: number, context: Message[]) => void,
  apply: () => Promise<void>,
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
      const { layout: result, context } = await layout({
        input: input.input
      })

      console.log(context)
      updatePageLayoutContext(input.page, context)
      await apply()
      return { success: true, content: result, message: 'design page successfully' }
    }
  })
}