<template>
  <div :class="[
    'px-4 flex items-center justify-center text-sm p-2 text-white select-none hover:cursor-pointer hover:opacity-65',
    {
      'rounded-2xl h-6': size === 'sm',
      'rounded-md h-8': size === 'md',
      'rounded-lg h-10': size === 'lg'
    }
  ]" :style="{ backgroundColor: color }" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'sm'
})

defineEmits<{
  (e: 'click'): void
}>()
</script>