export type withAuth<T = {}> = T & {
  userId: string
}
