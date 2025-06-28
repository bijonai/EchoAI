import { parse, renderRoots } from "sciux";
import initialize from 'sciux'
import { usePage } from "./usePage";
import patch from 'morphdom'

export default function useRenderer() {
  const board = ref<HTMLElement | null>(null)
  
  onMounted(() => {
    initialize()
    const { viewingDocument } = usePage()
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    board.value?.appendChild(container)

    watch(viewingDocument, (doc) => {
      const roots = renderRoots(doc.children)
      const newContainer = document.createElement('div')
      newContainer.style.width = '100%'
      newContainer.style.height = '100%'
      newContainer.append(...roots)
      patch(container, newContainer)
    }, {
      deep: true
    })
  })

  return {
    board,
  }
}