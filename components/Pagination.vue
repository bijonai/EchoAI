<template>
  <div class="flex items-center gap-2 select-none">
    <button class="w-10 h-10 font-bold rounded bg-[#FEFFE4] hover:shadow-md" :disabled="currentPage === 1"
      @click="$emit('update:page', currentPage - 1)">&lt;</button>
    <button v-for="page in pages" :key="page" class="w-10 h-10 font-bold rounded bg-[#FEFFE4] hover:shadow-md"
      :class="{ 'text-[#F76E67] shadow-2xl': page === currentPage }" @click="$emit('update:page', page)">
      {{ page }}
    </button>
    <button class="w-10 h-10 font-bold rounded bg-[#FEFFE4] hover:shadow-md" :disabled="currentPage === pageCount"
      @click="$emit('update:page', currentPage + 1)">&gt;</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ pageCount: number; currentPage: number }>()
const pages = computed(() => {
  return Array.from({ length: props.pageCount }, (_, i) => i + 1)
})
</script>

<style scoped>
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>