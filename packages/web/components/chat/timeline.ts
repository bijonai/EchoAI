import { MessageBoxType, END } from "./types"
import { DesignerStep, StepBranch } from "@echoai/workflow/designer"
import { DisplayedMessage } from "@echoai/api"

export const convert = (displayedMessages: DisplayedMessage[]): MessageBoxType[] => {
  return displayedMessages.map((msg) => {
    if (msg.role === 'user') {
      return {
        avatar: 'https://picsum.photos/200/300',
        role: 'user',
        content: msg.content
      }
    } else if (msg.role === 'processor') {
      return {
        role: 'tip',
        content: msg.content
      }
    } else {
      return {
        role: 'assistant',
        content: msg.content
      }
    }
  })
}

export const findStep = (stepId: string, branches: StepBranch[]): DesignerStep | null => {
  for (const branch of branches) {
    for (const step of branch.steps) {
      if (step.step.toString() === stepId.toString()) {
        return step
      }
    }
  }
  return null
}

export const findStepNext = (stepId: string, branches: StepBranch[]): DesignerStep | null | typeof END => {
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