import { eq } from "drizzle-orm"
import { PgUUID } from "drizzle-orm/pg-core"
import db, { resource } from "~/db"

export const config = {
  runtime: 'edge'
}

export default defineEventHandler(async (event) => {
  const id = <string>getRouterParam(event, 'id')
  const [result] = await db.select({
    id: resource.id,
    type: resource.type,
    name: resource.name,
    tags: resource.tags,
    author: resource.author,
    author_id: resource.author_id,
    description: resource.description,
    readme: resource.readme,
  })
    .from(resource)
    .where(eq(resource.id, id))
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Resource not found',
    })
  }
  return result
})