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
      <span v-if="props.content == 'Designer'" class="py-2 text-xl font-bold"
        :class="{ 'loading-effect-designer': true }">Designer is
        thinking...</span>
      <span v-else-if="props.content == 'Layout'" class="py-2 text-xl font-bold flex items-center gap-2">
        <span>Create Timeline</span>
        <svg width="95" height="20" viewBox="0 0 95 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle :class="{ 'flow-ball ball-1': true }" cx="10" cy="10" r="10" fill="#87CEEB" />
          <circle :class="{ 'flow-ball ball-2': true }" cx="35" cy="10" r="10" fill="#FFA500" />
          <circle :class="{ 'flow-ball ball-3': true }" cx="60" cy="10" r="10" fill="#E88AFF" />
          <circle :class="{ 'flow-ball ball-4': true }" cx="85" cy="10" r="10" fill="#FF4B4B" />
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

.flow-ball {
  opacity: 0.6;
  animation: ball-flow 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.ball-1 {
  animation-delay: 0s;
}

.ball-2 {
  animation-delay: 0.2s;
}

.ball-3 {
  animation-delay: 0.4s;
}

.ball-4 {
  animation-delay: 0.6s;
}

@keyframes ball-flow {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}
</style>
