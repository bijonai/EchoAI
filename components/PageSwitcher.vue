<script setup lang="ts">
const props = defineProps<{
  pageId: string
  total: number
}>()

defineEmits<{
  (e: 'switch', direction: 'previous' | 'next'): void
}>()
</script>

<template>
  <div class="bg-white w-32 h-9 rounded-xl flex">
    <div @click="$emit('switch', 'previous')"
      class="flex items-center justify-center w-9 h-full rounded-l-xl mr-auto hover:cursor-pointer
      hover:bg-gray-50">
      <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-500" />
    </div>
    <div class="flex items-center justify-center w-9 h-full select-none">
      <div class="text-sm text-gray-500">
        {{ `${pageId} / ${total}` }}
      </div>
    </div>
    <div @click="$emit('switch', 'next')"
      class="flex items-center justify-center w-9 h-full rounded-r-xl ml-auto hover:cursor-pointer
      hover:bg-gray-50">
      <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-500" />
    </div>
  </div>
</template>