<template>
  <div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-if="pointShape === 'row'">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="z-50">
        <rect x="1" y="1" width="18" height="10" rx="5" :stroke="color" stroke-width="2" fill="#FEFFE4" />
      </svg>
    </div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-else-if="pointShape === 'col'">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="z-50">
        <rect x="1" y="1" width="10" height="18" rx="5" :stroke="color" stroke-width="2" fill="#FEFFE4" />
      </svg>
    </div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-else-if="pointShape === 'circle'">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="z-50">
        <rect x="1" y="1" width="10" height="10" rx="5" :stroke="color" stroke-width="2" fill="#FEFFE4" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  pointShape: 'row' | 'col' | 'circle',
  color: string
}>()
</script>