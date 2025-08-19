/**
 * Email Verification Composable
 * Main logic for email verification flow
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './useAuth'
import { useVerificationTimer } from './useVerificationTimer'
import { useVerificationAnimation } from './useVerificationAnimation'
import { emailVerificationService } from '../services/email-verification.service'
import type { 
  VerificationStatus, 
  VerificationState,
  VerificationStep 
} from '../types/email-verification.types'

export function useEmailVerification() {
  const route = useRoute()
  const router = useRouter()
  const { resendVerificationEmail, checkEmailVerification } = useAuth()
  
  // State
  const status = ref<VerificationStatus>('pending')
  const isResending = ref(false)
  const isChecking = ref(false)
  const currentStepIndex = ref(0)
  
  // Timer composable
  const { 
    canResend, 
    timeUntilResend, 
    startResendTimer,
    startProgressAnimation,
    stopAllTimers
  } = useVerificationTimer()
  
  // Animation composable
  const { showVerificationSuccess } = useVerificationAnimation()
  
  // Computed properties
  const email = computed(() => route.query.email as string || '')
  const auth0Id = computed(() => route.query.auth0Id as string || '')
  
  const verificationState = computed<VerificationState>(() => ({
    status: status.value,
    isResending: isResending.value,
    isChecking: isChecking.value,
    canResend: canResend.value,
    timeUntilResend: timeUntilResend.value,
    currentStepIndex: currentStepIndex.value
  }))
  
  // Verification steps
  const verificationSteps: VerificationStep[] = [
    { id: 1, label: 'Email sent' },
    { id: 2, label: 'Check your inbox' },
    { id: 3, label: 'Click verify link' },
    { id: 4, label: 'Account activated' }
  ]
  
  // Auto-check interval
  let checkInterval: number | null = null
  
  /**
   * Core Functions
   */
  const checkVerificationStatus = async () => {
    if (!auth0Id.value) return
    
    try {
      const isVerified = await checkEmailVerification(auth0Id.value)
      if (isVerified && status.value !== 'verified') {
        status.value = 'verified'
        currentStepIndex.value = 3 // Final step
        
        // Stop auto-checking
        stopAutoCheck()
        
        // Show success animation
        showVerificationSuccess()
      }
    } catch (error) {
      console.error('Verification check failed:', error)
      // Don't change status on check failure - could be temporary network issue
    }
  }
  
  const resendVerification = async () => {
    if (!canResend.value || !email.value) return
    
    isResending.value = true
    try {
      await resendVerificationEmail(email.value)
      
      // Reset timer and status
      status.value = 'pending'
      startResendTimer()
      
      // Show success feedback
      emailVerificationService.showSuccessToast('Verification email sent!')
      
    } catch (error) {
      console.error('Resend failed:', error)
      emailVerificationService.showErrorToast('Failed to resend email. Please try again.')
    } finally {
      isResending.value = false
    }
  }
  
  const checkNow = async () => {
    if (!auth0Id.value || isChecking.value) return
    
    isChecking.value = true
    try {
      await checkVerificationStatus()
    } catch (error) {
      console.error('Manual check failed:', error)
    } finally {
      isChecking.value = false
    }
  }
  
  const handlePrimaryAction = (action: string) => {
    switch (action) {
      case 'continue':
        continueToOnboarding()
        break
      case 'startOver':
        startNewRegistration()
        break
    }
  }
  
  const continueToOnboarding = () => {
    // Track successful verification
    emailVerificationService.trackEmailVerified()
    
    router.push({ 
      name: 'OnboardingWelcome',
      query: { source: 'email_verification' }
    })
  }
  
  const startNewRegistration = () => {
    // Track restart action
    emailVerificationService.trackRegistrationRestart()
    
    router.push({ 
      name: 'Landing',
      query: { restart: 'true' }
    })
  }
  
  const advanceStep = () => {
    if (currentStepIndex.value < verificationSteps.length - 1) {
      currentStepIndex.value++
    }
  }
  
  /**
   * Lifecycle Management
   */
  const startAutoCheck = () => {
    checkInterval = window.setInterval(checkVerificationStatus, 3000)
  }
  
  const stopAutoCheck = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }
  
  const initialize = () => {
    // Validate required parameters
    if (!email.value || !auth0Id.value) {
      console.warn('Missing required parameters for email verification')
      router.push({ name: 'Landing' })
      return false
    }
    
    // Start checking verification status
    startAutoCheck()
    
    // Initial check
    checkVerificationStatus()
    
    // Start timers
    setTimeout(() => startResendTimer(), 10000) // Allow resend after 10s initially
    setTimeout(() => startProgressAnimation(advanceStep), 1000) // Start progress animation
    
    // Track page view
    if (import.meta.env.DEV) {
      console.log('Email verification page loaded', { 
        email: email.value, 
        auth0Id: auth0Id.value 
      })
    }
    
    return true
  }
  
  const cleanup = () => {
    stopAutoCheck()
    stopAllTimers()
  }
  
  // Lifecycle hooks
  onMounted(() => {
    initialize()
  })
  
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    // State
    verificationState,
    verificationSteps,
    email,
    
    // Actions
    resendVerification,
    checkNow,
    handlePrimaryAction,
    advanceStep,
    
    // Lifecycle
    initialize,
    cleanup
  }
}