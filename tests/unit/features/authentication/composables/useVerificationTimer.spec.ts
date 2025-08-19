/**
 * COMPOSABLE ANALYSIS TEMPLATE - useVerificationTimer.ts
 * 
 * COMPOSABLE: useVerificationTimer.ts (Timer Management)
 * DEPENDENCIES FOUND:
 * - Vue: ref
 * - State: canResend (ref<boolean>), timeUntilResend (ref<number>)
 * - Timers: resendTimer, progressTimer (window.setInterval)
 * - Methods: startResendTimer, startProgressAnimation, stopProgressAnimation, stopAllTimers
 * - No external dependencies
 * - Pure timer management with reactive state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useVerificationTimer } from '@/features/authentication/composables/useVerificationTimer'

// Mock window timers
vi.stubGlobal('setInterval', vi.fn())
vi.stubGlobal('clearInterval', vi.fn())

describe('useVerificationTimer Composable', () => {
  let mockSetInterval: ReturnType<typeof vi.fn>
  let mockClearInterval: ReturnType<typeof vi.fn>
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
    
    mockSetInterval = vi.mocked(setInterval)
    mockClearInterval = vi.mocked(clearInterval)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('initializes with correct default values', () => {
      const { canResend, timeUntilResend } = useVerificationTimer()

      expect(canResend.value).toBe(false)
      expect(timeUntilResend.value).toBe(60)
    })

    it('returns all required methods', () => {
      const timer = useVerificationTimer()

      expect(timer).toHaveProperty('canResend')
      expect(timer).toHaveProperty('timeUntilResend')
      expect(timer).toHaveProperty('startResendTimer')
      expect(timer).toHaveProperty('startProgressAnimation')
      expect(timer).toHaveProperty('stopProgressAnimation')
      expect(timer).toHaveProperty('stopAllTimers')
    })
  })

  describe('Resend Timer', () => {
    it('starts resend timer correctly', () => {
      const { startResendTimer, canResend, timeUntilResend } = useVerificationTimer()
      
      mockSetInterval.mockReturnValue(123 as any)
      
      startResendTimer()
      
      expect(canResend.value).toBe(false)
      expect(timeUntilResend.value).toBe(60)
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 1000)
    })

    it('decrements timeUntilResend every second', () => {
      const { startResendTimer, timeUntilResend } = useVerificationTimer()
      
      let intervalCallback: Function
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return 123 as any
      })
      
      startResendTimer()
      
      expect(timeUntilResend.value).toBe(60)
      
      // Simulate first tick
      intervalCallback!()
      expect(timeUntilResend.value).toBe(59)
      
      // Simulate second tick
      intervalCallback!()
      expect(timeUntilResend.value).toBe(58)
    })

    it('enables resend when countdown reaches zero', () => {
      const { startResendTimer, canResend, timeUntilResend } = useVerificationTimer()
      
      let intervalCallback: Function
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return 123 as any
      })
      
      startResendTimer()
      
      expect(canResend.value).toBe(false)
      
      // Fast forward to countdown end
      for (let i = 60; i > 0; i--) {
        intervalCallback!()
      }
      
      expect(timeUntilResend.value).toBe(0)
      expect(canResend.value).toBe(true)
    })

    it('clears interval when countdown reaches zero', () => {
      const { startResendTimer } = useVerificationTimer()
      
      let intervalCallback: Function
      const intervalId = 123
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return intervalId as any
      })
      
      startResendTimer()
      
      // Fast forward to countdown end
      for (let i = 60; i > 0; i--) {
        intervalCallback!()
      }
      
      expect(mockClearInterval).toHaveBeenCalledWith(intervalId)
    })

    it('clears existing timer before starting new one', () => {
      const { startResendTimer } = useVerificationTimer()
      
      const firstIntervalId = 123
      const secondIntervalId = 456
      
      mockSetInterval
        .mockReturnValueOnce(firstIntervalId as any)
        .mockReturnValueOnce(secondIntervalId as any)
      
      // Start first timer
      startResendTimer()
      
      // Start second timer
      startResendTimer()
      
      expect(mockClearInterval).toHaveBeenCalledWith(firstIntervalId)
    })
  })

  describe('Progress Animation Timer', () => {
    it('starts progress animation with callback', () => {
      const { startProgressAnimation } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      mockSetInterval.mockReturnValue(456 as any)
      
      startProgressAnimation(mockAdvanceStep)
      
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 3000)
    })

    it('calls advance step callback on each interval', () => {
      const { startProgressAnimation } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      let intervalCallback: Function
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return 456 as any
      })
      
      startProgressAnimation(mockAdvanceStep)
      
      // Simulate timer ticks
      intervalCallback!()
      expect(mockAdvanceStep).toHaveBeenCalledTimes(1)
      
      intervalCallback!()
      expect(mockAdvanceStep).toHaveBeenCalledTimes(2)
    })

    it('stops progress animation when requested', () => {
      const { startProgressAnimation, stopProgressAnimation } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      const intervalId = 456
      mockSetInterval.mockReturnValue(intervalId as any)
      
      startProgressAnimation(mockAdvanceStep)
      stopProgressAnimation()
      
      expect(mockClearInterval).toHaveBeenCalledWith(intervalId)
    })
  })

  describe('Timer Management', () => {
    it('stops all timers when requested', () => {
      const { startResendTimer, startProgressAnimation, stopAllTimers } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      const resendIntervalId = 123
      const progressIntervalId = 456
      
      mockSetInterval
        .mockReturnValueOnce(resendIntervalId as any)
        .mockReturnValueOnce(progressIntervalId as any)
      
      startResendTimer()
      startProgressAnimation(mockAdvanceStep)
      
      stopAllTimers()
      
      expect(mockClearInterval).toHaveBeenCalledWith(resendIntervalId)
      expect(mockClearInterval).toHaveBeenCalledWith(progressIntervalId)
    })

    it('handles stopping timers when none are active', () => {
      const { stopAllTimers } = useVerificationTimer()
      
      expect(() => stopAllTimers()).not.toThrow()
      expect(mockClearInterval).not.toHaveBeenCalled()
    })

    it('handles stopping progress animation when not active', () => {
      const { stopProgressAnimation } = useVerificationTimer()
      
      expect(() => stopProgressAnimation()).not.toThrow()
      expect(mockClearInterval).not.toHaveBeenCalled()
    })
  })
})

describe('State Management', () => {
    it('resets state correctly when starting new timer', () => {
      const { startResendTimer, canResend, timeUntilResend } = useVerificationTimer()
      
      // Modify state first
      canResend.value = true
      timeUntilResend.value = 30
      
      startResendTimer()
      
      expect(canResend.value).toBe(false)
      expect(timeUntilResend.value).toBe(60)
    })

    it('maintains state consistency during countdown', () => {
      const { startResendTimer, canResend, timeUntilResend } = useVerificationTimer()
      
      let intervalCallback: Function
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return 123 as any
      })
      
      startResendTimer()
      
      // During countdown, canResend should be false
      for (let i = 60; i > 1; i--) {
        intervalCallback!()
        expect(canResend.value).toBe(false)
        expect(timeUntilResend.value).toBe(i - 1)
      }
      
      // At zero, canResend should be true
      intervalCallback!()
      expect(canResend.value).toBe(true)
      expect(timeUntilResend.value).toBe(0)
    })
  })

describe('Edge Cases', () => {
    it('handles multiple timer starts gracefully', () => {
      const { startResendTimer } = useVerificationTimer()
      
      mockSetInterval.mockReturnValue(123 as any)
      
      startResendTimer()
      startResendTimer()
      startResendTimer()
      
      // Should clear previous timers
      expect(mockClearInterval).toHaveBeenCalledTimes(2)
      expect(mockSetInterval).toHaveBeenCalledTimes(3)
    })

    it('handles timer callback errors gracefully', () => {
      const { startResendTimer } = useVerificationTimer()
      
      let intervalCallback: Function
      mockSetInterval.mockImplementation((callback: Function) => {
        intervalCallback = callback
        return 123 as any
      })
      
      startResendTimer()
      
      // Even if something throws in the callback, it should not crash
      expect(() => intervalCallback!()).not.toThrow()
    })

    it('handles null interval IDs', () => {
      const { startResendTimer, stopAllTimers } = useVerificationTimer()
      
      mockSetInterval.mockReturnValue(null as any)
      
      startResendTimer()
      
      expect(() => stopAllTimers()).not.toThrow()
    })
  })

describe('Timer Intervals', () => {
    it('uses correct interval for resend timer (1 second)', () => {
      const { startResendTimer } = useVerificationTimer()
      
      startResendTimer()
      
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 1000)
    })

    it('uses correct interval for progress animation (3 seconds)', () => {
      const { startProgressAnimation } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      startProgressAnimation(mockAdvanceStep)
      
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 3000)
    })
  })

describe('Reactive State', () => {
    it('canResend is reactive', () => {
      const { canResend } = useVerificationTimer()
      
      expect(canResend.value).toBe(false)
      
      canResend.value = true
      expect(canResend.value).toBe(true)
    })

    it('timeUntilResend is reactive', () => {
      const { timeUntilResend } = useVerificationTimer()
      
      expect(timeUntilResend.value).toBe(60)
      
      timeUntilResend.value = 30
      expect(timeUntilResend.value).toBe(30)
    })
  })

describe('Integration with Real Timers', () => {
    it('works with real timers for basic functionality', async () => {
      vi.useRealTimers()
      
      const { startResendTimer, canResend, timeUntilResend } = useVerificationTimer()
      
      startResendTimer()
      
      expect(canResend.value).toBe(false)
      expect(timeUntilResend.value).toBe(60)
      
      // Let timer run for a short time
      await new Promise(resolve => setTimeout(resolve, 1100))
      
      expect(timeUntilResend.value).toBe(59)
      expect(canResend.value).toBe(false)
      
      vi.useFakeTimers() // Return to fake timers for other tests
    })
  })

  describe('Memory Management', () => {
    it('prevents memory leaks by clearing intervals', () => {
      const { startResendTimer, startProgressAnimation, stopAllTimers } = useVerificationTimer()
      const mockAdvanceStep = vi.fn()
      
      mockSetInterval.mockReturnValue(123 as any)
      
      // Start multiple timers
      startResendTimer()
      startProgressAnimation(mockAdvanceStep)
      
      // Stop all should clear both
      stopAllTimers()
      
      expect(mockClearInterval).toHaveBeenCalledTimes(2)
    })

    it('handles cleanup when intervals are already cleared', () => {
      const { startResendTimer, stopAllTimers } = useVerificationTimer()
      
      mockSetInterval.mockReturnValue(123 as any)
      
      startResendTimer()
      stopAllTimers()
      
      // Second call should not cause issues
      expect(() => stopAllTimers()).not.toThrow()
    })
  })