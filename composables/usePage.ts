import { inject } from "vue"
import { ACTIVE_DOCUMENT, PAGE, TOTAL, VIEWING, VIEWING_DOCUMENT } from "./useBoard"
import type { DocumentNode } from "sciux"

export function usePage() {
  const pageId = inject<Ref<number | null>>(PAGE)!
  const viewingId = inject<Ref<number | null>>(VIEWING)!
  const document = inject<Ref<DocumentNode>>(ACTIVE_DOCUMENT)!
  const viewingDocument = inject<Ref<DocumentNode>>(VIEWING_DOCUMENT)!
  const total = inject<Ref<number>>(TOTAL)!
  return {
    pageId,
    viewingId,  
    document,
    viewingDocument,
    total,
  }
}