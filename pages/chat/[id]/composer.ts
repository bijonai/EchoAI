import type { Ref } from "vue";
import type { StepBranch, Context, Operation, DesignerStep, DesignerResponse, LayoutResponse, ChalkResponse } from "~/types";

export const END = Symbol('END')
export const NEW_CHAT = Symbol('NEW_CHAT')

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

export const processOperations = (
  operations: Operation[],
  whiteboard: Whiteboard,
  pageId: string,
  operated: string[] = [],
) => {
  for (const operation of operations) {
    if (operated.includes(operation.id)) continue
    operated.push(operation.id)
    switch (operation.type) {
      case 'add-node':
        whiteboard.addNode(pageId, operation.position, operation.content)
        break
      case 'remove-node':
        whiteboard.removeNode(pageId, operation.position)
        break
      case 'set-prop':
        whiteboard.setProp(pageId, operation.position, operation.attr, operation.value)
        break
      case 'set-content':
        whiteboard.setContent(pageId, operation.position, operation.content)
        break
      case 'remove-prop':
        whiteboard.removeProp(pageId, operation.position, operation.attr)
        break
      default:
        console.error('Unknown operation:', operation)
    }
  }
}

export interface ComposerContext {
  pageId: Ref<number>
  chatId: string
  messages: Ref<Context>
  branches: Ref<StepBranch[]>
  nextAvailablity: Ref<boolean>
  token: Ref<string | undefined>
}

export function useComposer({
  pageId,
  messages,
  branches,
  nextAvailablity,
  token,
  chatId,
}: ComposerContext) {
  async function designer(
    step: string,
    prompt?: string,
  ) {
    console.log(branches)
    const data = await $fetch<DesignerResponse>('/api/chat/designer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        chat_id: chatId,
        prompt,
        step,
        next_step: findStepNext(step, branches.value),
      }
    })
    // After request, add new branch to tree
    const nextStep = findStepNext(step, branches.value)
    if (nextStep === END) return
    branches.value.push({
      steps: data.steps,
      start: step,
      end: nextStep?.step.toString(),
    })
    messages.value.length = 0
    messages.value.push(...data.displayed_messages)
    return data.steps
  }

  async function speaker(
    step: string,
    problem: string,
    knowledge: string,
    explanation: string,
    conclusion: string,
  ) {
    const res = await fetch('/api/chat/speaker', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({
        chat_id: chatId,
        step,
        problem,
        knowledge,
        explanation,
        conclusion,
        stream: true,
      })
    })
    const reader = res.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    messages.value.push({
      role: 'speaker',
      content: '',
      step,
      isLoading: true,
    })
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      messages.value.at(-1)!.content += decoder.decode(value, { stream: true })
    }
    reader.releaseLock()
    messages.value.at(-1)!.isLoading = false
  }

  async function layout(
    prompt: string,
    step: string,
    problem: string,
    knowledge: string,
    explanation: string,
    conclusion: string,
    interaction: string,
    pageIdWillBeUsed: string,
  ) {
    // Request layout
    const data = await $fetch<LayoutResponse>('/api/chat/layout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        chat_id: chatId,
        prompt,
        step,
        problem,
        knowledge,
        explanation,
        conclusion,
        interaction,
        page_id_will_be_used: pageIdWillBeUsed,
      }
    })
    if (data.operation) {
      if (data.operation.type === "new-page") {
        // pageId.value = whiteboard.addPage(data.value.operation.title).id;
      } else if (data.operation.type === "switch-page") {
        pageId.value = parseInt(data.operation.pageId);
      }
    }
    return data.content
  }

  const operated: string[] = []
  async function chalk(
    whiteboard: Whiteboard,
    prompt: string,
    step: string,
    document?: string,
    pageId?: string,
    model?: string,
    stream: boolean = true,
  ) {
    const response = await fetch('/api/chat/chalk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({
        chat_id: chatId,
        prompt,
        document,
        page_id: pageId,
        model,
        stream,
        step,
      })
    })
    if (stream) {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const { operations } = JSON.parse(decoder.decode(value, { stream: true }))
          processOperations(operations, whiteboard, pageId!, operated)
        }
      } finally {
        reader.releaseLock();
      }
      return;
    }

    return await response.json() as ChalkResponse;
  }
  
  return async (whiteboard: Whiteboard, latestStep: string, input?: string | typeof NEW_CHAT) => {
    nextAvailablity.value = false
    let designerResult = null
    if (input) designerResult = await designer(latestStep, input === NEW_CHAT ? void 0 : input)
    console.log(designerResult)
    const step = designerResult ? designerResult[0] : findStepNext(latestStep, branches.value)
    if (!step || step === END) return null
    const speakerPromise = speaker(step.step.toString(), step.problem, step.knowledge, step.explanation, step.conclusion)
    const boardPromise = new Promise(async (resolve) => {
      const content = await layout(typeof input === 'string' ? input : '', step.step.toString(), step.problem, step.knowledge, step.explanation, step.conclusion, '', pageId.value.toString())
      chalk(whiteboard, content!, step.step.toString(), '', pageId.value.toString())
      resolve(null)
    })
    await Promise.all([speakerPromise, boardPromise])
    nextAvailablity.value = true
  }
}