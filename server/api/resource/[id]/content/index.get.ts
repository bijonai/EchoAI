import { and, eq } from "drizzle-orm"
import db, { resource } from "~/db"
import { withAuth } from "~/types/auth"
import { PrivateResource } from "~/types/resource"
import { getUserId } from "~/utils/tool"

export const config = {
  runtime: 'edge'
}

export default defineEventHandler(async (event) => {
  const id = <string>getRouterParam(event, 'id')
  const userId = getUserId(event)

  const [result] = await db.select()
    .from(resource)
    .where(and(eq(resource.id, id), eq(resource.author_id, userId)))
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Resource not found',
    })
  }
  return result as PrivateResource satisfies PrivateResource
})  