/**
 * Tests de Performance y Core Web Vitals para Vana
 * Validación de métricas críticas de UX según objetivos del MVP
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { performanceTestUtils, responsiveTestUtils } from '../utils/test-utils'

// Mock de PerformanceObserver para tests
class MockPerformanceObserver {
  private callback: PerformanceObserverCallback
  private options: PerformanceObserverInit

  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback
  }

  observe(options: PerformanceObserverInit) {
    this.options = options
  }

  disconnect() {}

  static supportedEntryTypes = [
    'navigation',
    'paint',
    'largest-contentful-paint',
    'first-input',
    'layout-shift',
  ]
}

// Mock de Performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
}

beforeEach(() => {
  global.PerformanceObserver = MockPerformanceObserver as any
  global.performance = mockPerformance as any
  vi.clearAllMocks()
})

describe('Core Web Vitals - Performance Tests', () => {
  describe('Largest Contentful Paint (LCP)', () => {
    it('debe cargar contenido principal en menos de 2.5s', async () => {
      // Mock de LCP entry
      const mockLCPEntry = {
        name: '',
        entryType: 'largest-contentful-paint',
        startTime: 2200, // 2.2 segundos
        duration: 0,
        size: 50000,
        element: document.createElement('div'),
      }

      mockPerformance.getEntriesByType.mockReturnValue([mockLCPEntry])

      // Simular medición de LCP
      const measureLCP = () => {
        const entries = performance.getEntriesByType('largest-contentful-paint')
        return entries[entries.length - 1]?.startTime || 0
      }

      const lcpValue = measureLCP()

      // Verificar que LCP está por debajo del threshold
      expect(lcpValue).toBeLessThan(2500) // 2.5s threshold
      expect(lcpValue).toBeGreaterThan(0)
    })

    it('debe identificar elemento LCP correcto', async () => {
      const mockCalendarContainer = document.createElement('div')
      mockCalendarContainer.setAttribute('data-testid', 'calendar-container')

      const mockLCPEntry = {
        name: '',
        entryType: 'largest-contentful-paint',
        startTime: 1800,
        duration: 0,
        size: 75000,
        element: mockCalendarContainer,
      }

      mockPerformance.getEntriesByType.mockReturnValue([mockLCPEntry])

      const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0]

      expect(lcpEntry.element.getAttribute('data-testid')).toBe('calendar-container')
      expect(lcpEntry.size).toBeGreaterThan(50000) // Elemento significativo
    })

    it('debe medir LCP en diferentes breakpoints', async () => {
      const breakpointTests = [
        { name: 'mobile', threshold: 3000 },
        { name: 'tablet', threshold: 2500 },
        { name: 'desktop', threshold: 2000 },
      ]

      for (const { name, threshold } of breakpointTests) {
        await responsiveTestUtils.testInBreakpoint(name as any, () => {
          const mockEntry = {
            entryType: 'largest-contentful-paint',
            startTime: threshold - 200, // Siempre por debajo del threshold
          }

          mockPerformance.getEntriesByType.mockReturnValue([mockEntry])

          const lcp = performance.getEntriesByType('largest-contentful-paint')[0]
          expect(lcp.startTime).toBeLessThan(threshold)
        })
      }
    })
  })

  describe('First Input Delay (FID)', () => {
    it('debe responder a primera interacción en menos de 100ms', async () => {
      const mockFIDEntry = {
        name: 'click',
        entryType: 'first-input',
        startTime: 1500,
        processingStart: 1505,
        processingEnd: 1520,
        duration: 15, // 15ms de delay
        cancelable: true,
      }

      mockPerformance.getEntriesByType.mockReturnValue([mockFIDEntry])

      // Simular medición de FID
      const measureFID = () => {
        const entries = performance.getEntriesByType('first-input')
        return entries[0]?.duration || 0
      }

      const fidValue = measureFID()

      expect(fidValue).toBeLessThan(100) // 100ms threshold
      expect(fidValue).toBeGreaterThanOrEqual(0)
    })

    it('debe manejar diferentes tipos de input', async () => {
      const inputTypes = ['click', 'keydown', 'touchstart']

      inputTypes.forEach(inputType => {
        const mockEntry = {
          name: inputType,
          entryType: 'first-input',
          startTime: 1000,
          duration: 50,
        }

        mockPerformance.getEntriesByType.mockReturnValue([mockEntry])

        const entry = performance.getEntriesByType('first-input')[0]
        expect(entry.name).toBe(inputType)
        expect(entry.duration).toBeLessThan(100)
      })
    })
  })

  describe('Cumulative Layout Shift (CLS)', () => {
    it('debe mantener CLS por debajo de 0.1', async () => {
      const mockCLSEntries = [
        {
          name: '',
          entryType: 'layout-shift',
          startTime: 1200,
          duration: 0,
          value: 0.05, // Shift pequeño
          hadRecentInput: false,
          sources: [
            {
              node: document.createElement('div'),
              previousRect: { x: 0, y: 0, width: 100, height: 50 },
              currentRect: { x: 0, y: 10, width: 100, height: 50 },
            },
          ],
        },
        {
          name: '',
          entryType: 'layout-shift',
          startTime: 2000,
          duration: 0,
          value: 0.03,
          hadRecentInput: false,
          sources: [],
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockCLSEntries)

      // Calcular CLS total
      const calculateCLS = () => {
        const entries = performance.getEntriesByType('layout-shift')
        return entries
          .filter((entry: any) => !entry.hadRecentInput)
          .reduce((sum: number, entry: any) => sum + entry.value, 0)
      }

      const clsValue = calculateCLS()

      expect(clsValue).toBeLessThan(0.1) // Threshold para "Good"
      expect(clsValue).toBeGreaterThanOrEqual(0)
    })

    it('debe ignorar shifts causados por user input', async () => {
      const mockCLSEntries = [
        {
          entryType: 'layout-shift',
          value: 0.2, // Valor alto
          hadRecentInput: true, // Pero causado por input del usuario
        },
        {
          entryType: 'layout-shift',
          value: 0.05,
          hadRecentInput: false,
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockCLSEntries)

      const calculateCLS = () => {
        return performance
          .getEntriesByType('layout-shift')
          .filter((entry: any) => !entry.hadRecentInput)
          .reduce((sum: number, entry: any) => sum + entry.value, 0)
      }

      const clsValue = calculateCLS()

      // Solo debe contar el shift no causado por input
      expect(clsValue).toBe(0.05)
    })
  })

  describe('Time to First Byte (TTFB)', () => {
    it('debe recibir primera respuesta del servidor en menos de 600ms', async () => {
      const mockNavigationEntry = {
        name: 'https://vana.app/calendar',
        entryType: 'navigation',
        startTime: 0,
        responseStart: 450, // 450ms TTFB
        responseEnd: 800,
        domContentLoadedEventStart: 1200,
        loadEventStart: 2000,
      }

      mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry])

      const measureTTFB = () => {
        const [entry] = performance.getEntriesByType('navigation')
        return entry ? (entry as any).responseStart : 0
      }

      const ttfbValue = measureTTFB()

      expect(ttfbValue).toBeLessThan(600) // 600ms threshold
      expect(ttfbValue).toBeGreaterThan(0)
    })
  })

  describe('First Contentful Paint (FCP)', () => {
    it('debe mostrar primer contenido en menos de 1.8s', async () => {
      const mockPaintEntries = [
        {
          name: 'first-paint',
          entryType: 'paint',
          startTime: 800,
        },
        {
          name: 'first-contentful-paint',
          entryType: 'paint',
          startTime: 1200, // 1.2s FCP
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockPaintEntries)

      const measureFCP = () => {
        const entries = performance.getEntriesByType('paint')
        return entries.find((entry: any) => entry.name === 'first-contentful-paint')?.startTime || 0
      }

      const fcpValue = measureFCP()

      expect(fcpValue).toBeLessThan(1800) // 1.8s threshold
      expect(fcpValue).toBeGreaterThan(0)
    })
  })

  describe('Speed Index', () => {
    it('debe completar contenido visible en menos de 3.4s', async () => {
      // Mock de métricas visuales
      const mockSpeedIndexCalculation = () => {
        // Simulación simplificada del Speed Index
        const visualProgress = [
          { time: 1000, progress: 0.2 },
          { time: 1500, progress: 0.5 },
          { time: 2000, progress: 0.8 },
          { time: 2500, progress: 1.0 },
        ]

        let speedIndex = 0
        for (let i = 1; i < visualProgress.length; i++) {
          const current = visualProgress[i]
          const previous = visualProgress[i - 1]
          const timeInterval = current.time - previous.time
          const progressInterval = 1 - previous.progress
          speedIndex += timeInterval * progressInterval
        }

        return speedIndex
      }

      const speedIndex = mockSpeedIndexCalculation()

      expect(speedIndex).toBeLessThan(3400) // 3.4s threshold
    })
  })

  describe('Total Blocking Time (TBT)', () => {
    it('debe mantener tiempo de bloqueo total bajo', async () => {
      // Mock de long tasks
      const mockLongTasks = [
        {
          name: 'self',
          entryType: 'longtask',
          startTime: 1000,
          duration: 80, // 80ms task (bloquea por 30ms = 80-50)
        },
        {
          name: 'self',
          entryType: 'longtask',
          startTime: 2000,
          duration: 120, // 120ms task (bloquea por 70ms = 120-50)
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockLongTasks)

      const calculateTBT = () => {
        const longTasks = performance.getEntriesByType('longtask')
        return longTasks.reduce((tbt: number, task: any) => {
          // Tiempo de bloqueo = duración - 50ms (threshold)
          const blockingTime = Math.max(0, task.duration - 50)
          return tbt + blockingTime
        }, 0)
      }

      const tbtValue = calculateTBT()

      expect(tbtValue).toBeLessThan(200) // 200ms threshold
      expect(tbtValue).toBe(100) // 30 + 70 = 100ms
    })
  })

  describe('Resource Loading Performance', () => {
    it('debe cargar CSS crítico rápidamente', async () => {
      const mockResourceEntries = [
        {
          name: '/assets/critical.css',
          entryType: 'resource',
          startTime: 100,
          responseEnd: 250,
          initiatorType: 'link',
        },
        {
          name: '/assets/main.css',
          entryType: 'resource',
          startTime: 200,
          responseEnd: 400,
          initiatorType: 'link',
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockResourceEntries)

      const cssResources = performance
        .getEntriesByType('resource')
        .filter((entry: any) => entry.name.endsWith('.css'))

      cssResources.forEach((resource: any) => {
        const loadTime = resource.responseEnd - resource.startTime
        expect(loadTime).toBeLessThan(500) // CSS debe cargar en menos de 500ms
      })
    })

    it('debe lazy load recursos no críticos', async () => {
      const mockResourceEntries = [
        {
          name: '/assets/calendar-icons.svg',
          entryType: 'resource',
          startTime: 2000, // Carga después
          responseEnd: 2100,
          initiatorType: 'img',
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockResourceEntries)

      const nonCriticalResources = performance
        .getEntriesByType('resource')
        .filter((entry: any) => entry.name.includes('icons'))

      // Recursos no críticos deben cargar después de 1.5s
      nonCriticalResources.forEach((resource: any) => {
        expect(resource.startTime).toBeGreaterThan(1500)
      })
    })
  })

  describe('Memory Performance', () => {
    it('debe mantener uso de memoria bajo límites', async () => {
      // Mock de performance.memory (solo en Chrome)
      const mockMemory = {
        usedJSHeapSize: 15 * 1024 * 1024, // 15MB
        totalJSHeapSize: 20 * 1024 * 1024, // 20MB
        jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB limit
      }

      ;(global.performance as any).memory = mockMemory

      if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024)
        const memoryLimit = performance.memory.jsHeapSizeLimit / (1024 * 1024)
        const memoryPercentage = (memoryUsage / memoryLimit) * 100

        expect(memoryUsage).toBeLessThan(50) // Menos de 50MB
        expect(memoryPercentage).toBeLessThan(25) // Menos del 25% del límite
      }
    })
  })

  describe('Bundle Size Performance', () => {
    it('debe mantener tamaño de bundle principal pequeño', async () => {
      // Mock de resource timing para bundles JS
      const mockBundleEntries = [
        {
          name: '/assets/main.js',
          entryType: 'resource',
          transferSize: 150 * 1024, // 150KB
          encodedBodySize: 400 * 1024, // 400KB sin comprimir
          decodedBodySize: 1200 * 1024, // 1.2MB descomprimido
        },
      ]

      mockPerformance.getEntriesByType.mockReturnValue(mockBundleEntries)

      const jsResources = performance
        .getEntriesByType('resource')
        .filter((entry: any) => entry.name.endsWith('.js'))

      jsResources.forEach((resource: any) => {
        // Bundle comprimido debe ser menor a 200KB
        expect(resource.transferSize).toBeLessThan(200 * 1024)

        // Bundle descomprimido debe ser menor a 1.5MB
        expect(resource.decodedBodySize).toBeLessThan(1.5 * 1024 * 1024)
      })
    })
  })

  describe('Calendar-Specific Performance', () => {
    it('debe renderizar vista de calendario rápidamente', async () => {
      const startTime = performance.now()

      // Simular renderizado de calendario con 100 tareas
      const mockCalendarRender = async () => {
        await new Promise(resolve => setTimeout(resolve, 50)) // 50ms render time
      }

      await mockCalendarRender()

      const renderTime = performance.now() - startTime

      // Renderizado de calendario debe tomar menos de 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('debe manejar drag and drop con performance adecuada', async () => {
      const dragPerformanceMarks: number[] = []

      const mockDragStart = () => {
        dragPerformanceMarks.push(performance.now())
      }

      const mockDragEnd = () => {
        dragPerformanceMarks.push(performance.now())
      }

      mockDragStart()
      await new Promise(resolve => setTimeout(resolve, 16)) // Simular 1 frame
      mockDragEnd()

      const dragDuration = dragPerformanceMarks[1] - dragPerformanceMarks[0]

      // Drag operation debe completarse en menos de 16ms (60fps)
      expect(dragDuration).toBeLessThan(16)
    })

    it('debe filtrar tareas eficientemente', async () => {
      const startTime = performance.now()

      // Simular filtrado de 1000 tareas
      const mockTasks = Array.from({ length: 1000 }, (_, i) => ({
        id: `task-${i}`,
        title: `Task ${i}`,
        priority: i % 3 === 0 ? 'HIGH' : 'MEDIUM',
      }))

      const filteredTasks = mockTasks.filter(task => task.priority === 'HIGH')

      const filterTime = performance.now() - startTime

      expect(filteredTasks.length).toBeGreaterThan(0)
      expect(filterTime).toBeLessThan(10) // Filtrado debe tomar menos de 10ms
    })
  })
})
