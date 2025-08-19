import { ref, reactive, computed, onErrorCaptured } from 'vue'
import type { 
  AppError, 
  ErrorState, 
  ErrorRecoveryAction, 
  ErrorToast,
  TrustBuildingErrorMessages,
  AuthError,
  NetworkError,
  ValidationError,
  SystemError
} from '@/types/error.types'

// Following trust-building UX patterns from behavioral design specifications
const TRUST_BUILDING_MESSAGES: TrustBuildingErrorMessages = {
  'auth/login_failed': {
    title: 'No te preocupes, esto pasa a veces',
    message: 'Revisemos tus credenciales juntos. La mayoría de las veces es solo una letra o número.',
    tone: 'understanding',
    recovery: 'Verificar credenciales o usar recuperación de contraseña',
    trustSignal: 'Tu información está segura con nosotros'
  },
  'auth/session_expired': {
    title: 'Tu sesión expiró por seguridad',
    message: 'Esto mantiene tu cuenta protegida. Solo toma unos segundos volver a iniciar sesión.',
    tone: 'reassuring',
    recovery: 'Iniciar sesión nuevamente',
    trustSignal: 'Seguridad automática activada'
  },
  'auth/rate_limited': {
    title: 'Tómate un respiro',
    message: 'Detectamos varios intentos rápidos. Esto protege tu cuenta. Intenta de nuevo en un momento.',
    tone: 'calm',
    recovery: 'Esperar y intentar nuevamente',
    trustSignal: 'Protección automática contra ataques'
  },
  'network/offline': {
    title: 'Sin conexión, no hay problema',
    message: 'Hemos guardado tus cambios localmente. Se sincronizarán cuando recuperes la conexión.',
    tone: 'reassuring',
    recovery: 'Los datos están seguros offline',
    trustSignal: 'Sincronización automática habilitada'
  },
  'network/server_error': {
    title: 'Nuestros servidores están trabajando en esto',
    message: 'No es nada que hayas hecho mal. Nuestro equipo ya está solucionando el problema.',
    tone: 'helpful',
    recovery: 'Intentar en unos minutos',
    trustSignal: 'Monitoreo 24/7 activo'
  }
}

export const useErrorHandler = () => {
  const errorState = reactive<ErrorState>({
    hasError: false,
    error: null,
    isRecovering: false,
    recoveryAttempts: 0,
    maxRetryAttempts: 3
  })

  const errorToasts = ref<ErrorToast[]>([])
  const errorLog = ref<AppError[]>([])

  // Computed properties with explicit return types
  const canRetry = computed((): boolean => {
    if (!errorState.error) return false
    const isRetryable = (errorState.error.type === 'auth' || errorState.error.type === 'network') && 
                       'retryable' in errorState.error ? errorState.error.retryable : false
    return errorState.recoveryAttempts < errorState.maxRetryAttempts && isRetryable
  })

  const errorSeverity = computed((): 'low' | 'medium' | 'high' | 'critical' => {
    if (!errorState.error) return 'low'
    
    if (errorState.error.type === 'system') {
      return (errorState.error as SystemError).severity
    }
    
    if (errorState.error.type === 'auth') {
      const authError = errorState.error as AuthError
      if (authError.subType === 'session_timeout') return 'medium'
      if (authError.subType === 'rate_limit') return 'high'
      return 'medium'
    }
    
    if (errorState.error.type === 'network') {
      const networkError = errorState.error as NetworkError
      if (networkError.status && networkError.status >= 500) return 'high'
      return 'medium'
    }
    
    return 'medium'
  })

  const trustBuildingMessage = computed((): string => {
    if (!errorState.error) return ''
    
    const errorKey = `${errorState.error.type}/${errorState.error.code}`
    const template = TRUST_BUILDING_MESSAGES[errorKey]
    
    return template?.message || errorState.error.message
  })

  // Error handling methods with explicit return types
  const handleError = (error: AppError): void => {
    errorState.hasError = true
    errorState.error = error
    errorState.isRecovering = false
    
    // Log error for analytics
    logError(error)
    
    // Create toast notification
    createErrorToast(error)
    
    // Report to monitoring service in production
    if (import.meta.env.PROD) {
      reportError(error)
    }
  }

  const createAuthError = (
    code: string,
    message: string,
    subType: AuthError['subType'],
    retryable: boolean = true,
    recoveryAction?: ErrorRecoveryAction
  ): AuthError => {
    return {
      type: 'auth',
      code,
      message,
      subType,
      retryable,
      timestamp: new Date().toISOString(),
      recoveryAction,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    }
  }

  const createNetworkError = (
    code: string,
    message: string,
    status?: number,
    statusText?: string,
    endpoint?: string,
    method?: string
  ): NetworkError => {
    return {
      type: 'network',
      code,
      message,
      status,
      statusText,
      endpoint,
      method,
      retryable: status ? status >= 500 || status === 408 : true,
      timestamp: new Date().toISOString(),
      retryAfter: status === 429 ? 30000 : undefined, // 30 seconds for rate limiting
      context: {
        navigator: {
          onLine: navigator.onLine,
          userAgent: navigator.userAgent
        }
      }
    }
  }

  const createValidationError = (
    field: string,
    value: unknown,
    constraint: string,
    message: string
  ): ValidationError => {
    return {
      type: 'validation',
      code: `validation_${field}`,
      message,
      field,
      value,
      constraint,
      timestamp: new Date().toISOString()
    }
  }

  const createSystemError = (
    code: string,
    message: string,
    source: SystemError['source'],
    severity: SystemError['severity'] = 'medium'
  ): SystemError => {
    return {
      type: 'system',
      code,
      message,
      source,
      severity,
      timestamp: new Date().toISOString(),
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        localStorage: typeof Storage !== 'undefined'
      }
    }
  }

  const createErrorToast = (error: AppError): void => {
    const errorKey = `${error.type}/${error.code}`
    const template = TRUST_BUILDING_MESSAGES[errorKey]
    
    const toast: ErrorToast = {
      id: generateId(),
      type: errorSeverity.value === 'critical' ? 'error' : 'warning',
      title: template?.title || 'Algo no salió como esperábamos',
      message: template?.message || error.message,
      duration: errorSeverity.value === 'critical' ? 0 : 5000, // Critical errors don't auto-dismiss
      dismissible: true,
      actions: (error.type === 'auth' && 'recoveryAction' in error && error.recoveryAction) ? [error.recoveryAction] : []
    }
    
    errorToasts.value.push(toast)
  }

  const dismissToast = (toastId: string): void => {
    const index = errorToasts.value.findIndex(toast => toast.id === toastId)
    if (index > -1) {
      errorToasts.value.splice(index, 1)
    }
  }

  const clearError = (): void => {
    errorState.hasError = false
    errorState.error = null
    errorState.isRecovering = false
    errorState.recoveryAttempts = 0
  }

  const retry = async (): Promise<void> => {
    if (!canRetry.value || !errorState.error) return
    if (errorState.error.type !== 'auth' || !('recoveryAction' in errorState.error) || !errorState.error.recoveryAction) return
    
    errorState.isRecovering = true
    errorState.recoveryAttempts += 1
    
    try {
      await errorState.error.recoveryAction.handler()
      clearError()
    } catch (retryError) {
      console.error('Retry failed:', retryError)
      
      if (errorState.recoveryAttempts >= errorState.maxRetryAttempts) {
        // Escalate to support if max retries reached
        const supportError = createSystemError(
          'max_retries_exceeded',
          'No pudimos resolver el problema automáticamente. Nuestro equipo de soporte te ayudará.',
          'unknown',
          'high'
        )
        handleError(supportError)
      }
    } finally {
      errorState.isRecovering = false
    }
  }

  const logError = (error: AppError): void => {
    errorLog.value.push(error)
    console.error(`[${error.type.toUpperCase()}] ${error.code}:`, error.message, error)
  }

  const reportError = (error: AppError): void => {
    // In production, send to error monitoring service
    // For now, just log to console
    console.log('Reporting error to monitoring service:', error)
  }

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9)
  }

  // Vue error boundary integration
  onErrorCaptured((error: Error, instance, info): boolean => {
    const systemError = createSystemError(
      'vue_error',
      `Error en componente Vue: ${error.message}`,
      'unknown',
      'high'
    )
    
    systemError.context = {
      ...systemError.context,
      vueError: {
        message: error.message,
        stack: error.stack,
        componentInfo: info
      }
    }
    
    handleError(systemError)
    
    // Return false to prevent the error from propagating
    return false
  })

  // Accessibility helpers
  const announceError = (message: string): void => {
    // Create aria-live region for screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.setAttribute('class', 'sr-only')
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return {
    // State
    errorState,
    errorToasts,
    errorLog,
    
    // Computed
    canRetry,
    errorSeverity,
    trustBuildingMessage,
    
    // Methods
    handleError,
    createAuthError,
    createNetworkError,
    createValidationError,
    createSystemError,
    dismissToast,
    clearError,
    retry,
    announceError
  }
}