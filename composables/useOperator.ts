import type { AttributeNode, DocumentNode, ElementNode } from "sciux";
import type { AddNodeOperation, Operation, RemoveNodeOperation, RemovePropOperation, SetContentOperation, SetPropOperation } from "~/types";
import { querySelectorXPath, parse } from "sciux";

export default function useOperator(
  document: Ref<DocumentNode | undefined>,
  updateViewingDocument?: () => void
) {
  const operated: string[] = []
  const handleAddNode = (op: AddNodeOperation) => {
    if (!document.value) return
    if (operated.includes(op.id)) return
    operated.push(op.id)
    const { children } = parse(op.content)
    const target = <ElementNode>querySelectorXPath(document.value, op.position)
    if (!target) {
      // TODO: handle error
      return console.error(`Failed to find target node: ${op.position}`)
    }
    target.children.push(...children)
    console.log(document.value)
    updateViewingDocument?.()
    return op.type
  }
  const handleSetContent = (op: SetContentOperation) => {
    if (!document.value) return
    if (operated.includes(op.id)) return
    operated.push(op.id)
    const { children } = parse(op.content)
    const target = <ElementNode>querySelectorXPath(document.value, op.position)
    if (!target) {
      // TODO: handle error
      return console.error(`Failed to find target node: ${op.position}`)
    }
    target.children.length = 0
    target.children.push(...children)
    updateViewingDocument?.()
    return op.type
  }
  const handleSetProp = (op: SetPropOperation) => {
    if (!document.value) return
    if (operated.includes(op.id)) return
    operated.push(op.id)
    const target = <ElementNode>querySelectorXPath(document.value, op.position)
    if (!target) {
      // TODO: handle error
      return console.error(`Failed to find target node: ${op.position}`)
    }
    target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
    target.attributes.push(<AttributeNode>{
      name: op.attr,
      value: op.value,
    })
    updateViewingDocument?.()
    return op.type
  }
  const handleRemoveProp = (op: RemovePropOperation) => {
    if (!document.value) return
    if (operated.includes(op.id)) return
    operated.push(op.id)
    const target = <ElementNode>querySelectorXPath(document.value, op.position)
    if (!target) {
      // TODO: handle error
      return console.error(`Failed to find target node: ${op.position}`)
    }
    target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
    updateViewingDocument?.()
    return op.type
  }
  const handleRemoveNode = (op: RemoveNodeOperation) => {
    if (!document.value) return
    if (operated.includes(op.id)) return
    operated.push(op.id)
    const target = <ElementNode>querySelectorXPath(document.value, op.position)
    if (!target) {
      // TODO: handle error
      return console.error(`Failed to find target node: ${op.position}`)
    }
    const parent = target.parent
    if (!parent) {
      // TODO: handle error
      return console.error(`Failed to find parent node: ${op.position}`)
    }
    parent.children = parent.children.filter(child => child !== target)
    updateViewingDocument?.()
    return op.type
  }

  const handleOperation = (op: Operation) => {
    if (operated.includes(op.id)) return
    console.log(op)
    op.position = op.position === '/' ? op.position : '/root' + op.position
    console.log(op.position)
    switch (op.type) {
      case 'add-node':
        return handleAddNode(op)
      case 'set-content':
        return handleSetContent(op)
        break
      case 'set-prop':
        return handleSetProp(op)
      case 'remove-prop':
        return handleRemoveProp(op)
        break
      case 'remove-node':
        return handleRemoveNode(op)
    }
  }

  return {
    handleAddNode,
    handleSetContent,
    handleSetProp,
    handleRemoveProp,
    handleRemoveNode,
    handleOperation,
  }
}