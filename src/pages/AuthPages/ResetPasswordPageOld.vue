<template>
  <div class="reset-password-page">
    <div class="reset-password-page__container">
      <div class="reset-password-page__header">
        <router-link to="/" class="reset-password-page__back-link" aria-label="Volver al inicio">
          <img src="@/assets/images/vana-logo.png" alt="Vana Calendar" class="reset-password-page__logo" />
        </router-link>
      </div>

      <div class="reset-password-page__content">
        <div class="reset-password-page__form-container">
          <!-- Loading state -->
          <div v-if="isValidating" class="reset-password-page__loading">
            <div class="reset-password-page__loading-spinner"></div>
            <p class="reset-password-page__loading-text">Validando enlace...</p>
          </div>

          <!-- Invalid token state -->
          <div v-else-if="tokenError" class="reset-password-page__error-state">
            <ExclamationCircleIcon class="reset-password-page__error-state-icon" />
            <h1 class="reset-password-page__error-state-title">Enlace inválido o expirado</h1>
            <p class="reset-password-page__error-state-message">
              El enlace para restablecer tu contraseña no es válido o ha expirado.
              Solicita un nuevo enlace de recuperación.
            </p>
            <div class="reset-password-page__error-state-actions">
              <BaseButton
                variant="primary"
                @click="router.push('/auth/forgot-password')"
              >
                Solicitar nuevo enlace
              </BaseButton>
              <BaseButton
                variant="ghost"
                @click="router.push('/auth/login')"
              >
                Volver al inicio de sesión
              </BaseButton>
            </div>
          </div>

          <!-- Success state -->
          <div v-else-if="isResetSuccessful" class="reset-password-page__success-state">
            <CheckCircleIcon class="reset-password-page__success-state-icon" />
            <h1 class="reset-password-page__success-state-title">¡Contraseña restablecida!</h1>
            <p class="reset-password-page__success-state-message">
              Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <BaseButton
              variant="primary"
              class="reset-password-page__success-state-button"
              @click="router.push('/auth/login')"
            >
              Iniciar sesión
            </BaseButton>
          </div>

          <!-- Reset form -->
          <div v-else class="reset-password-form-section">
            <div class="reset-card">
              <!-- Form Header -->
              <div class="reset-header">
                <div class="reset-icon">
                  <ShieldIcon class="icon" />
                </div>
                <h1 class="reset-title">Reset your password</h1>
                <p class="reset-subtitle">
                  Create a new, secure password. We recommend using a combination of letters, numbers, and symbols.
                </p>
              </div>

              <form class="reset-form" @submit.prevent="handleSubmit">
                <!-- Password Input with PasswordStrengthIndicator -->
                <div class="form-field">
                  <label for="password" class="field-label">
                    <ShieldIcon class="label-icon" />
                    New password
                    <span class="field-required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <input
                      id="password"
                      v-model="password"
                      class="password-input"
                      :class="{ 
                        'input-error': passwordError, 
                        'input-success': password && passwordStrength.level === 'strong' 
                      }"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Minimum 8 characters with uppercase and numbers"
                      :disabled="isLoading"
                      :aria-invalid="!!passwordError"
                      :aria-describedby="passwordError ? 'password-error' : 'password-help'"
                      required
                      autocomplete="new-password"
                      @blur="validatePassword"
                      @input="updatePasswordStrength"
                    />
                    <button 
                      type="button" 
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                      class="password-toggle" 
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                  </div>
                  
                  <!-- Use PasswordStrengthIndicator component -->
                  <PasswordStrengthIndicator
                    v-if="password"
                    :password="password"
                    :show-requirements="true"
                  />

                  <div v-if="passwordError" id="password-error" class="field-error" role="alert">
                    <ExclamationCircleIcon class="error-icon" />
                    {{ passwordError }}
                  </div>
                  <div v-else id="password-help" class="field-help">
                    <ShieldIcon class="help-icon" />
                    Use at least 8 characters with uppercase, numbers and symbols
                  </div>
                </div>

                <!-- Confirm Password Input -->
                <div class="form-field">
                  <label for="confirm-password" class="field-label">
                    <ShieldIcon class="label-icon" />
                    Confirm password
                    <span class="field-required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <input
                      id="confirm-password"
                      v-model="confirmPassword"
                      class="password-input"
                      :class="{ 
                        'input-error': confirmPasswordError, 
                        'input-success': confirmPassword && !confirmPasswordError && password 
                      }"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Repeat the previous password"
                      :disabled="isLoading"
                      :aria-invalid="!!confirmPasswordError"
                      :aria-describedby="confirmPasswordError ? 'confirm-password-error' : 'confirm-password-help'"
                      required
                      autocomplete="new-password"
                      @blur="validateConfirmPassword"
                    />
                    <button 
                      type="button" 
                      class="password-toggle" 
                      :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                  </div>
                  <div v-if="confirmPasswordError" id="confirm-password-error" class="field-error" role="alert">
                    <ExclamationCircleIcon class="error-icon" />
                    {{ confirmPasswordError }}
                  </div>
                  <div v-else id="confirm-password-help" class="field-help">
                    <CheckCircleIcon v-if="confirmPassword && !confirmPasswordError && password" class="help-icon success" />
                    <span v-if="confirmPassword && !confirmPasswordError && password">Passwords match</span>
                    <span v-else>Must match the previous password</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <BaseButton
                  type="submit"
                  variant="primary"
                  size="large"
                  :loading="isLoading"
                  :disabled="isLoading || !isFormValid"
                  class="submit-button"
                >
                  <template #icon>
                    <ShieldIcon v-if="!isLoading" />
                  </template>
                  Reset password
                </BaseButton>
              </form>

              <!-- Error Status -->
              <div v-if="submitError" class="form-error" role="alert">
                <ExclamationCircleIcon class="error-icon" />
                {{ submitError }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator/PasswordStrengthIndicator.vue'
import BaseButton from '@/ui/BaseButton/BaseButton.vue'
import ExclamationCircleIcon from '@/components/icons/ExclamationCircleIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'

// Composables
const router = useRouter()
const route = useRoute()

// Local state
const isValidating = ref(true)
const tokenError = ref<string | null>(null)
const isResetSuccessful = ref(false)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const submitError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const confirmPasswordError = ref<string | null>(null)

// Extract token from URL
const resetToken = ref<string | null>(null)

// Enhanced password strength calculation
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return { level: 'weak', percentage: 0, text: 'Weak' }

  let score = 0
  let feedback: string[] = []
  
  // Length checks
  if (pwd.length >= 8) {
    score += 1
  } else {
    feedback.push('Need at least 8 characters')
  }
  
  if (pwd.length >= 12) {
    score += 1
  }
  
  // Character variety
  if (/[a-z]/.test(pwd)) {
    score += 1
  } else {
    feedback.push('Add a lowercase letter')
  }
  
  if (/[A-Z]/.test(pwd)) {
    score += 1
  } else {
    feedback.push('Add an uppercase letter')
  }
  
  if (/\d/.test(pwd)) {
    score += 1
  } else {
    feedback.push('Add a number')
  }
  
  if (/[^a-zA-Z\d]/.test(pwd)) {
    score += 1
  }

  // Pattern checks for common weak passwords
  if (/^\d+$/.test(pwd) || /^[a-zA-Z]+$/.test(pwd)) {
    score = Math.max(0, score - 1)
    feedback.push('Combine letters, numbers and symbols')
  }

  if (score < 3) {
    return { level: 'weak', percentage: 25, text: 'Weak', feedback }
  } else if (score < 4) {
    return { level: 'fair', percentage: 50, text: 'Fair', feedback }
  } else if (score < 6) {
    return { level: 'good', percentage: 75, text: 'Good', feedback }
  } else {
    return { level: 'strong', percentage: 100, text: 'Strong', feedback: [] }
  }
})

// Form validation
const isFormValid = computed((): boolean => {
  return (
    !passwordError.value &&
    !confirmPasswordError.value &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    passwordStrength.value.level !== 'weak' &&
    password.value === confirmPassword.value
  )
})

// Methods
const validateToken = async (): Promise<void> => {
  try {
    // Extract token from URL query parameters
    const token = route.query.token as string
    const email = route.query.email as string

    if (!token || !email) {
      tokenError.value = 'Missing token or email parameter'
      return
    }

    resetToken.value = token

    // Simulate API call to validate token
    // In real implementation, this would call:
    // await fetch('/v1/auth/password-recovery/validate', { ... })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes, assume token is valid if it exists
    // In real implementation, the backend would validate the token
    
  } catch (err) {
    tokenError.value = err instanceof Error ? err.message : 'Invalid or expired token'
  } finally {
    isValidating.value = false
  }
}

const updatePasswordStrength = (): void => {
  // This will trigger the computed property to recalculate
  // Also validate in real-time
  if (password.value && passwordStrength.value.level === 'weak') {
    const feedback = passwordStrength.value.feedback
    if (feedback && feedback.length > 0) {
      passwordError.value = feedback[0]
    }
  } else {
    passwordError.value = null
  }
  
  // Also revalidate confirm password if it has a value
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
}

const validatePassword = (): void => {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else if (passwordStrength.value.level === 'weak') {
    const feedback = passwordStrength.value.feedback
    passwordError.value = feedback && feedback.length > 0 ? feedback[0] : 'Password is too weak'
  } else {
    passwordError.value = null
  }
}

const validateConfirmPassword = (): void => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'You must confirm your password'
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = null
  }
}

const handleSubmit = async (): Promise<void> => {
  try {
    // Clear previous errors
    submitError.value = null

    // Validate form
    validatePassword()
    validateConfirmPassword()
    
    if (!isFormValid.value) return

    isLoading.value = true

    // Simulate API call to reset password
    // In real implementation, this would call:
    // await fetch('/v1/auth/password-recovery/reset', { 
    //   method: 'POST',
    //   body: JSON.stringify({
    //     token: resetToken.value,
    //     password: password.value
    //   })
    // })
    
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mark as successful
    isResetSuccessful.value = true

  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted((): void => {
  validateToken()
})

// SEO and Meta
document.title = 'Reset Password - Vana Calendar'
</script>

<style src="./ResetPasswordPage.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
// Empty - all styles are in the external SCSS file
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #eef2ff 100%);

  @include flex-column;

  padding: 40px 20px;

  &__container {
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
    padding: $spacing-lg;

    @include mobile-only {
      padding: $spacing-md;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  &__back-link {
    display: inline-block;
    text-decoration: none;
    transition: transform $transition-duration-base;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__logo {
    height: 3rem;
    width: auto;
  }

  &__content {
    @include flex-column;

    align-items: center;
  }

  &__form-container {
    width: 100%;

    @include card-base;

    padding: $spacing-xl;

    @include mobile-only {
      padding: $spacing-lg;
    }
  }

  // Loading state

  &__loading {
    @include flex-column-center;

    gap: $spacing-md;
    padding: $spacing-xl;
  }

  &__loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid $border-secondary;
    border-top: 2px solid $interactive-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__loading-text {
    font-size: $font-size-base;
    color: $text-secondary;
    margin: 0;
  }

  // Error state

  &__error-state {
    @include flex-column-center;

    gap: $spacing-md;
    text-align: center;
  }

  &__error-state-icon {
    width: 3rem;
    height: 3rem;
    color: $error-primary;
  }

  &__error-state-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }

  &__error-state-message {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
  }

  &__error-state-actions {
    @include flex-column;

    gap: $spacing-sm;
    width: 100%;
  }

  // Success state

  &__success-state {
    @include flex-column-center;

    gap: $spacing-md;
    text-align: center;
  }

  &__success-state-icon {
    width: 3rem;
    height: 3rem;
    color: $success-primary;
  }

  &__success-state-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }

  &__success-state-message {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
  }

  &__success-state-button {
    width: 100%;
    justify-content: center;
  }

  // Form section

  &__form-section {
    width: 100%;
  }

  &__form-header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin-bottom: $spacing-sm;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.5;
  }

  &__form {
    @include flex-column;

    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }

  &__field {
    @include flex-column;

    gap: $spacing-xs;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $text-primary;
  }

  &__input {
    width: 100%;
  }

  &__field-error {
    font-size: $font-size-sm;
    color: $error-primary;
    margin: 0;
  }

  &__password-strength {
    margin-top: $spacing-xs;
  }

  &__strength-bar {
    width: 100%;
    height: 4px;
    background-color: $neutral-light;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: $spacing-xs;
  }

  &__strength-fill {
    height: 100%;
    transition: width $transition-duration-base, background-color $transition-duration-base;

    &--weak {
      background-color: $error-primary;
    }

    &--medium {
      background-color: $warning-primary;
    }

    &--strong {
      background-color: $interactive-primary;
    }

    &--very-strong {
      background-color: $success-primary;
    }
  }

  &__strength-text {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin: 0;
  }

  &__submit-button {
    width: 100%;
    justify-content: center;
  }

  &__error {
    @include flex-start;

    gap: $spacing-sm;
    padding: $spacing-md;
    background-color: rgba($error-primary, 8%);
    border: 1px solid rgba($error-primary, 20%);
    border-radius: $radius-md;
    margin-top: $spacing-md;
  }

  &__error-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: $error-primary;
    flex-shrink: 0;
  }

  &__error-message {
    font-size: $font-size-sm;
    color: $error-primary;
    margin: 0;
  }

// Password Toggle Button

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  font-size: 16px;
  
  &:hover {
    color: #6366f1;
  }
  
  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

// Form Sections

.reset-password-form-section {
  width: 100%;
}

.reset-password-form {
  margin-bottom: 24px;
}

@keyframes spin {

  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>