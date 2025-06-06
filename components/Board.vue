<template>
  <div class="flex relative size-full">
    <div class="flex size-full" ref="boardRef"></div>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="pageId" :total="whiteboard.getPageCount().toString()" @switch="$emit('switch', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Operation } from '~/types';
import { Whiteboard } from './whiteboard';

const boardRef = ref<HTMLDivElement>()

defineProps<{
  operations: Operation[]
  pageId: string
  whiteboard: Whiteboard
}>()

defineEmits<{
  (e: 'switch', direction: 'previous' | 'next'): void
}>()
</script>