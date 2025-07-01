<template>
  <div class="flex relative size-full">
    <div ref="board" class="flex size-full"/>
    <div class="absolute bottom-0 right-0 m-4">
      <PageSwitcher :page-id="viewingId?.toString() ?? ''" :total="total" @switch="handleSwitch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useRenderer from '~/composables/useRenderer'
import { usePage } from '~/composables/usePage'
const { viewingId, total } = usePage()

const { board } = useRenderer()
</script>

<style>
@import '@sciux/theme-default/styles/main.css'
</style>