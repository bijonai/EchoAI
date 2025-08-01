import { tool } from "ai";
import { z } from "zod";

export async function stepToTool() {
  return tool({
    description: 'Progress to a step of designed lesson with a step-id',
    parameters: z.object({
      step: z.string().describe('The step-id to progress to'),
    }),
    async execute(input) {
      return {
        success: true,
        message: 'progress to step successfully',
        data: {
          step: input.step,
        }
      }
    },
  })
}