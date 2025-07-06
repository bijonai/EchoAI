// https://nuxt.com/docs/api/configuration/nuxt-config
import { UserScope } from '@logto/nuxt'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss()
    ],
    build: {
      target: 'esnext',
      rollupOptions: {
        external: ['@valibot/to-json-schema'],
      }
    },
  },
  
  // alias: {
  //   '@valibot/to-json-schema': './index-CISmcbXk.js',
  //   'sury': './index-CISmcbXk.js',
  //   'effect': './index-CISmcbXk.js',
  // },
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'vercel'
  },
  // hub: {

  // },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@logto/nuxt',
    // '@nuxthub/core'
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
    },
    public: {
      boardDebug: process.env.BOARD_DEBUG,
    }
  },
  fonts: {
    defaults: {
      weights: [400, 700],
      fallbacks: {
        monospace: ['Inconsolata'],
        serif: ['Noto Serif SC', 'Noto Serif TC']
      }
    },
    families: [
      {
        name: 'Inconsolata',
        provider: 'google'
      },
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