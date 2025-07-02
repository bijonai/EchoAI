<template>
  <div class="flex relative size-full">
    <div ref="board" class="flex size-full" v-show="!debugging" />
    <div v-show="debugging">
      <BoardDebugger :active-document="document" />
    </div>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="viewingId?.toString() ?? ''" :total="total" @switch="handleSwitch" />
    </div>
    <div class="absolute bottom-0 left-0 m-4" v-if="isDebug">
      <div class="w-18 h-9 rounded-xl bg-white flex justify-center items-center hover:cursor-pointer hover:bg-gray-50"
        @click="debugging = !debugging">
        DEBUG
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useRenderer from '~/composables/useRenderer'
import { usePage } from '~/composables/usePage'
const { viewingId, total, document } = usePage()

const isDebug = ref(false)
const debugging = ref(false)
const runtimeConfig = useRuntimeConfig()
if (runtimeConfig.public.boardDebug === 'true') {
  isDebug.value = true
}

const { board } = useRenderer()

function handleSwitch(op: 'next' | 'previous') {
  if (op === 'next') {
    viewingId.value = viewingId.value! + 1
  } else {
    viewingId.value = viewingId.value! - 1
  }
}
</script>

<style>
/* @import '@sciux/theme-default/styles/main.css' */
</style>