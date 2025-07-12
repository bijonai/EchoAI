export default defineEventHandler(async (event) => {
  const stream = createEventStream(event)

  return stream
})