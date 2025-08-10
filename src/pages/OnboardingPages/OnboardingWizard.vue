<!--
Onboarding Wizard Component
Main container for the multi-step onboarding process
-->
<template>
  <div class="onboarding-wizard">
    <!-- Progress Header -->
    <div class="wizard-header">
      <div class="container">
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          <div class="step-indicator">
            Step <span class="current-step">{{ currentStepNumber }}</span> of {{ totalSteps }}
            <span class="progress-percentage">({{ progress }}%)</span>
          </div>
        </div>

        <!-- Skip Button -->
        <button v-if="canSkip && !isSubmitting" class="skip-button" @click="skipCurrentStep">
          <XMarkIcon class="w-4 h-4" />
          Skip for now
        </button>
      </div>
    </div>

    <!-- Step Content -->
    <div class="wizard-content">
      <div class="container">
        <Transition
          name="step-transition"
          mode="out-in"
          @before-enter="onBeforeEnter"
          @after-enter="onAfterEnter"
        >
          <component
            :is="currentStepComponent"
            :key="currentStep"
            :step-data="stepData"
            :is-loading="isSubmitting"
            :can-proceed="canProceed"
            class="step-component"
            @step-complete="handleStepComplete"
            @step-skip="handleStepSkip"
            @step-back="handleStepBack"
            @data-change="handleDataChange"
            @validation-change="handleValidationChange"
          />
        </Transition>
      </div>
    </div>

    <!-- Navigation Footer -->
    <div class="wizard-footer">
      <div class="container">
        <div class="navigation-controls">
          <!-- Back Button -->
          <BaseButton
            v-if="canGoBack && !isFirstStep"
            variant="ghost"
            :disabled="isSubmitting"
            class="back-button"
            @click="goToPreviousStep"
          >
            <template #icon>
              <ArrowLeftIcon class="w-4 h-4" />
            </template>
            Back
          </BaseButton>

          <!-- Spacer -->
          <div v-if="canGoBack && !isFirstStep" class="spacer"></div>

          <!-- Skip Button (alternative position) -->
          <BaseButton
            v-if="canSkip && showFooterSkip"
            variant="outline"
            :disabled="isSubmitting"
            class="skip-button-alt"
            @click="skipCurrentStep"
          >
            Skip for now
          </BaseButton>

          <!-- Continue/Complete Button -->
          <BaseButton
            v-if="!isLastStep"
            variant="primary"
            :loading="isSubmitting"
            :disabled="!canProceed || isSubmitting"
            class="continue-button"
            @click="proceedToNext"
          >
            Continue
            <template #icon>
              <ArrowRightIcon class="w-4 h-4" />
            </template>
          </BaseButton>

          <BaseButton
            v-else
            variant="primary"
            :loading="isSubmitting"
            :disabled="!canProceed || isSubmitting"
            class="complete-button"
            @click="completeOnboarding"
          >
            <template #icon>
              <CheckIcon class="w-4 h-4" />
            </template>
            Complete Setup
          </BaseButton>
        </div>

        <!-- Progress Text -->
        <div class="progress-text">
          <span v-if="estimatedTimeRemaining > 0" class="time-remaining">
            <ClockIcon class="w-4 h-4" />
            About {{ Math.ceil(estimatedTimeRemaining / 60) }} min remaining
          </span>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-message">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Error Modal -->
    <BaseModal
      :model-value="!!error"
      class="error-modal"
      @update:model-value="error && !$event && clearError()"
      @close="clearError"
    >
      <template #title>
        <div class="error-title">
          <ExclamationTriangleIcon class="w-6 h-6 text-red-500" />
          Something went wrong
        </div>
      </template>

      <div class="error-content">
        <p class="error-message">{{ error.userMessage || error.message }}</p>

        <div class="error-actions">
          <BaseButton variant="outline" @click="clearError"> Dismiss </BaseButton>

          <BaseButton v-if="error.retryable" variant="primary" @click="retryLastAction">
            Try Again
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useOnboarding } from '@/composables/useOnboarding'
  import { useAuth } from '@/composables/useAuth'
  import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    XMarkIcon,
    ClockIcon,
    ExclamationTriangleIcon,
  } from '@heroicons/vue/24/outline'

  // Import step components
  import WelcomeStep from './steps/WelcomeStep.vue'
  import WorkStyleStep from './steps/WorkStyleStep.vue'
  import CalendarIntegrationStep from './steps/CalendarIntegrationStep.vue'
  import AISetupStep from './steps/AISetupStep.vue'
  import TutorialStep from './steps/TutorialStep.vue'

  // Import UI components
  import BaseButton from '@/ui/BaseButton/BaseButton.vue'
  import BaseModal from '@/ui/BaseModal/BaseModal.vue'

  const router = useRouter()
  const route = useRoute()
  const { user } = useAuth()

  const {
    currentStep,
    stepData,
    progress,
    isLoading,
    isSubmitting,
    canProceed,
    error,
    estimatedTimeRemaining,
    goToStep,
    goToPreviousStep,
    goToNextStep,
    submitCurrentStep,
    skipCurrentStep,
    completeOnboarding: completeOnboardingFlow,
    updateStepData,
  } = useOnboarding()

  // Local state
  const isValidationValid = ref(true)
  const loadingMessage = ref('Setting up your experience...')
  const lastFailedAction = ref<(() => Promise<void>) | null>(null)

  // Step configuration
  const stepComponents = {
    welcome: WelcomeStep,
    preferences: WorkStyleStep,
    calendar_sync: CalendarIntegrationStep,
    ai_setup: AISetupStep,
    tutorial: TutorialStep,
  }

  const stepConfig = [
    {
      key: 'welcome',
      title: 'Welcome',
      canSkip: false,
      showFooterSkip: false,
      estimatedTime: 30,
    },
    {
      key: 'preferences',
      title: 'Work Style',
      canSkip: true,
      showFooterSkip: true,
      estimatedTime: 120,
    },
    {
      key: 'calendar_sync',
      title: 'Calendar',
      canSkip: true,
      showFooterSkip: false,
      estimatedTime: 90,
    },
    {
      key: 'ai_setup',
      title: 'AI Assistant',
      canSkip: true,
      showFooterSkip: true,
      estimatedTime: 60,
    },
    {
      key: 'tutorial',
      title: 'Quick Tour',
      canSkip: true,
      showFooterSkip: false,
      estimatedTime: 180,
    },
  ]

  /**
   * Computed Properties
   */

  const currentStepComponent = computed(() => {
    return stepComponents[currentStep.value as keyof typeof stepComponents]
  })

  const currentStepConfig = computed(() => {
    return stepConfig.find(step => step.key === currentStep.value)
  })

  const currentStepNumber = computed(
    () => stepConfig.findIndex(step => step.key === currentStep.value) + 1
  )

  const totalSteps = computed(() => stepConfig.length)

  const canGoBack = computed(() => currentStepNumber.value > 1)

  const canSkip = computed(() => {
    return currentStepConfig.value?.canSkip ?? false
  })

  const showFooterSkip = computed(() => {
    return currentStepConfig.value?.showFooterSkip ?? false
  })

  const isFirstStep = computed(() => currentStepNumber.value === 1)

  const isLastStep = computed(() => currentStepNumber.value === totalSteps.value)

  /**
   * Event Handlers
   */

  const handleStepComplete = async (data?: Record<string, unknown>) => {
    try {
      loadingMessage.value = 'Saving your progress...'

      if (data) {
        updateStepData(currentStep.value, data)
      }

      lastFailedAction.value = () => submitCurrentStep()
      await submitCurrentStep()

      if (!isLastStep.value) {
        loadingMessage.value = 'Loading next step...'
        await goToNextStep()
      }

      trackStepCompleted(currentStep.value, data)
    } catch (error) {
      console.error('Step completion failed:', error)
      // Error is handled by the error state in composable
    }
  }

  const handleStepSkip = async () => {
    try {
      loadingMessage.value = 'Skipping step...'

      lastFailedAction.value = () => skipCurrentStep()
      await skipCurrentStep()

      if (!isLastStep.value) {
        loadingMessage.value = 'Loading next step...'
        await goToNextStep()
      }

      trackStepSkipped(currentStep.value)
    } catch (error) {
      console.error('Step skip failed:', error)
    }
  }

  const handleStepBack = async () => {
    try {
      loadingMessage.value = 'Going back...'
      await goToPreviousStep()
    } catch (error) {
      console.error('Step back navigation failed:', error)
    }
  }

  const handleDataChange = (data: Record<string, unknown>) => {
    updateStepData(currentStep.value, data)
  }

  const handleValidationChange = (isValid: boolean) => {
    isValidationValid.value = isValid
  }

  const proceedToNext = async () => {
    try {
      loadingMessage.value = 'Saving and continuing...'

      lastFailedAction.value = async () => {
        await submitCurrentStep()
        await goToNextStep()
      }

      await lastFailedAction.value()
    } catch (error) {
      console.error('Proceed to next failed:', error)
    }
  }

  const completeOnboarding = async () => {
    try {
      loadingMessage.value = 'Completing your setup...'

      lastFailedAction.value = () => completeOnboardingFlow()
      await completeOnboardingFlow()

      // Success! Navigation handled by composable
      trackOnboardingCompleted()
    } catch (error) {
      console.error('Onboarding completion failed:', error)
      // Show completion error in modal instead of redirecting
    }
  }

  const clearError = () => {
    // Clear error from composable if possible
    if (error.value) {
      error.value = null
    }
  }

  const retryLastAction = async () => {
    if (lastFailedAction.value) {
      try {
        clearError()
        await lastFailedAction.value()
      } catch (error) {
        console.error('Retry failed:', error)
      }
    }
  }

  /**
   * Transition Event Handlers
   */

  const onBeforeEnter = () => {
    // Prepare for step transition
    const stepElement = document.querySelector('.step-component')
    if (stepElement) {
      stepElement.classList.add('transitioning')
    }
  }

  const onAfterEnter = () => {
    // Complete step transition
    const stepElement = document.querySelector('.step-component')
    if (stepElement) {
      stepElement.classList.remove('transitioning')
    }

    // Focus management for accessibility
    const firstInput = stepElement?.querySelector('input, button, select, textarea')
    if (firstInput instanceof HTMLElement) {
      firstInput.focus()
    }
  }

  /**
   * Route Synchronization
   */

  const syncRouteWithStep = (step: string) => {
    const routeName = `Onboarding${step.charAt(0).toUpperCase() + step.slice(1).replace('_', '')}`

    if (route.name !== routeName) {
      router.replace({ name: routeName })
    }
  }

  /**
   * Analytics Tracking
   */

  const trackStepCompleted = (step: string, data?: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.log('Onboarding step completed:', { step, data })
    }
    // Implement actual analytics tracking
  }

  const trackStepSkipped = (step: string) => {
    if (import.meta.env.DEV) {
      console.log('Onboarding step skipped:', { step })
    }
    // Implement actual analytics tracking
  }

  const trackOnboardingCompleted = () => {
    if (import.meta.env.DEV) {
      console.log('Onboarding completed successfully')
    }
    // Implement actual analytics tracking
  }

  /**
   * Keyboard Shortcuts
   */

  const handleKeydown = (event: KeyboardEvent) => {
    // Escape key to skip (if allowed)
    if (event.key === 'Escape' && canSkip.value && !isSubmitting.value) {
      event.preventDefault()
      handleStepSkip()
    }

    // Enter key to continue (if valid)
    if (event.key === 'Enter' && event.ctrlKey && canProceed.value && !isSubmitting.value) {
      event.preventDefault()
      if (isLastStep.value) {
        completeOnboarding()
      } else {
        proceedToNext()
      }
    }

    // Backspace to go back
    if (event.key === 'Backspace' && event.ctrlKey && canGoBack.value && !isSubmitting.value) {
      event.preventDefault()
      handleStepBack()
    }
  }

  /**
   * Lifecycle
   */

  onMounted(() => {
    // Initialize onboarding if we have a user
    if (user.value?.sub) {
      // Sync initial route
      syncRouteWithStep(currentStep.value)

      // Add keyboard listeners
      document.addEventListener('keydown', handleKeydown)

      // Track onboarding start
      if (import.meta.env.DEV) {
        console.log('Onboarding wizard mounted', {
          user: user.value.sub,
          currentStep: currentStep.value,
        })
      }
    } else {
      // No user, redirect to login
      router.push({ name: 'Landing' })
    }
  })

  onBeforeUnmount(() => {
    // Remove keyboard listeners
    document.removeEventListener('keydown', handleKeydown)
  })

  // Watch for step changes and sync route
  watch(currentStep, newStep => {
    syncRouteWithStep(newStep)

    // Update loading message based on step
    switch (newStep) {
      case 'welcome':
        loadingMessage.value = 'Welcome to Vana!'
        break
      case 'preferences':
        loadingMessage.value = 'Setting up your work preferences...'
        break
      case 'calendar_sync':
        loadingMessage.value = 'Connecting your calendar...'
        break
      case 'ai_setup':
        loadingMessage.value = 'Configuring AI assistant...'
        break
      case 'tutorial':
        loadingMessage.value = 'Preparing your tour...'
        break
      default:
        loadingMessage.value = 'Loading...'
    }
  })

  // Watch for route changes and sync step
  watch(
    () => route.name,
    newRouteName => {
      if (typeof newRouteName === 'string' && newRouteName.startsWith('Onboarding')) {
        const stepFromRoute = newRouteName
          .replace('Onboarding', '')
          .toLowerCase()
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase()

        if (stepFromRoute !== currentStep.value) {
          goToStep(stepFromRoute as string)
        }
      }
    }
  )
</script>

<style lang="scss" scoped>
  .onboarding-wizard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  }

  /* Header */

  .wizard-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1.5rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 10%);

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .progress-section {
      flex: 1;
      max-width: 400px;
    }

    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 4px;
        transition: width 0.6s ease;
      }
    }

    .step-indicator {
      font-size: 0.875rem;
      color: #718096;

      .current-step {
        font-weight: 600;
        color: #2d3748;
      }

      .progress-percentage {
        color: #a0aec0;
      }
    }

    .skip-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      color: #718096;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f7fafc;
        color: #4a5568;
      }
    }
  }

  /* Content */

  .wizard-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }
  }

  /* Step Transitions */

  .step-transition-enter-active,
  .step-transition-leave-active {
    transition: all 0.4s ease;
  }

  .step-transition-enter-from {
    opacity: 0%;
    transform: translateX(30px);
  }

  .step-transition-leave-to {
    opacity: 0%;
    transform: translateX(-30px);
  }

  /* Footer */

  .wizard-footer {
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 1.5rem 0;

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .navigation-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;

      .spacer {
        flex: 1;
      }

      .back-button {
        margin-right: auto;
      }

      .continue-button,
      .complete-button {
        min-width: 120px;
      }

      @media (width <= 640px) {
        flex-direction: column;
        gap: 1rem;

        .back-button {
          margin-right: 0;
          order: 3;
        }

        .continue-button,
        .complete-button {
          order: 1;
          width: 100%;
        }

        .skip-button-alt {
          order: 2;
          width: 100%;
        }
      }
    }

    .progress-text {
      display: flex;
      justify-content: center;

      .time-remaining {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        color: #718096;
      }
    }
  }

  /* Loading Overlay */

  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 50%);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .loading-content {
      text-align: center;
      color: white;

      .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 20%);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      .loading-message {
        font-size: 1.1rem;
        font-weight: 500;
      }
    }
  }

  @keyframes spin {

    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* Error Modal */

  .error-modal {

    .error-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .error-content {

      .error-message {
        margin-bottom: 1.5rem;
        color: #718096;
        line-height: 1.6;
      }

      .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    }
  }

  /* Responsive Design */
  @media (width <= 768px) {

    .wizard-header,
    .wizard-footer {
      padding: 1rem 0;
    }

    .wizard-content {
      padding: 2rem 0;
    }

    .container {
      padding: 0 1rem;
    }
  }

  /* Accessibility */

  .step-component {

    &.transitioning {
      outline: none;
    }

    &:focus-within {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 0.5rem;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {

    .progress-bar {
      border: 1px solid #000;
    }

    .progress-fill {
      background: #000;
    }

    .skip-button {
      border-color: #000;
      color: #000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {

    .step-transition-enter-active,
    .step-transition-leave-active {
      transition: opacity 0.2s ease;
    }

    .step-transition-enter-from,
    .step-transition-leave-to {
      transform: none;
    }

    .progress-fill {
      transition: none;
    }

    .loading-spinner {
      animation: none;
    }
  }
</style>
