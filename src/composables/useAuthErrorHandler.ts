import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/authentication/composables/useAuth'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { AuthError, ErrorRecoveryAction } from '@/shared/types/error.types'

// Auth-specific error handling with trust-building patterns
export const useAuthErrorHandler = () => {
  const router = useRouter()
  const { isAuthenticated, error: authError } = useAuth()
  const { 
    handleError, 
    createAuthError, 
    createNetworkError,
    announceError
  } = useErrorHandler()

  // Auth0-specific error mappings with trust-building messages
  const handleAuth0Error = (error: Record<string, unknown>): AuthError => {
    const errorCode = error.error || error.code || 'unknown'
    const errorDescription = error.error_description || error.message || 'Error desconocido'

    // Common Auth0 errors with recovery actions
    switch (errorCode) {
      case 'access_denied':
        return createAuthError(
          'access_denied',
          'Acceso denegado durante la autenticación',
          'login',
          true,
          {
            type: 'retry',
            label: 'Intentar nuevamente',
            handler: async (): Promise<void> => {
              await router.push('/auth/login')
            }
          }
        )

      case 'unauthorized':
        return createAuthError(
          'unauthorized',
          'Credenciales incorrectas',
          'login',
          true,
          {
            type: 'redirect',
            label: 'Recuperar contraseña',
            handler: async (): Promise<void> => {
              await router.push('/auth/forgot-password')
            }
          }
        )

      case 'server_error':
        return createAuthError(
          'server_error',
          'Error temporal del servidor de autenticación',
          'login',
          true,
          {
            type: 'retry',
            label: 'Intentar en un momento',
            handler: async (): Promise<void> => {
              // Wait 5 seconds before retry
              setTimeout(async () => {
                window.location.reload()
              }, 5000)
            }
          }
        )

      case 'too_many_attempts':
        return createAuthError(
          'rate_limited',
          'Demasiados intentos de inicio de sesión',
          'rate_limit',
          false,
          {
            type: 'contact_support',
            label: 'Contactar soporte',
            handler: (): void => {
              window.open('mailto:support@vana.app?subject=Account Locked', '_blank')
            }
          }
        )

      case 'invalid_request':
        return createAuthError(
          'invalid_request',
          'Solicitud de autenticación inválida',
          'login',
          true,
          {
            type: 'refresh',
            label: 'Recargar página',
            handler: (): void => {
              window.location.reload()
            }
          }
        )

      case 'temporarily_unavailable':
        return createAuthError(
          'service_unavailable',
          'Servicio de autenticación temporalmente no disponible',
          'login',
          true,
          {
            type: 'retry',
            label: 'Intentar más tarde',
            handler: async (): Promise<void> => {
              // Wait 30 seconds before retry
              setTimeout(() => {
                window.location.reload()
              }, 30000)
            }
          }
        )

      case 'login_required':
        return createAuthError(
          'login_required',
          'Necesitas iniciar sesión para continuar',
          'session_timeout',
          true,
          {
            type: 'redirect',
            label: 'Iniciar sesión',
            handler: async (): Promise<void> => {
              await router.push('/auth/login')
            }
          }
        )

      default:
        return createAuthError(
          String(errorCode),
          String(errorDescription),
          'login',
          true,
          {
            type: 'retry',
            label: 'Intentar nuevamente',
            handler: async (): Promise<void> => {
              await router.push('/auth/login')
            }
          }
        )
    }
  }

  // Handle login-specific errors
  const handleLoginError = (error: Record<string, unknown>): void => {
    const authError = handleAuth0Error(error)
    handleError(authError)
    
    // Announce error for accessibility
    announceError(`Error de inicio de sesión: ${authError.message}`)
  }

  // Handle callback errors
  const handleCallbackError = (error: Record<string, unknown>): void => {
    const authError = handleAuth0Error(error)
    authError.subType = 'callback'
    handleError(authError)
    
    // Announce error for accessibility
    announceError(`Error en el callback de autenticación: ${authError.message}`)
  }

  // Handle token refresh errors
  const handleTokenRefreshError = (_error: Record<string, unknown>): void => {
    const authError = createAuthError(
      'token_refresh_failed',
      'Tu sesión expiró por seguridad',
      'token_refresh',
      true,
      {
        type: 'redirect',
        label: 'Iniciar sesión nuevamente',
        handler: async (): Promise<void> => {
          // Clear local storage and redirect to login
          localStorage.removeItem('vana_user')
          localStorage.removeItem('vana_token')
          await router.push('/auth/login?reason=session_expired')
        }
      }
    )

    handleError(authError)
    announceError('Tu sesión expiró. Necesitas iniciar sesión nuevamente.')
  }

  // Handle logout errors
  const handleLogoutError = (_error: Record<string, unknown>): void => {
    const authError = createAuthError(
      'logout_failed',
      'Error al cerrar sesión',
      'logout',
      true,
      {
        type: 'retry',
        label: 'Intentar cerrar sesión nuevamente',
        handler: async (): Promise<void> => {
          // Force logout by clearing local data
          localStorage.clear()
          window.location.href = '/auth/logout'
        }
      }
    )

    handleError(authError)
  }

  // Handle network errors during auth operations
  const handleAuthNetworkError = (error: Record<string, unknown>, endpoint: string, method: string = 'POST'): void => {
    const networkError = createNetworkError(
      'auth_network_error',
      'Error de conexión durante la autenticación',
      typeof error.status === 'number' ? error.status : undefined,
      typeof error.statusText === 'string' ? error.statusText : undefined,
      endpoint,
      method
    )

    // Add auth-specific recovery action
    networkError.context = {
      ...networkError.context,
      authEndpoint: endpoint,
      isAuthFlow: true
    }

    handleError(networkError)
  }

  // Session timeout handler
  const handleSessionTimeout = (): void => {
    const timeoutError = createAuthError(
      'session_timeout',
      'Tu sesión expiró por seguridad',
      'session_timeout',
      true,
      {
        type: 'redirect',
        label: 'Iniciar sesión nuevamente',
        handler: async (): Promise<void> => {
          await router.push('/auth/login?reason=timeout')
        }
      }
    )

    handleError(timeoutError)
    announceError('Tu sesión expiró. Serás redirigido al inicio de sesión.')
  }

  // Rate limiting handler with progressive backoff
  const handleRateLimit = (retryAfter?: number): void => {
    const waitTime = retryAfter || 60 // Default 1 minute
    
    const rateLimitError = createAuthError(
      'rate_limited',
      `Por seguridad, espera ${Math.ceil(waitTime / 60)} minutos antes de intentar nuevamente`,
      'rate_limit',
      false,
      {
        type: 'retry',
        label: `Intentar en ${Math.ceil(waitTime / 60)} minutos`,
        handler: async (): Promise<void> => {
          setTimeout(() => {
            window.location.reload()
          }, waitTime * 1000)
        }
      }
    )

    handleError(rateLimitError)
    announceError('Límite de intentos alcanzado. Espera antes de intentar nuevamente.')
  }

  // Email verification error handler
  const handleEmailVerificationError = (_error: Record<string, unknown>): void => {
    const verificationError = createAuthError(
      'email_verification_failed',
      'Error al verificar el email',
      'login',
      true,
      {
        type: 'retry',
        label: 'Reenviar email de verificación',
        handler: async (): Promise<void> => {
          // This would call the resend verification endpoint
          console.log('Resending verification email...')
          // TODO: Implement actual resend logic
        }
      }
    )

    handleError(verificationError)
  }

  // Generic error handler that determines the type
  const handleGenericAuthError = (error: Record<string, unknown>, context: string = 'auth'): void => {
    // Determine error type based on context and error properties
    if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
      handleSessionTimeout()
    } else if (error.status === 429 || error.code === 'too_many_attempts') {
      handleRateLimit(typeof error.retryAfter === 'number' ? error.retryAfter : undefined)
    } else if (typeof error.status === 'number' && error.status >= 500) {
      handleAuthNetworkError(error, context)
    } else if (context === 'login') {
      handleLoginError(error)
    } else if (context === 'callback') {
      handleCallbackError(error)
    } else if (context === 'token_refresh') {
      handleTokenRefreshError(error)
    } else if (context === 'logout') {
      handleLogoutError(error)
    } else {
      // Default auth error handling
      const authError = handleAuth0Error(error)
      handleError(authError)
    }
  }

  // Watch for auth errors and handle them automatically
  watch(authError, (newError) => {
    if (newError) {
      handleGenericAuthError(newError, 'auth_watch')
    }
  })

  // Provide helpers for specific error scenarios
  const createTrustBuildingRecovery = (
    message: string,
    action: () => Promise<void> | void,
    label: string = 'Continuar'
  ): ErrorRecoveryAction => {
    return {
      type: 'retry',
      label,
      handler: action,
      params: {
        trustBuilding: true,
        userFriendly: true
      }
    }
  }

  // Check if user needs reauthentication
  const needsReauth = computed((): boolean => {
    return !isAuthenticated.value && 
           localStorage.getItem('vana_user') !== null
  })

  return {
    // Error handlers
    handleLoginError,
    handleCallbackError,
    handleTokenRefreshError,
    handleLogoutError,
    handleAuthNetworkError,
    handleSessionTimeout,
    handleRateLimit,
    handleEmailVerificationError,
    handleGenericAuthError,
    
    // Utilities
    createTrustBuildingRecovery,
    needsReauth
  }
}