<template>
  <div class="email-verification-page">
    <div class="verification-container">
      <!-- Progress Header -->
      <div class="verification-progress">
        <ProgressSteps
          :current-step="2"
          :total-steps="4"
          :steps="progressSteps"
          class="progress-steps"
        />
      </div>

      <!-- Main Verification Card -->
      <div class="verification-card">
        <!-- Status Icon -->
        <div class="verification-icon" :class="`verification-icon--${verificationStatus}`">
          <MailIcon v-if="verificationStatus === 'pending'" />
          <CheckCircleIcon v-if="verificationStatus === 'success'" />
          <ExclamationCircleIcon v-if="verificationStatus === 'expired'" />
          <ClockIcon v-if="verificationStatus === 'resent'" />
        </div>

        <!-- Dynamic Content Based on Status -->
        <div class="verification-content">
          <!-- Pending Verification -->
          <template v-if="verificationStatus === 'pending'">
            <h1 class="verification-title">Check Your Email</h1>
            <p class="verification-description">
              We've sent a verification link to
              <strong class="user-email">{{ userEmail }}</strong>
            </p>
            <p class="verification-instructions">
              Click the link in the email to continue setting up your account. It might take a few
              minutes to arrive.
            </p>
          </template>

          <!-- Success State -->
          <template v-if="verificationStatus === 'success'">
            <h1 class="verification-title verification-title--success">Email Verified!</h1>
            <p class="verification-description">
              Great! Your email has been successfully verified. Let's continue setting up your
              calendar.
            </p>
          </template>

          <!-- Expired State -->
          <template v-if="verificationStatus === 'expired'">
            <h1 class="verification-title verification-title--error">Link Expired</h1>
            <p class="verification-description">
              The verification link has expired. Don't worry, we can send you a new one.
            </p>
          </template>

          <!-- Resent State -->
          <template v-if="verificationStatus === 'resent'">
            <h1 class="verification-title">New Email Sent</h1>
            <p class="verification-description">
              We've sent a fresh verification link to your email. Please check your inbox and spam
              folder.
            </p>
          </template>
        </div>

        <!-- Action Buttons -->
        <div class="verification-actions">
          <!-- Continue Button (Success) -->
          <RegisterButton
            v-if="verificationStatus === 'success'"
            size="large"
            width="full"
            class="continue-button"
            @click="continueToOnboarding"
          >
            Continue Setup
            <template #iconRight>
              <ArrowRightIcon />
            </template>
          </RegisterButton>

          <!-- Resend Button (Pending/Expired) -->
          <template v-if="verificationStatus === 'pending' || verificationStatus === 'expired'">
            <RegisterButton
              variant="outline"
              size="medium"
              width="full"
              :loading="isResending"
              :disabled="!canResend"
              class="resend-button"
              @click="resendVerification"
            >
              <template #iconLeft>
                <RefreshIcon />
              </template>
              {{ resendButtonText }}
            </RegisterButton>

            <p v-if="!canResend" class="resend-timer">
              You can request another email in {{ resendCountdown }}s
            </p>
          </template>

          <!-- Check Again Button (Resent) -->
          <RegisterButton
            v-if="verificationStatus === 'resent'"
            variant="secondary"
            size="medium"
            width="full"
            class="check-button"
            @click="checkVerificationStatus"
          >
            <template #iconLeft>
              <RefreshIcon />
            </template>
            Check Verification Status
          </RegisterButton>
        </div>

        <!-- Help Section -->
        <div class="verification-help">
          <div class="help-section">
            <h3 class="help-title">Didn't receive the email?</h3>
            <ul class="help-list">
              <li>Check your spam or junk folder</li>
              <li>Make sure {{ userEmail }} is correct</li>
              <li>Wait up to 10 minutes for delivery</li>
            </ul>
          </div>

          <!-- Contact Support -->
          <div class="support-link">
            <a href="/support" class="support-button">
              <SupportIcon />
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <!-- Security Note -->
      <div class="security-note">
        <ShieldIcon />
        <span> Your privacy is protected. We'll never share your email address. </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import { RegisterButton } from '@/shared/ui'
  import ProgressSteps from '@/features/onboarding/components/ProgressSteps.vue'
  import MailIcon from '@/shared/icons/MailIcon.vue'
  import CheckCircleIcon from '@/shared/icons/CheckCircleIcon.vue'
  import ExclamationCircleIcon from '@/shared/icons/ExclamationCircleIcon.vue'
  import ClockIcon from '@/shared/icons/ClockIcon.vue'
  import ArrowRightIcon from '@/shared/icons/ArrowRightIcon.vue'
  import RefreshIcon from '@/shared/icons/RefreshIcon.vue'
  import SupportIcon from '@/shared/icons/SupportIcon.vue'
  import ShieldIcon from '@/shared/icons/ShieldIcon.vue'

  export interface Props {
    email?: string
    token?: string
    status?: 'pending' | 'success' | 'expired' | 'resent'
  }

  const props = withDefaults(defineProps<Props>(), {
    email: '',
    token: '',
    status: 'pending',
  })

  const router = useRouter()

  // Reactive state
  const verificationStatus = ref<'pending' | 'success' | 'expired' | 'resent'>(props.status)
  const isResending = ref(false)
  const canResend = ref(false)
  const resendCountdown = ref(60)

  // Timer for resend cooldown
  let resendTimer: number | null = null

  // Computed properties
  const userEmail = computed(() => props.email || 'your email')

  const progressSteps = computed(() => [
    { id: 1, title: 'Account', status: 'completed' as const },
    { id: 2, title: 'Email Verification', status: 'current' as const },
    { id: 3, title: 'Preferences', status: 'pending' as const },
    { id: 4, title: 'Calendar Setup', status: 'pending' as const },
  ])

  const resendButtonText = computed(() => {
    if (verificationStatus.value === 'expired') {
      return 'Send New Link'
    }
    return 'Resend Email'
  })

  // Methods
  const continueToOnboarding = () => {
    router.push('/onboarding/preferences')
  }

  const resendVerification = async () => {
    if (!canResend.value || isResending.value) return

    isResending.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      verificationStatus.value = 'resent'
      startResendCooldown()

      // Auto-switch back to pending after showing confirmation
      setTimeout(() => {
        verificationStatus.value = 'pending'
      }, 3000)
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    } finally {
      isResending.value = false
    }
  }

  const checkVerificationStatus = async () => {
    // Simulate checking verification status
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes, randomly verify or keep pending
    const isVerified = Math.random() > 0.5
    verificationStatus.value = isVerified ? 'success' : 'pending'
  }

  const startResendCooldown = () => {
    canResend.value = false
    resendCountdown.value = 60

    resendTimer = window.setInterval(() => {
      resendCountdown.value--

      if (resendCountdown.value <= 0) {
        canResend.value = true
        if (resendTimer) {
          clearInterval(resendTimer)
          resendTimer = null
        }
      }
    }, 1000)
  }

  // Lifecycle
  onMounted(() => {
    // Check URL token if provided
    if (props.token) {
      // Simulate token verification
      setTimeout(() => {
        const isValidToken = props.token.length > 10 // Simple validation
        verificationStatus.value = isValidToken ? 'success' : 'expired'
      }, 1000)
    } else {
      // Start resend cooldown for initial load
      startResendCooldown()
    }
  })

  onBeforeUnmount(() => {
    if (resendTimer) {
      clearInterval(resendTimer)
    }
  })
</script>

<script lang="ts">
  export default {
    name: 'EmailVerificationPage',
  }
</script>

<style lang="scss" scoped>
  @use '../../../styles/tokens' as *;
  @use './EmailVerificationPage';
</style>
