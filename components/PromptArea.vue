<template>
  <div class="flex w-full h-full bg-[#EBEBDB] rounded-2xl p-2 text-sm">
    <div class="flex flex-col w-full h-full gap-2">
      <div class="flex flex-grow-[1] w-full">
        <!-- components -->
      </div>
      <div class="flex flex-grow-[10] w-full h-full">
        <textarea class="w-full h-full bg-white rounded-2xl p-2 focus:outline-none resize-none" :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
      </div>
      <div class="flex flex-row w-full">
        <div class="flex flex-grow-[1] gap-2">
          <Tool v-if="upload" @click="$emit('upload')" class="flex items-center justify-center size-6">
            <Icon name="heroicons:link" class="w-5 h-5" />
          </Tool>
          <Tool v-if="image" @click="$emit('image')" class="flex items-center justify-center size-6">
            <Icon name="heroicons:photo" class="w-5 h-5" />
          </Tool>
          <Tool v-if="webSearch" @click="$emit('webSearch')" class="flex items-center justify-center size-6">
            <Icon name="heroicons:globe-alt" class="w-5 h-5" />
          </Tool>
        </div>
        <div class="w-full flex-grow-[3] flex justify-end gap-2">
          <Button v-if="send" color="skyblue" @click="$emit('send')">
            <Icon name="heroicons:paper-airplane" class="w-4 h-4 mr-2" /> Send
          </Button>
          <Button v-if="next" color="#FC6262" @click="$emit('next')">
            <Icon name="heroicons:arrow-right" class="w-4 h-4 mr-2" /> Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  send?: boolean
  next?: boolean
  upload?: boolean
  image?: boolean
  webSearch?: boolean
}>(), {
  send: true,
  next: false,
  upload: true,
  image: true,
  webSearch: true
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'next'): void
  (e: 'upload'): void
  (e: 'image'): void
  (e: 'webSearch'): void
}>()
</script>
