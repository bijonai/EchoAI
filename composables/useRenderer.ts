import { NodeType, parse, renderRoots } from "sciux";
import initialize from 'sciux'
import { createUpdater} from 'sciux'
import { usePage } from "./usePage";
import patch from 'morphdom'


export default function useRenderer() {
  const { total, pages: pageBucket, pageId, activeTarget } = usePage()
  const pages: Ref<HTMLElement | null>[] = []
  const updater = createUpdater()

  onMounted(() => {
    initialize()
  })

  watch(total, (v) => {
    if (v > pages.length) {
      for (let i = pages.length; i < v; i++) {
        const page = ref<HTMLElement | null>(null)
        pages.push(page)
        nextTick(() => {
          const { document: doc } = pageBucket.get(i + 1)!
          const roots = renderRoots(doc.children)
          const container = document.createElement('div')
          container.style.width = '100%'
          container.style.height = '100%'
          container.append(...roots)
          console.log(i + 1, doc, pageBucket)
          patch((<any>page.value)[0], container)
        })
      }
    }
  }, { immediate: true })

  watch(activeTarget, (v) => {
    if (v) {
      console.log(v)
      if (v.type === NodeType.DOCUMENT) {
        const { document: doc } = pageBucket.get(pageId.value!)!
        const roots = renderRoots(doc.children)
        const container = document.createElement('div')
        container.style.width = '100%'
        container.style.height = '100%'
        container.append(...roots)
        nextTick(() => {
          const page = <any>pages[pageId.value! - 1].value!
          console.log(page)
          patch(page[0], container)
        })
        return
      }
      updater(v)
    }
  })

  return {
    pages,
  }
}