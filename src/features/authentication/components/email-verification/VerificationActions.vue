<!--
Verification Actions Component
Handles all action buttons: resend, primary action, check now
-->
<template>
  <div class="verification-actions">
    <!-- Resend Button -->
    <BaseButton
      v-if="showResendButton"
      :variant="canResend ? 'outline' : 'outline'"
      :loading="isResending"
      :disabled="!canResend || isResending"
      class="resend-button"
      @click="$emit('resend')"
    >
      <template v-if="!canResend" #icon>
        <ClockIcon class="w-4 h-4" />
      </template>
      {{ resendButtonText }}
    </BaseButton>
    
    <!-- Primary Action Button -->
    <BaseButton
      v-if="primaryAction"
      :variant="primaryAction.variant"
      :loading="primaryAction.loading"
      :disabled="primaryAction.disabled"
      class="primary-action"
      @click="$emit('primaryAction', primaryAction.action)"
    >
      <template #icon>
        <component :is="primaryAction.icon" class="w-4 h-4" />
      </template>
      {{ primaryAction.text }}
    </BaseButton>
    
    <!-- Check Email Button -->
    <button 
      v-if="showCheckButton"
      class="check-email-button"
      :disabled="isChecking"
      @click="$emit('checkNow')"
    >
      <ArrowPathIcon 
        class="w-4 h-4" 
        :class="{ 'animate-spin': isChecking }"
      />
      Check Now
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ClockIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import { BaseButton } from '@/shared/ui'
import type { VerificationStatus } from '../../types/email-verification.types'

interface PrimaryAction {
  text: string
  variant: 'primary' | 'secondary' | 'outline'
  icon: typeof RocketLaunchIcon
  loading: boolean
  disabled: boolean
  action: string
}

interface Props {
  status: VerificationStatus
  isResending: boolean
  isChecking: boolean
  canResend: boolean
  timeUntilResend: number
}

const props = defineProps<Props>()

defineEmits<{
  resend: []
  primaryAction: [action: string]
  checkNow: []
}>()

/**
 * Computed Properties
 */
const showResendButton = computed(() => {
  return props.status === 'pending' || props.status === 'expired' || props.status === 'error'
})

const showCheckButton = computed(() => {
  return props.status === 'pending'
})

const resendButtonText = computed(() => {
  if (props.isResending) return 'Sending...'
  if (!props.canResend && props.timeUntilResend > 0) {
    return `Resend in ${props.timeUntilResend}s`
  }
  return 'Resend Email'
})

const primaryAction = computed((): PrimaryAction | null => {
  switch (props.status) {
    case 'verified':
      return {
        text: 'Continue to Setup',
        variant: 'primary',
        icon: RocketLaunchIcon,
        loading: false,
        disabled: false,
        action: 'continue'
      }
    case 'expired':
    case 'error':
      return {
        text: 'Start Over',
        variant: 'primary',
        icon: ArrowRightIcon,
        loading: false,
        disabled: false,
        action: 'startOver'
      }
    default:
      return null
  }
})
</script>

<style lang="scss" scoped>
.verification-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .primary-action {
    order: 1;
  }
  
  .resend-button {
    order: 2;
  }
  
  .check-email-button {
    order: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    color: #667eea;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
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