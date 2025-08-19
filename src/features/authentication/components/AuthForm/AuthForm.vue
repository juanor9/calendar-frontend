<template>
  <div class="auth-form">
    <!-- Form header -->
    <div class="auth-form__header">
      <h1 class="auth-form__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth-form__subtitle">{{ subtitle }}</p>
    </div>

    <!-- Trust signals -->
    <div v-if="showTrustSignals" class="auth-form__trust-signals">
      <div class="auth-form__trust-item">
        <ShieldIcon class="auth-form__trust-icon" />
        <span>Protegido con cifrado de grado militar</span>
      </div>
      <div class="auth-form__trust-item">
        <LockIcon class="auth-form__trust-icon" />
        <span>Tu privacidad es nuestra prioridad</span>
      </div>
    </div>

    <!-- Loading skeleton -->
    <LoadingSkeleton v-if="isLoading && showLoadingSkeleton" variant="form" :fields="3" />

    <!-- Form content -->
    <form v-else class="auth-form__form" novalidate @submit.prevent="handleSubmit">
      <!-- Email field -->
      <EmailField
        v-if="showEmailField"
        v-model="formData.email"
        :label="emailLabel"
        :placeholder="emailPlaceholder"
        :required="emailRequired"
        :disabled="isSubmitting"
        :validating="validatingEmail"
        @suggestion="handleEmailSuggestion"
      />

      <!-- Email suggestion -->
      <div v-if="emailSuggestion" class="auth-form__suggestion" role="alert">
        <ExclamationTriangleIcon class="auth-form__suggestion-icon" />
        <span>¿Quisiste decir </span>
        <button type="button" class="auth-form__suggestion-link" @click="acceptEmailSuggestion">
          {{ emailSuggestion }}
        </button>
        <span>?</span>
        <button
          type="button"
          class="auth-form__suggestion-close"
          aria-label="Cerrar sugerencia"
          @click="dismissEmailSuggestion"
        >
          ×
        </button>
      </div>

      <!-- Password field -->
      <FormField
        v-if="showPasswordField"
        v-model="formData.password"
        name="password"
        type="password"
        :label="passwordLabel"
        :placeholder="passwordPlaceholder"
        :required="passwordRequired"
        :disabled="isSubmitting"
        autocomplete="current-password"
      />

      <!-- Password strength indicator -->
      <PasswordStrengthIndicator
        v-if="showPasswordStrength && formData.password"
        :password="formData.password"
        :compact="compactPasswordStrength"
        class="auth-form__password-strength"
      />

      <!-- Confirm password field -->
      <FormField
        v-if="showConfirmPasswordField"
        v-model="formData.confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="Confirma tu contraseña"
        :required="true"
        :disabled="isSubmitting"
        autocomplete="new-password"
      />

      <!-- Additional fields slot -->
      <slot name="additional-fields" />

      <!-- Terms and privacy -->
      <div v-if="showTermsAcceptance" class="auth-form__terms">
        <label class="auth-form__checkbox-label">
          <input
            v-model="formData.acceptTerms"
            type="checkbox"
            class="auth-form__checkbox"
            :disabled="isSubmitting"
            required
          />
          <span class="auth-form__checkbox-text">
            Acepto los
            <a href="/terms" target="_blank" class="auth-form__link">términos de servicio</a>
            y la
            <a href="/privacy" target="_blank" class="auth-form__link">política de privacidad</a>
          </span>
        </label>
      </div>

      <!-- Form actions -->
      <div class="auth-form__actions">
        <!-- Primary submit button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="large"
          :loading="isSubmitting"
          :disabled="!canSubmitForm"
          class="auth-form__submit-button"
        >
          {{ submitButtonText }}
        </BaseButton>

        <!-- Secondary actions -->
        <div v-if="showSecondaryActions" class="auth-form__secondary-actions">
          <slot name="secondary-actions" />
        </div>
      </div>

      <!-- Form footer -->
      <div v-if="showFormFooter" class="auth-form__footer">
        <slot name="footer" />
      </div>
    </form>

    <!-- Social login options -->
    <div v-if="showSocialLogin" class="auth-form__social">
      <div class="auth-form__divider">
        <span class="auth-form__divider-text">o continúa con</span>
      </div>

      <div class="auth-form__social-buttons">
        <BaseButton
          v-for="provider in socialProviders"
          :key="provider.name"
          variant="outline"
          :loading="provider.loading"
          :disabled="isSubmitting"
          class="auth-form__social-button"
          @click="handleSocialLogin(provider.name)"
        >
          <component :is="provider.icon" class="auth-form__social-icon" />
          {{ provider.label }}
        </BaseButton>
      </div>
    </div>

    <!-- Error display -->
    <div v-if="formErrors.length > 0" class="auth-form__errors" role="alert" aria-live="polite">
      <div v-for="error in formErrors" :key="error.code" class="auth-form__error">
        <ExclamationCircleIcon class="auth-form__error-icon" />
        <span>{{ error.message }}</span>
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="auth-form__success" role="alert" aria-live="polite">
      <CheckCircleIcon class="auth-form__success-icon" />
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
  } from '@heroicons/vue/24/outline'
  import ShieldIcon from '@/shared/icons/ShieldIcon.vue'
  import LockIcon from '@/shared/icons/LockIcon.vue'
  import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'
  import FormField from '@/features/authentication/components/FormValidation/FormField.vue'
  import EmailField from '@/features/authentication/components/FormValidation/EmailField.vue'
  import PasswordStrengthIndicator from '@/features/authentication/components/PasswordStrengthIndicator/PasswordStrengthIndicator.vue'
  import LoadingSkeleton from '@/shared/ui/LoadingSkeleton/LoadingSkeleton.vue'
  import { useFormValidation } from '@/shared/composables/useFormValidation'

  interface SocialProvider {
    name: string
    label: string
    icon: unknown
    loading: boolean
  }

  interface Props {
    title: string
    subtitle?: string
    submitButtonText?: string
    // Field visibility
    showEmailField?: boolean
    showPasswordField?: boolean
    showConfirmPasswordField?: boolean
    showPasswordStrength?: boolean
    compactPasswordStrength?: boolean
    showTermsAcceptance?: boolean
    showSocialLogin?: boolean
    showTrustSignals?: boolean
    showLoadingSkeleton?: boolean
    showSecondaryActions?: boolean
    showFormFooter?: boolean
    // Field labels
    emailLabel?: string
    emailPlaceholder?: string
    passwordLabel?: string
    passwordPlaceholder?: string
    // Field requirements
    emailRequired?: boolean
    passwordRequired?: boolean
    // State
    isLoading?: boolean
    isSubmitting?: boolean
    successMessage?: string
    // Social providers
    socialProviders?: SocialProvider[]
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    submitButtonText: 'Continuar',
    showEmailField: true,
    showPasswordField: true,
    showConfirmPasswordField: false,
    showPasswordStrength: true,
    compactPasswordStrength: false,
    showTermsAcceptance: false,
    showSocialLogin: false,
    showTrustSignals: true,
    showLoadingSkeleton: true,
    showSecondaryActions: true,
    showFormFooter: true,
    emailLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña segura',
    emailRequired: true,
    passwordRequired: true,
    isLoading: false,
    isSubmitting: false,
    successMessage: undefined,
    socialProviders: () => [],
  })

  const emit = defineEmits<{
    submit: [formData: Record<string, unknown>]
    socialLogin: [provider: string]
  }>()

  // Form validation composable
  const {
    registerField,
    commonRules,
    validateAllFields,
    setSubmitting,
    setSubmitAttempted,
    canSubmit,
    formErrors,
  } = useFormValidation()

  // Form data
  const formData = ref({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  // Email suggestion state
  const emailSuggestion = ref('')
  const validatingEmail = ref(false)

  // Register form fields on mount
  onMounted(() => {
    if (props.showEmailField) {
      const emailRules = []
      if (props.emailRequired) {
        emailRules.push(commonRules.required('Email es obligatorio'))
      }
      emailRules.push(commonRules.email('Ingresa un email válido'))
      registerField('email', emailRules)
    }

    if (props.showPasswordField) {
      const passwordRules = []
      if (props.passwordRequired) {
        passwordRules.push(commonRules.required('Contraseña es obligatoria'))
      }
      if (props.showPasswordStrength) {
        passwordRules.push(commonRules.passwordStrength('fair'))
      }
      registerField('password', passwordRules)
    }

    if (props.showConfirmPasswordField) {
      registerField('confirmPassword', [
        commonRules.required('Confirma tu contraseña'),
        commonRules.confirmPassword('password'),
      ])
    }
  })

  // Computed properties with explicit return types
  const canSubmitForm = computed((): boolean => {
    let basicValidation = canSubmit.value

    if (props.showTermsAcceptance) {
      basicValidation = basicValidation && formData.value.acceptTerms
    }

    return basicValidation && !props.isSubmitting
  })

  // Form submission
  const handleSubmit = async (): Promise<void> => {
    setSubmitAttempted(true)

    const validationResult = validateAllFields()
    if (!validationResult.isValid) {
      return
    }

    if (props.showTermsAcceptance && !formData.value.acceptTerms) {
      // Show terms acceptance error
      return
    }

    setSubmitting(true)

    try {
      emit('submit', { ...formData.value })
    } finally {
      setSubmitting(false)
    }
  }

  // Social login handler
  const handleSocialLogin = (provider: string): void => {
    emit('socialLogin', provider)
  }

  // Email suggestion handlers
  const handleEmailSuggestion = (suggestion: string): void => {
    emailSuggestion.value = suggestion
  }

  const acceptEmailSuggestion = (): void => {
    formData.value.email = emailSuggestion.value
    emailSuggestion.value = ''
  }

  const dismissEmailSuggestion = (): void => {
    emailSuggestion.value = ''
  }

  // Watch for prop changes
  watch(
    () => props.isSubmitting,
    newValue => {
      setSubmitting(newValue)
    }
  )
</script>

<style lang="scss" src="./AuthForm.scss" scoped />
