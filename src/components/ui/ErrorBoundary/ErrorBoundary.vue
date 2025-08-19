<template>
  <div class="error-boundary">
    <!-- Error state -->
    <div v-if="errorState.hasError" class="error-boundary__error">
      <div class="error-boundary__container">
        <!-- Error icon -->
        <div class="error-boundary__icon">
          <ExclamationTriangleIcon />
        </div>

        <!-- Error content -->
        <div class="error-boundary__content">
          <h2 class="error-boundary__title">
            {{ trustBuildingMessage.title }}
          </h2>
          
          <p class="error-boundary__message">
            {{ trustBuildingMessage.message }}
          </p>

          <!-- Trust signal -->
          <div v-if="trustBuildingMessage.trustSignal" class="error-boundary__trust-signal">
            <ShieldIcon class="error-boundary__shield-icon" />
            <span>{{ trustBuildingMessage.trustSignal }}</span>
          </div>

          <!-- Recovery actions -->
          <div class="error-boundary__actions">
            <BaseButton
              v-if="canRetry"
              variant="primary"
              :loading="errorState.isRecovering"
              @click="handleRetry"
            >
              {{ (errorState.error?.type === 'auth' && 'recoveryAction' in errorState.error ? errorState.error.recoveryAction?.label : null) || 'Intentar nuevamente' }}
            </BaseButton>

            <BaseButton
              variant="outline"
              @click="handleReset"
            >
              Comenzar de nuevo
            </BaseButton>

            <BaseButton
              v-if="showContactSupport"
              variant="ghost"
              @click="handleContactSupport"
            >
              <SupportIcon />
              Contactar soporte
            </BaseButton>
          </div>

          <!-- Error details for development -->
          <details v-if="showErrorDetails" class="error-boundary__details">
            <summary>Detalles técnicos</summary>
            <pre class="error-boundary__error-code">{{ errorDetails }}</pre>
          </details>
        </div>
      </div>
    </div>

    <!-- Normal content -->
    <div v-else>
      <slot />
    </div>

    <!-- Toast notifications -->
    <div class="error-boundary__toasts" aria-live="polite" aria-label="Notificaciones">
      <ErrorToast
        v-for="toast in errorToasts"
        :key="toast.id"
        :toast="toast"
        @dismiss="dismissToast"
        @action="handleToastAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onErrorCaptured } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import ShieldIcon from '@/shared/icons/ShieldIcon.vue'
import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'
import SupportIcon from '@/shared/icons/SupportIcon.vue'
import ErrorToast from './ErrorToast.vue'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { ErrorRecoveryAction } from '@/shared/types/error.types'

interface Props {
  fallbackComponent?: string
  onError?: (error: Error, errorInfo: string) => void
  resetOnPropsChange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallbackComponent: 'div',
  onError: undefined,
  resetOnPropsChange: false
})

const emit = defineEmits<{
  error: [error: Error, errorInfo: string]
  reset: []
  retry: []
}>()

const {
  errorState,
  errorToasts,
  canRetry,
  handleError,
  createSystemError,
  dismissToast,
  clearError,
  retry,
  announceError
} = useErrorHandler()

// Computed properties with explicit return types
const trustBuildingMessage = computed((): {
  title: string
  message: string
  trustSignal?: string
} => {
  if (!errorState.error) {
    return {
      title: 'Algo inesperado ocurrió',
      message: 'No te preocupes, estamos trabajando para solucionarlo.'
    }
  }

  const errorKey = `${errorState.error.type}/${errorState.error.code}`
  
  // Trust-building message templates
  const templates: Record<string, { title: string; message: string; trustSignal?: string }> = {
    'system/vue_error': {
      title: 'Ups, encontramos un pequeño problema',
      message: 'No es nada grave. Puedes intentar nuevamente o comenzar desde el inicio.',
      trustSignal: 'Tus datos están seguros'
    },
    'system/component_error': {
      title: 'Este componente está tomando un descanso',
      message: 'Esto pasa a veces. Intentemos cargar la página nuevamente.',
      trustSignal: 'Reporte automático enviado'
    },
    'system/max_retries_exceeded': {
      title: 'Necesitamos ayuda extra',
      message: 'Hemos intentado resolver esto automáticamente. Nuestro equipo de soporte está listo para ayudarte.',
      trustSignal: 'Soporte 24/7 disponible'
    }
  }

  const template = templates[errorKey]
  
  return template || {
    title: 'Algo no salió como esperábamos',
    message: errorState.error.message || 'Estamos trabajando para solucionarlo.',
    trustSignal: 'Tu experiencia es nuestra prioridad'
  }
})

const showErrorDetails = computed((): boolean => {
  return import.meta.env.DEV
})

const showContactSupport = computed((): boolean => {
  return errorState.recoveryAttempts >= 2 || 
         (errorState.error?.type === 'system' && errorState.error.code === 'max_retries_exceeded')
})

const errorDetails = computed((): string => {
  if (!errorState.error) return ''

  return JSON.stringify(
    {
      error: errorState.error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      component: 'ErrorBoundary'
    },
    null,
    2
  )
})

// Methods with explicit return types
const handleRetry = async (): Promise<void> => {
  try {
    await retry()
    emit('retry')
  } catch (error) {
    console.error('Retry failed in ErrorBoundary:', error)
  }
}

const handleReset = (): void => {
  clearError()
  emit('reset')
  
  // Announce to screen readers
  announceError('La página se ha reiniciado correctamente')
}

const handleContactSupport = (): void => {
  // Open support chat or redirect to support page
  const supportUrl = 'mailto:support@vana.app?subject=Error Report&body=' + 
                    encodeURIComponent(`Error Details:\n${errorDetails.value}`)
  
  window.open(supportUrl, '_blank')
}

const handleToastAction = (action: ErrorRecoveryAction): void => {
  action.handler()
}

// Vue error boundary
onErrorCaptured((error: Error, instance, info): boolean => {
  const systemError = createSystemError(
    'vue_error',
    error.message,
    'unknown',
    'high'
  )

  // Add Vue-specific context
  systemError.context = {
    ...systemError.context,
    vueError: {
      message: error.message,
      stack: error.stack,
      componentInfo: info,
      component: instance?.$options.name || 'Unknown'
    }
  }

  handleError(systemError)
  
  // Emit error event for parent handling
  emit('error', error, info)
  props.onError?.(error, info)

  // Announce error to screen readers
  announceError(`Error en la aplicación: ${error.message}`)

  // Return false to prevent error from propagating further
  return false
})

// Handle unhandled promise rejections
onMounted(() => {
  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = createSystemError(
      'unhandled_promise_rejection',
      event.reason?.message || 'Promise rechazada sin manejar',
      'unknown',
      'medium'
    )

    error.context = {
      ...error.context,
      promiseRejection: {
        reason: event.reason,
        stack: event.reason?.stack
      }
    }

    handleError(error)
    
    // Prevent default browser handling
    event.preventDefault()
  }

  window.addEventListener('unhandledrejection', handleUnhandledRejection)

  // Cleanup on unmount
  return () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
})
</script>

<style lang="scss" scoped>
.error-boundary {
  position: relative;
  width: 100%;
  height: 100%;

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: var(--spacing-lg);
  }

  &__container {
    max-width: 500px;
    text-align: center;
  }

  &__icon {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    
    svg {
      width: 64px;
      height: 64px;
      color: var(--color-warning-500);
    }
  }

  // &__content {
  //   @include design-token('color', 'text-primary');
  // }

  &__title {
    // @include design-token('typography', 'heading-lg');

    margin-bottom: var(--spacing-md);

    // @include design-token('color', 'text-primary');
  }

  &__message {
    // @include design-token('typography', 'body-lg');

    margin-bottom: var(--spacing-lg);

    // @include design-token('color', 'text-secondary');

    line-height: 1.6;
  }

  &__trust-signal {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-success-50);
    border: 1px solid var(--color-success-200);
    border-radius: var(--border-radius-md);

    // @include design-token('color', 'success-700');
    // @include design-token('typography', 'body-sm');
  }

  &__shield-icon {
    width: 16px;
    height: 16px;
    color: var(--color-success-600);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: center;
    margin-bottom: var(--spacing-lg);

    @media (width >= 640px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__details {
    margin-top: var(--spacing-lg);
    text-align: left;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    background: var(--color-background-secondary);

    summary {
      cursor: pointer;

      // @include design-token('typography', 'body-sm');
      // @include design-token('color', 'text-secondary');

      margin-bottom: var(--spacing-sm);
    }
  }

  &__error-code {
    // @include design-token('typography', 'mono-sm');
    // @include design-token('color', 'text-primary');

    background: var(--color-background-tertiary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__toasts {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    max-width: 400px;

    @media (width <= 640px) {
      top: var(--spacing-md);
      right: var(--spacing-md);
      left: var(--spacing-md);
      max-width: none;
    }
  }
}

// Screen reader only class

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>