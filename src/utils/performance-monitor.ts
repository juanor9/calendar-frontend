/**
 * Performance Monitoring Service for Vana
 * Tracks Core Web Vitals and custom metrics
 */

import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'
import type { Metric } from 'web-vitals'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface CustomMetric {
  name: string
  value: number
  unit: string
  context?: Record<string, unknown>
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceMetric> = new Map()
  private customMetrics: Map<string, CustomMetric> = new Map()
  private analyticsEnabled: boolean = false
  private debugMode: boolean = false

  // Performance thresholds based on Vana's SLOs
  private readonly thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 600, poor: 1800 },
    INP: { good: 200, poor: 500 },
  }

  private constructor() {
    this.debugMode = import.meta.env.DEV || localStorage.getItem('debug_performance') === 'true'
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Initialize performance monitoring
   */
  init(options: { analytics?: boolean; debug?: boolean } = {}) {
    this.analyticsEnabled = options.analytics ?? true
    this.debugMode = options.debug ?? this.debugMode

    // Monitor Core Web Vitals
    this.setupCoreWebVitals()

    // Monitor custom metrics
    this.setupCustomMetrics()

    // Setup performance observer for long tasks
    this.setupLongTaskObserver()

    // Monitor memory usage (if available)
    this.setupMemoryMonitoring()

    // Log initial page load metrics
    this.logNavigationTiming()

    if (this.debugMode) {
      console.log('[Performance Monitor] Initialized with options:', options)
      this.exposeDebugInterface()
    }
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupCoreWebVitals() {
    // Largest Contentful Paint
    onLCP(this.handleMetric.bind(this))

    // First Input Delay
    onFID(this.handleMetric.bind(this))

    // Cumulative Layout Shift
    onCLS(this.handleMetric.bind(this))

    // First Contentful Paint
    onFCP(this.handleMetric.bind(this))

    // Time to First Byte
    onTTFB(this.handleMetric.bind(this))

    // Interaction to Next Paint (new metric)
    onINP(this.handleMetric.bind(this))
  }

  /**
   * Handle Web Vitals metric
   */
  private handleMetric(metric: Metric) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating || this.getRating(metric.name, metric.value),
      timestamp: Date.now(),
    }

    this.metrics.set(metric.name, performanceMetric)

    // Send to analytics
    if (this.analyticsEnabled) {
      this.sendToAnalytics(performanceMetric)
    }

    // Log in debug mode
    if (this.debugMode) {
      console.log(`[Web Vital] ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}${this.getUnit(metric.name)}`,
        rating: performanceMetric.rating,
        percentile: metric.id,
      })
    }

    // Check against SLOs and alert if needed
    this.checkSLO(performanceMetric)
  }

  /**
   * Setup custom metrics specific to Vana
   */
  private setupCustomMetrics() {
    // Calendar render time
    this.measureCalendarRender()

    // GraphQL query performance
    this.measureGraphQLPerformance()

    // Task drag-and-drop performance
    this.measureDragAndDrop()

    // OR-Tools optimization time
    this.measureOptimizationTime()
  }

  /**
   * Measure calendar rendering performance
   */
  private measureCalendarRender() {
    // Mark start when calendar component mounts
    performance.mark('calendar-render-start')

    // Use MutationObserver to detect when calendar is fully rendered
    const observer = new MutationObserver((mutations, obs) => {
      const calendarElement = document.querySelector('[data-calendar-container]')
      if (calendarElement && calendarElement.children.length > 0) {
        performance.mark('calendar-render-end')
        performance.measure('calendar-render', 'calendar-render-start', 'calendar-render-end')

        const measure = performance.getEntriesByName('calendar-render')[0]
        if (measure) {
          this.recordCustomMetric('calendar-render', measure.duration, 'ms', {
            taskCount: calendarElement.querySelectorAll('[data-task]').length,
            eventCount: calendarElement.querySelectorAll('[data-event]').length,
          })
        }

        obs.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  /**
   * Measure GraphQL query performance
   */
  measureGraphQLPerformance() {
    // This will be called from Apollo Client link
    return (operationName: string, startTime: number, endTime: number) => {
      const duration = endTime - startTime
      this.recordCustomMetric(`graphql-${operationName}`, duration, 'ms', {
        operationName,
        timestamp: new Date().toISOString(),
      })

      // Alert if query exceeds p95 target (350ms)
      if (duration > 350) {
        console.warn(
          `[Performance] GraphQL query "${operationName}" exceeded 350ms target: ${duration}ms`
        )
      }
    }
  }

  /**
   * Measure drag and drop performance
   */
  private measureDragAndDrop() {
    let dragStartTime: number

    document.addEventListener('dragstart', () => {
      dragStartTime = performance.now()
      performance.mark('drag-start')
    })

    document.addEventListener('drop', () => {
      if (dragStartTime) {
        performance.mark('drag-end')
        performance.measure('drag-operation', 'drag-start', 'drag-end')

        const duration = performance.now() - dragStartTime
        this.recordCustomMetric('drag-drop', duration, 'ms')

        // Check if maintaining 60fps (16.67ms per frame)
        if (duration > 16.67) {
          console.warn(`[Performance] Drag operation exceeded frame budget: ${duration}ms`)
        }
      }
    })
  }

  /**
   * Measure OR-Tools optimization time
   */
  measureOptimizationTime() {
    // This will be called from the optimization service
    return (startTime: number, endTime: number, taskCount: number) => {
      const duration = endTime - startTime
      this.recordCustomMetric('or-tools-optimization', duration, 'ms', {
        taskCount,
        timestamp: new Date().toISOString(),
      })

      // Alert if optimization exceeds 5s target
      if (duration > 5000) {
        console.error(
          `[Performance] OR-Tools optimization exceeded 5s target: ${duration}ms for ${taskCount} tasks`
        )
      }
    }
  }

  /**
   * Setup observer for long tasks
   */
  private setupLongTaskObserver() {
    if (
      'PerformanceObserver' in window &&
      PerformanceObserver.supportedEntryTypes?.includes('longtask')
    ) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const longTask = entry as PerformanceEntry & { duration: number }
          if (longTask.duration > 50) {
            this.recordCustomMetric('long-task', longTask.duration, 'ms', {
              name: longTask.name,
              startTime: longTask.startTime,
            })

            if (this.debugMode) {
              console.warn(`[Performance] Long task detected: ${longTask.duration}ms`)
            }
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
    }
  }

  /**
   * Monitor memory usage
   */
  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (
          performance as typeof performance & {
            memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
          }
        ).memory
        const usedMB = memory.usedJSHeapSize / 1048576
        const totalMB = memory.totalJSHeapSize / 1048576
        const limitMB = memory.jsHeapSizeLimit / 1048576

        this.recordCustomMetric('memory-usage', usedMB, 'MB', {
          total: totalMB,
          limit: limitMB,
          percentage: (usedMB / limitMB) * 100,
        })

        // Alert if memory usage exceeds 50MB or 25% of limit
        if (usedMB > 50 || usedMB / limitMB > 0.25) {
          console.warn(
            `[Performance] High memory usage: ${usedMB.toFixed(2)}MB (${((usedMB / limitMB) * 100).toFixed(1)}% of limit)`
          )
        }
      }, 30000) // Check every 30 seconds
    }
  }

  /**
   * Log navigation timing metrics
   */
  private logNavigationTiming() {
    if (performance.timing) {
      const timing = performance.timing
      const metrics = {
        'dns-lookup': timing.domainLookupEnd - timing.domainLookupStart,
        'tcp-connection': timing.connectEnd - timing.connectStart,
        'request-response': timing.responseEnd - timing.requestStart,
        'dom-processing': timing.domComplete - timing.domLoading,
        'page-load': timing.loadEventEnd - timing.navigationStart,
      }

      Object.entries(metrics).forEach(([name, value]) => {
        this.recordCustomMetric(name, value, 'ms')
      })
    }
  }

  /**
   * Record a custom metric
   */
  recordCustomMetric(name: string, value: number, unit: string, context?: Record<string, unknown>) {
    const metric: CustomMetric = {
      name,
      value,
      unit,
      context,
    }

    this.customMetrics.set(name, metric)

    if (this.debugMode) {
      console.log(`[Custom Metric] ${name}: ${value.toFixed(2)}${unit}`, context)
    }

    // Send to analytics
    if (this.analyticsEnabled) {
      this.sendCustomMetricToAnalytics(metric)
    }
  }

  /**
   * Get rating for a metric value
   */
  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metricName as keyof typeof this.thresholds]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Get unit for a metric
   */
  private getUnit(metricName: string): string {
    switch (metricName) {
      case 'CLS':
        return ''
      case 'FID':
      case 'LCP':
      case 'FCP':
      case 'TTFB':
      case 'INP':
        return 'ms'
      default:
        return ''
    }
  }

  /**
   * Check if metric violates SLO
   */
  private checkSLO(metric: PerformanceMetric) {
    if (metric.rating === 'poor') {
      console.error(
        `[Performance SLO Violation] ${metric.name} is ${metric.rating} (${metric.value})`
      )

      // Could trigger alerts here
      if (this.analyticsEnabled) {
        this.sendSLOViolation(metric)
      }
    }
  }

  /**
   * Send metric to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric) {
    // Integration with analytics service (e.g., Google Analytics, Sentry, custom)
    if (
      (
        window as typeof window & {
          analytics?: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics?.track
    ) {
      ;(
        window as typeof window & {
          analytics: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics.track('Web Vital', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        timestamp: metric.timestamp,
      })
    }
  }

  /**
   * Send custom metric to analytics
   */
  private sendCustomMetricToAnalytics(metric: CustomMetric) {
    if (
      (
        window as typeof window & {
          analytics?: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics?.track
    ) {
      ;(
        window as typeof window & {
          analytics: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics.track('Custom Metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        ...metric.context,
      })
    }
  }

  /**
   * Send SLO violation alert
   */
  private sendSLOViolation(metric: PerformanceMetric) {
    if (
      (
        window as typeof window & {
          analytics?: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics?.track
    ) {
      ;(
        window as typeof window & {
          analytics: { track: (event: string, data: Record<string, unknown>) => void }
        }
      ).analytics.track('SLO Violation', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        threshold_violated: this.thresholds[metric.name as keyof typeof this.thresholds]?.poor,
      })
    }
  }

  /**
   * Expose debug interface in console
   */
  private exposeDebugInterface() {
    ;(
      window as typeof window & { performanceMonitor: Record<string, unknown> }
    ).performanceMonitor = {
      getMetrics: () => Object.fromEntries(this.metrics),
      getCustomMetrics: () => Object.fromEntries(this.customMetrics),
      getSummary: () => this.getSummary(),
      reset: () => {
        this.metrics.clear()
        this.customMetrics.clear()
      },
    }

    console.log('[Performance Monitor] Debug interface available at window.performanceMonitor')
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const summary: Record<string, unknown> = {
      webVitals: {},
      customMetrics: {},
      sloStatus: {},
    }

    // Web Vitals summary
    this.metrics.forEach((metric, name) => {
      summary.webVitals[name] = {
        value: metric.value,
        rating: metric.rating,
        unit: this.getUnit(name),
      }

      summary.sloStatus[name] = metric.rating !== 'poor' ? 'PASS' : 'FAIL'
    })

    // Custom metrics summary
    this.customMetrics.forEach((metric, name) => {
      summary.customMetrics[name] = {
        value: metric.value,
        unit: metric.unit,
      }
    })

    return summary
  }

  /**
   * Mark a custom event
   */
  mark(name: string) {
    performance.mark(name)

    if (this.debugMode) {
      console.log(`[Performance Mark] ${name}`)
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark: string) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]

      if (measure) {
        this.recordCustomMetric(name, measure.duration, 'ms')
      }
    } catch (error) {
      console.error(`[Performance] Failed to measure ${name}:`, error)
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Export types
export type { PerformanceMetric, CustomMetric }
