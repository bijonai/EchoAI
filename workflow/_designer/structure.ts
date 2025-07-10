import { z } from "zod"
import { type as t } from "arktype"

export const structure = z.object({
  step: z.string().describe('The step number of the lesson'),
  problem: z.string().describe('What specific concept or problem this step addresses'),
  knowledge: z.string().describe('The fundamental knowledge points needed for this step'),
  explanation: z.string().describe('Detailed guidance for teachers on how to present and explain this content'),
  interaction: z.string().describe('The interaction design of the lesson'),
  conclusion: z.string().describe('The key learning outcome or solution for this step'),
})

export const structure_ark = t({
  step: t.string
    .describe('The step number of the lesson'),
  problem: t.string
    .describe('What specific concept or problem this step addresses'),
  knowledge: t.string
    .describe('The fundamental knowledge points needed for this step'),
  explanation: t.string
    .describe('Detailed guidance for teachers on how to present and explain this content'),
  interaction: t.string
    .describe('The interaction design of the lesson'),
  conclusion: t.string
    .describe('The key learning outcome or solution for this step'),
})

export const wrapper = t({
  elements: structure_ark.array(),
})