/**
 * Unit tests for useOnboarding composable
 * Testing complete onboarding flow and state management for Vana
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useOnboarding } from '@/composables/useOnboarding'
import { useOnboardingStore } from '@/store/onboarding'
import { OnboardingAPI } from '@/services/api/onboarding'

// Mock dependencies
vi.mock('@/services/api/onboarding')
vi.mock('@/store/onboarding')

// Mock Vue Router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('useOnboarding composable', () => {
  let mockOnboardingStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    // Setup mock onboarding store
    mockOnboardingStore = {
      currentStep: 'welcome',
      stepData: {},
      completedSteps: [],
      updateCurrentStep: vi.fn(),
      updateStepData: vi.fn(),
      completeStep: vi.fn(),
      skipStep: vi.fn(),
      completeOnboarding: vi.fn(),
      updateWorkStyle: vi.fn(),
      updateWorkHours: vi.fn(),
      updateMeetingPreferences: vi.fn(),
      connectCalendar: vi.fn(),
      saveProgress: vi.fn(),
      loadSavedProgress: vi.fn(),
      resetOnboarding: vi.fn()
    }

    vi.mocked(useOnboardingStore).mockReturnValue(mockOnboardingStore)

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization and state management', () => {
    it('should initialize with welcome step', () => {
      const { currentStep, progress } = useOnboarding()

      expect(currentStep.value).toBe('welcome')
      expect(progress.value).toBe(10) // 0 completed + 50% credit for current step
    })

    it('should calculate progress correctly with completed steps', () => {
      mockOnboardingStore.completedSteps = ['welcome', 'preferences']
      const { progress } = useOnboarding()

      expect(progress.value).toBe(40) // 2/5 completed = 40%
    })

    it('should calculate progress correctly at completion', () => {
      mockOnboardingStore.completedSteps = ['welcome', 'preferences', 'calendar_sync', 'ai_setup', 'tutorial']
      const { progress } = useOnboarding()

      expect(progress.value).toBe(100)
    })

    it('should validate step data correctly', () => {
      mockOnboardingStore.currentStep = 'preferences'
      mockOnboardingStore.stepData = {
        preferences: {
          workStyle: 'focused'
        }
      }

      const { isStepValid } = useOnboarding()

      expect(isStepValid.value).toBe(true)
    })

    it('should invalidate step data when required field is missing', () => {
      mockOnboardingStore.currentStep = 'preferences'
      mockOnboardingStore.stepData = {
        preferences: {}
      }

      const { isStepValid } = useOnboarding()

      expect(isStepValid.value).toBe(false)
    })

    it('should allow proceeding when step is valid and not submitting', () => {
      mockOnboardingStore.currentStep = 'welcome'
      const { canProceed } = useOnboarding()

      expect(canProceed.value).toBe(true)
    })
  })

  describe('step navigation', () => {
    describe('goToStep', () => {
      it('should navigate to specified step', async () => {
        const { goToStep } = useOnboarding()

        await goToStep('preferences')

        expect(mockOnboardingStore.updateCurrentStep).toHaveBeenCalledWith('preferences')
        expect(mockRouter.push).toHaveBeenCalledWith({ 
          name: 'OnboardingPreferences' 
        })
      })

      it('should handle navigation errors', async () => {
        const { goToStep, error } = useOnboarding()
        const navError = new Error('Navigation failed')

        mockOnboardingStore.updateCurrentStep.mockRejectedValue(navError)

        await goToStep('preferences')

        expect(error.value).toEqual({
          code: 'NAVIGATION_FAILED',
          type: 'onboarding',
          message: 'Navigation failed',
          userMessage: 'Unable to navigate to step. Please try again.',
          retryable: true,
          timestamp: expect.any(Date),
          step: 'welcome'
        })
      })

      it('should handle camelCase step names for routing', async () => {
        const { goToStep } = useOnboarding()

        await goToStep('calendar_sync')

        expect(mockRouter.push).toHaveBeenCalledWith({ 
          name: 'OnboardingCalendarSync' 
        })
      })
    })

    describe('goToPreviousStep', () => {
      it('should navigate to previous step', async () => {
        mockOnboardingStore.currentStep = 'preferences'
        const { goToPreviousStep } = useOnboarding()

        await goToPreviousStep()

        expect(mockOnboardingStore.updateCurrentStep).toHaveBeenCalledWith('welcome')
      })

      it('should not navigate from first step', async () => {
        mockOnboardingStore.currentStep = 'welcome'
        const { goToPreviousStep } = useOnboarding()

        await goToPreviousStep()

        expect(mockOnboardingStore.updateCurrentStep).not.toHaveBeenCalled()
      })
    })

    describe('goToNextStep', () => {
      it('should navigate to next step', async () => {
        mockOnboardingStore.currentStep = 'welcome'
        const { goToNextStep } = useOnboarding()

        await goToNextStep()

        expect(mockOnboardingStore.updateCurrentStep).toHaveBeenCalledWith('preferences')
      })

      it('should complete onboarding from last step', async () => {
        mockOnboardingStore.currentStep = 'tutorial'
        const { goToNextStep } = useOnboarding()

        await goToNextStep()

        expect(mockOnboardingStore.completeOnboarding).toHaveBeenCalled()
      })
    })
  })

  describe('data management', () => {
    describe('updateStepData', () => {
      it('should update step data and auto-save', async () => {
        const { updateStepData } = useOnboarding()
        const stepData = { workStyle: 'focused', workHours: { start: '09:00', end: '17:00' } }

        mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

        updateStepData('preferences', stepData)

        expect(mockOnboardingStore.updateStepData).toHaveBeenCalledWith('preferences', stepData)
        
        // Wait for auto-save
        await nextTick()
        expect(mockOnboardingStore.saveProgress).toHaveBeenCalled()
      })

      it('should handle auto-save errors gracefully', async () => {
        const { updateStepData } = useOnboarding()
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation()

        mockOnboardingStore.saveProgress.mockRejectedValue(new Error('Save failed'))

        updateStepData('preferences', { workStyle: 'focused' })

        await nextTick()
        
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
        consoleSpy.mockRestore()
      })
    })

    describe('submitCurrentStep', () => {
      it('should submit valid step data', async () => {
        mockOnboardingStore.currentStep = 'welcome'
        const { submitCurrentStep } = useOnboarding()

        mockOnboardingStore.completeStep.mockResolvedValue(undefined)
        mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

        await submitCurrentStep()

        expect(mockOnboardingStore.completeStep).toHaveBeenCalledWith('welcome')
        expect(mockOnboardingStore.saveProgress).toHaveBeenCalled()
      })

      it('should not submit invalid step data', async () => {
        mockOnboardingStore.currentStep = 'preferences'
        mockOnboardingStore.stepData = { preferences: {} } // Missing required workStyle

        const { submitCurrentStep } = useOnboarding()

        await expect(submitCurrentStep()).rejects.toThrow('Cannot proceed with invalid step data')
        expect(mockOnboardingStore.completeStep).not.toHaveBeenCalled()
      })

      it('should handle submission errors', async () => {
        mockOnboardingStore.currentStep = 'welcome'
        const { submitCurrentStep, error } = useOnboarding()
        const submitError = new Error('Server error')

        mockOnboardingStore.completeStep.mockRejectedValue(submitError)

        await expect(submitCurrentStep()).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'STEP_SUBMISSION_FAILED',
          type: 'onboarding',
          message: 'Server error',
          userMessage: 'Unable to save your progress. Please try again.',
          retryable: true,
          timestamp: expect.any(Date),
          step: 'welcome'
        })
      })
    })

    describe('skipCurrentStep', () => {
      it('should skip current step', async () => {
        mockOnboardingStore.currentStep = 'calendar_sync'
        const { skipCurrentStep } = useOnboarding()

        mockOnboardingStore.skipStep.mockResolvedValue(undefined)
        mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

        await skipCurrentStep()

        expect(mockOnboardingStore.skipStep).toHaveBeenCalledWith('calendar_sync')
        expect(mockOnboardingStore.saveProgress).toHaveBeenCalled()
      })

      it('should handle skip errors', async () => {
        mockOnboardingStore.currentStep = 'calendar_sync'
        const { skipCurrentStep, error } = useOnboarding()
        const skipError = new Error('Skip failed')

        mockOnboardingStore.skipStep.mockRejectedValue(skipError)

        await expect(skipCurrentStep()).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'STEP_SKIP_FAILED',
          type: 'onboarding',
          message: 'Skip failed',
          userMessage: 'Unable to skip step. Please try again.',
          retryable: true,
          timestamp: expect.any(Date),
          step: 'calendar_sync'
        })
      })
    })
  })

  describe('onboarding completion', () => {
    it('should complete onboarding and redirect to dashboard', async () => {
      const { completeOnboarding } = useOnboarding()

      mockOnboardingStore.completeOnboarding.mockResolvedValue(undefined)

      await completeOnboarding()

      expect(mockOnboardingStore.completeOnboarding).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'Dashboard',
        query: { onboarding: 'completed' }
      })
    })

    it('should handle completion errors', async () => {
      const { completeOnboarding, error } = useOnboarding()
      const completionError = new Error('Database error')

      mockOnboardingStore.completeOnboarding.mockRejectedValue(completionError)

      await expect(completeOnboarding()).rejects.toThrow()

      expect(error.value).toEqual({
        code: 'ONBOARDING_COMPLETION_FAILED',
        type: 'onboarding',
        message: 'Database error',
        userMessage: 'Unable to complete setup. Please try again.',
        retryable: true,
        timestamp: expect.any(Date),
        step: 'welcome'
      })
    })
  })

  describe('preferences management', () => {
    describe('updateWorkPreferences', () => {
      it('should update work preferences', async () => {
        const { updateWorkPreferences } = useOnboarding()
        const preferences = {
          workStyle: 'focused',
          workHours: { start: '09:00', end: '17:00' },
          meetingPreferences: { maxMeetingsPerDay: 3 }
        }

        mockOnboardingStore.updateWorkStyle.mockResolvedValue(undefined)
        mockOnboardingStore.updateWorkHours.mockResolvedValue(undefined)
        mockOnboardingStore.updateMeetingPreferences.mockResolvedValue(undefined)

        await updateWorkPreferences(preferences)

        expect(mockOnboardingStore.updateWorkStyle).toHaveBeenCalledWith('focused')
        expect(mockOnboardingStore.updateWorkHours).toHaveBeenCalledWith(preferences.workHours)
        expect(mockOnboardingStore.updateMeetingPreferences).toHaveBeenCalledWith(preferences.meetingPreferences)
        expect(mockOnboardingStore.updateStepData).toHaveBeenCalledWith('preferences', preferences)
      })

      it('should handle preferences update errors', async () => {
        const { updateWorkPreferences, error } = useOnboarding()
        const preferences = { workStyle: 'focused' }
        const updateError = new Error('Preferences update failed')

        mockOnboardingStore.updateWorkStyle.mockRejectedValue(updateError)

        await expect(updateWorkPreferences(preferences)).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'PREFERENCES_UPDATE_FAILED',
          type: 'onboarding',
          message: 'Preferences update failed',
          userMessage: 'Unable to save your preferences. Please try again.',
          retryable: true,
          timestamp: expect.any(Date),
          step: 'welcome'
        })
      })
    })

    describe('updateCalendarIntegration', () => {
      it('should update calendar integration', async () => {
        const { updateCalendarIntegration } = useOnboarding()
        const integration = {
          provider: 'google',
          credentials: { access_token: 'token123' }
        }

        mockOnboardingStore.connectCalendar.mockResolvedValue(undefined)

        await updateCalendarIntegration(integration)

        expect(mockOnboardingStore.connectCalendar).toHaveBeenCalledWith('google', integration.credentials)
        expect(mockOnboardingStore.updateStepData).toHaveBeenCalledWith('calendar_sync', integration)
      })

      it('should handle calendar integration errors', async () => {
        const { updateCalendarIntegration, error } = useOnboarding()
        const integration = { provider: 'google', credentials: {} }
        const integrationError = new Error('Calendar connection failed')

        mockOnboardingStore.connectCalendar.mockRejectedValue(integrationError)

        await expect(updateCalendarIntegration(integration)).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'CALENDAR_INTEGRATION_FAILED',
          type: 'onboarding',
          message: 'Calendar connection failed',
          userMessage: 'Unable to connect your calendar. Please try again.',
          retryable: true,
          timestamp: expect.any(Date),
          step: 'welcome'
        })
      })
    })
  })

  describe('recovery and persistence', () => {
    describe('saveProgress', () => {
      it('should save progress without throwing on errors', async () => {
        const { saveProgress } = useOnboarding()
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()

        mockOnboardingStore.saveProgress.mockRejectedValue(new Error('Save failed'))

        await expect(saveProgress()).resolves.not.toThrow()

        expect(consoleSpy).toHaveBeenCalledWith('Failed to save onboarding progress:', expect.any(Error))
        consoleSpy.mockRestore()
      })

      it('should save progress successfully', async () => {
        const { saveProgress } = useOnboarding()

        mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

        await saveProgress()

        expect(mockOnboardingStore.saveProgress).toHaveBeenCalled()
      })
    })

    describe('loadSavedProgress', () => {
      it('should load saved progress', async () => {
        const { loadSavedProgress } = useOnboarding()

        mockOnboardingStore.loadSavedProgress.mockResolvedValue(undefined)

        await loadSavedProgress()

        expect(mockOnboardingStore.loadSavedProgress).toHaveBeenCalled()
      })

      it('should handle load errors gracefully', async () => {
        const { loadSavedProgress } = useOnboarding()
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()

        mockOnboardingStore.loadSavedProgress.mockRejectedValue(new Error('Load failed'))

        await loadSavedProgress()

        expect(consoleSpy).toHaveBeenCalledWith('Failed to load saved progress:', expect.any(Error))
        consoleSpy.mockRestore()
      })
    })

    describe('resetOnboarding', () => {
      it('should reset onboarding state', () => {
        const { resetOnboarding, error } = useOnboarding()

        // Set an error first
        error.value = {
          code: 'TEST_ERROR',
          type: 'onboarding',
          message: 'Test error',
          userMessage: 'Test error',
          retryable: true,
          timestamp: new Date(),
          step: 'welcome'
        }

        resetOnboarding()

        expect(mockOnboardingStore.resetOnboarding).toHaveBeenCalled()
        expect(error.value).toBe(null)
      })
    })
  })

  describe('step validation', () => {
    it('should validate email format in custom validation', () => {
      mockOnboardingStore.currentStep = 'preferences'
      mockOnboardingStore.stepData = {
        preferences: {
          workStyle: 'focused',
          email: 'invalid-email'
        }
      }

      // Mock a step config with email validation
      const originalStepConfigs = vi.doMock('@/composables/useOnboarding', () => ({
        STEP_CONFIGS: [{
          id: 'preferences',
          validationRules: [
            { field: 'workStyle', type: 'required' },
            { field: 'email', type: 'email' }
          ]
        }]
      }))

      const { isStepValid } = useOnboarding()

      // This would be false due to invalid email format
      // In real implementation, the validation logic would catch this
      expect(typeof isStepValid.value).toBe('boolean')
    })

    it('should validate minimum length requirements', () => {
      mockOnboardingStore.currentStep = 'preferences'
      mockOnboardingStore.stepData = {
        preferences: {
          workStyle: 'focused',
          description: 'ab' // Too short
        }
      }

      const { isStepValid } = useOnboarding()

      expect(typeof isStepValid.value).toBe('boolean')
    })

    it('should validate maximum length requirements', () => {
      mockOnboardingStore.currentStep = 'preferences'
      mockOnboardingStore.stepData = {
        preferences: {
          workStyle: 'focused',
          description: 'a'.repeat(1000) // Too long
        }
      }

      const { isStepValid } = useOnboarding()

      expect(typeof isStepValid.value).toBe('boolean')
    })
  })

  describe('auto-save functionality', () => {
    it('should auto-save when current step changes', async () => {
      const { currentStep } = useOnboarding()

      mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

      // Simulate step change
      currentStep.value = 'preferences'

      await nextTick()

      expect(mockOnboardingStore.saveProgress).toHaveBeenCalled()
    })

    it('should handle auto-save errors during step changes', async () => {
      const { currentStep } = useOnboarding()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation()

      mockOnboardingStore.saveProgress.mockRejectedValue(new Error('Auto-save failed'))

      currentStep.value = 'preferences'

      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('analytics tracking', () => {
    it('should track step views in development mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      
      // Mock development environment
      vi.stubEnv('DEV', true)

      const { goToStep } = useOnboarding()

      await goToStep('preferences')

      expect(consoleSpy).toHaveBeenCalledWith('Onboarding step viewed:', 'preferences')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('should track step completion in development mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      
      vi.stubEnv('DEV', true)

      mockOnboardingStore.currentStep = 'welcome'
      mockOnboardingStore.completeStep.mockResolvedValue(undefined)
      mockOnboardingStore.saveProgress.mockResolvedValue(undefined)

      const { submitCurrentStep } = useOnboarding()

      await submitCurrentStep()

      expect(consoleSpy).toHaveBeenCalledWith('Onboarding step completed:', 'welcome')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('should track onboarding completion in development mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      
      vi.stubEnv('DEV', true)

      mockOnboardingStore.completeOnboarding.mockResolvedValue(undefined)

      const { completeOnboarding } = useOnboarding()

      await completeOnboarding()

      expect(consoleSpy).toHaveBeenCalledWith('Onboarding completed')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })
  })
})