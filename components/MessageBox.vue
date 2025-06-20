<script setup lang="ts">
const props = defineProps<{
  role: string
  content?: string
  isLoading?: boolean
}>()

const avatar = computed(() => {
  if (props.role === 'user') {
    return 'humbleicons:user-asking'
  } else if (props.role == 'assistant') {
    return 'humbleicons:heading'
  } else {
    return 'humbleicons:pencil'
  }
})
</script>

<template>
  <div class="flex flex-row w-full p-2 gap-2 text-sm text-[#5C5B4F] opacity-60">
    <div class="flex-shrink-0 w-8 h-8">
      <Icon :name="avatar" class="!w-8 !h-8" />
    </div>
    <div v-if="props.role !== 'processor'" class="flex-grow min-w-0">
      <div class="w-full h-full p-2">
        <div class="prose prose-sm">
          <MarkdownRenderer :content="content" />
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-start flex-grow px-2">
      <span v-if="props.content == 'Designer'" class="text-xl font-bold">Designer is thinking...</span>
      <span v-else-if="props.content == 'Layout'" class="text-xl font-bold">Creating Timeline...</span>
    </div>
  </div>
</template>
