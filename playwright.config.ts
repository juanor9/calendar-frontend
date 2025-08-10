/**
 * Configuración de Playwright para Vana E2E Testing
 * Tests end-to-end críticos para funcionalidades del calendario inteligente
 */

import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Configuración de archivos de test */
  testMatch: /.*\.e2e\.spec\.ts$/,

  /* Ejecutar tests en paralelo */
  fullyParallel: true,

  /* Fallar el build si tests fueron left-over */
  forbidOnly: !!process.env.CI,

  /* Retry en CI solamente */
  retries: process.env.CI ? 2 : 0,

  /* Configurar workers para CI y desarrollo */
  workers: process.env.CI ? 1 : '50%',

  /* Reporter para CI y desarrollo */
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [['html'], ['list']],

  /* Configuración global para todos los tests */
  use: {
    /* URL base de la aplicación */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    /* Trace solo en CI o cuando falla */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

    /* Screenshots en fallos */
    screenshot: 'only-on-failure',

    /* Videos en fallos */
    video: 'retain-on-failure',

    /* Configuraciones de navegador */
    acceptDownloads: true,
    ignoreHTTPSErrors: true,

    /* Configuraciones de tiempo */
    actionTimeout: 10000,
    navigationTimeout: 30000,

    /* Configuraciones de viewport por defecto */
    viewport: { width: 1280, height: 720 },

    /* Configuraciones específicas de Vana */
    contextOptions: {
      // Permisos para notificaciones y geolocalización
      permissions: ['notifications'],
      // Mock de localización (Madrid por defecto)
      geolocation: { latitude: 40.4168, longitude: -3.7038 },
      // Timezone para tests de calendario
      timezoneId: 'Europe/Madrid',
      // Configuración de localStorage para tests
      storageState: undefined, // Se configura por test según necesidad
    },
  },

  /* Configuración de proyectos para diferentes browsers */
  projects: [
    {
      name: 'setup-auth',
      testMatch: /.*\.setup\.ts$/,
      teardown: 'cleanup',
    },

    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts$/,
    },

    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        // Configuraciones específicas para Chromium
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
      dependencies: ['setup-auth'],
    },

    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup-auth'],
    },

    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup-auth'],
    },

    /* Mobile testing para responsive */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup-auth'],
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
      dependencies: ['setup-auth'],
    },

    /* Tablet testing para viewport intermedio */
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
      },
      dependencies: ['setup-auth'],
    },
  ],

  /* Configuración de servidor de desarrollo */
  webServer: {
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutos para que arranque
    env: {
      NODE_ENV: 'test',
      VITE_APP_ENV: 'testing',
    },
  },

  /* Configuración de outputs */
  outputDir: 'test-results/',

  /* Configuraciones de timeout global */
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : 30 * 60 * 1000, // 1 hora en CI, 30 min local
  timeout: 30 * 1000, // 30 segundos por test individual

  /* Expectativas por defecto */
  expect: {
    // Timeout para aserciones
    timeout: 10 * 1000,
    // Screenshots de comparación
    threshold: 0.2, // 20% de diferencia permitida
    // Animaciones
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
    },
  },

  /* Configuración de metadata para reportes */
  metadata: {
    project: 'Vana Calendar',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'test',
    ci: process.env.CI ? 'true' : 'false',
  },
})
