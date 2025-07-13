type StreamEntry<K extends PropertyKey, T> = { source: K; value: T };

export function mergeReadableStreams<
  T extends Readonly<Record<string | number | symbol, ReadableStream<any>>>
>(
  sources: T
): ReadableStream<
  {
    [K in keyof T]: T[K] extends ReadableStream<infer U> ? StreamEntry<K, U> : never
  }[keyof T]
> {
  const entries = Object.entries(sources) as [keyof T, ReadableStream<any>][];
  const readers = entries.map(([, stream]) => stream.getReader());

  return new ReadableStream({
    async start(controller) {
      const activeReaders = new Set(readers);

      entries.forEach(([key], i) => {
        const reader = readers[i];
        const pump = async () => {
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                activeReaders.delete(reader);
                if (activeReaders.size === 0) controller.close();
                break;
              }
              controller.enqueue({ source: key, value } as any); // 👈 断言绕过 TS 推导
            }
          } catch (err) {
            controller.error(err);
          }
        };
        pump();
      });
    },
    cancel(reason) {
      readers.forEach(reader => reader.cancel(reason).catch(() => { }));
    }
  });
}
