// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@logto/nuxt'
  ],
  runtimeConfig: {
    public: {
      logto: {
        endpoint: process.env.LOGTO_ENDPOINT,
        appId: process.env.LOGTO_APP_ID,
        appSecret: process.env.LOGTO_APP_SECRET,
        cookieEncryptionKey: process.env.LOGTO_COOKIE_ENCRYPTION_KEY,
        pathnames: {
          signIn: '/auth/signin',
          signOut: '/auth/signout',
          callback: '/auth/callback'
        }
      }
    }
  }
})