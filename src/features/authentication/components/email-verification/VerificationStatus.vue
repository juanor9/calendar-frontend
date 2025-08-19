<!--
Verification Status Display Component
Handles status icon and title/description display
-->
<template>
  <div class="verification-status">
    <!-- Status Icon -->
    <div class="status-icon" :class="statusIconClass">
      <component 
        :is="statusIconComponent" 
        class="w-16 h-16"
      />
    </div>
    
    <!-- Status Content -->
    <div class="status-content">
      <h1 class="status-title">{{ statusTitle }}</h1>
      <p class="status-description">{{ statusDescription }}</p>
      
      <!-- Email Display -->
      <div v-if="email" class="email-display">
        <span class="email-label">Sent to:</span>
        <span class="email-value">{{ email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  EnvelopeIcon,
  CheckCircleIcon, 
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { VerificationStatus } from '../../types/email-verification.types'

interface Props {
  status: VerificationStatus
  email?: string
}

const props = defineProps<Props>()

/**
 * Computed Properties
 */
const statusIconClass = computed(() => ({
  'status-pending': props.status === 'pending',
  'status-verified': props.status === 'verified',
  'status-expired': props.status === 'expired',
  'status-error': props.status === 'error'
}))

const statusIconComponent = computed(() => {
  switch (props.status) {
    case 'pending': return EnvelopeIcon
    case 'verified': return CheckCircleIcon
    case 'expired': return ExclamationTriangleIcon
    case 'error': return ExclamationTriangleIcon
    default: return EnvelopeIcon
  }
})

const statusTitle = computed(() => {
  switch (props.status) {
    case 'pending': return 'Check Your Email'
    case 'verified': return 'Email Verified!'
    case 'expired': return 'Verification Link Expired'
    case 'error': return 'Something Went Wrong'
    default: return 'Verifying Email'
  }
})

const statusDescription = computed(() => {
  switch (props.status) {
    case 'pending': 
      return 'We sent a verification link to your email address. Click the link to activate your account and continue.'
    case 'verified': 
      return 'Your email has been verified successfully! You can now continue setting up your calendar.'
    case 'expired': 
      return 'Your verification link has expired for security reasons. Please request a new verification email.'
    case 'error': 
      return 'We encountered an error while verifying your email. Please try again or contact support if the problem persists.'
    default: 
      return 'Checking your email verification status...'
  }
})
</script>

<style lang="scss" scoped>
.verification-status {
  text-align: center;
}

.status-icon {
  margin: 0 auto 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.status-pending {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }
  
  &.status-verified {
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
  }
  
  &.status-expired,
  &.status-error {
    background: linear-gradient(135deg, #f56565, #e53e3e);
    color: white;
  }
}

.status-content {

  .status-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a202c;
  }
  
  .status-description {
    font-size: 1rem;
    color: #718096;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.email-display {
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  
  .email-label {
    color: #718096;
    margin-right: 0.5rem;
  }
  
  .email-value {
    font-weight: 600;
    color: #2d3748;
    word-break: break-all;
  }
}
</style>