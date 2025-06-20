<template>
  <div class="flex flex-col gap-2 w-full h-full bg-[#FEFFE4] rounded-md p-4 text-sm">
    <textarea class="flex-grow focus:outline-none resize-none text-[#5C5B4F] opacity-60" name="prompt"
      :value="modelValue" placeholder="Send the knowledge you interested..."
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
    <div class="flex flex-row gap-2 justify-end items-center w-full">
      <span
        class="w-10 h-10 flex items-center justify-center rounded-md text-[#5C5B4F] bg-[#E7E3C5] hover:shadow-md transition-all duration-100"
        @click="$emit('next')" v-if="displayNext">
        <span class="opacity-60">Next</span>
      </span>
      <span
        class="w-10 h-10 flex items-center justify-center rounded-md bg-[#E7E3C5] hover:shadow-md transition-all duration-100"
        @click="$emit('send')">
        <Icon name="humbleicons:play" class="!w-5 !h-5 text-[#5C5B4F] opacity-60" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  send?: boolean
  next?: boolean
  displayNext?: boolean
}>(), {
  send: true,
  next: false,
  displayNext: true
})

const emit = defineEmits<{
  (e: 'send'): void
  (e: 'next'): void
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
textarea::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(140, 140, 120, 0.3);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea {
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 140, 120, 0.3) transparent;
}
</style>
