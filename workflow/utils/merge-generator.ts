export async function* mergeGenerator<T>(...generators: AsyncGenerator<T>[]): AsyncGenerator<T> {
  const iterators = generators.map(gen => gen[Symbol.asyncIterator]())
  const results = iterators.map((it, index) =>
    it.next().then(result => ({ result, index }))
  )

  while (results.length > 0) {
    const { result, index } = await Promise.race(results)
    if (result.done) {
      results.splice(index, 1)
      iterators.splice(index, 1)
      for (let i = index; i < results.length; i++) {
        results[i] = results[i].then(({ result }) => ({ result, index: i }))
      }
    } else {
      yield result.value
      results[index] = iterators[index].next().then(res => ({ result: res, index }))
    }
  }
}
