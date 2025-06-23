<script setup lang="ts">
const props = defineProps<{
  role: string
  content?: string
  isLoading?: boolean
  timelineIndex?: number /* start with 0 */
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
  <div class="flex flex-row w-full p-2 gap-1 text-md font-bold text-[#5C5B4F] opacity-80">
    <div class="flex-shrink-0 w-6 h-6 pt-2">
      <Icon :name="avatar" class="!w-6 !h-6" />
    </div>
    <div v-if="props.role !== 'processor'" class="flex-grow min-w-0">
      <div class="w-full h-full p-2">
        <div class="prose prose-sm">
          <MarkdownRenderer :content="content" />
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-start flex-grow px-2">
      <span v-if="isLoading" class="py-2 text-xl font-bold" :class="{ 'loading-effect-designer': true }">Designer is
        thinking...</span>
      <span v-else class="py-2 text-xl font-bold flex gap-2 items-center flex-wrap">
        <span>Created</span>
        <span>Timeline</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#87CEEB" :class="{ 'hidden': (timelineIndex ?? 0) % 4 !== 0 }" />
          <circle cx="10" cy="10" r="10" fill="#FFA500" :class="{ 'hidden': (timelineIndex ?? 0) % 4 !== 1 }" />
          <circle cx="10" cy="10" r="10" fill="#E88AFF" :class="{ 'hidden': (timelineIndex ?? 0) % 4 !== 2 }" />
          <circle cx="10" cy="10" r="10" fill="#FF4B4B" :class="{ 'hidden': (timelineIndex ?? 0) % 4 !== 3 }" />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
.loading-effect-designer {
  background: linear-gradient(90deg,
      rgba(92, 91, 79, 0.5) 0%,
      rgba(92, 91, 79, 0.9) 50%,
      rgba(92, 91, 79, 0.5) 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: flow-designer 2s linear infinite;
}

@keyframes flow-designer {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 200% 50%;
  }
}
</style>
