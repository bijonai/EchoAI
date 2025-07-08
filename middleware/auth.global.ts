import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {

  const logtoClient = useLogtoClient();

  if (
    to.path.startsWith('/api') ||
    to.path.startsWith('/auth') ||
    to.path === '/'
  ) {
    return
  }

  if (!logtoClient.isAuthenticated()) {
    return navigateTo('/auth/signin', { external: true })
  }
}) 