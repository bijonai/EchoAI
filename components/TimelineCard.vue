<template>
  <div class="flex flex-col justify-center gap-1 size-auto" ref="cardRef" @mouseover="display = true"
    @mouseleave="display = props.fullDisplay">
    <TimelinePointShape ref="pointRef" :point-shape="props.pointShape" :color="'#000'" class="min-w-24" />
    <div class="timeline-content font-bold text-sm text-[#5C5B4F] max-w-48 break-words whitespace-pre-line text-center"
      :class="{ 'timeline-visible': display }">
      {{ props.conetext }}
    </div>
  </div>
</template>

<script setup lang="ts">
import TimelinePointShape from './TimelinePoint.vue'
import { ref, watch, onMounted, onUnmounted, reactive } from 'vue'
import type { TimelinePointPosition } from './TimelineUtils'

const props = defineProps<{
  conetext: string
  fullDisplay?: boolean
  pointShape: 'row' | 'col' | 'circle'
}>()

const display = ref<boolean>(props.fullDisplay)
const cardRef = ref<HTMLElement | null>(null)
const pointRef = ref<InstanceType<typeof TimelinePointShape> | null>(null)

// 点位置
const pointPosition = reactive<TimelinePointPosition>({
  type: 'point',
  x: 0,
  y: 0
})

// 计算点位置
const calculatePointPosition = () => {
  if (!cardRef.value || !pointRef.value?.$el) return

  const cardRect = cardRef.value.getBoundingClientRect()
  const pointRect = pointRef.value.$el.getBoundingClientRect()

  // 计算点相对于卡片的中心坐标
  pointPosition.x = pointRect.left + pointRect.width / 2 - cardRect.left
  pointPosition.y = pointRect.top + pointRect.height / 2 - cardRect.top
}

// 监听窗口大小变化
onMounted(() => {
  calculatePointPosition()
  window.addEventListener('resize', calculatePointPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePointPosition)
})

// 暴露方法和数据给父组件
defineExpose({
  pointPosition,
  calculatePointPosition
})

watch(() => props.fullDisplay, (newVal) => {
  display.value = newVal ?? false
})
</script>

<style scoped>
.timeline-content {
  opacity: 0;
  visibility: hidden;
  height: 48px;
  /* 可根据实际需要调整 */
  position: relative;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  overflow: hidden;
}

.timeline-visible {
  opacity: 1;
  visibility: visible;
  height: auto;
  pointer-events: auto;
}
</style>
