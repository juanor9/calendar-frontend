<script setup lang="ts">
  import { ref, computed } from 'vue'

  // Component props interface
  interface Props {
    loading?: boolean
    title?: string
    subtitle?: string
    emailPlaceholder?: string
    buttonText?: string
    backText?: string
    showBackButton?: boolean
  }

  // Component emits interface
  interface Emits {
    submit: [email: string]
    back: []
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    title: 'Reset your password',
    subtitle: "Enter your email address and we'll send you a link to reset your password.",
    emailPlaceholder: 'Enter your email address',
    buttonText: 'Send reset link',
    backText: 'Back to login',
    showBackButton: true,
  })

  // Emits definition
  const emit = defineEmits<Emits>()

  // Component state
  const email = ref<string>('')
  const emailError = ref<string>('')
  const isSubmitted = ref<boolean>(false)

  // Computed properties
  const isEmailValid = computed((): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })

  const isFormValid = computed((): boolean => {
    return email.value.length > 0 && isEmailValid.value
  })

  const buttonClasses = computed(() => {
    return [
      'password-recovery-card__button',
      {
        'password-recovery-card__button--disabled': !isFormValid.value || props.loading,
        'password-recovery-card__button--loading': props.loading,
      },
    ]
  })

  // Event handlers
  const handleSubmit = (): void => {
    if (!isFormValid.value || props.loading) {
      return
    }

    // Clear previous error
    emailError.value = ''

    // Validate email format
    if (!isEmailValid.value) {
      emailError.value = 'Please enter a valid email address'
      return
    }

    isSubmitted.value = true
    emit('submit', email.value)
  }

  const handleBack = (): void => {
    emit('back')
  }

  const handleEmailInput = (): void => {
    // Clear error when user starts typing
    if (emailError.value) {
      emailError.value = ''
    }
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }
</script>

<template>
  <div class="password-recovery-card">
    <div class="password-recovery-card__header">
      <h1 class="password-recovery-card__title">
        {{ props.title }}
      </h1>
      <p class="password-recovery-card__subtitle">
        {{ props.subtitle }}
      </p>
    </div>

    <form class="password-recovery-card__form" @submit.prevent="handleSubmit">
      <div class="password-recovery-card__field">
        <label for="recovery-email" class="password-recovery-card__label"> Email address </label>

        <input
          id="recovery-email"
          v-model="email"
          type="email"
          class="password-recovery-card__input"
          :class="{
            'password-recovery-card__input--error': emailError,
            'password-recovery-card__input--success': isSubmitted && isEmailValid,
          }"
          :placeholder="props.emailPlaceholder"
          :disabled="props.loading"
          :aria-describedby="emailError ? 'email-error' : undefined"
          :aria-invalid="!!emailError"
          autocomplete="email"
          @input="handleEmailInput"
          @keydown="handleKeydown"
        />

        <div
          v-if="emailError"
          id="email-error"
          class="password-recovery-card__error"
          role="alert"
          aria-live="polite"
        >
          {{ emailError }}
        </div>
      </div>

      <button
        type="submit"
        :class="buttonClasses"
        :disabled="!isFormValid || props.loading"
        :aria-busy="props.loading"
      >
        <span v-if="!props.loading">
          {{ props.buttonText }}
        </span>
        <span v-else class="password-recovery-card__loading-text"> Sending... </span>

        <div v-if="props.loading" class="password-recovery-card__spinner" aria-hidden="true" />
      </button>
    </form>

    <div v-if="props.showBackButton" class="password-recovery-card__footer">
      <button
        type="button"
        class="password-recovery-card__back-button"
        :disabled="props.loading"
        @click="handleBack"
      >
        {{ props.backText }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./PasswordRecoveryCard.scss"></style>
