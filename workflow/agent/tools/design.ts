import { tool } from "xsai";
import { z } from "zod";
import type { Design } from "~/types/design";

export const structure = z.object({
  step: z.string().describe('The step number of the lesson'),
  problem: z.string().describe('What specific concept or problem this step addresses'),
  knowledge: z.string().describe('The fundamental knowledge points needed for this step'),
  explanation: z.string().describe('Detailed guidance for teachers on how to present and explain this content'),
  interaction: z.string().describe('The interaction design of the lesson'),
  conclusion: z.string().describe('The key learning outcome or solution for this step'),
})
export const wrapper = z.object({
  elements: z.array(structure).describe('The steps of the lesson'),
  from: z.string().describe('The start base point of previous-designed branches').optional(),
  to: z.string().describe('The end base point of previous-designed branches').optional(),
})

export async function designTool(design: Design) {
  return tool({
    name: 'design',
    description: 'Design a lesson plan for the user or based on previous teaching steps.',
    parameters: wrapper,
    async execute(input) {
      return {
        message: 'create design successfully',
        success: true,
        data: {
          start: input.elements[0],
          end: input.elements[input.elements.length - 1],
          from: input.from,
          to: input.to,
        }
      }
    },
  })
}