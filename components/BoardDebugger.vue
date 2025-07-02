<template>
  <div class="size-full">
    <div v-html="html" class="p-5"></div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { NodeType, type DocumentNode, type ChildNode } from 'sciux'

const props = defineProps<{
  activeDocument: DocumentNode
}>()

function processToDocumentString(document: DocumentNode): string {
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

  return resolve(document.children)
}

const result = computed(() => {
  return codeToHtml(processToDocumentString(props.activeDocument), {
    theme: 'github-dark',
    lang: 'html',
  })
})
const html = ref('')
watch(result, async (newVal) => {
  html.value = await newVal
}, { immediate: true })
</script>
