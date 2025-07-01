<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import * as d3 from 'd3'
import TimelineSlot from './TimelineSlot.vue';
import type { Branch } from '~/types/timeline';
import type { Timeline } from './TimelineUtils';

const props = defineProps<{
  branches: Branch[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const viewBoxRef = ref<HTMLElement | null>(null)
const transform = ref(d3.zoomIdentity)
const timelines = ref<Timeline>()
const timelineSlotRef = ref<InstanceType<typeof TimelineSlot> | null>(null)
const recalculateKey = useState<number>('recalculate-key', () => 0)
const resizeObserver = ref<ResizeObserver | null>(null)

const nowStep = useState<string | null>('now-step')
const activeCardRef = useState<HTMLElement | null>('active-card-ref')

const initD3 = () => {
  if (!containerRef.value || !viewBoxRef.value) return

  const container = d3.select(containerRef.value)
  const viewBox = d3.select(viewBoxRef.value)

  const zoom = d3.zoom()
    .scaleExtent([0.5, 4])
    .on('zoom', (event) => {
      transform.value = event.transform
      viewBox.style('transform', `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`)
    })

  container.call(zoom as any)
}

function moveToActiveCard() {
  if (!activeCardRef.value || !containerRef.value || !viewBoxRef.value) return

  const viewBox = d3.select(viewBoxRef.value)

  viewBox.style('transform', `translate(0px, 0px) scale(1)`)

  const containerRect = containerRef.value.getBoundingClientRect()
  const activeCardRect = activeCardRef.value.getBoundingClientRect()

  const dx = (containerRect.left + containerRect.width / 2) - (activeCardRect.left + activeCardRect.width / 2)
  const dy = (containerRect.top + containerRect.height / 2) - (activeCardRect.top + activeCardRect.height / 2)

  viewBox.style('transform', `translate(${dx}px, ${dy}px) scale(1)`)
}

watch(nowStep, () => {
  moveToActiveCard()
})

function generateTimeline(branches: Branch[], stepMap: Map<string, Branch>, id: string, context: string, visited: Set<string> = new Set()): Timeline {
  const timeline: Timeline = {
    context: `${id} ${context}`,
    children: []
  }

  // 防止循环引用：如果已经访问过这个id，直接返回
  if (visited.has(id.toString())) {
    return timeline
  }

  const branch = stepMap.get(id.toString())
  if (!branch) {
    return timeline
  }

  // 将当前id加入已访问集合
  visited.add(id.toString())

  for (const step of branch.steps) {
    timeline.children.push(generateTimeline(branches, stepMap, step.step, step.problem, visited))
  }

  // 递归完成后从访问集合中移除（允许在不同分支中重复访问）
  visited.delete(id.toString())

  return timeline
}

function branchesToTimeline(branches: Branch[]): Timeline {
  const stepMap = new Map<string, Branch>();

  branches.forEach((branch: Branch) => {
    stepMap.set(branch.start ?? '_', branch);
  });

  return generateTimeline(branches, stepMap, '_', '', new Set())
}

watch(props.branches, () => {
  timelines.value = branchesToTimeline(props.branches)
  recalculateKey.value++
})

onMounted(() => {
  initD3()

  if (containerRef.value && 'ResizeObserver' in window) {
    resizeObserver.value = new ResizeObserver(() => {
      recalculateKey.value++
    })
    resizeObserver.value.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (containerRef.value) {
    d3.select(containerRef.value).on('.zoom', null)
  }

  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full overflow-hidden relative rounded-md">
    <div class="w-full h-full absolute top-0 left-0 rounded-md">
      <div ref="viewBoxRef"
        class="absolute top-0 left-0 origin-top-left pointer-events-auto flex gap-2 p-2 items-center justify-center overflow-hidden">
        <TimelineSlot ref="timelineSlotRef" v-if="timelines" :is-outer="true" :timeline="timelines" :color-index="0"
          :key="recalculateKey" />
      </div>
      <span
        class="w-10 h-10 flex items-center justify-center rounded-md bg-[#FEFFE4] hover:bg-gray-300 transition-all duration-100 absolute top-2 right-2"
        @click="moveToActiveCard">
        <Icon name="humbleicons:location" class="!w-5 !h-5 opacity-60" />
      </span>
    </div>
  </div>
</template>

