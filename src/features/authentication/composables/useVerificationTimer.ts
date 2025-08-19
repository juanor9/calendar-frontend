/**
 * Verification Timer Composable
 * Handles resend timer and progress animation timing
 */

import { ref } from 'vue'

export function useVerificationTimer() {
  const canResend = ref(false)
  const timeUntilResend = ref(60)
  
  let resendTimer: number | null = null
  let progressTimer: number | null = null
  
  const startResendTimer = () => {
    canResend.value = false
    timeUntilResend.value = 60
    
    if (resendTimer) {
      clearInterval(resendTimer)
    }
    
    resendTimer = window.setInterval(() => {
      timeUntilResend.value--
      if (timeUntilResend.value <= 0) {
        canResend.value = true
        if (resendTimer) {
          clearInterval(resendTimer)
          resendTimer = null
        }
      }
    }, 1000)
  }
  
  const startProgressAnimation = (advanceStep: () => void) => {
    // Simulate progress through steps
    progressTimer = window.setInterval(() => {
      advanceStep()
    }, 3000)
  }
  
  const stopProgressAnimation = () => {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }
  
  const stopAllTimers = () => {
    if (resendTimer) {
      clearInterval(resendTimer)
      resendTimer = null
    }
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }
  
  return {
    canResend,
    timeUntilResend,
    startResendTimer,
    startProgressAnimation,
    stopProgressAnimation,
    stopAllTimers
  }
}