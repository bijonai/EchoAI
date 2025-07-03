<template>
  <div
    class="h-full min-h-screen max-h-screen flex flex-col py-2 px-2 gap-2 items-stretch bg-[#FEFFE4] text-[#66665B] transition-all duration-300"
    :class="{ 'w-16 max-w-16 min-w-16': !isOpen, 'w-80 max-w-80 min-w-80': isOpen }">
    <div class="flex flex-row items-center" :class="{ 'justify-between px-2': isOpen, 'justify-center': !isOpen }">
      <span>
        <img src="/logo.svg" alt="logo" class="w-10 h-10" />
      </span>
      <span class="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-200 transition-all duration-100"
        :class="{ 'hidden': !isOpen }" @click="isOpen = false">
        <Icon name="humbleicons:align-objects-left" class="!w-5 !h-5 opacity-60" />
      </span>
    </div>
    <div class="flex flex-col flex-grow max-h-[calc(100vh-4rem)]"
      :class="{ 'items-center': !isOpen, 'items-stretch justify-stretch': isOpen }">
      <!-- Display when sidebar is close -->
      <span v-if="!isOpen"
        class="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-200 transition-all duration-100"
        @click="navigateTo('/')">
        <Icon name="humbleicons:plus" class="!w-5 !h-5 opacity-60" />
      </span>
      <span v-if="!isOpen"
        class="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-200 transition-all duration-100"
        @click="isOpen = true">
        <Icon name="humbleicons:clock" class="!w-5 !h-5 opacity-60" />
      </span>

      <!-- Display when sidebar is open -->
      <HistoryPanel v-if="isOpen" />
    </div>
    <div class="flex flex-col items-center gap-2" :class="{ 'hidden': isOpen }">
      <span class="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-200 transition-all duration-100"
        @click="navigateTo('/resource')">
        <Icon name="humbleicons:dashboard" class="!w-5 !h-5 opacity-60" />
      </span>
      <UserAvatar />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
let isOpen = ref(false)
</script>