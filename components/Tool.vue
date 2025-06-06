<template>
  <div class="size-full p-1 bg-gray-50 hover:cursor-pointer hover:bg-gray-100 rounded-full" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>