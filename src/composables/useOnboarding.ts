/**
 * Onboarding Composable for Vana Calendar
 * Manages the complete user onboarding flow and state
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/store/onboarding'
import type {
  OnboardingStep,
  OnboardingError,
  WorkPreferences,
  CalendarIntegration,
  OnboardingStepConfig,
} from '@/types/registration.types'

export interface UseOnboardingReturn {
  // State management
  currentStep: Ref<OnboardingStep>
  stepData: Ref<Record<string, unknown>>
  progress: ComputedRef<number>
  isStepValid: ComputedRef<boolean>
  canProceed: ComputedRef<boolean>

  // Loading and error states
  isLoading: Ref<boolean>
  isSubmitting: Ref<boolean>
  error: Ref<OnboardingError | null>

  // Step navigation
  goToStep: (step: OnboardingStep) => Promise<void>
  goToPreviousStep: () => Promise<void>
  goToNextStep: () => Promise<void>

  // Data management
  updateStepData: (step: OnboardingStep, data: Record<string, unknown>) => void
  submitCurrentStep: () => Promise<void>
  skipCurrentStep: () => Promise<void>

  // Onboarding completion
  completeOnboarding: () => Promise<void>

  // Preferences management
  updateWorkPreferences: (preferences: WorkPreferences) => Promise<void>
  updateCalendarIntegration: (integration: CalendarIntegration) => Promise<void>

  // Recovery and persistence
  saveProgress: () => Promise<void>
  loadSavedProgress: () => Promise<void>
  resetOnboarding: () => void
}

const STEP_ORDER: OnboardingStep[] = [
  'welcome',
  'preferences',
  'calendar_sync',
  'ai_setup',
  'tutorial',
]

const STEP_CONFIGS: OnboardingStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to Vana',
    description: 'Get started with your intelligent calendar',
    icon: 'hand-wave',
    required: true,
    estimatedTime: 30,
    component: 'WelcomeStep',
  },
  {
    id: 'preferences',
    title: 'Work Style Setup',
    description: 'Tell us about your work preferences',
    icon: 'cog',
    required: false,
    estimatedTime: 120,
    component: 'WorkStyleStep',
    validationRules: [
      {
        field: 'workStyle',
        type: 'required',
        message: 'Please select your work style',
      },
    ],
  },
  {
    id: 'calendar_sync',
    title: 'Connect Your Calendar',
    description: 'Sync with your existing calendars',
    icon: 'calendar',
    required: false,
    estimatedTime: 90,
    component: 'CalendarIntegrationStep',
  },
  {
    id: 'ai_setup',
    title: 'AI Optimization',
    description: 'Configure AI assistance preferences',
    icon: 'sparkles',
    required: false,
    estimatedTime: 60,
    component: 'AISetupStep',
  },
  {
    id: 'tutorial',
    title: 'Quick Tour',
    description: 'Learn the key features',
    icon: 'academic-cap',
    required: false,
    estimatedTime: 180,
    component: 'TutorialStep',
  },
]

export const useOnboarding = (): UseOnboardingReturn => {
  const router = useRouter()
  const onboardingStore = useOnboardingStore()

  // Local reactive state
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<OnboardingError | null>(null)

  // Computed state from store
  const currentStep = computed({
    get: () => onboardingStore.currentStep,
    set: (step: OnboardingStep) => onboardingStore.updateCurrentStep(step),
  })

  const stepData = computed(() => onboardingStore.stepData)

  // Calculate progress percentage
  const progress = computed(() => {
    const totalSteps = STEP_ORDER.length
    const currentIndex = STEP_ORDER.indexOf(currentStep.value)
    const completedSteps = onboardingStore.completedSteps.length

    // Base progress on completed steps + partial credit for current step
    const baseProgress = (completedSteps / totalSteps) * 100
    const currentStepProgress = currentIndex >= 0 ? (1 / totalSteps) * 50 : 0 // 50% credit for starting a step

    return Math.min(100, Math.round(baseProgress + currentStepProgress))
  })

  // Check if current step data is valid
  const isStepValid = computed(() => {
    const stepConfig = STEP_CONFIGS.find(config => config.id === currentStep.value)
    if (!stepConfig?.validationRules) return true

    const data = stepData.value[currentStep.value]
    if (!data) return !stepConfig.required

    return stepConfig.validationRules.every(rule => {
      const value = data[rule.field]

      switch (rule.type) {
        case 'required':
          return value !== undefined && value !== null && value !== ''
        case 'email':
          return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        case 'min':
          return !value || value.length >= (rule.value || 0)
        case 'max':
          return !value || value.length <= (rule.value || Infinity)
        case 'custom':
          return !rule.validator || rule.validator(value)
        default:
          return true
      }
    })
  })

  const canProceed = computed(() => {
    return isStepValid.value && !isSubmitting.value
  })

  // Get current step configuration
  const getCurrentStepConfig = () => {
    return STEP_CONFIGS.find(config => config.id === currentStep.value)
  }

  // Get next step in sequence
  const getNextStep = (): OnboardingStep | null => {
    const currentIndex = STEP_ORDER.indexOf(currentStep.value)
    return currentIndex >= 0 && currentIndex < STEP_ORDER.length - 1
      ? STEP_ORDER[currentIndex + 1]
      : null
  }

  // Get previous step in sequence
  const getPreviousStep = (): OnboardingStep | null => {
    const currentIndex = STEP_ORDER.indexOf(currentStep.value)
    return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null
  }

  /**
   * Navigation Methods
   */

  const goToStep = async (step: OnboardingStep) => {
    try {
      isLoading.value = true
      error.value = null

      await onboardingStore.updateCurrentStep(step)

      // Update URL to match current step
      const routeName = `Onboarding${step.charAt(0).toUpperCase() + step.slice(1).replace('_', '')}`
      await router.push({ name: routeName })

      // Track analytics
      trackStepViewed(step)
    } catch (err) {
      error.value = createOnboardingError(
        'NAVIGATION_FAILED',
        err instanceof Error ? err.message : 'Navigation failed',
        'Unable to navigate to step. Please try again.'
      )
    } finally {
      isLoading.value = false
    }
  }

  const goToPreviousStep = async () => {
    const previousStep = getPreviousStep()
    if (previousStep) {
      await goToStep(previousStep)
    }
  }

  const goToNextStep = async () => {
    const nextStep = getNextStep()
    if (nextStep) {
      await goToStep(nextStep)
    } else {
      await completeOnboarding()
    }
  }

  /**
   * Data Management Methods
   */

  const updateStepData = (step: OnboardingStep, data: Record<string, unknown>) => {
    onboardingStore.updateStepData(step, data)

    // Auto-save progress
    saveProgress().catch(console.error)
  }

  const submitCurrentStep = async () => {
    if (!canProceed.value) {
      throw new Error('Cannot proceed with invalid step data')
    }

    try {
      isSubmitting.value = true
      error.value = null

      const stepConfig = getCurrentStepConfig()
      if (!stepConfig) {
        throw new Error('Invalid step configuration')
      }

      // Submit step data to backend
      await onboardingStore.completeStep(currentStep.value)

      // Track analytics
      trackStepCompleted(currentStep.value)

      // Save progress
      await saveProgress()
    } catch (err) {
      error.value = createOnboardingError(
        'STEP_SUBMISSION_FAILED',
        err instanceof Error ? err.message : 'Step submission failed',
        'Unable to save your progress. Please try again.'
      )
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const skipCurrentStep = async () => {
    try {
      isSubmitting.value = true
      error.value = null

      await onboardingStore.skipStep(currentStep.value)

      // Track analytics
      trackStepSkipped(currentStep.value)

      // Save progress
      await saveProgress()
    } catch (err) {
      error.value = createOnboardingError(
        'STEP_SKIP_FAILED',
        err instanceof Error ? err.message : 'Step skip failed',
        'Unable to skip step. Please try again.'
      )
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Onboarding Completion
   */

  const completeOnboarding = async () => {
    try {
      isSubmitting.value = true
      error.value = null

      await onboardingStore.completeOnboarding()

      // Track analytics
      trackOnboardingCompleted()

      // Navigate to dashboard
      await router.push({
        name: 'Dashboard',
        query: { onboarding: 'completed' },
      })
    } catch (err) {
      error.value = createOnboardingError(
        'ONBOARDING_COMPLETION_FAILED',
        err instanceof Error ? err.message : 'Onboarding completion failed',
        'Unable to complete setup. Please try again.'
      )
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Preferences Management
   */

  const updateWorkPreferences = async (preferences: WorkPreferences) => {
    try {
      isLoading.value = true
      await onboardingStore.updateWorkStyle(preferences.workStyle)
      await onboardingStore.updateWorkHours(preferences.workHours)
      await onboardingStore.updateMeetingPreferences(preferences.meetingPreferences)

      // Update step data
      updateStepData('preferences', preferences)
    } catch (err) {
      error.value = createOnboardingError(
        'PREFERENCES_UPDATE_FAILED',
        err instanceof Error ? err.message : 'Preferences update failed',
        'Unable to save your preferences. Please try again.'
      )
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCalendarIntegration = async (integration: CalendarIntegration) => {
    try {
      isLoading.value = true
      await onboardingStore.connectCalendar(integration.provider, integration.credentials)

      // Update step data
      updateStepData('calendar_sync', integration)
    } catch (err) {
      error.value = createOnboardingError(
        'CALENDAR_INTEGRATION_FAILED',
        err instanceof Error ? err.message : 'Calendar integration failed',
        'Unable to connect your calendar. Please try again.'
      )
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Recovery and Persistence
   */

  const saveProgress = async () => {
    try {
      await onboardingStore.saveProgress()
    } catch (err) {
      console.warn('Failed to save onboarding progress:', err)
      // Don't throw - this is a background operation
    }
  }

  const loadSavedProgress = async () => {
    try {
      isLoading.value = true
      await onboardingStore.loadSavedProgress()
    } catch (err) {
      console.warn('Failed to load saved progress:', err)
    } finally {
      isLoading.value = false
    }
  }

  const resetOnboarding = () => {
    onboardingStore.resetOnboarding()
    error.value = null
  }

  /**
   * Utility Functions
   */

  const createOnboardingError = (
    code: string,
    message: string,
    userMessage: string
  ): OnboardingError => ({
    code,
    type: 'onboarding',
    message,
    userMessage,
    retryable: true,
    timestamp: new Date(),
    step: currentStep.value,
  })

  const trackStepViewed = (step: OnboardingStep) => {
    // Analytics tracking implementation
    if (import.meta.env.DEV) {
      console.log('Onboarding step viewed:', step)
    }
  }

  const trackStepCompleted = (step: OnboardingStep) => {
    // Analytics tracking implementation
    if (import.meta.env.DEV) {
      console.log('Onboarding step completed:', step)
    }
  }

  const trackStepSkipped = (step: OnboardingStep) => {
    // Analytics tracking implementation
    if (import.meta.env.DEV) {
      console.log('Onboarding step skipped:', step)
    }
  }

  const trackOnboardingCompleted = () => {
    // Analytics tracking implementation
    if (import.meta.env.DEV) {
      console.log('Onboarding completed')
    }
  }

  // Watch for step changes and auto-save
  watch(currentStep, (newStep, oldStep) => {
    if (oldStep && newStep !== oldStep) {
      saveProgress().catch(console.error)
    }
  })

  return {
    // State
    currentStep,
    stepData,
    progress,
    isStepValid,
    canProceed,
    estimatedTimeRemaining: computed(() => 5), // Mock value, implement proper calculation

    // Loading states
    isLoading,
    isSubmitting,
    error,

    // Navigation
    goToStep,
    goToPreviousStep,
    goToNextStep,

    // Data management
    updateStepData,
    submitCurrentStep,
    skipCurrentStep,

    // Completion
    completeOnboarding,

    // Preferences
    updateWorkPreferences,
    updateCalendarIntegration,

    // Recovery
    saveProgress,
    loadSavedProgress,
    resetOnboarding,
  }
}
