import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/auth/callback') {
    return navigateTo('/')
  }
}) 