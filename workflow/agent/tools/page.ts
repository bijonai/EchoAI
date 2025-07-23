import { tool } from "ai";
import { z } from "zod";
import type { PageStore } from "~/types/page";

export async function createPageTool(
  getStore: () => PageStore,
) {
  return tool({
    description: 'Tool to create a new page.',
    parameters: z.object({
      title: z.string().describe('The title of the page.'),
    }),
    async execute(input) {
      const store = getStore()
      const last = store.length ? Math.max(...Object.keys(store).map(Number)) : 0
      const id = last + 1
      return {
        success: true,
        message: 'create page successfully',
        data: {
          id: id.toString(),
          title: input.title,
        }
      }
    },
  })
}