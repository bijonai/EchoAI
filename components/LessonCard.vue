<script setup lang="ts">
import type { LessonSummary } from '~/types'

defineProps<LessonSummary>()
</script>

<template>
  <div class="flex flex-col w-full h-52 bg-gray-100 hover:bg-gray-50 rounded-lg p-5 gap-3">
    <div class="size-full gap-3">
      <div class="flex flex-row w-full">
        <h1 class="text-md text-black w-5/6">{{ title }}</h1>
        <div
          class="text-[10px] w-1/6 justify-center items-center flex text-gray-700 select-none hover:bg-[#e6e6af] bg-[#EBEBDB] rounded-full px-2 py-1">
          $200</div>
      </div>
      <p class="text-sm h-full text-gray-500">{{ description }}</p>
    </div>
    <div class="flex w-1/2 h-6 gap-2">
      <div class="text-sm text-gray-500">
        {{ author }}
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <div v-for="(tag, index) in tags" :key="index" class="flex h-6 bg-[#EBEBDB] opacity-80 rounded-full">
        <div class="flex size-full py-1 px-3 justify-center items-center">
          <div class="size-full text-[10px] opacity-100 flex items-center justify-center">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

