// https://nuxt.com/docs/api/configuration/nuxt-config
import { UserScope } from '@logto/nuxt'
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
  nitro: {
    experimental: {
      tasks: true
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@logto/nuxt'
  ],
  runtimeConfig: {
    logto: {
      endpoint: process.env.LOGTO_ENDPOINT,
      appId: process.env.LOGTO_APP_ID,
      appSecret: process.env.LOGTO_APP_SECRET,
      cookieEncryptionKey: process.env.LOGTO_COOKIE_SECRET,
      postCallbackRedirectUri: process.env.LOGTO_BASE_URL + '/auth/callback',
      resource: ["http://localhost:3000/api"],
      scopes: [UserScope.Email, "echoai_server"],
      pathnames: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        callback: '/auth/callback'
      }
    }
  },
  fonts: {
    defaults: {
      weights: [400, 700],
      fallbacks: {
        serif: ['Noto Serif SC', 'Noto Serif TC']
      }
    },
    families: [
      {
        name: 'Noto Serif SC',
        provider: 'google'
      },
      {
        name: 'Noto Serif TC',
        provider: 'google',
      }
    ]
  }
})