<template>
  <div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-if="pointShape === 'row'">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="z-50 point-shape">
        <rect x="1" y="1" width="18" height="10" rx="5" :stroke="color" stroke-width="2" :fill="currentFill" />
      </svg>
    </div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-else-if="pointShape === 'col'">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="z-50 point-shape">
        <rect x="1" y="1" width="10" height="18" rx="5" :stroke="color" stroke-width="2" :fill="currentFill" />
      </svg>
    </div>
    <div class="w-5 h-5 mx-auto flex items-center justify-center" v-else-if="pointShape === 'circle'">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="z-50 point-shape">
        <rect x="1" y="1" width="10" height="10" rx="5" :stroke="color" stroke-width="2" :fill="currentFill" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps<{
  pointShape: 'row' | 'col' | 'circle',
  color: string,
  fill?: string,
  blink?: boolean,
  blinkColor?: string
}>()

const defaultFill = '#FEFFE4'

const blinkValue = ref(0)
let blinkTimer: ReturnType<typeof setInterval> | null = null
const blinkIncrement = 0.05
const blinkInterval = 50

const currentFill = computed(() => {
  if (!props.blink) return props.fill ?? defaultFill

  const baseColor = props.fill ?? defaultFill
  const targetColor = props.blinkColor ?? baseColor

  return interpolateColor(baseColor, targetColor, blinkValue.value)
})

function interpolateColor(color1: string, color2: string, factor: number) {
  if (factor <= 0) return color1
  if (factor >= 1) return color2

  // 解析颜色
  const parseColor = (color: string) => {
    const hex = color.substring(1)
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    }
  }

  const c1 = parseColor(color1)
  const c2 = parseColor(color2)

  const r = Math.round(c1.r + factor * (c2.r - c1.r))
  const g = Math.round(c1.g + factor * (c2.g - c1.g))
  const b = Math.round(c1.b + factor * (c2.b - c1.b))

  return `#${(r < 16 ? '0' : '') + r.toString(16)}${(g < 16 ? '0' : '') + g.toString(16)}${(b < 16 ? '0' : '') + b.toString(16)}`
}

const startBlinking = () => {
  if (blinkTimer) return

  let increasing = true
  blinkTimer = setInterval(() => {
    if (increasing) {
      blinkValue.value += blinkIncrement
      if (blinkValue.value >= 1) {
        blinkValue.value = 1
        increasing = false
      }
    } else {
      blinkValue.value -= blinkIncrement
      if (blinkValue.value <= 0) {
        blinkValue.value = 0
        increasing = true
      }
    }
  }, blinkInterval)
}

const stopBlinking = () => {
  if (blinkTimer) {
    clearInterval(blinkTimer)
    blinkTimer = null
  }
  blinkValue.value = 0
}

watch(() => props.blink, (newVal) => {
  if (newVal) {
    startBlinking()
  } else {
    stopBlinking()
  }
}, { immediate: true })

onUnmounted(() => {
  stopBlinking()
})
</script>
<style scoped>
.point-shape rect {
  transition: fill 0.3s ease;
}
</style>