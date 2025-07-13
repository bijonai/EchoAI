import { tool } from "xsai";
import { z } from "zod";
import { action, type Action, type LayoutActions } from "~/types/agent";
import type { PageStore } from "~/types/page";
import { createChalk } from "~/workflow/chalk";
import { createLayout } from "~/workflow/layout";

export function drawTool(
  store: PageStore,
  push: (action: Action<string, any>) => void
) {
  return tool({
    name: 'draw',
    description: 'Tool to generate interactive figures according to natural language.',
    parameters: z.object({
      input: z.string()
        .describe('The description of the whiteboard to be generated or changed.'),
      page: z.number()
        .describe('The page number of the target page.'),
    }),
    execute: async (input) => {
      push(action<LayoutActions>('layout-start', {}))
      const page = store[input.page.toString()]
      const layout = createLayout(page.layout_context)
      const content = await layout({
        input: input.input
      })
      push(action<LayoutActions>('layout-done', {
        layout: content,
        page: input.page
      }))
      return { success: true, content: content, message: 'design page successfully' }
    }
  })
}