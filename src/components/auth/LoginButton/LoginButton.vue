<template>
  <BaseButton
    :variant="variant"
    :size="size"
    :disabled="isLoading"
    :loading="isLoading"
    :class="[
      'login-button',
      {
        'login-button--loading': isLoading,
        'login-button--error': hasError,
      },
    ]"
    @click="handleLogin"
  >
    <template #icon>
      <component
        :is="iconComponent"
        :class="['login-button__icon', { 'animate-spin': isLoading }]"
      />
    </template>

    <template #default>
      {{ buttonText }}
    </template>
  </BaseButton>

  <!-- Error message -->
  <div v-if="hasError && showError" class="login-button__error" role="alert" aria-live="polite">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ArrowRightOnRectangleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
  import BaseButton from '@/ui/BaseButton/BaseButton.vue'
  import { useAuth } from '@/composables/useAuth'
  import type { LoginOptions } from '@/auth/types'

  // Props
  export interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'small' | 'medium' | 'large'
    text?: string
    redirectUri?: string
    appState?: Record<string, unknown>
    showError?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'medium',
    text: 'Iniciar Sesión',
    redirectUri: undefined,
    appState: undefined,
    showError: true,
  })

  // Emits
  export interface Emits {
    loginStart: []
    loginSuccess: []
    loginError: [error: Error]
  }

  const emit = defineEmits<Emits>()

  // Auth composable
  const { loginWithRedirect, isLoading, error } = useAuth()

  // Local state
  const localLoading = ref(false)

  // Computed
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value?.message || 'Error al iniciar sesión')
  const isLoadingState = computed(() => isLoading.value || localLoading.value)

  const buttonText = computed(() => {
    if (isLoadingState.value) {
      return 'Iniciando sesión...'
    }
    return props.text
  })

  const iconComponent = computed(() => {
    if (hasError.value) {
      return ExclamationTriangleIcon
    }
    return ArrowRightOnRectangleIcon
  })

  // Methods
  const handleLogin = async () => {
    try {
      localLoading.value = true
      emit('loginStart')

      const options: LoginOptions = {}

      if (props.redirectUri) {
        options.redirect_uri = props.redirectUri
      }

      if (props.appState) {
        options.appState = props.appState
      }

      await loginWithRedirect(options)
      emit('loginSuccess')
    } catch (err) {
      console.error('Login failed:', err)
      const error = err instanceof Error ? err : new Error('Login failed')
      emit('loginError', error)
    } finally {
      localLoading.value = false
    }
  }
</script>

<style lang="scss" src="./LoginButton.scss" scoped />
