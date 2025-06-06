<template>
  <Teleport to="body">
    <div>
      <!-- Backdrop -->
      <div v-show="isOpen" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" @click="$emit('close')" />

      <!-- Panel -->
      <div :class="`fixed top-0 right-0 h-full bg-white/90 backdrop-blur-sm shadow-xl
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-80 z-50 bg-blue-100`">
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-semibold text-gray-800">History</h2>
            <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div class="space-y-3">
            <div class="p-4 bg-[#EBEBDB] rounded-xl hover:opacity-65 cursor-pointer transition-colors duration-200"
              @click="navigateTo('/')">
              <div class="font-medium text-gray-800">+ New</div>
            </div>

            <div v-for="item in history" :key="item.id"
              class="p-4 bg-white rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              @click="navigateTo(`/chat/${item.id}`)">
              <div class="font-medium text-gray-800">{{ item.title }}</div>
              <div class="text-sm text-gray-500 mt-1">{{ item.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits<{
  (e: 'close'): void
}>()

const history = ref([
  {
    id: '1',
    title: 'Chat 1',
    date: '2024-03-20 10:30'
  },
  {
    id: '2',
    title: 'Chat 2',
    date: '2024-03-20 11:45'
  }
])

// Mock data - replace with actual API call
onMounted(async () => {
  // TODO: Replace with actual API call
})
</script>

<style scoped>
.history-panel {
  @apply h-full;
}
</style>