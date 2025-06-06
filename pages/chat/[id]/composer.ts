import type { Ref } from "vue";
import type { StepBranch, Context, Operation, DesignerStep } from "~/types";

export const END = Symbol('END')

export interface ComposerContext {
  pageId: Ref<string>
  operations: Ref<Operation[]>
  messages: Ref<Context>
  prompt: Ref<string>
  branches: Ref<StepBranch[]>
  nextAvailablity: Ref<boolean>
}

export function useComposer({
  pageId,
  operations,
  messages,
  prompt,
  branches,
}: ComposerContext) {
  const findStep = (stepId: string, branches: StepBranch[]): DesignerStep | null => {
    for (const branch of branches) {
      for (const step of branch.steps) {
        if (step.step.toString() === stepId.toString()) {
          return step
        }
      }
    }
    return null
  }

  const findStepNext = (stepId: string, branches: StepBranch[]): DesignerStep | null | typeof END => {
    for (const branch of branches) {
      for (let i = 0; i < branch.steps.length; i++) {
        const step = branch.steps[i]
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

  async function designer() {
    // After request, add new branch to tree
    branches.value.push()
  }

  async function speaker() {
    // Process streaming response
    messages // Change to messages
  }

  async function layout(): Promise<string> {
    // Request layout
    return ''
  }

  async function chalk() {
    // Process operation from streaming response
    operations // Change to operations
  }
  
  return (input?: string) => {
    // If input is provided, design a new branch
    if (input) { }
    else { }
  }
}