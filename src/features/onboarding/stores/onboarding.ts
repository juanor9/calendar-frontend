/**
 * Onboarding Store - Pinia Store for Onboarding Flow State Management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  OnboardingStep,
  CalendarProvider,
  WorkStyle,
  WorkHours,
  MeetingPreferences,
  FocusTimePreferences,
  AIOptimizationLevel,
} from '@/features/authentication/types/registration.types'
import { OnboardingAPI } from '@/features/onboarding/services/api/onboarding'

export interface OnboardingWizardState {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]
  stepData: Record<string, unknown>
  startedAt: Date | null
  completedAt: Date | null
  abandonedAt: Date | null
  lastActivityAt: Date | null
}

export interface OnboardingPreferences {
  workStyle: WorkStyle | null
  workHours: WorkHours | null
  meetingPreferences: MeetingPreferences | null
  focusTimePreferences: FocusTimePreferences | null
  aiOptimizationLevel: AIOptimizationLevel | null
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
}

export interface OnboardingCalendarIntegration {
  provider: CalendarProvider | null
  isConnected: boolean
  connectedAt: Date | null
  initialSyncCompleted: boolean
  syncError: string | null
  calendars: Array<Record<string, unknown>>
}

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  workStyle: null,
  workHours: null,
  meetingPreferences: null,
  focusTimePreferences: null,
  aiOptimizationLevel: null,
  theme: 'auto',
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
}

const DEFAULT_CALENDAR_INTEGRATION: OnboardingCalendarIntegration = {
  provider: null,
  isConnected: false,
  connectedAt: null,
  initialSyncCompleted: false,
  syncError: null,
  calendars: [],
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // Core onboarding state
  const wizard = ref<OnboardingWizardState>({
    currentStep: 'welcome',
    completedSteps: [],
    skippedSteps: [],
    stepData: {},
    startedAt: null,
    completedAt: null,
    abandonedAt: null,
    lastActivityAt: null,
  })

  // User preferences
  const preferences = ref<OnboardingPreferences>({ ...DEFAULT_PREFERENCES })

  // Calendar integration
  const calendarIntegration = ref<OnboardingCalendarIntegration>({
    ...DEFAULT_CALENDAR_INTEGRATION,
  })

  // Loading and error states
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  // User ID (set when onboarding starts)
  const userId = ref<string | null>(null)

  /**
   * Computed Properties
   */

  const currentStep = computed({
    get: () => wizard.value.currentStep,
    set: (step: OnboardingStep) => updateCurrentStep(step),
  })

  const stepData = computed(() => wizard.value.stepData)

  const completionPercentage = computed(() => {
    const totalSteps = 5 // welcome, preferences, calendar_sync, ai_setup, tutorial
    const completed = wizard.value.completedSteps.length
    const skipped = wizard.value.skippedSteps.length

    return Math.round(((completed + skipped) / totalSteps) * 100)
  })

  const isComplete = computed(() => {
    return wizard.value.completedAt !== null
  })

  const hasCompletedStep = computed(() => (step: OnboardingStep) => {
    return wizard.value.completedSteps.includes(step)
  })

  const hasSkippedStep = computed(() => (step: OnboardingStep) => {
    return wizard.value.skippedSteps.includes(step)
  })

  const canSkipCurrentStep = computed(() => {
    // Welcome step is required, others can be skipped
    return wizard.value.currentStep !== 'welcome'
  })

  const estimatedTimeRemaining = computed(() => {
    // Estimate based on remaining required steps
    const stepTimes = {
      welcome: 30,
      preferences: 120,
      calendar_sync: 90,
      ai_setup: 60,
      tutorial: 180,
    }

    const remainingSteps = (
      ['welcome', 'preferences', 'calendar_sync', 'ai_setup', 'tutorial'] as OnboardingStep[]
    ).filter(
      step =>
        !wizard.value.completedSteps.includes(step) && !wizard.value.skippedSteps.includes(step)
    )

    return remainingSteps.reduce((total, step) => total + (stepTimes[step] || 60), 0)
  })

  // Additional computed properties for easier access
  const completedSteps = computed(() => wizard.value.completedSteps)
  const skippedSteps = computed(() => wizard.value.skippedSteps)

  /**
   * Onboarding Actions
   */

  const initializeOnboarding = async (userIdParam: string) => {
    try {
      isLoading.value = true
      error.value = null
      userId.value = userIdParam

      // Try to load existing onboarding state from backend
      const existingState = await OnboardingAPI.getOnboardingState(userIdParam)

      if (existingState) {
        // Restore from backend
        wizard.value = {
          currentStep: existingState.currentStep,
          completedSteps: existingState.completedSteps,
          skippedSteps: existingState.skippedSteps || [],
          stepData: existingState.stepData || {},
          startedAt: existingState.startedAt ? new Date(existingState.startedAt) : null,
          completedAt: existingState.completedAt ? new Date(existingState.completedAt) : null,
          abandonedAt: null,
          lastActivityAt: new Date(),
        }

        if (existingState.preferences) {
          // Convert UserPreferences to OnboardingPreferences format
          const prefs = existingState.preferences as unknown as Record<string, unknown>
          preferences.value = {
            ...DEFAULT_PREFERENCES,
            workStyle: (prefs?.workStyle as WorkStyle) || null,
            workHours: (prefs?.workHours as WorkHours) || null,
            meetingPreferences: (prefs?.meetingPreferences as MeetingPreferences) || null,
            focusTimePreferences: (prefs?.focusTimePreferences as FocusTimePreferences) || null,
            aiOptimizationLevel: (prefs?.aiOptimizationLevel as AIOptimizationLevel) || null,
            theme: existingState.preferences.theme || 'auto',
            notifications: {
              email:
                typeof existingState.preferences.notifications === 'object'
                  ? (existingState.preferences.notifications.email?.enabled ?? true)
                  : true,
              push:
                typeof existingState.preferences.notifications === 'object'
                  ? (existingState.preferences.notifications.push?.enabled ?? true)
                  : true,
              inApp:
                typeof existingState.preferences.notifications === 'object'
                  ? (existingState.preferences.notifications.inApp?.enabled ?? true)
                  : true,
            },
          }
        }
      } else {
        // Start fresh onboarding
        wizard.value.startedAt = new Date()
        wizard.value.lastActivityAt = new Date()
        await saveProgress()
      }

      trackOnboardingStarted()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize onboarding'
      console.error('Onboarding initialization failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateCurrentStep = async (step: OnboardingStep) => {
    try {
      wizard.value.currentStep = step
      wizard.value.lastActivityAt = new Date()

      await saveProgress()
      trackStepViewed(step)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update step'
      console.error('Step update failed:', err)
    }
  }

  const updateStepData = (step: OnboardingStep, data: Record<string, unknown>) => {
    const existingStepData = wizard.value.stepData[step] as Record<string, unknown> | undefined
    wizard.value.stepData[step] = {
      ...(existingStepData || {}),
      ...data,
    }
    wizard.value.lastActivityAt = new Date()

    // Auto-save after a short delay
    setTimeout(() => saveProgress(), 1000)
  }

  const completeStep = async (step: OnboardingStep) => {
    try {
      isSubmitting.value = true
      error.value = null

      // Add to completed steps if not already there
      if (!wizard.value.completedSteps.includes(step)) {
        wizard.value.completedSteps.push(step)
      }

      // Remove from skipped steps if it was there
      wizard.value.skippedSteps = wizard.value.skippedSteps.filter(s => s !== step)

      wizard.value.lastActivityAt = new Date()

      // Save step completion to backend
      if (userId.value) {
        await OnboardingAPI.completeStep(userId.value, step, wizard.value.stepData[step])
      }

      await saveProgress()
      trackStepCompleted(step)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to complete step'
      console.error('Step completion failed:', err)
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const skipStep = async (step: OnboardingStep) => {
    try {
      isSubmitting.value = true
      error.value = null

      // Add to skipped steps if not already there
      if (!wizard.value.skippedSteps.includes(step)) {
        wizard.value.skippedSteps.push(step)
      }

      // Remove from completed steps if it was there
      wizard.value.completedSteps = wizard.value.completedSteps.filter(s => s !== step)

      wizard.value.lastActivityAt = new Date()

      // Save step skip to backend
      if (userId.value) {
        await OnboardingAPI.skipStep(userId.value, step)
      }

      await saveProgress()
      trackStepSkipped(step)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to skip step'
      console.error('Step skip failed:', err)
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const completeOnboarding = async () => {
    try {
      isSubmitting.value = true
      error.value = null

      wizard.value.completedAt = new Date()
      wizard.value.lastActivityAt = new Date()

      // Save completion to backend
      if (userId.value) {
        await OnboardingAPI.completeOnboarding(userId.value, {
          preferences: preferences.value,
          calendarIntegration: calendarIntegration.value,
          stepData: wizard.value.stepData,
        })
      }

      await saveProgress()
      trackOnboardingCompleted()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to complete onboarding'
      console.error('Onboarding completion failed:', err)
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Preferences Actions
   */

  const updateWorkStyle = async (workStyle: WorkStyle) => {
    preferences.value.workStyle = workStyle
    await saveProgress()
  }

  const updateWorkHours = async (workHours: WorkHours) => {
    preferences.value.workHours = workHours
    await saveProgress()
  }

  const updateMeetingPreferences = async (meetingPrefs: MeetingPreferences) => {
    preferences.value.meetingPreferences = meetingPrefs
    await saveProgress()
  }

  const updateFocusTimePreferences = async (focusPrefs: FocusTimePreferences) => {
    preferences.value.focusTimePreferences = focusPrefs
    await saveProgress()
  }

  const updateAIOptimization = async (level: AIOptimizationLevel) => {
    preferences.value.aiOptimizationLevel = level
    await saveProgress()
  }

  const updateTheme = async (theme: 'light' | 'dark' | 'auto') => {
    preferences.value.theme = theme
    await saveProgress()
  }

  /**
   * Calendar Integration Actions
   */

  const connectCalendar = async (
    provider: CalendarProvider,
    credentials: Record<string, unknown>
  ) => {
    try {
      isSubmitting.value = true

      if (!userId.value) {
        throw new Error('User ID not set')
      }

      const connection = await OnboardingAPI.connectCalendar(userId.value, provider, credentials)

      calendarIntegration.value = {
        provider,
        isConnected: true,
        connectedAt: new Date(),
        initialSyncCompleted: false,
        syncError: null,
        calendars: connection.calendars || [],
      }

      await saveProgress()
      trackCalendarConnected(provider)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calendar connection failed'
      calendarIntegration.value.syncError = errorMessage
      error.value = errorMessage

      trackCalendarConnectionFailed(provider, errorMessage)
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const disconnectCalendar = async () => {
    try {
      isSubmitting.value = true

      if (userId.value && calendarIntegration.value.provider) {
        await OnboardingAPI.disconnectCalendar(userId.value, calendarIntegration.value.provider)
      }

      calendarIntegration.value = { ...DEFAULT_CALENDAR_INTEGRATION }
      await saveProgress()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to disconnect calendar'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const triggerInitialSync = async () => {
    try {
      if (!userId.value || !calendarIntegration.value.isConnected) {
        throw new Error('Calendar not connected')
      }

      await OnboardingAPI.triggerInitialSync(userId.value)
      calendarIntegration.value.initialSyncCompleted = true

      await saveProgress()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Initial sync failed'
      calendarIntegration.value.syncError = errorMessage
      error.value = errorMessage
      throw err
    }
  }

  /**
   * Persistence and Recovery
   */

  const saveProgress = async () => {
    try {
      if (!userId.value) return

      await OnboardingAPI.saveProgress(userId.value, {
        currentStep: wizard.value.currentStep,
        completedSteps: wizard.value.completedSteps,
        skippedSteps: wizard.value.skippedSteps,
        stepData: wizard.value.stepData,
        preferences: preferences.value,
        calendarIntegration: calendarIntegration.value,
        lastActivityAt: wizard.value.lastActivityAt,
      })
    } catch (err) {
      console.warn('Failed to save onboarding progress:', err)
      // Don't throw - this is a background operation
    }
  }

  const loadSavedProgress = async () => {
    try {
      if (!userId.value) return

      const rawProgress = await OnboardingAPI.loadProgress(userId.value)
      const savedProgress = rawProgress as {
        wizard?: Partial<OnboardingWizardState>
        preferences?: Partial<OnboardingPreferences>
        calendarIntegration?: Partial<OnboardingCalendarIntegration>
      } | null

      if (savedProgress) {
        if (savedProgress.wizard) {
          wizard.value = {
            ...wizard.value,
            ...savedProgress.wizard,
            lastActivityAt: new Date(),
          }
        }

        if (savedProgress.preferences) {
          preferences.value = { ...DEFAULT_PREFERENCES, ...savedProgress.preferences }
        }

        if (savedProgress.calendarIntegration) {
          calendarIntegration.value = {
            ...DEFAULT_CALENDAR_INTEGRATION,
            ...savedProgress.calendarIntegration,
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load saved progress:', err)
    }
  }

  const resetOnboarding = () => {
    wizard.value = {
      currentStep: 'welcome',
      completedSteps: [],
      skippedSteps: [],
      stepData: {},
      startedAt: new Date(),
      completedAt: null,
      abandonedAt: null,
      lastActivityAt: new Date(),
    }

    preferences.value = { ...DEFAULT_PREFERENCES }
    calendarIntegration.value = { ...DEFAULT_CALENDAR_INTEGRATION }

    error.value = null
    isLoading.value = false
    isSubmitting.value = false
  }

  /**
   * Analytics Tracking
   */

  const trackOnboardingStarted = () => {
    if (import.meta.env.DEV) {
      console.log('Onboarding started:', { userId: userId.value })
    }
    // Implement actual analytics tracking
  }

  const trackStepViewed = (step: OnboardingStep) => {
    if (import.meta.env.DEV) {
      console.log('Onboarding step viewed:', { userId: userId.value, step })
    }
    // Implement actual analytics tracking
  }

  const trackStepCompleted = (step: OnboardingStep) => {
    if (import.meta.env.DEV) {
      console.log('Onboarding step completed:', { userId: userId.value, step })
    }
    // Implement actual analytics tracking
  }

  const trackStepSkipped = (step: OnboardingStep) => {
    if (import.meta.env.DEV) {
      console.log('Onboarding step skipped:', { userId: userId.value, step })
    }
    // Implement actual analytics tracking
  }

  const trackOnboardingCompleted = () => {
    if (import.meta.env.DEV) {
      console.log('Onboarding completed:', {
        userId: userId.value,
        completedSteps: wizard.value.completedSteps,
        skippedSteps: wizard.value.skippedSteps,
        duration:
          wizard.value.completedAt && wizard.value.startedAt
            ? wizard.value.completedAt.getTime() - wizard.value.startedAt.getTime()
            : null,
      })
    }
    // Implement actual analytics tracking
  }

  const trackCalendarConnected = (provider: CalendarProvider) => {
    if (import.meta.env.DEV) {
      console.log('Calendar connected:', { userId: userId.value, provider })
    }
    // Implement actual analytics tracking
  }

  const trackCalendarConnectionFailed = (provider: CalendarProvider, error: string) => {
    if (import.meta.env.DEV) {
      console.log('Calendar connection failed:', { userId: userId.value, provider, error })
    }
    // Implement actual analytics tracking
  }

  return {
    // State
    wizard: wizard.value,
    preferences: preferences.value,
    calendarIntegration: calendarIntegration.value,
    isLoading,
    isSubmitting,
    error,
    userId,

    // Computed
    currentStep,
    stepData,
    completedSteps,
    skippedSteps,
    completionPercentage,
    isComplete,
    hasCompletedStep,
    hasSkippedStep,
    canSkipCurrentStep,
    estimatedTimeRemaining,

    // Onboarding actions
    initializeOnboarding,
    updateCurrentStep,
    updateStepData,
    completeStep,
    skipStep,
    completeOnboarding,

    // Preferences actions
    updateWorkStyle,
    updateWorkHours,
    updateMeetingPreferences,
    updateFocusTimePreferences,
    updateAIOptimization,
    updateTheme,

    // Calendar actions
    connectCalendar,
    disconnectCalendar,
    triggerInitialSync,

    // Persistence
    saveProgress,
    loadSavedProgress,
    resetOnboarding,
  }
})
