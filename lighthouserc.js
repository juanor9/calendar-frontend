/**
 * Configuración de Lighthouse CI para Vana
 * Validación automática de Core Web Vitals y métricas de performance
 */

module.exports = {
  ci: {
    // Configuración de build
    collect: {
      // URL base para testing
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/calendar',
        'http://localhost:5173/tasks',
        'http://localhost:5173/settings'
      ],
      
      // Configuración de servidor local
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:.*http://localhost:5173',
      
      // Configuración de colección
      numberOfRuns: process.env.CI ? 3 : 1, // 3 runs en CI, 1 local
      
      // Chrome flags para testing
      chromeFlags: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--no-first-run',
        '--disable-default-apps',
      ],
      
      // Configuraciones específicas de device
      settings: {
        preset: 'desktop',
        // También podemos usar 'mobile' para testing mobile
        chromeFlags: '--disable-storage-reset',
        // Configuración de red para simular condiciones reales
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Configuración de viewport
        screenEmulation: {
          mobile: false,
          width: 1280,
          height: 720,
          deviceScaleFactor: 1,
          disabled: false,
        }
      }
    },

    // Configuración de assertions (umbrales de performance)
    assert: {
      assertions: {
        // 🚀 Core Web Vitals - Objetivos agresivos para Vana
        'largest-contentful-paint': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { minScore: 0.9 }],
        'cumulative-layout-shift': ['error', { minScore: 0.95 }],
        'total-blocking-time': ['error', { minScore: 0.85 }],
        
        // 📊 Métricas de Lighthouse
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // 🔧 Métricas específicas de red
        'server-response-time': ['warn', { maxNumericValue: 600 }],
        'interactive': ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        
        // 📱 Métricas de recursos
        'total-byte-weight': ['warn', { maxNumericValue: 1600000 }], // 1.6MB
        'unused-css-rules': ['warn', { minScore: 0.8 }],
        'unused-javascript': ['warn', { minScore: 0.8 }],
        'modern-image-formats': ['error', { minScore: 0.9 }],
        
        // ♿ Accesibilidad crítica
        'color-contrast': ['error', { minScore: 1 }],
        'aria-allowed-attr': ['error', { minScore: 1 }],
        'aria-required-attr': ['error', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        'form-field-multiple-labels': ['error', { minScore: 1 }],
        'heading-order': ['error', { minScore: 1 }],
        'label': ['error', { minScore: 1 }],
        
        // 🛡️ Seguridad y buenas prácticas
        'uses-https': ['error', { minScore: 1 }],
        'no-vulnerable-libraries': ['error', { minScore: 1 }],
        'csp-xss': ['warn', { minScore: 0.8 }],
      },
      
      // Configuración de matriz para diferentes páginas
      matrix: [
        {
          url: 'http://localhost:5173/',
          assertions: {
            'largest-contentful-paint': ['error', { maxNumericValue: 2000 }], // Homepage más estricta
            'categories:performance': ['error', { minScore: 0.9 }]
          }
        },
        {
          url: 'http://localhost:5173/calendar',
          assertions: {
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // Calendar view
            'total-blocking-time': ['error', { maxNumericValue: 200 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
          }
        }
      ]
    },

    // Configuración de upload (para CI)
    upload: {
      target: 'temporary-public-storage',
      
      // Configuración de GitHub Actions (si disponible)
      ...(process.env.GITHUB_TOKEN && {
        target: 'lhci',
        token: process.env.LHCI_GITHUB_APP_TOKEN,
        githubToken: process.env.GITHUB_TOKEN,
        githubApiHost: process.env.GITHUB_API_HOST,
      }),
      
      // Configuración para reportes locales
      ...(process.env.CI ? {} : {
        target: 'filesystem',
        outputDir: './lhci_reports',
      })
    },

    // Configuración del servidor LHCI (opcional)
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db',
      },
    }
  },

  // Configuraciones específicas para diferentes entornos
  ...(process.env.NODE_ENV === 'production' && {
    ci: {
      collect: {
        // En producción, usar URLs reales
        url: [
          'https://vana.app/',
          'https://vana.app/calendar',
          'https://vana.app/tasks'
        ],
        // No iniciar servidor local en producción
        startServerCommand: undefined,
      }
    }
  }),

  // Configuración para testing mobile
  ...(process.env.LIGHTHOUSE_DEVICE === 'mobile' && {
    ci: {
      collect: {
        settings: {
          preset: 'mobile',
          screenEmulation: {
            mobile: true,
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            disabled: false,
          },
          // Red móvil simulada
          throttling: {
            rttMs: 150,
            throughputKbps: 1600,
            cpuSlowdownMultiplier: 4,
          }
        }
      },
      assert: {
        assertions: {
          // Umbrales más relajados para mobile
          'largest-contentful-paint': ['error', { minScore: 0.8 }],
          'categories:performance': ['error', { minScore: 0.75 }],
          'total-blocking-time': ['error', { maxNumericValue: 300 }]
        }
      }
    }
  })
}

// Configuraciones adicionales por comando
if (process.argv.includes('--config=budget')) {
  // Configuración para performance budgets estrictos
  module.exports.ci.assert.assertions = {
    ...module.exports.ci.assert.assertions,
    'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
    'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
    'total-blocking-time': ['error', { maxNumericValue: 150 }],
    'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
    'total-byte-weight': ['error', { maxNumericValue: 1000000 }], // 1MB estricto
  }
}

if (process.argv.includes('--config=accessibility')) {
  // Configuración enfocada en accesibilidad
  module.exports.ci.assert.assertions = {
    'categories:accessibility': ['error', { minScore: 0.98 }],
    'color-contrast': ['error', { minScore: 1 }],
    'aria-allowed-attr': ['error', { minScore: 1 }],
    'aria-required-attr': ['error', { minScore: 1 }],
    'button-name': ['error', { minScore: 1 }],
    'form-field-multiple-labels': ['error', { minScore: 1 }],
    'heading-order': ['error', { minScore: 1 }],
    'label': ['error', { minScore: 1 }],
    'link-name': ['error', { minScore: 1 }],
    'list': ['error', { minScore: 1 }],
    'listitem': ['error', { minScore: 1 }],
  }
}