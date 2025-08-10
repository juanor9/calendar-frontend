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

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_tokens.scss" as *;`
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.spec.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      'tests/unit/**/*.spec.{ts,tsx}',
      'tests/integration/**/*.spec.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'tests/e2e/**',
      'tests/visual/**',
      'src/**/*.stories.{ts,tsx}'
    ],
    setupFiles: [
      'vitest.shims.d.ts',
      'tests/setup/vitest-setup.ts'
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'tests/**',
        '**/*.stories.{ts,tsx}',
        '**/*.config.{ts,js}',
        'src/types/**',
        'src/**/*.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Componentes UI críticos requieren mayor coverage
        'src/ui/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },
    // Configuración para browser testing
    browser: {
      enabled: false, // Habilitaremos según necesidad
      name: 'chromium',
      provider: 'playwright'
    },
    // Configuración de performance para CI
    maxWorkers: process.env.CI ? 1 : '50%',
    minWorkers: 1,
    // Timeouts para diferentes tipos de tests
    testTimeout: 10000,
    hookTimeout: 10000,
    // Configuración de reportes
    reporters: process.env.CI 
      ? ['verbose', 'junit', 'json'] 
      : ['verbose'],
    outputFile: {
      junit: './coverage/junit.xml',
      json: './coverage/results.json'
    }
  },
})
