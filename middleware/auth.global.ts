import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  if (
    to.path.startsWith('/api') ||
    to.path.startsWith('/auth') ||
    to.path === '/'
  ) {
    return
  }

  const isAuthenticated = useState<boolean | undefined>('is-authenticated')

  if (!isAuthenticated.value) {
    return navigateTo('/auth/signin', { external: true })
  }
}) 