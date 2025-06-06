<template>
  <div class="flex relative size-full">
    <div class="flex size-full" ref="boardRef"></div>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="pageId" :total="whiteboard.getPageCount()" @switch="$emit('switch', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Operation } from '~/types';
import { Whiteboard } from './whiteboard';
import { renderRoots } from 'sciux';
import initializeSciux from 'sciux'

const boardRef = ref<HTMLDivElement>()
const executed = reactive<string[]>([])

const props = defineProps<{
  operations: Operation[]
  pageId: string
  whiteboard: Whiteboard
}>()

onMounted(() => {
  initializeSciux()
})

defineEmits<{
  (e: 'switch', direction: 'previous' | 'next'): void
}>()

const render = (pageId: string) => {
  if (!props.whiteboard) return
  const { document } = props.whiteboard.findPage(pageId)!
  if (!document) return
  try {
    const roots = renderRoots(document.children)
    boardRef.value!.replaceChildren(...roots)
  } catch (e) {
    console.error('Failed to render page', pageId, 'error:', e)
  }
}

effect(() => {
  if (props.operations.length < 1) return
  for (const opt of props.operations) {
    if (executed.includes(opt.id)) continue
    switch (opt.type) {
      case 'add-node':
        props.whiteboard.addNode(props.pageId, opt.position, opt.content)
        break
      case 'remove-node':
        props.whiteboard.removeNode(props.pageId, opt.position)
        break
      case 'set-prop':
        props.whiteboard.setProp(props.pageId, opt.position, opt.attr, opt.value)
        break
      case 'set-content':
        props.whiteboard.setContent(props.pageId, opt.position, opt.content)
        break
      case 'remove-prop':
        props.whiteboard.removeProp(props.pageId, opt.position, opt.attr)
        break
      default:
        console.error('Unknown operation:', opt)
    }
    executed.push(opt.id)
  }
  render(props.pageId)
})
</script>