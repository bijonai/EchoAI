<template>
  <input class="w-full h-10 bg-white rounded-lg p-2 focus:outline-none resize-none" :placeholder="placeholder"
    :type="type" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"/>
</template>

<script setup lang="ts">
defineProps<{
  placeholder: string,
  type: string,
  modelValue: string,
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
