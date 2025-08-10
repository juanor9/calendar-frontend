/**
 * Registration Store - Pinia Store for Registration Flow State Management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  RegistrationState,
  RegistrationError,
  RegistrationStep,
} from '@/types/registration.types'
import { RegistrationCache } from '@/utils/registration-cache'

export interface RegistrationFlowState {
  status: RegistrationState['status']
  step: RegistrationStep
  email: string
  source: string
  auth0Id: string | null
  startedAt: Date | null
  completedAt: Date | null
  error: RegistrationError | null
  retryCount: number
  sessionId: string | null
}

export interface EmailVerificationStoreState {
  isVerified: boolean
  sentAt: Date | null
  canResend: boolean
  resendCount: number
  timeUntilResend: number
  lastResendAt: Date | null
}

export const useRegistrationStore = defineStore('registration', () => {
  // Registration flow state
  const flow = ref<RegistrationFlowState>({
    status: 'idle',
    step: 'initial',
    email: '',
    source: 'landing',
    auth0Id: null,
    startedAt: null,
    completedAt: null,
    error: null,
    retryCount: 0,
    sessionId: null,
  })

  // Email verification state
  const emailVerification = ref<EmailVerificationStoreState>({
    isVerified: false,
    sentAt: null,
    canResend: false,
    resendCount: 0,
    timeUntilResend: 0,
    lastResendAt: null,
  })

  // Loading states
  const isLoading = ref(false)
  const isRetrying = ref(false)

  /**
   * Computed Properties
   */

  const registrationState = computed(
    (): RegistrationState => ({
      status: flow.value.status,
      step: flow.value.step,
      startedAt: flow.value.startedAt || undefined,
      completedAt: flow.value.completedAt || undefined,
      error: flow.value.error || undefined,
      retryCount: flow.value.retryCount,
      sessionId: flow.value.sessionId || undefined,
    })
  )

  const isRegistrationActive = computed(() => {
    return (
      flow.value.status !== 'idle' &&
      flow.value.status !== 'completed' &&
      flow.value.status !== 'error'
    )
  })

  const canRetry = computed(() => {
    return flow.value.status === 'error' && flow.value.error?.retryable && flow.value.retryCount < 3
  })

  const progressPercentage = computed(() => {
    switch (flow.value.status) {
      case 'idle':
        return 0
      case 'redirecting':
        return 10
      case 'processing':
        return 30
      case 'verifying':
        return 60
      case 'completed':
        return 100
      case 'error':
        // Return progress based on where the error occurred
        switch (flow.value.step) {
          case 'auth0_redirect':
            return 10
          case 'auth0_form':
            return 20
          case 'email_verification':
            return 60
          case 'profile_creation':
            return 80
          default:
            return 5
        }
      default:
        return 0
    }
  })

  /**
   * Registration Flow Actions
   */

  const startRegistration = (email: string, source = 'landing') => {
    flow.value = {
      status: 'redirecting',
      step: 'auth0_redirect',
      email,
      source,
      auth0Id: null,
      startedAt: new Date(),
      completedAt: null,
      error: null,
      retryCount: 0,
      sessionId: generateSessionId(),
    }

    // Reset email verification
    emailVerification.value = {
      isVerified: false,
      sentAt: null,
      canResend: false,
      resendCount: 0,
      timeUntilResend: 0,
      lastResendAt: null,
    }

    // Cache the state
    RegistrationCache.save(registrationState.value)

    // Track analytics
    trackRegistrationStarted(email, source)
  }

  const updateRegistrationState = (
    status: RegistrationState['status'],
    step?: RegistrationStep
  ) => {
    flow.value.status = status
    if (step) {
      flow.value.step = step
    }

    if (status === 'completed') {
      flow.value.completedAt = new Date()
      trackRegistrationCompleted()
    }

    // Cache the updated state
    RegistrationCache.save(registrationState.value)
  }

  const setAuth0Id = (auth0Id: string) => {
    flow.value.auth0Id = auth0Id
    RegistrationCache.save(registrationState.value)
  }

  const handleRegistrationError = (error: unknown) => {
    const registrationError: RegistrationError = normalizeError(error)

    flow.value.status = 'error'
    flow.value.error = registrationError
    flow.value.retryCount += 1

    // Track error analytics
    trackRegistrationError(registrationError)

    // Cache the error state
    RegistrationCache.save(registrationState.value)
  }

  const retryRegistration = async () => {
    if (!canRetry.value) {
      throw new Error('Cannot retry registration at this time')
    }

    isRetrying.value = true

    try {
      // Clear error state
      flow.value.error = null
      flow.value.status = 'redirecting'

      // Reset to appropriate step based on where we failed
      if (flow.value.step === 'email_verification') {
        flow.value.status = 'verifying'
      } else {
        flow.value.step = 'auth0_redirect'
      }

      // Track retry attempt
      trackRegistrationRetry(flow.value.retryCount)
    } finally {
      isRetrying.value = false
    }
  }

  const resetRegistration = () => {
    flow.value = {
      status: 'idle',
      step: 'initial',
      email: '',
      source: 'landing',
      auth0Id: null,
      startedAt: null,
      completedAt: null,
      error: null,
      retryCount: 0,
      sessionId: null,
    }

    emailVerification.value = {
      isVerified: false,
      sentAt: null,
      canResend: false,
      resendCount: 0,
      timeUntilResend: 0,
      lastResendAt: null,
    }

    isLoading.value = false
    isRetrying.value = false

    // Clear cache
    RegistrationCache.clear()
  }

  /**
   * Email Verification Actions
   */

  const sendVerificationEmail = (_email: string) => {
    const now = new Date()

    emailVerification.value.sentAt = now
    emailVerification.value.lastResendAt = now
    emailVerification.value.canResend = false
    emailVerification.value.resendCount += 1
    emailVerification.value.timeUntilResend = 60 // 60 seconds cooldown

    // Start cooldown timer
    startResendCooldown()

    // Update flow step if needed
    if (flow.value.step !== 'email_verification') {
      flow.value.step = 'email_verification'
      flow.value.status = 'verifying'
    }

    // Cache state
    RegistrationCache.save(registrationState.value)
  }

  const checkVerificationStatus = async (): Promise<boolean> => {
    // This would typically call an API to check verification status
    // For now, return current state
    return emailVerification.value.isVerified
  }

  const markEmailVerified = () => {
    emailVerification.value.isVerified = true
    flow.value.step = 'profile_creation'

    // If this completes the registration, update status
    if (flow.value.status === 'verifying') {
      updateRegistrationState('completed')
    }
  }

  const startResendCooldown = () => {
    const cooldownInterval = setInterval(() => {
      if (emailVerification.value.timeUntilResend > 0) {
        emailVerification.value.timeUntilResend -= 1
      } else {
        emailVerification.value.canResend = true
        clearInterval(cooldownInterval)
      }
    }, 1000)
  }

  /**
   * Utility Functions
   */

  const generateSessionId = (): string => {
    return `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const normalizeError = (error: unknown): RegistrationError => {
    if (error && typeof error === 'object' && 'code' in error) {
      return error as RegistrationError
    }

    const message = error instanceof Error ? error.message : String(error)

    // Determine error type based on message content
    let type: RegistrationError['type'] = 'unknown'
    let retryable = true

    if (message.includes('network') || message.includes('fetch')) {
      type = 'network'
    } else if (message.includes('auth0') || message.includes('authentication')) {
      type = 'auth0'
    } else if (message.includes('validation') || message.includes('invalid')) {
      type = 'validation'
      retryable = false
    } else if (message.includes('backend') || message.includes('server')) {
      type = 'backend'
    }

    return {
      code: 'REGISTRATION_ERROR',
      type,
      message,
      userMessage: getUserFriendlyErrorMessage(type, message),
      retryable,
      errorId: `reg_err_${Date.now()}`,
    }
  }

  const getUserFriendlyErrorMessage = (
    type: RegistrationError['type'],
    _message: string
  ): string => {
    switch (type) {
      case 'network':
        return 'Network connection error. Please check your internet connection and try again.'
      case 'auth0':
        return 'Authentication service error. Please try again in a moment.'
      case 'backend':
        return 'Server error. Please try again later.'
      case 'validation':
        return 'Invalid information provided. Please check your details and try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  /**
   * Analytics Tracking Functions
   */

  const trackRegistrationStarted = (email: string, source: string) => {
    if (import.meta.env.DEV) {
      console.log('Registration started:', { email, source, sessionId: flow.value.sessionId })
    }
    // Implement actual analytics tracking here
  }

  const trackRegistrationCompleted = () => {
    if (import.meta.env.DEV) {
      console.log('Registration completed:', {
        sessionId: flow.value.sessionId,
        duration:
          flow.value.completedAt && flow.value.startedAt
            ? flow.value.completedAt.getTime() - flow.value.startedAt.getTime()
            : null,
      })
    }
    // Implement actual analytics tracking here
  }

  const trackRegistrationError = (error: RegistrationError) => {
    if (import.meta.env.DEV) {
      console.log('Registration error:', {
        sessionId: flow.value.sessionId,
        error: error.code,
        step: flow.value.step,
        retryCount: flow.value.retryCount,
      })
    }
    // Implement actual analytics tracking here
  }

  const trackRegistrationRetry = (retryCount: number) => {
    if (import.meta.env.DEV) {
      console.log('Registration retry:', {
        sessionId: flow.value.sessionId,
        retryCount,
        step: flow.value.step,
      })
    }
    // Implement actual analytics tracking here
  }

  /**
   * State Recovery
   */

  const loadCachedState = () => {
    const cachedState = RegistrationCache.load()
    if (cachedState && cachedState.status !== 'completed') {
      // Restore flow state from cache
      flow.value = {
        status: cachedState.status,
        step: cachedState.step,
        email: cachedState.sessionId
          ? flow.value.email // Keep current email if we have one
          : '', // Or reset if no session
        source: 'cache_recovery',
        auth0Id: null,
        startedAt: cachedState.startedAt || null,
        completedAt: cachedState.completedAt || null,
        error: cachedState.error || null,
        retryCount: cachedState.retryCount,
        sessionId: cachedState.sessionId || null,
      }
    }
  }

  // Load cached state on store initialization
  loadCachedState()

  return {
    // State
    flow: flow.value,
    emailVerification: emailVerification.value,
    isLoading,
    isRetrying,

    // Computed
    registrationState,
    isRegistrationActive,
    canRetry,
    progressPercentage,

    // Registration actions
    startRegistration,
    updateRegistrationState,
    setAuth0Id,
    handleRegistrationError,
    retryRegistration,
    resetRegistration,

    // Email verification actions
    sendVerificationEmail,
    checkVerificationStatus,
    markEmailVerified,

    // Utility
    loadCachedState,
  }
})
