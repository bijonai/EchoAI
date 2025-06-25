export function initialize<T extends Record<string, unknown>>(context: Record<keyof T, unknown>) {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      value ? value : []
    ])
  ) as {
    [K in keyof T]: T[K] extends unknown[] ? T[K][] : T[K][]
  }
}