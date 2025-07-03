<template>
  <div class="flex flex-col gap-2 w-full h-full bg-[#FEFFE4] rounded-md p-4 text-sm">
    <textarea class="flex-grow focus:outline-none resize-none text-[#5C5B4F] opacity-60" name="prompt"
      :value="modelValue" placeholder="Send the knowledge you interested..."
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
    <div class="flex flex-row gap-2 justify-end items-center w-full">
      <span
        class="w-10 h-10 flex items-center justify-center rounded-md text-[#5C5B4F] bg-[#E7E3C5] hover:shadow-md transition-all duration-100"
        @click="$emit('action')" v-if="model === 'next'">
        <span class="opacity-60">Next</span>
      </span>
      <span
        class="w-10 h-10 flex items-center justify-center rounded-md bg-[#E7E3C5] hover:shadow-md transition-all duration-100"
        @click="$emit('action')" v-if="model === 'doubt'">
        <Icon name="humbleicons:play" class="!w-5 !h-5 text-[#5C5B4F] opacity-60" />
      </span>
      <span class="w-10 h-10 flex items-center justify-center rounded-md bg-[#E7E3C5]" v-if="model === 'prohibited'">
        <transition name="icon-fade" mode="out-in">
          <Icon :key="bulbOn ? 'bulb' : 'bulb-off'" :name="bulbOn ? 'humbleicons:bulb' : 'humbleicons:bulb-off'"
            class="!w-5 !h-5 text-[#5C5B4F] opacity-60" />
        </transition>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue?: string
  model: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
  (e: 'update:modelValue', value: string): void
}>()

const bulbOn = ref(true)
let bulbProhibitTimer: ReturnType<typeof setInterval> | null = null

watch(() => props.model, (val) => {
  if (val === 'prohibited') {
    if (!bulbProhibitTimer) {
      bulbProhibitTimer = setInterval(() => {
        bulbOn.value = !bulbOn.value
      }, 600)
    }
  } else {
    if (bulbProhibitTimer) {
      clearInterval(bulbProhibitTimer)
      bulbProhibitTimer = null
      bulbOn.value = true
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (bulbProhibitTimer) {
    clearInterval(bulbProhibitTimer)
    bulbProhibitTimer = null
  }
})

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
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) rotate(0deg);
}

.icon-fade-enter-to,
.icon-fade-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
</style>
