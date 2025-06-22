import type { Branch, Step } from "~/types/timeline";
import type { ChatInfo } from ".";
import { chat } from "~/api";
import type { Message } from "~/types";

export const END = Symbol('END')

export const findStep = (stepId: string, branches: Branch[]): Step | null => {
  for (const branch of branches) {
    for (const step of branch.steps) {
      if (step.step.toString() === stepId.toString()) {
        return step
      }
    }
  }
  return null
}

export const findStepNext = (stepId: string, branches: Branch[]): Step | null | typeof END => {
  for (const branch of branches) {
    for (let i = 0; i < branch.steps.length; i++) {
      const step = branch.steps[i]
      if (!step || !step.step) continue;
      if (step.step.toString() === stepId.toString()) {
        if (i < branch.steps.length - 1) {
          return branch.steps[i + 1]
        } else if (branch.start && branch.end) {
          return findStep(branch.end, branches)
        } else {
          return END
        }
      }
    }
  }
  return null
}

export default function useDesigner(nextType: NextType, info: ChatInfo) {
  const branches = ref<Branch[]>([])

  async function next(step: Step, prompt: string, refs?: string): Promise<Message[] | undefined> {
    if (nextType.value !== 'doubt') return
    nextType.value = 'prohibited'
    const result = await chat.designer({
      chat_id: info.chat_id,
      prompt,
      refs,
      step: step.step.toString(),
      next_step: (findStepNext(step.step.toString(), branches.value) as Step)?.step.toString(),
    }, info.token)
    nextType.value = 'next'
    branches.value.length = 0
    branches.value.push(...result.branches)
    return result.messages
  }

  return {
    branches,
    next,
  }
}