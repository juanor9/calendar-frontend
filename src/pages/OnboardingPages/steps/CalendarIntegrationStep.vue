<!--
Calendar Integration Step - Connect user's calendar
Handles calendar provider connection and setup
-->
<template>
  <div class="calendar-integration-step">
    <div class="step-content">
      <div class="step-header">
        <h1 class="step-title">Connect Your Calendar</h1>
        <p class="step-subtitle">Sync your existing calendars to start optimizing your schedule</p>
      </div>

      <!-- Calendar Providers -->
      <div class="providers-section">
        <h2 class="section-title">Choose your calendar provider</h2>

        <div class="providers-grid">
          <button
            v-for="provider in calendarProviders"
            :key="provider.id"
            class="provider-card"
            :class="{
              connected: connectedProvider === provider.id,
              disabled: isLoading,
            }"
            :disabled="isLoading"
            @click="connectProvider(provider)"
          >
            <div class="provider-icon">
              <img :src="provider.logo" :alt="provider.name" />
            </div>
            <h3 class="provider-name">{{ provider.name }}</h3>
            <p class="provider-description">{{ provider.description }}</p>

            <div v-if="connectedProvider === provider.id" class="connected-badge">
              <CheckCircleIcon class="w-5 h-5 text-green-500" />
              <span>Connected</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Skip Option -->
      <div class="skip-section">
        <p class="skip-text">You can also connect your calendar later from settings</p>
        <button class="skip-button" :disabled="isLoading" @click="skipCalendarSetup">
          Skip for now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { CheckCircleIcon } from '@heroicons/vue/24/outline'

  interface StepData {
    provider?: string
    connectedAt?: string
  }

  interface CalendarProvider {
    id: string
    name: string
    description: string
    logo: string
  }

  interface Props {
    stepData?: StepData
    isLoading?: boolean
    canProceed?: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'step-complete': [data: StepData]
    'step-skip': []
    'data-change': [data: StepData]
    'validation-change': [isValid: boolean]
  }>()

  const calendarProviders = [
    {
      id: 'google',
      name: 'Google Calendar',
      description: 'Connect your Gmail and Google Workspace calendars',
      logo: '/logos/google-calendar.svg',
    },
    {
      id: 'microsoft',
      name: 'Microsoft Outlook',
      description: 'Connect Outlook and Office 365 calendars',
      logo: '/logos/outlook.svg',
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      description: 'Connect your iCloud calendar',
      logo: '/logos/apple-calendar.svg',
    },
  ]

  const connectedProvider = ref<string | null>(null)

  const isValid = computed(() => connectedProvider.value !== null)

  const connectProvider = async (provider: CalendarProvider) => {
    if (props.isLoading) return

    // Simulate connection process
    connectedProvider.value = provider.id

    emit('step-complete', {
      provider: provider.id,
      connectedAt: new Date().toISOString(),
    })
  }

  const skipCalendarSetup = () => {
    emit('step-skip')
  }

  onMounted(() => {
    if (props.stepData?.provider) {
      connectedProvider.value = props.stepData.provider
    }

    emit('validation-change', isValid.value)
  })
</script>

<style lang="scss" scoped>
  .calendar-integration-step {
    max-width: 600px;
    margin: 0 auto;
  }

  .step-content {
    padding: 2rem;
    text-align: center;
  }

  .step-header {
    margin-bottom: 3rem;

    .step-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.75rem;
    }

    .step-subtitle {
      font-size: 1.125rem;
      color: #718096;
      line-height: 1.6;
    }
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
  }

  .providers-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .provider-card {
    padding: 2rem;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover:not(.disabled) {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 15%);
    }

    &.connected {
      border-color: #48bb78;
      background: rgba(72, 187, 120, 5%);
    }

    &.disabled {
      opacity: 60%;
      cursor: not-allowed;
    }

    .provider-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .provider-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .provider-description {
      color: #718096;
      line-height: 1.5;
    }

    .connected-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #48bb78;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  .skip-section {
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;

    .skip-text {
      color: #718096;
      margin-bottom: 1rem;
    }

    .skip-button {
      color: #667eea;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.875rem;

      &:hover:not(:disabled) {
        color: #5a67d8;
      }

      &:disabled {
        opacity: 50%;
        cursor: not-allowed;
      }
    }
  }
</style>
