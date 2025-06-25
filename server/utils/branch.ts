export const END = Symbol('END')
import type { Branch, Step } from "~/types/timeline"

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