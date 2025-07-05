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

export default function useDesigner(nextType: NextType, info: ChatInfo, messages: Ref<Message[]>) {
  const branches = ref<Branch[]>([])
  const currentStep = ref<string | null>(null)

  async function next(step: Step | null, { prompt, resource_id }: {
    prompt?: string,
    resource_id?: string,
  }): Promise<Message[] | undefined> {
    console.log('designer')

    nextType.value = 'prohibited'
    messages.value.push({
      role: 'processor',
      content: 'Designer is thinking...',
      isLoading: true,
    })

    const result = await chat.designer({
      chat_id: info.chat_id,
      prompt: prompt ?? '',
      resource_id: resource_id ?? '',
      step: step ? step.step.toString() : undefined,
      next_step: void 0,
    }, info.token)

    nextType.value = 'next'

    branches.value.length = 0
    branches.value.push(...result.branches)
    messages.value.length = 0
    messages.value.push(...result.messages)
    currentStep.value = latest(result.branches)?.steps[0].step.toString() ?? null

    return result.messages
  }

  return {
    branches,
    step: currentStep,
    next,
  }
}