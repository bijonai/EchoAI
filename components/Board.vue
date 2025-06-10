<template>
  <div class="flex relative size-full">
    <div class="flex size-full" ref="boardRef"></div>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="pageId" :total="whiteboard.getPageCount()" @switch="$emit('switch', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Whiteboard } from '@/utils/whiteboard';
import { renderRoots } from 'sciux';
import initializeSciux from 'sciux'

const boardRef = ref<HTMLDivElement>()
const executed = reactive<string[]>([])

const props = defineProps<{
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
</script>