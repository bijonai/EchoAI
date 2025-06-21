import { type as t } from "arktype"

export const structure = t({
  step: t.number
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
}).array()
