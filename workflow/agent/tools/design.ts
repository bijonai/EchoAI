import { tool } from "ai";
import { z } from "zod";
import type { Design } from "~/types/design";

export const stepSchema = z.object({
  step: z.string().describe('The step number of the lesson'),
  problem: z.string().describe('What specific concept or problem this step addresses'),
  knowledge: z.string().describe('The fundamental knowledge points needed for this step'),
  explanation: z.string().describe('Detailed guidance for teachers on how to present and explain this content'),
  interaction: z.string().describe('The interaction design of the lesson'),
  conclusion: z.string().describe('The key learning outcome or solution for this step'),
})

export const branchSchema: z.ZodType<any> = z.lazy(() => z.object({
  steps: z.array(stepSchema).describe('The steps of the lesson'),
  children: z.array(branchSchema).describe('The children branches of the lesson').optional(),
  from: z.string().describe('The start base point of previous-designed branches').optional(),
  to: z.string().describe('The end base point of previous-designed branches').optional(),
}));

export const wrapper = z.object({
  key: z.string().describe('The key of the lesson plan'),
  value: branchSchema.describe('The value of the lesson plan'),
})

export async function designTool(design: Design) {
  return tool({
    description: 'Design a lesson plan for the user or based on previous teaching steps.',
    parameters: wrapper,
    async execute(input) {
      design[input.key] = input.value
      return {
        message: 'create design successfully',
        success: true,
        data: design
      }
    },
  })
}