/**
 * Performance testing utilities
 * Helper functions for measuring and monitoring performance in tests
 */

export interface PerformanceMetrics {
  renderTime: number
  componentCount: number
  domNodes: number
  memoryUsage?: number
  longTasks: number[]
  webVitals: {
    LCP?: number
    FID?: number
    CLS?: number
    FCP?: number
    TTFB?: number
    INP?: number
  }
}

export interface PerformanceBudget {
  renderTime: number // Maximum render time in ms
  componentCount: number // Maximum number of components
  domNodes: number // Maximum DOM nodes
  longTaskThreshold: number // Maximum long task duration in ms
  webVitals: {
    LCP: number // Largest Contentful Paint threshold
    FID: number // First Input Delay threshold  
    CLS: number // Cumulative Layout Shift threshold
    FCP: number // First Contentful Paint threshold
    TTFB: number // Time to First Byte threshold
    INP: number // Interaction to Next Paint threshold
  }
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  renderTime: 100, // 100ms
  componentCount: 50,
  domNodes: 1000,
  longTaskThreshold: 50, // 50ms
  webVitals: {
    LCP: 2500, // 2.5s
    FID: 100, // 100ms
    CLS: 0.1, // 0.1
    FCP: 1800, // 1.8s
    TTFB: 800, // 800ms
    INP: 200 // 200ms
  }
}

/**
 * Measure performance metrics during component render
 */
export const measurePerformance = async (
  renderFn: () => Promise<any>
): Promise<PerformanceMetrics> => {
  const startTime = performance.now()
  const initialNodeCount = document.querySelectorAll('*').length
  
  // Clear existing performance entries
  performance.clearMarks()
  performance.clearMeasures()
  
  // Mark start
  performance.mark('render-start')
  
  // Execute render function
  const result = await renderFn()
  
  // Mark end
  performance.mark('render-end')
  performance.measure('render-duration', 'render-start', 'render-end')
  
  const endTime = performance.now()
  const finalNodeCount = document.querySelectorAll('*').length
  
  // Get performance measurements
  const measures = performance.getEntriesByType('measure')
  const renderMeasure = measures.find(m => m.name === 'render-duration')
  
  // Get long tasks (if available)
  const longTasks = performance.getEntriesByType('longtask')
    .map(task => task.duration)
  
  // Estimate component count (rough approximation)
  const componentCount = document.querySelectorAll('[data-v-], [class*="vue-"]').length
  
  const metrics: PerformanceMetrics = {
    renderTime: renderMeasure ? renderMeasure.duration : (endTime - startTime),
    componentCount,
    domNodes: finalNodeCount - initialNodeCount,
    longTasks,
    webVitals: {}
  }
  
  // Add memory usage if available
  if ('memory' in performance) {
    metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
  }
  
  return { ...result, metrics }
}

/**
 * Mock Web Vitals API for testing
 */
export const mockWebVitals = () => {
  const vitals = {
    LCP: 0,
    FID: 0,
    CLS: 0,
    FCP: 0,
    TTFB: 0,
    INP: 0
  }

  // Mock PerformanceObserver
  global.PerformanceObserver = class MockPerformanceObserver {
    private callback: (list: any) => void
    
    constructor(callback: (list: any) => void) {
      this.callback = callback
    }
    
    observe(options: { entryTypes: string[] }) {
      // Mock LCP
      if (options.entryTypes.includes('largest-contentful-paint')) {
        setTimeout(() => {
          vitals.LCP = 1200 + Math.random() * 800 // 1.2-2.0s
          this.callback({
            getEntries: () => [{
              name: 'largest-contentful-paint',
              startTime: vitals.LCP,
              size: 15000,
              element: document.querySelector('h1, [data-testid*="title"]')
            }]
          })
        }, 100)
      }
      
      // Mock FID
      if (options.entryTypes.includes('first-input')) {
        setTimeout(() => {
          vitals.FID = 50 + Math.random() * 50 // 50-100ms
          this.callback({
            getEntries: () => [{
              name: 'first-input',
              processingStart: 200 + vitals.FID,
              startTime: 200,
              duration: vitals.FID
            }]
          })
        }, 200)
      }
      
      // Mock CLS
      if (options.entryTypes.includes('layout-shift')) {
        setTimeout(() => {
          vitals.CLS = Math.random() * 0.05 // 0-0.05
          this.callback({
            getEntries: () => [{
              name: 'layout-shift',
              value: vitals.CLS,
              hadRecentInput: false
            }]
          })
        }, 300)
      }
      
      // Mock FCP
      if (options.entryTypes.includes('paint')) {
        setTimeout(() => {
          vitals.FCP = 800 + Math.random() * 400 // 0.8-1.2s
          this.callback({
            getEntries: () => [{
              name: 'first-contentful-paint',
              startTime: vitals.FCP
            }]
          })
        }, 150)
      }
      
      // Mock Long Tasks
      if (options.entryTypes.includes('longtask')) {
        setTimeout(() => {
          this.callback({
            getEntries: () => [{
              name: 'longtask',
              duration: 30 + Math.random() * 20, // 30-50ms
              startTime: performance.now()
            }]
          })
        }, 400)
      }
    }
    
    disconnect() {
      // Cleanup mock observer
    }
  } as any

  return vitals
}

/**
 * Assert performance metrics meet budget requirements
 */
export const assertPerformanceBudget = (
  metrics: PerformanceMetrics,
  budget: Partial<PerformanceBudget> = {}
): void => {
  const fullBudget = { ...DEFAULT_PERFORMANCE_BUDGET, ...budget }
  
  // Check render time
  if (metrics.renderTime > fullBudget.renderTime) {
    throw new Error(
      `Render time ${metrics.renderTime.toFixed(2)}ms exceeds budget of ${fullBudget.renderTime}ms`
    )
  }
  
  // Check component count
  if (metrics.componentCount > fullBudget.componentCount) {
    throw new Error(
      `Component count ${metrics.componentCount} exceeds budget of ${fullBudget.componentCount}`
    )
  }
  
  // Check DOM nodes
  if (metrics.domNodes > fullBudget.domNodes) {
    throw new Error(
      `DOM nodes ${metrics.domNodes} exceeds budget of ${fullBudget.domNodes}`
    )
  }
  
  // Check long tasks
  const longTasks = metrics.longTasks.filter(duration => duration > fullBudget.longTaskThreshold)
  if (longTasks.length > 0) {
    throw new Error(
      `Found ${longTasks.length} long tasks exceeding ${fullBudget.longTaskThreshold}ms threshold`
    )
  }
  
  // Check Web Vitals
  Object.entries(fullBudget.webVitals).forEach(([metric, threshold]) => {
    const value = metrics.webVitals[metric as keyof typeof metrics.webVitals]
    if (value !== undefined && value > threshold) {
      throw new Error(
        `${metric} ${value} exceeds budget of ${threshold}`
      )
    }
  })
}

/**
 * Create performance test wrapper
 */
export const withPerformanceTest = (
  testFn: () => Promise<any>,
  budget?: Partial<PerformanceBudget>
) => {
  return async () => {
    const result = await measurePerformance(testFn)
    assertPerformanceBudget(result.metrics, budget)
    return result
  }
}

/**
 * Monitor performance over time
 */
export class PerformanceMonitor {
  private measurements: PerformanceMetrics[] = []
  private startTime = performance.now()
  
  addMeasurement(metrics: PerformanceMetrics) {
    this.measurements.push({
      ...metrics,
      timestamp: performance.now() - this.startTime
    } as any)
  }
  
  getAverageMetrics(): PerformanceMetrics {
    if (this.measurements.length === 0) {
      throw new Error('No measurements recorded')
    }
    
    const totals = this.measurements.reduce((acc, metrics) => ({
      renderTime: acc.renderTime + metrics.renderTime,
      componentCount: acc.componentCount + metrics.componentCount,
      domNodes: acc.domNodes + metrics.domNodes,
      longTasks: [...acc.longTasks, ...metrics.longTasks],
      webVitals: {
        LCP: (acc.webVitals.LCP || 0) + (metrics.webVitals.LCP || 0),
        FID: (acc.webVitals.FID || 0) + (metrics.webVitals.FID || 0),
        CLS: (acc.webVitals.CLS || 0) + (metrics.webVitals.CLS || 0),
        FCP: (acc.webVitals.FCP || 0) + (metrics.webVitals.FCP || 0),
        TTFB: (acc.webVitals.TTFB || 0) + (metrics.webVitals.TTFB || 0),
        INP: (acc.webVitals.INP || 0) + (metrics.webVitals.INP || 0)
      }
    }), {
      renderTime: 0,
      componentCount: 0,
      domNodes: 0,
      longTasks: [] as number[],
      webVitals: {}
    } as PerformanceMetrics)
    
    const count = this.measurements.length
    
    return {
      renderTime: totals.renderTime / count,
      componentCount: Math.round(totals.componentCount / count),
      domNodes: Math.round(totals.domNodes / count),
      longTasks: totals.longTasks,
      webVitals: {
        LCP: totals.webVitals.LCP ? totals.webVitals.LCP / count : undefined,
        FID: totals.webVitals.FID ? totals.webVitals.FID / count : undefined,
        CLS: totals.webVitals.CLS ? totals.webVitals.CLS / count : undefined,
        FCP: totals.webVitals.FCP ? totals.webVitals.FCP / count : undefined,
        TTFB: totals.webVitals.TTFB ? totals.webVitals.TTFB / count : undefined,
        INP: totals.webVitals.INP ? totals.webVitals.INP / count : undefined
      }
    }
  }
  
  detectRegressions(threshold = 1.2): boolean {
    if (this.measurements.length < 3) return false
    
    const recent = this.measurements.slice(-3)
    const baseline = this.measurements.slice(0, 3)
    
    const recentAvg = recent.reduce((sum, m) => sum + m.renderTime, 0) / recent.length
    const baselineAvg = baseline.reduce((sum, m) => sum + m.renderTime, 0) / baseline.length
    
    return recentAvg > baselineAvg * threshold
  }
  
  generateReport(): string {
    const avg = this.getAverageMetrics()
    const hasRegression = this.detectRegressions()
    
    return `
Performance Report
==================
Measurements: ${this.measurements.length}
Average Render Time: ${avg.renderTime.toFixed(2)}ms
Average Component Count: ${avg.componentCount}
Average DOM Nodes: ${avg.domNodes}
Long Tasks: ${avg.longTasks.length} (avg: ${(avg.longTasks.reduce((a, b) => a + b, 0) / Math.max(avg.longTasks.length, 1)).toFixed(2)}ms)

Web Vitals:
- LCP: ${avg.webVitals.LCP?.toFixed(2) || 'N/A'}ms
- FID: ${avg.webVitals.FID?.toFixed(2) || 'N/A'}ms  
- CLS: ${avg.webVitals.CLS?.toFixed(3) || 'N/A'}
- FCP: ${avg.webVitals.FCP?.toFixed(2) || 'N/A'}ms
- TTFB: ${avg.webVitals.TTFB?.toFixed(2) || 'N/A'}ms
- INP: ${avg.webVitals.INP?.toFixed(2) || 'N/A'}ms

Performance Regression: ${hasRegression ? '⚠️ DETECTED' : '✅ None'}
`
  }
  
  reset() {
    this.measurements = []
    this.startTime = performance.now()
  }
}

/**
 * Simulate network conditions for performance testing
 */
export const simulateNetworkConditions = (
  type: 'fast-3g' | 'slow-3g' | 'offline' | 'fast'
) => {
  const conditions = {
    'fast-3g': { latency: 150, downloadThroughput: 1600, uploadThroughput: 750 },
    'slow-3g': { latency: 2000, downloadThroughput: 500, uploadThroughput: 500 },
    'offline': { latency: 0, downloadThroughput: 0, uploadThroughput: 0 },
    'fast': { latency: 10, downloadThroughput: 10000, uploadThroughput: 10000 }
  }
  
  const condition = conditions[type]
  
  // Mock fetch with simulated network delay
  const originalFetch = global.fetch
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (condition.downloadThroughput === 0) {
      throw new Error('Network offline')
    }
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, condition.latency))
    
    // For testing, we'll just add delay rather than actual throttling
    return originalFetch(input, init)
  }
  
  return () => {
    global.fetch = originalFetch
  }
}

/**
 * CPU throttling simulation
 */
export const simulateCPUThrottling = (slowdownFactor = 4) => {
  const originalSetTimeout = global.setTimeout
  const originalSetInterval = global.setInterval
  
  global.setTimeout = ((callback: (...args: any[]) => void, delay = 0, ...args: any[]) => {
    return originalSetTimeout(callback, delay * slowdownFactor, ...args)
  }) as typeof setTimeout
  
  global.setInterval = ((callback: (...args: any[]) => void, delay = 0, ...args: any[]) => {
    return originalSetInterval(callback, delay * slowdownFactor, ...args)
  }) as typeof setInterval
  
  return () => {
    global.setTimeout = originalSetTimeout
    global.setInterval = originalSetInterval
  }
}

/**
 * Memory pressure simulation
 */
export const simulateMemoryPressure = (mbUsage = 100) => {
  // Create large objects to consume memory
  const memoryBallast: any[] = []
  const bytesPerMB = 1024 * 1024
  const objectSize = 1000 // ~1KB per object
  const objectCount = (mbUsage * bytesPerMB) / objectSize
  
  for (let i = 0; i < objectCount; i++) {
    memoryBallast.push({
      id: i,
      data: new Array(objectSize / 8).fill(Math.random()),
      timestamp: Date.now()
    })
  }
  
  return () => {
    memoryBallast.length = 0
  }
}