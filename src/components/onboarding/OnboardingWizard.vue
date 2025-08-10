<template>
  <div class="onboarding-wizard">
    <!-- Progress Header -->
    <div class="onboarding-header">
      <div class="container">
        <ProgressIndicator
          :current-step="currentStep"
          :total-steps="totalSteps"
          :steps="wizardSteps"
          class="progress-indicator"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="onboarding-content">
      <div class="container">
        <!-- Step 1: Preferences -->
        <OnboardingStep
          v-if="currentStep === 1"
          :step="1"
          title="Tell us about your work style"
          subtitle="Help us optimize your calendar for maximum productivity"
          class="step-content"
        >
          <WorkStylePicker
            v-model="userPreferences.workStyle"
            class="work-style-picker"
            @change="handleWorkStyleChange"
          />

          <div class="step-actions">
            <RegisterButton
              size="large"
              width="full"
              :disabled="!userPreferences.workStyle"
              class="continue-button"
              @click="nextStep"
            >
              Continue
              <template #iconRight>
                <ArrowRightIcon />
              </template>
            </RegisterButton>
          </div>
        </OnboardingStep>

        <!-- Step 2: Calendar Connection -->
        <OnboardingStep
          v-if="currentStep === 2"
          :step="2"
          title="Connect your calendar"
          subtitle="We'll optimize your existing schedule and add intelligent features"
          class="step-content"
        >
          <CalendarProviderSelector
            v-model="userPreferences.calendarProvider"
            :connecting="connectingCalendar"
            class="provider-selector"
            @connect="handleCalendarConnect"
          />

          <div class="step-actions">
            <RegisterButton variant="ghost" size="medium" class="back-button" @click="previousStep">
              <template #iconLeft>
                <ArrowLeftIcon />
              </template>
              Back
            </RegisterButton>

            <RegisterButton
              size="large"
              :disabled="!userPreferences.calendarProvider"
              :loading="connectingCalendar"
              class="continue-button"
              @click="nextStep"
            >
              {{ connectingCalendar ? 'Connecting...' : 'Continue' }}
              <template #iconRight>
                <ArrowRightIcon />
              </template>
            </RegisterButton>
          </div>
        </OnboardingStep>

        <!-- Step 3: AI Preferences -->
        <OnboardingStep
          v-if="currentStep === 3"
          :step="3"
          title="Customize your AI assistant"
          subtitle="Set your preferences for how Vana should manage your time"
          class="step-content"
        >
          <AiPreferencesForm
            v-model="userPreferences.aiSettings"
            class="ai-preferences"
            @change="handleAiPreferencesChange"
          />

          <div class="step-actions">
            <RegisterButton variant="ghost" size="medium" class="back-button" @click="previousStep">
              <template #iconLeft>
                <ArrowLeftIcon />
              </template>
              Back
            </RegisterButton>

            <RegisterButton
              size="large"
              :loading="completingSetup"
              class="complete-button"
              @click="completeOnboarding"
            >
              {{ completingSetup ? 'Setting up...' : 'Complete Setup' }}
              <template #iconRight>
                <SparklesIcon />
              </template>
            </RegisterButton>
          </div>
        </OnboardingStep>

        <!-- Success State -->
        <OnboardingStep
          v-if="currentStep === 4"
          :step="4"
          title="Welcome to your intelligent calendar!"
          subtitle="Everything is set up and ready to optimize your productivity"
          class="step-content step-content--success"
        >
          <div class="success-animation">
            <CheckCircleIcon class="success-icon" />
            <div class="success-stats">
              <div class="stat">
                <div class="stat-value">4+ hrs</div>
                <div class="stat-label">saved weekly</div>
              </div>
              <div class="stat">
                <div class="stat-value">85%</div>
                <div class="stat-label">less stress</div>
              </div>
              <div class="stat">
                <div class="stat-value">3x</div>
                <div class="stat-label">more focus</div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <RegisterButton
              size="large"
              width="full"
              class="dashboard-button"
              @click="goToDashboard"
            >
              Open Your Calendar
              <template #iconRight>
                <CalendarIcon />
              </template>
            </RegisterButton>
          </div>
        </OnboardingStep>
      </div>
    </div>

    <!-- Skip Option -->
    <div v-if="currentStep < 4" class="skip-option">
      <button class="skip-button" @click="showSkipDialog = true">Skip setup for now</button>
    </div>

    <!-- Skip Confirmation Modal -->
    <BaseModal
      :model-value="showSkipDialog"
      title="Skip onboarding?"
      class="skip-modal"
      @update:model-value="showSkipDialog = $event"
      @close="showSkipDialog = false"
    >
      <p class="skip-modal__text">
        You can complete setup later, but you'll miss out on personalized optimization features
        until then.
      </p>

      <div class="skip-modal__actions">
        <RegisterButton variant="outline" @click="showSkipDialog = false">
          Continue Setup
        </RegisterButton>
        <RegisterButton variant="ghost" @click="skipOnboarding"> Skip for Now </RegisterButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { RegisterButton, BaseModal } from '@/ui'
  import OnboardingStep from '@/components/onboarding/OnboardingStep.vue'
  import ProgressIndicator from '@/components/onboarding/ProgressIndicator.vue'
  import WorkStylePicker from '@/components/onboarding/WorkStylePicker.vue'
  import CalendarProviderSelector from '@/components/onboarding/CalendarProviderSelector.vue'
  import AiPreferencesForm from '@/components/onboarding/AiPreferencesForm.vue'
  import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
  import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
  import SparklesIcon from '@/components/icons/SparklesIcon.vue'
  import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
  import CalendarIcon from '@/components/icons/CalendarIcon.vue'

  interface UserPreferences {
    workStyle: string | null
    calendarProvider: string | null
    aiSettings: {
      focusTimePreference: string
      meetingBatching: boolean
      breakReminders: boolean
      energyOptimization: boolean
    }
  }

  const router = useRouter()

  // State
  const currentStep = ref(1)
  const totalSteps = 4
  const connectingCalendar = ref(false)
  const completingSetup = ref(false)
  const showSkipDialog = ref(false)

  const userPreferences = reactive<UserPreferences>({
    workStyle: null,
    calendarProvider: null,
    aiSettings: {
      focusTimePreference: 'morning',
      meetingBatching: true,
      breakReminders: true,
      energyOptimization: true,
    },
  })

  // Computed
  const wizardSteps = computed(() => [
    {
      id: 1,
      title: 'Work Style',
      status: currentStep.value > 1 ? 'completed' : currentStep.value === 1 ? 'current' : 'pending',
    },
    {
      id: 2,
      title: 'Calendar',
      status: currentStep.value > 2 ? 'completed' : currentStep.value === 2 ? 'current' : 'pending',
    },
    {
      id: 3,
      title: 'AI Settings',
      status: currentStep.value > 3 ? 'completed' : currentStep.value === 3 ? 'current' : 'pending',
    },
    { id: 4, title: 'Complete', status: currentStep.value === 4 ? 'current' : 'pending' },
  ])

  // Methods
  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const handleWorkStyleChange = (style: string) => {
    userPreferences.workStyle = style
  }

  const handleCalendarConnect = async (provider: string) => {
    connectingCalendar.value = true

    try {
      // Simulate calendar connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      userPreferences.calendarProvider = provider

      // Auto-advance after successful connection
      setTimeout(() => {
        connectingCalendar.value = false
        nextStep()
      }, 500)
    } catch (error) {
      console.error('Calendar connection failed:', error)
      connectingCalendar.value = false
    }
  }

  const handleAiPreferencesChange = (settings: Record<string, unknown>) => {
    userPreferences.aiSettings = { ...userPreferences.aiSettings, ...settings }
  }

  const completeOnboarding = async () => {
    completingSetup.value = true

    try {
      // Simulate setup completion
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Save user preferences
      console.log('Saving user preferences:', userPreferences)

      nextStep() // Go to success state
    } catch (error) {
      console.error('Setup completion failed:', error)
    } finally {
      completingSetup.value = false
    }
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  const skipOnboarding = () => {
    router.push('/dashboard?onboarding=skipped')
  }
</script>

<script lang="ts">
  export default {
    name: 'OnboardingWizard',
  }
</script>

<style lang="scss" scoped>
  @use '../../../styles/tokens' as *;
  @use './OnboardingWizard';
</style>
