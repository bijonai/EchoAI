<template>
  <div class="flex flex-col items-stretch relative mx-5" ref="containerRef">
    <svg class="w-full h-full absolute top-0 left-0 pointer-events-none" ref="svgRef">
      <path v-if="pathD" :d="pathD" :stroke="getTimelineColor(colorIndex - 1)" stroke-width="2" fill="none" />
      <path v-for="(connection, index) in connections" :key="index" :d="connection"
        :stroke="getTimelineColor(colorIndex)" stroke-width="2" fill="none" />
      <path v-if="!isOuter" :d="pathArcLeft" :stroke="getTimelineColor(colorIndex)" stroke-width="2" fill="none" />
      <path v-if="!isOuter" :d="pathArcRight" :stroke="getTimelineColor(colorIndex)" stroke-width="2" fill="none" />
    </svg>

    <div v-if="!props.isOuter" class="flex justify-between items-center">
      <TimelinePoint ref="startPointRef" point-shape="row" :color="'#000'" />
      <TimelinePoint ref="endPointRef" point-shape="row" :color="'#000'" />
    </div>
    <div class="flex flex-col px-16 gap-2">
      <div v-if="!props.isOuter" class="w-full font-bold text-sm text-[#5C5B4F] text-center">
        {{ props.timeline.context }}
      </div>
      <div class="w-full flex gap-2 items-start justify-center">
        <template v-for="(child, index) in props.timeline.children" :key="index">
          <TimelineCard v-if="child.children.length === 0" :conetext="child.context" :fullDisplay="true"
            :color-index="colorIndex" pointShape="circle" ref="childrenRefs" />
          <TimelineSlot v-else :is-outer="false" :timeline="child" :color-index="colorIndex + 1" ref="childrenRefs" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Timeline, TimelineSlotPosition, TimelinePointPosition } from './TimelineUtils';
import TimelinePoint from './TimelinePoint.vue';
import TimelineCard from './TimelineCard.vue';
import TimelineSlot from './TimelineSlot.vue';
import { getTimelineColor } from './TimelineUtils';

const props = defineProps<{
  isOuter: boolean
  timeline: Timeline
  colorIndex: number
}>()

const containerRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGElement | null>(null);
const startPointRef = ref<InstanceType<typeof TimelinePoint> | null>(null);
const endPointRef = ref<InstanceType<typeof TimelinePoint> | null>(null);
const childrenRefs = ref<(InstanceType<typeof TimelineCard | typeof TimelineSlot>)[]>([]);
const pathD = ref<string>('');
const pathArcLeft = ref<string>('');
const pathArcRight = ref<string>('');
const connections = ref<string[]>([]);

const pointPositions = reactive<TimelineSlotPosition>({
  type: 'slot',
  left: { type: 'point', x: 0, y: 0 },
  right: { type: 'point', x: 0, y: 0 }
});

const calculatePointPositions = () => {
  if (!containerRef.value || !startPointRef.value?.$el || !endPointRef.value?.$el) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const startPointRect = startPointRef.value.$el.getBoundingClientRect();
  const endPointRect = endPointRef.value.$el.getBoundingClientRect();

  pointPositions.left = {
    type: 'point',
    x: startPointRect.left + startPointRect.width / 2 - containerRect.left,
    y: startPointRect.top + startPointRect.height / 2 - containerRect.top
  };

  pointPositions.right = {
    type: 'point',
    x: endPointRect.left + endPointRect.width / 2 - containerRect.left,
    y: endPointRect.top + endPointRect.height / 2 - containerRect.top
  };

  updateLRConnectionPath();
};

const updateLRConnectionPath = () => {
  const { left, right } = pointPositions;
  pathD.value = `M ${left.x} ${left.y} L ${right.x} ${right.y}`;
};

const updateChildrenConnectionPath = () => {
  if (!containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();

  connections.value = []

  for (let i = 0; i < childrenRefs.value.length - 1; i++) {
    const child = childrenRefs.value[i];
    const nextChild = childrenRefs.value[i + 1];

    const childRect = child.$el.getBoundingClientRect();
    const nextChildRect = nextChild.$el.getBoundingClientRect();

    let left: TimelinePointPosition = {
      type: 'point',
      x: childRect.left - containerRect.left,
      y: childRect.top - containerRect.top
    }

    let right: TimelinePointPosition = {
      type: 'point',
      x: nextChildRect.left - containerRect.left,
      y: nextChildRect.top - containerRect.top
    }

    if ('pointPosition' in child) {
      left.x += child.pointPosition.x;
      left.y += child.pointPosition.y;
    } else if ('pointPositions' in child) {
      left.x += child.pointPositions.right.x;
      left.y += child.pointPositions.right.y;
    }

    if ('pointPosition' in nextChild) {
      right.x += nextChild.pointPosition.x;
      right.y += nextChild.pointPosition.y;
    } else if ('pointPositions' in nextChild) {
      right.x += nextChild.pointPositions.left.x;
      right.y += nextChild.pointPositions.left.y;
    }

    connections.value.push(`M ${left.x} ${left.y} L ${right.x} ${right.y}`);
  }
}

const updateArcConnectionPath = () => {
  if (props.isOuter) return;

  if (!containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();

  const childStart = childrenRefs.value[0];
  const childEnd = childrenRefs.value[childrenRefs.value.length - 1];

  const childStartRect = childStart.$el.getBoundingClientRect();
  const childEndRect = childEnd.$el.getBoundingClientRect();

  let left: TimelinePointPosition = {
    type: 'point',
    x: childStartRect.left - containerRect.left,
    y: childStartRect.top - containerRect.top
  }

  let right: TimelinePointPosition = {
    type: 'point',
    x: childEndRect.left - containerRect.left,
    y: childEndRect.top - containerRect.top
  }

  if ('pointPosition' in childStart) {
    left.x += childStart.pointPosition.x;
    left.y += childStart.pointPosition.y;
  } else if ('pointPositions' in childStart) {
    left.x += childStart.pointPositions.left.x;
    left.y += childStart.pointPositions.left.y;
  }

  if ('pointPosition' in childEnd) {
    right.x += childEnd.pointPosition.x;
    right.y += childEnd.pointPosition.y;
  } else if ('pointPositions' in childEnd) {
    right.x += childEnd.pointPositions.right.x;
    right.y += childEnd.pointPositions.right.y;
  }

  pathArcLeft.value = `M ${pointPositions.left.x} ${pointPositions.left.y} A ${Math.abs(left.y - pointPositions.left.y)} ${Math.abs(left.y - pointPositions.left.y)} 0 0 0 ${pointPositions.left.x + Math.abs(left.y - pointPositions.left.y)} ${left.y} L ${left.x} ${left.y}`;
  pathArcRight.value = `M ${pointPositions.right.x} ${pointPositions.right.y} A ${Math.abs(right.y - pointPositions.right.y)} ${Math.abs(right.y - pointPositions.right.y)} 0 0 1 ${pointPositions.right.x - Math.abs(right.y - pointPositions.right.y)} ${right.y} L ${right.x} ${right.y}`;
}

defineExpose({
  pointPositions,
  calculatePointPositions
});

onMounted(async () => {
  calculatePointPositions();
  updateChildrenConnectionPath();
  updateArcConnectionPath();

  window.addEventListener('resize', calculatePointPositions);
  window.addEventListener('resize', updateChildrenConnectionPath);
  window.addEventListener('resize', updateArcConnectionPath);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculatePointPositions);
  window.removeEventListener('resize', updateChildrenConnectionPath);
  window.removeEventListener('resize', updateArcConnectionPath);
});
</script>