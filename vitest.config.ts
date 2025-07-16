/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  /* 👇 añade el alias @ exactamente igual que en Vite */
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}'],
    browser: { enabled: false },
    maxWorkers: 1,
    setupFiles: ['vitest.shims.d.ts'],
    coverage: { enabled: false },
  },
})
