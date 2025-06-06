<template>
  <div class="sidebar">
    <div class="h-full w-16 flex flex-col justify-between p-3 backdrop-blur-sm">
      <div>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors" @click="isHistoryOpen = !isHistoryOpen">
          <Icon name="heroicons:clock" class="w-10 h-10 text-gray-700" />
        </button>
      </div>
      <div class="flex flex-col gap-4 mt-auto">
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors" @click="navigateTo('/community')">
          <Icon name="heroicons:cube" class="w-10 h-10 text-gray-700" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Icon name="heroicons:cog-6-tooth" class="w-10 h-10 text-gray-700" />
        </button>
        <UserAvatar />
      </div>
    </div>
    <HistoryPanel v-show="isHistoryOpen" :is-open="isHistoryOpen" @close="isHistoryOpen = false" />
  </div>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
const isHistoryOpen = ref(false)
</script>

<style scoped>
.sidebar {
  @apply h-full;
}
</style>