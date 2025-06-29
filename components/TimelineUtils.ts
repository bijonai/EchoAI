export const getTimelineColor = (index: number): string => {
  switch (index % 4) {
    case 0:
      return '#87CEEB'
    case 1:
      return '#FFA500'
    case 2:
      return '#E88AFF'
    case 3:
      return '#FF4B4B'
    default:
      return '#000'
  }
}

export interface Timeline {
  context: string
  children: Timeline[]
}

export type TimelinePosition = TimelinePointPosition | TimelineSlotPosition

export interface TimelinePointPosition {
  type: 'point'
  x: number
  y: number
};

export interface TimelineSlotPosition {
  type: 'slot'
  left: TimelinePointPosition
  right: TimelinePointPosition
};