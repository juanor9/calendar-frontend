// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig }       from 'vite'
import vue                    from '@vitejs/plugin-vue'
import vueDevTools            from 'vite-plugin-vue-devtools'
import VueInspector           from 'vite-plugin-vue-inspector'

const isStorybook = !!process.env.STORYBOOK
const isVitest    = !!process.env.VITEST

export default defineConfig({
  plugins: [
    vue(),
    !isStorybook && !isVitest && vueDevTools(),
    !isStorybook && !isVitest && VueInspector()
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs','.ts', '.js', '.jsx', '.tsx', '.json', '.vue']
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/global.scss" as *;\n`
      }
    }
  }

  // ← Aquí NO va ningún `test: { … }`
})
