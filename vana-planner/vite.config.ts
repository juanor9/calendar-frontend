import { fileURLToPath, URL } from 'node:url'
import { defineConfig }       from 'vite'
import vue                    from '@vitejs/plugin-vue'
import vueDevTools            from 'vite-plugin-vue-devtools'
import VueInspector           from 'vite-plugin-vue-inspector'
import path from 'path' // <-- ¡Añade esta línea!

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
      '@': path.resolve(__dirname, 'src')
    },
    // AÑADE ESTA LÍNEA:
    // Indica a Vite qué extensiones de archivo debe intentar resolver automáticamente.
    // .ts y .vue son cruciales para tu proyecto.
    extensions: ['.mjs', '.ts', '.js', '.jsx', '.tsx', '.json', '.vue']
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_tokens.scss" as *;\n`
      }
    }
  }

  // ← Aquí NO va ningún `test: { … }`
})