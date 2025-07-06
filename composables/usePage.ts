import { inject } from "vue"
import { PAGE, PAGES, TOTAL, VIEWING, ACTIVE_TARGET } from "./useBoard"
import type { BaseNode } from "sciux"

export function usePage() {
  const pageId = inject<Ref<number | null>>(PAGE)!
  const viewingId = inject<Ref<number | null>>(VIEWING)!
  const total = inject<Ref<number>>(TOTAL)!
  const pages = inject<Map<number, Page>>(PAGES)!
  const activeTarget = inject<Ref<BaseNode>>(ACTIVE_TARGET)!
  return {
    pageId,
    viewingId,  
    total,
    pages,
    activeTarget,
  }
}