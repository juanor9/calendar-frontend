import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueInspector from 'vite-plugin-vue-inspector'

const isStorybook = !!process.env.STORYBOOK
const isVitest = !!process.env.VITEST

export default defineConfig({
  plugins: [
    vue(),
    !isStorybook && !isVitest && vueDevTools(),
    !isStorybook && !isVitest && VueInspector(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
    },
    // AÑADE ESTA LÍNEA:
    // Indica a Vite qué extensiones de archivo debe intentar resolver automáticamente.
    // .ts y .vue son cruciales para tu proyecto.
    extensions: ['.mjs', '.ts', '.js', '.jsx', '.tsx', '.json', '.vue'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_tokens.scss" as *;\n`,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue ecosystem
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // Auth0 and authentication
          'auth-vendor': ['@auth0/auth0-vue', '@auth0/auth0-spa-js'],

          // Apollo GraphQL
          'graphql-vendor': ['@apollo/client', '@vue/apollo-composable', 'graphql'],

          // UI libraries and utilities
          'ui-vendor': ['@heroicons/vue', '@headlessui/vue', '@vueuse/core', '@vueuse/head'],

          // Other utilities
          'utils-vendor': ['socket.io-client', 'vue-draggable-plus', 'web-vitals'],
        },
      },
    },
    chunkSizeWarningLimit: 600,

    // Optimizaciones adicionales
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Source maps solo en development
    sourcemap: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  },

  // ← Aquí NO va ningún `test: { … }`
})
