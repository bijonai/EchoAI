<template>
  <div class="flex relative size-full">
    <div class="flex size-full" ref="boardRef"></div>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="viewingId?.toString() ?? ''" :total="total" @switch="handleSwitch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { pageId, viewingId, document, total } = usePage()

function handleSwitch(operation: 'next' | 'previous') {
  if (operation === 'next') {
    if (viewingId.value! < total.value) {
      viewingId.value = viewingId.value! + 1
    }
  } else if (operation === 'previous') {
    if (viewingId.value! > 0) {
      viewingId.value = viewingId.value! - 1
    }
  }
}

const boardRef = ref<HTMLDivElement>()

</script>