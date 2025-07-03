<template>
  <div class="w-full h-full max-h-56 min-h-48 bg-[#FEFFE4] rounded-md">
    <div class="w-full h-full flex flex-col gap-2 items-stretch justify-start p-2">
      <h4 class="p-0 m-0 font-bold text-[#66665B] opacity-80">{{ data.name }}
      </h4>
      <span class="flex items-center gap-1 font-normal text-sm text-[#66665B] opacity-60">
        <Icon name="humbleicons:user" class="!w-4 !h-4" />
        {{ data.author }}
      </span>
      <div class="flex flex-grow flex-wrap justify-start gap-1">
        <span class="flex h-6 px-2 justify-center items-center bg-[#e9e9e9] rounded-full" v-for="i in data.tags"
          :key="i.id">
          <span class="text-sm text-[#000000] opacity-60">{{ i.name }}</span>
        </span>
      </div>
      <div class="flex justify-end items-center">
        <button
          class="px-2 h-6 bg-[#F76E67] text-white text-md rounded-full hover:shadow-md transition-all duration-100"
          @click="emit('start', data.id)">Start</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicResource } from '~/types/resource';

const props = defineProps<{
  data: PublicResource
}>()

const emit = defineEmits(['start'])
</script>