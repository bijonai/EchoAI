import { ChildNode, DocumentNode, ElementNode, NodeType, parse, querySelectorXPath, ref, Ref } from 'sciux'

export type WhiteboardPage = {
  id: string
  title: string
  document: DocumentNode
}

const resolveXPath = (source: string) => {
  if (source === '/') {
    return `${source}`
  } else {
    return `/root${source}`
  }
}
export class Whiteboard {
  pages: WhiteboardPage[] = []
  primaryPageTemp: DocumentNode = parse('<root></root>')
  // When whiteboard.nextable and chalk workflow request completed status both true, the next function will be allowed.
  nextable: Ref<boolean> = ref(true)

  constructor() { }

  findPage(id: string) {
    return this.pages.find(page => page.id === id)
  }

  getPageCount() {
    return this.pages.length
  }

  addPage(title: string) {
    const page: WhiteboardPage = {
      id: (this.pages.length + 1).toString(),
      title,
      document: this.primaryPageTemp
    }
    this.pages.push(page)
    return page
  }

  removePage(id: string) {
    this.pages = this.pages.filter(page => page.id !== id)
  }

  // Operations
  addNode(
    pageId: string,
    position: string, // XPath
    content: string
  ) {
    const page = this.findPage(pageId)!
    const node = querySelectorXPath(page.document, resolveXPath(position))!
    // 
    const children = parse(content).children
    if (node.type === NodeType.ELEMENT || node.type === NodeType.FRAGMENT || node.type === NodeType.DOCUMENT) {
      node.children.push(...children)
    }

    console.log('document', page.document)

    return this
  }

  removeNode(
    pageId: string,
    position: string // XPath
  ) {
    const page = this.findPage(pageId)!
    const node = querySelectorXPath(page.document, resolveXPath(position))!
    node.parent?.children.splice(node.parent.children.indexOf(node), 1)

    return this
  }

  setProp(
    pageId: string,
    position: string, // XPath
    prop: string,
    value: string
  ) {
    const page = this.findPage(pageId)!
    const node = querySelectorXPath(page.document, resolveXPath(position))!
    if (node.type === NodeType.ELEMENT) {
      for (const attr of node.attributes) {
        if (attr.name === prop) {
          attr.value = value
          return this
        }
      }
      node.attributes.push({ name: prop, value, type: NodeType.ATTRIBUTE, raw: `${prop}="${value}"` })
    }

    return this
  }

  removeProp(
    pageId: string,
    position: string, // XPath
    prop: string
  ) {
    const page = this.findPage(pageId)!
    const node = querySelectorXPath(page.document, resolveXPath(position))!
    if (node.type === NodeType.ELEMENT) {
      node.attributes = node.attributes.filter(attr => attr.name !== prop)
    }
    return this
  }

  setContent(
    pageId: string,
    position: string, // XPath
    content: string
  ) {
    const page = this.findPage(pageId)!
    const node = querySelectorXPath(page.document, resolveXPath(position))!
    if (node.type === NodeType.ELEMENT || node.type === NodeType.FRAGMENT || node.type === NodeType.DOCUMENT) {
      node.children = parse(content).children
    }
    return this
  }

  // Process
  processToDocumentString(pageId: string): string {
    const page = this.findPage(pageId)!

    const resolve = (children: ChildNode[]) => {
      let content = ''
      for (const child of children) {
        switch (child.type) {
          case NodeType.TEXT:
            content += child.content
            break
          case NodeType.VALUE:
            content += `{{${child.value}}}`
            break
          case NodeType.ELEMENT:
            content += `<${child.tag}`
            for (const attr of child.attributes) {
              content += ` ${attr.name}="${attr.value}"`
            }
            if (child.selfClosing) {
              content += '/>'
              break
            }
            content += '>'
            const childrenContent = resolve(child.children)
            content += childrenContent
            content += `</${child.tag}>`
            break
        }
      }

      return content
    }

    return resolve(page.document.children)
  }

  processToSummarizedDocumentString(pageId: string): string {
    const page = this.findPage(pageId)!

    return ''
  }
}
