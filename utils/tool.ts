export function latest<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}