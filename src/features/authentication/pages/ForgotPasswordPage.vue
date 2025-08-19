<template>
  <div class="forgot-password-page">
    <div class="forgot-password-page__container">
      <div class="forgot-password-page__header">
        <router-link to="/" class="forgot-password-page__back-link" aria-label="Back to home">
          <img src="@/assets/images/vana-logo.png" alt="Vana Calendar" class="forgot-password-page__logo" />
        </router-link>
      </div>

      <div class="forgot-password-page__content">
        <!-- Enhanced Recovery with PasswordRecoveryCard -->
        <div class="recovery-wrapper">
          <div class="recovery-header">
            <div class="recovery-icon">
              <MailIcon class="icon" />
            </div>
            <h1 class="recovery-title">Forgot your password?</h1>
            <p class="recovery-subtitle">
              Don't worry, it happens. We'll help you recover access to your account securely.
            </p>
          </div>

          <PasswordRecoveryCard
            v-if="!isEmailSent"
            :loading="isLoading"
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
            email-placeholder="Enter your email address"
            button-text="Send reset link"
            back-text="Back to login"
            :show-back-button="true"
            @submit="handleSubmit"
            @back="handleBack"
          />

          <!-- Success Status -->
          <div v-if="isEmailSent" class="recovery-success" role="status">
            <div class="success-icon">
              <CheckCircleIcon />
            </div>
            <h2 class="success-title">Email sent successfully!</h2>
            <p class="success-message">{{ successMessage }}</p>

            <div class="countdown-timer">
              <ClockIcon class="timer-icon" />
              Link expires in: <strong>{{ formatTime(timeRemaining) }}</strong>
            </div>

            <div class="recovery-actions">
              <button 
                class="resend-button"
                :disabled="resendDisabled"
                @click="handleResend"
              >
                <RefreshIcon v-if="!resendDisabled" class="button-icon" />
                <span v-if="!resendDisabled">Resend email</span>
                <div v-if="resendDisabled" class="progress-text">Available in {{ resendCountdown }}s</div>
              </button>
            </div>
          </div>

          <!-- Error Status -->
          <div v-if="error" class="recovery-error" role="alert">
            <ExclamationCircleIcon class="error-icon" />
            <p class="error-message">{{ error }}</p>
            <button class="retry-button" @click="clearError">
              Try again
            </button>
          </div>

          <!-- Footer Navigation -->
          <div class="recovery-footer">
            <button class="back-to-login-button" @click="handleBack">
              ← Back to login
            </button>
            <router-link to="/help/password-recovery" class="help-link">
              <SupportIcon class="icon" />
              Need help?
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import PasswordRecoveryCard from '@/features/authentication/components/PasswordRecoveryCard/PasswordRecoveryCard.vue'
import ExclamationCircleIcon from '@/shared/icons/ExclamationCircleIcon.vue'
import CheckCircleIcon from '@/shared/icons/CheckCircleIcon.vue'
import MailIcon from '@/shared/icons/MailIcon.vue'
import ClockIcon from '@/shared/icons/ClockIcon.vue'
import RefreshIcon from '@/shared/icons/RefreshIcon.vue'
import SupportIcon from '@/shared/icons/SupportIcon.vue'

// Composables
const router = useRouter()

// Local state
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const isEmailSent = ref(false)
const timeRemaining = ref(15 * 60) // 15 minutes in seconds
const resendDisabled = ref(false)
const resendCountdown = ref(0)

// Timers
let countdownInterval: number | null = null
let resendInterval: number | null = null

// Methods
const handleBack = (): void => {
  router.push('/auth/login')
}

const clearError = (): void => {
  error.value = null
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startCountdown = (): void => {
  if (countdownInterval) clearInterval(countdownInterval)
  
  countdownInterval = window.setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

const startResendCountdown = (): void => {
  resendDisabled.value = true
  resendCountdown.value = 30
  
  if (resendInterval) clearInterval(resendInterval)
  
  resendInterval = window.setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--
    } else {
      resendDisabled.value = false
      if (resendInterval) clearInterval(resendInterval)
    }
  }, 1000)
}

const handleResend = async (): Promise<void> => {
  if (resendDisabled.value) return
  
  try {
    // Reset timer
    timeRemaining.value = 15 * 60
    
    // Call the same submission logic with last used email
    const lastEmail = localStorage.getItem('vana_last_email') || ''
    await handleSubmit(lastEmail)
    
    // Start resend cooldown
    startResendCountdown()
  } catch (err) {
    console.error('Resend failed:', err)
  }
}

const handleSubmit = async (email: string): Promise<void> => {
  try {
    // Clear previous states
    error.value = null
    successMessage.value = null
    isEmailSent.value = false

    isLoading.value = true

    // Store email for auto-detection
    localStorage.setItem('vana_last_email', email)

    // Simulate API call to backend password recovery endpoint
    // In real implementation, this would call:
    // const response = await fetch('/v1/auth/password-recovery/request', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // })
    
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay

    // Mock success response
    successMessage.value = `We've sent an email to ${email} with instructions to reset your password.`
    isEmailSent.value = true
    
    // Start countdown timer
    timeRemaining.value = 15 * 60
    startCountdown()
    
    // Start initial resend cooldown
    startResendCountdown()

  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('not found')) {
        error.value = 'We couldn\'t find an account with that email. Please check it\'s correct.'
      } else if (err.message.includes('rate limit')) {
        error.value = 'You\'ve requested too many emails recently. Please wait a few minutes.'
      } else {
        error.value = err.message
      }
    } else {
      error.value = 'Failed to send email. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted((): void => {
  // Component initialization if needed
})

onBeforeUnmount((): void => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (resendInterval) clearInterval(resendInterval)
})

// SEO and Meta
document.title = 'Reset Password - Vana Calendar'
</script>

<style lang="scss" scoped>
@use '@/styles/tokens' as *;
@use '@/styles/globals/mixins' as *;
@use '@/styles/auth/auth-components' as *;

.forgot-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #eef2ff 100%);

  @include flex-column;

  padding: 40px 20px;

  &__container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 32px;
  }

  &__back-link {
    display: inline-block;
    text-decoration: none;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__logo {
    height: 3rem;
    width: auto;
  }

  &__content {
    width: 100%;
  }
}

// Auth Recovery Header

.auth-recovery-header {
  text-align: center;
  margin-bottom: 32px;

  .recovery-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    .icon {
      width: 28px;
      height: 28px;
    }
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #312e81;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
  }
}

// Forgot Password Form

.forgot-password-form {
  margin-bottom: 32px;
}

// Auth Recovery Footer  

.auth-recovery-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid rgba(99, 102, 241, 10%);
  
  @include mobile-only {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .help-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6366f1;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;

    .icon {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: #4f46e5;
      text-decoration: underline;
    }
  }
}
</style>