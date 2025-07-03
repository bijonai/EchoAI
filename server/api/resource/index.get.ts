import db, { resource } from "~/db"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) ?? 10
  const offset = parseInt(query.offset as string) ?? 0
  const results = await db.select({
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
    .limit(limit)
    .offset(offset)
  return {
    resources: results,
  }
})