<template>
  <div class="flex flex-col justify-center gap-1 size-auto" ref="cardRef" @mouseover="display = true"
    @mouseleave="display = props.fullDisplay">
    <TimelinePointShape ref="pointRef" :point-shape="props.pointShape" :color="'#000'" class="min-w-24"
      :fill="'#FEFFE4'" :blink="isActive" :blinkColor="getTimelineColor(props.colorIndex)" />
    <div class="timeline-content font-bold text-sm text-[#5C5B4F] max-w-48 break-words whitespace-pre-line text-center"
      :class="{ 'timeline-visible': display }">
      {{ props.conetext }}
    </div>
  </div>
</template>

<script setup lang="ts">
import TimelinePointShape from './TimelinePoint.vue'
import { ref, watch, onMounted, onUnmounted, reactive, computed } from 'vue'
import { getTimelineColor, type TimelinePointPosition } from './TimelineUtils'

const props = defineProps<{
  conetext: string
  fullDisplay?: boolean
  pointShape: 'row' | 'col' | 'circle'
  colorIndex: number
}>()

const display = ref<boolean>(props.fullDisplay)
const cardRef = ref<HTMLElement | null>(null)
const pointRef = ref<InstanceType<typeof TimelinePointShape> | null>(null)

const recalculateKey = useState<number>('recalculate-key')
const nowStep = useState<string | null>('now-step')
const activeCardRef = useState<HTMLElement | null>('active-card-ref')

const isActive = computed(() => nowStep.value == props.conetext.split(' ')[0])

const pointPosition = reactive<TimelinePointPosition>({
  type: 'point',
  x: 0,
  y: 0
})

const calculatePointPosition = () => {
  if (!cardRef.value || !pointRef.value?.$el) return

  const cardRect = cardRef.value.getBoundingClientRect()
  const pointRect = pointRef.value.$el.getBoundingClientRect()

  pointPosition.x = pointRect.left + pointRect.width / 2 - cardRect.left
  pointPosition.y = pointRect.top + pointRect.height / 2 - cardRect.top
}

const updateActiveCard = () => {
  if (!cardRef.value || !pointRef.value?.$el) { return }
  if (nowStep.value != props.conetext.split(' ')[0]) { return }

  activeCardRef.value = cardRef.value
}

watch([nowStep, recalculateKey], () => {
  updateActiveCard()
})

onMounted(() => {
  calculatePointPosition()
  updateActiveCard()
  window.addEventListener('resize', calculatePointPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePointPosition)
})

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
