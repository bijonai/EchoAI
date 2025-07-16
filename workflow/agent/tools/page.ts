import { tool } from "xsai";
import { z } from "zod";
import type { PageStore } from "~/types/page";

export async function createPageTool(
  store: PageStore,
) {
  return tool({
    name: 'create-page',
    description: 'Tool to create a new page.',
    parameters: z.object({
      title: z.string().describe('The title of the page.'),
    }),
    async execute(input, options) { 
      const last = Math.max(...Object.keys(store).map(Number))
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