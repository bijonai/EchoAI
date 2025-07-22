import type { Operation } from "~/types/operation";
import { createRootNode, type AgentEnvironment } from ".";
import { createUpdater, parse, querySelectorXPath, renderRoots, type AttributeNode, type BaseNode, type ElementNode } from "sciux";
import type { ChalkOperateAction } from "~/types/agent";

export interface BoardHandler {
  createPage(title: string, id: string, autoSwitch?: boolean): void
  switchPageTo(id: string): void
  nextPage(): void
  previousPage(): void
  applyOperation(operation: ChalkOperateAction): void
}

export default function useBoard(environment: AgentEnvironment): BoardHandler {
  const updater = createUpdater()

  for (const page of Object.keys(environment.pages.value)) {
    for (const operation of environment.pages.value[page].operations) {
      applyOperation({
        type: 'chalk-operate',
        success: true,
        timestamp: new Date(),
        data: {
          operation,
          page: parseInt(page)
        }
      })
    }

    if (environment.pages.value[page].ast.value?.children) {
      environment.pages.value[page].rendered.value = renderRoots(environment.pages.value[page].ast.value?.children)
    }
  }

  const firstPage = Object.keys(environment.pages.value)[0] as string
  environment.activePageId.value = firstPage
  if (environment.pages.value[firstPage].ast.value?.children) {
    updater(environment.pages.value[firstPage].ast.value)
  }

  watch(environment.activePageId, (id) => {
    if (id && environment.pages.value[id].ast.value) {
      updater(environment.pages.value[id].ast.value)
    }
  })

  function createPage(title: string, id: string, autoSwitch: boolean = true) {
    if (environment.pages.value[id]) {
      console.error(`Page ${id} already exists`)
      return
    }

    environment.pages.value[id] = {
      title,
      operations: [],
      knowledge: [],
      chalk_context: [],
      layout_context: [],
      ast: ref(createRootNode(id)),
      rendered: ref(null)
    }

    if (environment.pages.value[id].ast.value?.children) {
      environment.pages.value[id].rendered.value = renderRoots(environment.pages.value[id].ast.value?.children)


    } if (autoSwitch) {
      environment.activePageId.value = id
    }
  }

  function switchPageTo(id: string) {
    if (!(id in environment.pages.value)) {
      console.error(`Page ${id} not found`)
      return
    }

    environment.activePageId.value = id
  }

  function nextPage() {
    if (!environment.activePageId.value) {
      console.error('No active page')
      return
    }
    const currentPageId = environment.activePageId.value
    const pages = Object.keys(environment.pages.value)
    const currentIndex = pages.indexOf(currentPageId)
    const nextIndex = (currentIndex + 1) % pages.length
    switchPageTo(pages[nextIndex])
  }

  function previousPage() {
    if (!environment.activePageId.value) {
      console.error('No active page')
      return
    }
    const currentPageId = environment.activePageId.value
    const pages = Object.keys(environment.pages.value)
    const currentIndex = pages.indexOf(currentPageId)
    const previousIndex = (currentIndex - 1 + pages.length) % pages.length
    switchPageTo(pages[previousIndex])
  }

  function applyOperation(operation: ChalkOperateAction) {
    if (!operation.success) {
      console.error(`Failed to apply operation ${operation.type}`, operation.error)
      return
    }
    const { ast } = environment.pages.value[operation.data.page]
    if (!ast || !ast.value) {
      console.error(`Page ${operation.data.page} not found`)
      return
    }
    const op = operation.data.operation
    const target = <ElementNode>querySelectorXPath(ast.value, op.position)
    if (!target) {
      console.error(`Target not found for operation ${op.type}`)
      return
    }
    switch (op.type) {
      case 'add-node': {
        const { children } = parse(op.content)
        target.children.push(...children)
        break
      }
      case 'set-content': {
        const { children } = parse(op.content)
        target.children.length = 0
        target.children.push(...children)
        break
      }
      case 'set-prop': {
        target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
        target.attributes.push(<AttributeNode>{
          name: op.attr,
          value: op.value,
        })
        break
      }
      case 'remove-prop': {
        target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
        break
      }
      case 'remove-node': {
        const parent = target.parent
        if (!parent) {
          console.error(`Failed to find parent node: ${op.position}`)
          break
        }
        parent.children = parent.children.filter(child => child !== target)
        break
      }
    }

    const updateAST = environment.pages.value[operation.data.page.toString()].ast.value
    if (updateAST && environment.activePageId.value === operation.data.page.toString()) {
      updater(updateAST)
    }
  }

  return {
    createPage,
    switchPageTo,
    nextPage,
    previousPage,
    applyOperation
  }
}