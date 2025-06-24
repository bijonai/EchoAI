import { inject } from "vue"
import { DOCUMENT, PAGE, TOTAL, VIEWING } from "./useBoard"
import type { DocumentNode } from "sciux"

export function usePage() {
  const pageId = inject<Ref<number | null>>(PAGE)!
  const viewingId = inject<Ref<number | null>>(VIEWING)!
  const document = inject<ComputedRef<DocumentNode>>(DOCUMENT)!
  const total = inject<Ref<number>>(TOTAL)!
  return {
    pageId,
    viewingId,  
    document,
    total,
  }
}