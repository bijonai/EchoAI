export function latest<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

export function getUserId(event: any) {
  return event['userId'] as string
}
