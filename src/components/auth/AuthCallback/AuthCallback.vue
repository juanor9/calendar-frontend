<template>
  <div class="auth-callback">
    <div class="auth-callback__container">
      <!-- Loading state -->
      <div v-if="isLoading" class="auth-callback__loading">
        <div class="auth-callback__spinner" />
        <h2 class="auth-callback__title">Procesando autenticación...</h2>
        <p class="auth-callback__message">
          Por favor espera mientras completamos tu inicio de sesión.
        </p>
      </div>

      <!-- Success state -->
      <div v-else-if="isSuccess" class="auth-callback__success">
        <div class="auth-callback__success-icon">
          <CheckCircleIcon />
        </div>
        <h2 class="auth-callback__title">¡Autenticación exitosa!</h2>
        <p class="auth-callback__message">Redirigiendo a tu calendario...</p>
        <div class="auth-callback__progress">
          <div class="auth-callback__progress-bar" />
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="auth-callback__error">
        <div class="auth-callback__error-icon">
          <ExclamationCircleIcon />
        </div>
        <h2 class="auth-callback__title">Error de autenticación</h2>
        <p class="auth-callback__message">
          {{ errorMessage }}
        </p>

        <!-- Error details (dev mode) -->
        <details v-if="showErrorDetails" class="auth-callback__error-details">
          <summary>Detalles técnicos</summary>
          <pre class="auth-callback__error-code">{{ errorDetails }}</pre>
        </details>

        <!-- Action buttons -->
        <div class="auth-callback__actions">
          <BaseButton variant="primary" :loading="isRetrying" @click="retryAuth">
            Intentar nuevamente
          </BaseButton>

          <BaseButton variant="outline" @click="goToLogin"> Volver al inicio de sesión </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
  import BaseButton from '@/ui/BaseButton/BaseButton.vue'
  import { useAuth } from '@/auth/auth-composable'

  // Router
  const router = useRouter()
  const route = useRoute()

  // Auth composable
  const { handleRedirectCallback, isAuthenticated, user } = useAuth()

  // Local state
  const isLoading = ref(true)
  const isSuccess = ref(false)
  const isRetrying = ref(false)
  const error = ref<Error | null>(null)

  // Computed
  const errorMessage = computed(() => {
    if (!error.value) return ''

    // Common Auth0 errors with user-friendly messages
    const errorMap: Record<string, string> = {
      access_denied: 'Acceso denegado. Es posible que hayas cancelado el inicio de sesión.',
      unauthorized: 'No autorizado. Verifica tus credenciales.',
      server_error: 'Error del servidor. Por favor intenta más tarde.',
      temporarily_unavailable: 'Servicio temporalmente no disponible.',
      invalid_request: 'Solicitud inválida. Por favor intenta nuevamente.',
      unsupported_response_type: 'Tipo de respuesta no soportado.',
      invalid_scope: 'Alcance inválido.',
      login_required: 'Inicio de sesión requerido.',
    }

    const errorCode = error.value.message.toLowerCase()
    const friendlyMessage = errorMap[errorCode]

    if (friendlyMessage) {
      return friendlyMessage
    }

    return 'Ocurrió un error durante la autenticación. Por favor intenta nuevamente.'
  })

  const errorDetails = computed(() => {
    if (!error.value) return ''

    return JSON.stringify(
      {
        message: error.value.message,
        name: error.value.name,
        stack: error.value.stack,
        route: route.fullPath,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  })

  const showErrorDetails = computed(() => {
    return import.meta.env.DEV
  })

  // Methods
  const processCallback = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Handle the Auth0 callback
      const result = await handleRedirectCallback()

      if (isAuthenticated.value && user.value) {
        isSuccess.value = true

        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          redirectToIntendedDestination(result)
        }, 1500)
      } else {
        throw new Error('Authentication failed - no user returned')
      }
    } catch (err) {
      console.error('Auth callback error:', err)
      error.value = err instanceof Error ? err : new Error('Unknown error occurred')
      isSuccess.value = false
    } finally {
      isLoading.value = false
    }
  }

  const redirectToIntendedDestination = (result?: {
    appState?: Record<string, unknown> | undefined
  }) => {
    try {
      // Try to get redirect URL from multiple sources
      let redirectUrl = '/'

      // 1. From callback result app state
      if (
        result?.appState &&
        typeof result.appState === 'object' &&
        'targetUrl' in result.appState
      ) {
        redirectUrl = result.appState.targetUrl as string
      }
      // 2. From query parameters
      else if (route.query.redirect && typeof route.query.redirect === 'string') {
        redirectUrl = decodeURIComponent(route.query.redirect)
      }
      // 3. From stored state in localStorage
      else {
        const storedRedirect = localStorage.getItem('vana_auth_redirect')
        if (storedRedirect) {
          redirectUrl = storedRedirect
          localStorage.removeItem('vana_auth_redirect')
        }
      }

      // Validate redirect URL (security check)
      if (redirectUrl && !redirectUrl.startsWith('/')) {
        console.warn('Invalid redirect URL, using default:', redirectUrl)
        redirectUrl = '/'
      }

      // Navigate to the intended destination
      router.push(redirectUrl)
    } catch (err) {
      console.error('Redirect error:', err)
      router.push('/')
    }
  }

  const retryAuth = async () => {
    isRetrying.value = true
    try {
      await processCallback()
    } finally {
      isRetrying.value = false
    }
  }

  const goToLogin = () => {
    router.push({
      name: 'Login',
      query: {
        reason: 'callback_error',
      },
    })
  }

  // Lifecycle
  onMounted(() => {
    // Clear any existing errors
    error.value = null

    // Process the authentication callback
    processCallback()
  })

  // Handle page visibility change (user switching tabs during auth)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && isLoading.value) {
      // If user comes back and we're still loading, retry
      setTimeout(retryAuth, 1000)
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
</script>

<style lang="scss" src="./AuthCallback.scss" scoped />
