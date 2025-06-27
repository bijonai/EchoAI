<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'

const containerRef = ref<HTMLElement | null>(null)
const viewBoxRef = ref<HTMLElement | null>(null)
const transform = ref(d3.zoomIdentity)

const initD3 = () => {
  if (!containerRef.value || !viewBoxRef.value) return

  const container = d3.select(containerRef.value)
  const viewBox = d3.select(viewBoxRef.value)

  // 创建缩放行为
  const zoom = d3.zoom()
    .scaleExtent([0.5, 2.5]) // 设置缩放范围
    .on('zoom', (event) => {
      transform.value = event.transform
      viewBox.style('transform', `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`)
    })

  // 应用缩放行为到容器
  container.call(zoom as any)
}

// 初始化D3
onMounted(() => {
  initD3()
})

// 清理
onBeforeUnmount(() => {
  if (containerRef.value) {
    d3.select(containerRef.value).on('.zoom', null)
  }
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full overflow-hidden relative rounded-md">
    <div class="w-full h-full absolute top-0 left-0 rounded-md">
      <div ref="viewBoxRef"
        class="w-full h-full absolute top-0 left-0 origin-top-left pointer-events-auto flex gap-2 p-2 items-center justify-center overflow-hidden">
        <TimelineSlot :is-outer="true" :timeline="{
          conetext: '',
          children: [
            {
              conetext: '标题测试标题测试标题测试标题测试',
              children: []
            },
            {
              conetext: '标题测试标题测试标题测试标题测试',
              children: [
                {
                  conetext: '标题测试标题测试标题测试标题测试',
                  children: [
                    {
                      conetext: '标题测试标题测试标题测试标题测试',
                      children: []
                    },
                    {
                      conetext: '标题测试标题测试标题测试标题测试',
                      children: []
                    }
                  ]
                },
                {
                  conetext: '标题测试标题测试标题测试标题测试',
                  children: []
                }
              ]
            },
            {
              conetext: '标题测试标题测试标题测试标题测试',
              children: []
            },
            {
              conetext: '标题测试标题测试标题测试标题测试',
              children: [
                {
                  conetext: '标题测试标题测试标题测试标题测试',
                  children: []
                },
                {
                  conetext: '标题测试标题测试标题测试标题测试',
                  children: []
                }
              ]
            },

          ]
        }
          " />
      </div>
    </div>
  </div>
</template>

