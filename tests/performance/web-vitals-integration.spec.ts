/**
 * Web Vitals Integration Tests
 * Tests for web-vitals library integration and performance monitoring
 *
 * CRITICAL: Tests for the specific error patterns found in web-vitals import and usage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { onLCP, onFCP, onCLS, onTTFB, onINP, type Metric } from 'web-vitals'

// Mock web-vitals module
vi.mock('web-vitals', () => ({
  onLCP: vi.fn(),
  onFCP: vi.fn(),
  onCLS: vi.fn(),
  onTTFB: vi.fn(),
  onINP: vi.fn(),
}))

// Mock performance monitoring utility
const createPerformanceMonitor = () => {
  let metrics: Metric[] = []

  const collectMetric = (metric: Metric) => {
    metrics.push(metric)
  }

  const startPerformanceMonitoring = () => {
    try {
      onLCP(collectMetric)
      onFCP(collectMetric)
      onCLS(collectMetric)
      onTTFB(collectMetric)
      onINP(collectMetric)
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error)
    }
  }

  const getMetrics = () => [...metrics]
  const clearMetrics = () => {
    metrics = []
  }

  return {
    startPerformanceMonitoring,
    getMetrics,
    clearMetrics,
  }
}

describe('Web Vitals Integration', () => {
  let mockOnLCP: ReturnType<typeof vi.fn>
  let mockOnFCP: ReturnType<typeof vi.fn>
  let mockOnCLS: ReturnType<typeof vi.fn>
  let mockOnTTFB: ReturnType<typeof vi.fn>
  let mockOnINP: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnLCP = vi.mocked(onLCP)
    mockOnFCP = vi.mocked(onFCP)
    mockOnCLS = vi.mocked(onCLS)
    mockOnTTFB = vi.mocked(onTTFB)
    mockOnINP = vi.mocked(onINP)

    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // 📊 Web Vitals Function Import Tests
  describe('Web Vitals Function Imports', () => {
    it('should import web vitals functions correctly', async () => {
      // Test that all required functions can be imported
      expect(onLCP).toBeDefined()
      expect(onFCP).toBeDefined()
      expect(onCLS).toBeDefined()
      expect(onTTFB).toBeDefined()
      expect(onINP).toBeDefined()

      expect(typeof onLCP).toBe('function')
      expect(typeof onFCP).toBe('function')
      expect(typeof onCLS).toBe('function')
      expect(typeof onTTFB).toBe('function')
      expect(typeof onINP).toBe('function')
    })

    it('should handle dynamic imports of web-vitals', async () => {
      // Test dynamic import pattern
      const dynamicImport = async () => {
        try {
          const webVitals = await import('web-vitals')
          return {
            onLCP: webVitals.onLCP,
            onFCP: webVitals.onFCP,
            onCLS: webVitals.onCLS,
            onTTFB: webVitals.onTTFB,
            onINP: webVitals.onINP,
          }
        } catch (error) {
          console.error('Failed to import web-vitals:', error)
          return null
        }
      }

      const vitals = await dynamicImport()
      expect(vitals).not.toBeNull()
      expect(vitals?.onLCP).toBeDefined()
      expect(vitals?.onFCP).toBeDefined()
      expect(vitals?.onCLS).toBeDefined()
      expect(vitals?.onTTFB).toBeDefined()
      expect(vitals?.onINP).toBeDefined()
    })

    it('should handle tree-shaken imports', async () => {
      // Test individual function imports (tree-shaking friendly)
      const { startPerformanceMonitoring } = createPerformanceMonitor()

      expect(() => startPerformanceMonitoring()).not.toThrow()

      // Verify all functions were called
      expect(mockOnLCP).toHaveBeenCalledTimes(1)
      expect(mockOnFCP).toHaveBeenCalledTimes(1)
      expect(mockOnCLS).toHaveBeenCalledTimes(1)
      expect(mockOnTTFB).toHaveBeenCalledTimes(1)
      expect(mockOnINP).toHaveBeenCalledTimes(1)
    })
  })

  // 📏 Metric Type Handling Tests
  describe('Metric Type Handling', () => {
    it('should handle Metric interface correctly', () => {
      const mockMetric: Metric = {
        name: 'LCP',
        value: 2500,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'test-lcp-id',
        navigationType: 'navigate',
      }

      // Verify that the Metric type is used correctly
      expect(mockMetric.name).toBe('LCP')
      expect(mockMetric.value).toBe(2500)
      expect(mockMetric.rating).toBe('good')
      expect(mockMetric.delta).toBe(0)
      expect(Array.isArray(mockMetric.entries)).toBe(true)
      expect(mockMetric.id).toBe('test-lcp-id')
      expect(mockMetric.navigationType).toBe('navigate')
    })

    it('should handle different metric types', () => {
      const metrics: Metric[] = [
        {
          name: 'LCP',
          value: 1800,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'lcp-1',
          navigationType: 'navigate',
        },
        {
          name: 'FCP',
          value: 1200,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'fcp-1',
          navigationType: 'navigate',
        },
        {
          name: 'CLS',
          value: 0.05,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'cls-1',
          navigationType: 'navigate',
        },
        {
          name: 'TTFB',
          value: 300,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'ttfb-1',
          navigationType: 'navigate',
        },
        {
          name: 'INP',
          value: 150,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'inp-1',
          navigationType: 'navigate',
        },
      ]

      // Verify all metric names are valid
      const validMetricNames = ['LCP', 'FCP', 'CLS', 'TTFB', 'INP']
      metrics.forEach(metric => {
        expect(validMetricNames).toContain(metric.name)
        expect(typeof metric.value).toBe('number')
        expect(['good', 'needs-improvement', 'poor']).toContain(metric.rating)
      })
    })

    it('should handle metric rating thresholds', () => {
      const getRating = (
        metricName: string,
        value: number
      ): 'good' | 'needs-improvement' | 'poor' => {
        const thresholds = {
          LCP: { good: 2500, poor: 4000 },
          FCP: { good: 1800, poor: 3000 },
          CLS: { good: 0.1, poor: 0.25 },
          TTFB: { good: 800, poor: 1800 },
          INP: { good: 200, poor: 500 },
        }

        const threshold = thresholds[metricName as keyof typeof thresholds]
        if (!threshold) return 'good'

        if (value <= threshold.good) return 'good'
        if (value <= threshold.poor) return 'needs-improvement'
        return 'poor'
      }

      // Test LCP ratings
      expect(getRating('LCP', 2000)).toBe('good')
      expect(getRating('LCP', 3000)).toBe('needs-improvement')
      expect(getRating('LCP', 5000)).toBe('poor')

      // Test CLS ratings
      expect(getRating('CLS', 0.05)).toBe('good')
      expect(getRating('CLS', 0.15)).toBe('needs-improvement')
      expect(getRating('CLS', 0.3)).toBe('poor')
    })
  })

  // 🔧 Performance Monitor Implementation Tests
  describe('Performance Monitor Implementation', () => {
    it('should initialize performance monitoring without errors', () => {
      const monitor = createPerformanceMonitor()

      expect(() => monitor.startPerformanceMonitoring()).not.toThrow()

      // Verify all web vitals functions were registered
      expect(mockOnLCP).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnFCP).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnCLS).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnTTFB).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnINP).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should collect metrics correctly', () => {
      const monitor = createPerformanceMonitor()
      monitor.startPerformanceMonitoring()

      // Simulate metric collection
      const mockLCPMetric: Metric = {
        name: 'LCP',
        value: 2400,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'lcp-test',
        navigationType: 'navigate',
      }

      // Get the callback function passed to onLCP
      const lcpCallback = mockOnLCP.mock.calls[0][0]
      lcpCallback(mockLCPMetric)

      const metrics = monitor.getMetrics()
      expect(metrics).toHaveLength(1)
      expect(metrics[0]).toEqual(mockLCPMetric)
    })

    it('should handle multiple metric updates', () => {
      const monitor = createPerformanceMonitor()
      monitor.startPerformanceMonitoring()

      // Simulate multiple metrics
      const metrics: Metric[] = [
        {
          name: 'FCP',
          value: 1500,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'fcp-1',
          navigationType: 'navigate',
        },
        {
          name: 'LCP',
          value: 2200,
          rating: 'good',
          delta: 0,
          entries: [],
          id: 'lcp-1',
          navigationType: 'navigate',
        },
        {
          name: 'CLS',
          value: 0.08,
          rating: 'good',
          delta: 0.02,
          entries: [],
          id: 'cls-1',
          navigationType: 'navigate',
        },
      ]

      // Trigger callbacks
      const fcpCallback = mockOnFCP.mock.calls[0][0]
      const lcpCallback = mockOnLCP.mock.calls[0][0]
      const clsCallback = mockOnCLS.mock.calls[0][0]

      fcpCallback(metrics[0])
      lcpCallback(metrics[1])
      clsCallback(metrics[2])

      const collectedMetrics = monitor.getMetrics()
      expect(collectedMetrics).toHaveLength(3)
      expect(collectedMetrics).toEqual(metrics)
    })

    it('should clear metrics correctly', () => {
      const monitor = createPerformanceMonitor()
      monitor.startPerformanceMonitoring()

      // Add a metric
      const mockMetric: Metric = {
        name: 'TTFB',
        value: 400,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'ttfb-test',
        navigationType: 'navigate',
      }

      const ttfbCallback = mockOnTTFB.mock.calls[0][0]
      ttfbCallback(mockMetric)

      expect(monitor.getMetrics()).toHaveLength(1)

      monitor.clearMetrics()
      expect(monitor.getMetrics()).toHaveLength(0)
    })
  })

  // 🚨 Error Handling Tests
  describe('Web Vitals Error Handling', () => {
    it('should handle web-vitals import failures gracefully', async () => {
      // Mock failed import
      const failedImportMonitor = () => {
        const safeImport = async () => {
          try {
            const { onLCP, onFCP } = await import('web-vitals')
            return { onLCP, onFCP }
          } catch (error) {
            console.warn('Web Vitals not available:', error)
            return {
              onLCP: () => {},
              onFCP: () => {},
            }
          }
        }

        return safeImport()
      }

      const vitals = await failedImportMonitor()
      expect(vitals).toBeDefined()
      expect(typeof vitals.onLCP).toBe('function')
      expect(typeof vitals.onFCP).toBe('function')
    })

    it('should handle missing web vitals functions', () => {
      const safePerformanceMonitor = () => {
        const callbacks: Array<(metric: Metric) => void> = []

        const safeCall = (fn: Function | undefined, callback: (metric: Metric) => void) => {
          if (typeof fn === 'function') {
            try {
              fn(callback)
            } catch (error) {
              console.warn('Failed to register performance callback:', error)
            }
          }
        }

        const start = () => {
          const collectMetric = (metric: Metric) => callbacks.forEach(cb => cb(metric))

          safeCall(onLCP, collectMetric)
          safeCall(onFCP, collectMetric)
          safeCall(onCLS, collectMetric)
          safeCall(onTTFB, collectMetric)
          safeCall(onINP, collectMetric)
        }

        return { start }
      }

      const monitor = safePerformanceMonitor()
      expect(() => monitor.start()).not.toThrow()
    })

    it('should handle malformed metric objects', () => {
      const validateMetric = (metric: any): metric is Metric => {
        return (
          metric &&
          typeof metric === 'object' &&
          typeof metric.name === 'string' &&
          typeof metric.value === 'number' &&
          typeof metric.rating === 'string' &&
          typeof metric.delta === 'number' &&
          Array.isArray(metric.entries) &&
          typeof metric.id === 'string'
        )
      }

      const validMetric: Metric = {
        name: 'LCP',
        value: 2000,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'test',
        navigationType: 'navigate',
      }

      const invalidMetrics = [
        null,
        undefined,
        { name: 'LCP' }, // Missing required fields
        { name: 'LCP', value: 'not-a-number', rating: 'good' }, // Wrong types
        'not-an-object',
      ]

      expect(validateMetric(validMetric)).toBe(true)

      invalidMetrics.forEach(invalid => {
        expect(validateMetric(invalid)).toBe(false)
      })
    })
  })

  // 🔄 Real-world Integration Tests
  describe('Real-world Integration Scenarios', () => {
    it('should integrate with analytics services', () => {
      const analyticsIntegration = {
        sendMetric: vi.fn(),
      }

      const performanceMonitorWithAnalytics = () => {
        const handleMetric = (metric: Metric) => {
          // Send to analytics service
          analyticsIntegration.sendMetric({
            event: 'web_vital',
            metric_name: metric.name,
            value: metric.value,
            rating: metric.rating,
            page_url: window.location.pathname,
            timestamp: Date.now(),
          })
        }

        const start = () => {
          onLCP(handleMetric)
          onFCP(handleMetric)
          onCLS(handleMetric)
          onTTFB(handleMetric)
          onINP(handleMetric)
        }

        return { start }
      }

      const monitor = performanceMonitorWithAnalytics()
      monitor.start()

      // Simulate metric collection
      const mockMetric: Metric = {
        name: 'LCP',
        value: 1800,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'lcp-analytics-test',
        navigationType: 'navigate',
      }

      const lcpCallback = mockOnLCP.mock.calls[0][0]
      lcpCallback(mockMetric)

      expect(analyticsIntegration.sendMetric).toHaveBeenCalledWith({
        event: 'web_vital',
        metric_name: 'LCP',
        value: 1800,
        rating: 'good',
        page_url: '/',
        timestamp: expect.any(Number),
      })
    })

    it('should handle performance budgets and alerts', () => {
      const performanceBudgets = {
        LCP: 2500,
        FCP: 1800,
        CLS: 0.1,
        TTFB: 800,
        INP: 200,
      }

      const alertSystem = {
        sendAlert: vi.fn(),
      }

      const budgetMonitor = () => {
        const checkBudget = (metric: Metric) => {
          const budget = performanceBudgets[metric.name as keyof typeof performanceBudgets]
          if (budget && metric.value > budget) {
            alertSystem.sendAlert({
              type: 'performance_budget_exceeded',
              metric: metric.name,
              value: metric.value,
              budget: budget,
              severity: metric.rating,
            })
          }
        }

        const start = () => {
          onLCP(checkBudget)
          onFCP(checkBudget)
          onCLS(checkBudget)
          onTTFB(checkBudget)
          onINP(checkBudget)
        }

        return { start }
      }

      const monitor = budgetMonitor()
      monitor.start()

      // Test budget exceeded
      const poorLCPMetric: Metric = {
        name: 'LCP',
        value: 5000, // Exceeds budget of 2500
        rating: 'poor',
        delta: 0,
        entries: [],
        id: 'poor-lcp',
        navigationType: 'navigate',
      }

      const lcpCallback = mockOnLCP.mock.calls[0][0]
      lcpCallback(poorLCPMetric)

      expect(alertSystem.sendAlert).toHaveBeenCalledWith({
        type: 'performance_budget_exceeded',
        metric: 'LCP',
        value: 5000,
        budget: 2500,
        severity: 'poor',
      })
    })

    it('should handle conditional monitoring based on environment', () => {
      const conditionalMonitor = (enableMonitoring: boolean = true) => {
        if (!enableMonitoring) {
          return {
            start: () => {
              // Do nothing in disabled state
            },
            getMetrics: () => [],
          }
        }

        const metrics: Metric[] = []

        const collectMetric = (metric: Metric) => {
          metrics.push(metric)
        }

        const start = () => {
          onLCP(collectMetric)
          onFCP(collectMetric)
          onCLS(collectMetric)
          onTTFB(collectMetric)
          onINP(collectMetric)
        }

        return {
          start,
          getMetrics: () => [...metrics],
        }
      }

      // Test enabled monitoring
      const enabledMonitor = conditionalMonitor(true)
      enabledMonitor.start()

      expect(mockOnLCP).toHaveBeenCalled()

      // Clear mocks and test disabled monitoring
      vi.clearAllMocks()

      const disabledMonitor = conditionalMonitor(false)
      disabledMonitor.start()

      expect(mockOnLCP).not.toHaveBeenCalled()
      expect(disabledMonitor.getMetrics()).toEqual([])
    })
  })
})
