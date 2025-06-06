<script setup lang="ts">
import type { StepBranch } from '@/types'
import { generateTimeline } from './timeline'

const props = withDefaults(defineProps<{
  branches: StepBranch[],
  width?: number,
  minGap?: number
}>(), {
  width: 800,
  minGap: 100,
})

const svgRef = ref<SVGSVGElement>()

onMounted(() => {
  effect(() => {
    if (!svgRef.value) return
    generateTimeline(props.branches, props.width, props.minGap, svgRef as Ref<SVGSVGElement>)
  })
})
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <svg ref="svgRef" class="w-full h-full select-none" />
  </div>
</template>