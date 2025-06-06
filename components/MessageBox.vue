<script setup lang="ts">
import Markdown from 'vue-markdown-render'

defineProps<{
  avatar: string
  role: string
  content: string
}>()
</script>

<template>
  <div class="flex w-full p-2 gap-2 text-sm" :class="role === 'user' ? 'flex-row-reverse' : 'flex-row'">
    <div class="flex-shrink-0 w-8 h-8">
      <img class="w-full h-full rounded-full" :src="avatar" />
    </div>
    <div class="flex-grow min-w-0">
      <div class="w-full h-full bg-[rgba(255,255,255,0.5)] rounded-lg p-4">
        <div class="prose prose-sm max-w-none">
          <Markdown :source="content" />
        </div>
      </div>
    </div>
  </div>
</template>
