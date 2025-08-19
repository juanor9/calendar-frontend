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
            <h1 class="reset-password-page__error-state-title">Enlace inválido</h1>
            <p class="reset-password-page__error-state-message">
              Este enlace para restablecer contraseña ha expirado o no es válido.
              Solicita un nuevo enlace de restablecimiento.
            </p>
            <BaseButton 
              variant="primary" 
              @click="handleBackToForgotPassword"
            >
              Solicitar nuevo enlace
            </BaseButton>
          </div>

          <!-- Success state -->
          <div v-else-if="resetComplete" class="reset-password-page__success-state">
            <CheckCircleIcon class="reset-password-page__success-state-icon" />
            <h1 class="reset-password-page__success-state-title">¡Contraseña cambiada!</h1>
            <p class="reset-password-page__success-state-message">
              Tu contraseña ha sido actualizada exitosamente. 
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <BaseButton 
              variant="primary" 
              @click="handleBackToLogin"
            >
              Ir a iniciar sesión
            </BaseButton>
          </div>

          <!-- Reset form -->
          <form v-else class="reset-password-page__form" @submit.prevent="handleSubmit">
            <div class="reset-password-page__form-header">
              <h1 class="reset-password-page__title">Nueva contraseña</h1>
              <p class="reset-password-page__subtitle">
                Crea una contraseña segura para tu cuenta
              </p>
            </div>

            <!-- Password field -->
            <div class="reset-password-page__field">
              <label for="password" class="reset-password-page__label">
                Nueva contraseña
              </label>
              <div class="reset-password-page__password-field">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :class="['reset-password-page__input', { 'error': passwordError }]"
                  :aria-describedby="passwordError ? 'password-error' : 'password-help'"
                  autocomplete="new-password"
                  @input="handlePasswordChange"
                />
                <button 
                  type="button" 
                  class="password-toggle" 
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <PasswordStrengthIndicator 
                :password="password" 
                :compact="false"
                class="reset-password-page__strength-indicator"
              />
            </div>

            <!-- Confirm password field -->
            <div class="reset-password-page__field">
              <label for="confirmPassword" class="reset-password-page__label">
                Confirmar contraseña
              </label>
              <div class="reset-password-page__password-field">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  :class="['reset-password-page__input', { 'error': confirmPasswordError }]"
                  :aria-describedby="confirmPasswordError ? 'confirm-password-error' : 'confirm-password-help'"
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

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="large"
              :disabled="!canSubmit || isSubmitting"
              :loading="isSubmitting"
              class="reset-password-page__submit-button"
            >
              {{ isSubmitting ? 'Actualizando...' : 'Cambiar contraseña' }}
            </BaseButton>

            <!-- Error message -->
            <div v-if="submitError" class="reset-password-page__error-message" role="alert">
              <ExclamationCircleIcon class="error-icon" />
              {{ submitError }}
            </div>
          </form>

          <!-- Back to login link -->
          <div class="reset-password-page__back-to-login">
            <router-link to="/auth/login">
              ¿Recordaste tu contraseña? Iniciar sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PasswordStrengthIndicator from '@/features/authentication/components/PasswordStrengthIndicator/PasswordStrengthIndicator.vue'
import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'
import ExclamationCircleIcon from '@/shared/icons/ExclamationCircleIcon.vue'
import CheckCircleIcon from '@/shared/icons/CheckCircleIcon.vue'

// Router and composables
const router = useRouter()
const route = useRoute()
// const { /* auth methods if needed */ } = useAuth() // Commented out to avoid empty destructuring

// Component state
const isValidating = ref(true)
const tokenError = ref('')
const resetComplete = ref(false)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const confirmPasswordError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

// Computed properties
const canSubmit = computed((): boolean => {
  return !!(
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

// Methods
const validateToken = async (): Promise<void> => {
  try {
    isValidating.value = true
    tokenError.value = ''

    const token = route.query.token as string
    if (!token) {
      tokenError.value = 'Token no encontrado'
      return
    }

    // Validate token with backend
    // const isValid = await validateResetToken(token)
    // if (!isValid) {
    //   tokenError.value = 'Token inválido o expirado'
    // }
    
    // Mock validation - always valid for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    tokenError.value = 'Error al validar el token'
    console.error('Token validation error:', error)
  } finally {
    isValidating.value = false
  }
}

const handlePasswordChange = (): void => {
  passwordError.value = ''
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = (): void => {
  confirmPasswordError.value = ''
  
  if (!confirmPassword.value) return
  
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Las contraseñas no coinciden'
  }
}

const handleSubmit = async (): Promise<void> => {
  if (!canSubmit.value) return

  try {
    isSubmitting.value = true
    submitError.value = ''

    const token = route.query.token as string
    console.log('Reset password token:', token) // Use token to avoid unused var warning
    
    // Submit password reset
    // await resetPassword({ token, password: password.value })
    
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    resetComplete.value = true
    
  } catch (error) {
    submitError.value = 'Error al cambiar la contraseña. Inténtalo nuevamente.'
    console.error('Password reset error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleBackToForgotPassword = (): void => {
  router.push('/auth/forgot-password')
}

const handleBackToLogin = (): void => {
  router.push('/auth/login')
}

// Lifecycle
onMounted(async () => {
  await validateToken()
})

onUnmounted(() => {
  // Cleanup if needed
})

// SEO and Meta
document.title = 'Reset Password - Vana Calendar'
</script>

<style src="./ResetPasswordPage.scss" lang="scss" scoped></style>