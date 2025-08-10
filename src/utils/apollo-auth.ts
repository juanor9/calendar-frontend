import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { from } from '@apollo/client/core'
import type { ApolloLink } from '@apollo/client/core'
import { useAuth } from '@/auth/auth-composable'
import { useAuthStore } from '@/store/auth'

// Create auth link that adds JWT token to headers
export const createAuthLink = (): ApolloLink => {
  return setContext(async (_, { headers }) => {
    try {
      // Get token from auth composable
      const { getAccessToken, isAuthenticated } = useAuth()

      if (isAuthenticated.value) {
        const token = await getAccessToken()

        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      }

      return {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    } catch (error) {
      console.error('Error setting auth headers:', error)

      // Return headers without auth if token fetch fails
      return {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    }
  })
}

// Error link that handles auth-related errors
export const createErrorLink = (): ApolloLink => {
  return onError(({ graphQLErrors, networkError, operation: _operation, forward: _forward }) => {
    const authStore = useAuthStore()

    // Handle GraphQL errors
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error('GraphQL error:', { message, locations, path, extensions })

        // Handle authentication errors
        if (
          extensions?.code === 'UNAUTHENTICATED' ||
          message.includes('Unauthorized') ||
          message.includes('Authentication required')
        ) {
          authStore.setError('Sesión expirada. Por favor inicia sesión nuevamente.')

          // Clear auth data
          authStore.clearAuth()

          // Redirect to login if not already there
          if (window.location.pathname !== '/auth/login') {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}&reason=session_expired`
          }
        }

        // Handle authorization errors
        if (
          extensions?.code === 'FORBIDDEN' ||
          message.includes('Forbidden') ||
          message.includes('Access denied')
        ) {
          authStore.setError('No tienes permisos para realizar esta acción.')

          // Redirect to unauthorized page or home
          if (window.location.pathname !== '/unauthorized') {
            window.location.href = '/unauthorized'
          }
        }
      })
    }

    // Handle network errors
    if (networkError) {
      console.error('Network error:', networkError)

      // Handle specific HTTP status codes
      if ('statusCode' in networkError) {
        const statusCode = networkError.statusCode

        switch (statusCode) {
          case 401:
            authStore.setError('Credenciales inválidas. Por favor inicia sesión nuevamente.')
            authStore.clearAuth()

            if (window.location.pathname !== '/auth/login') {
              window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}&reason=unauthorized`
            }
            break

          case 403:
            authStore.setError('No tienes permisos para realizar esta acción.')
            break

          case 429:
            authStore.setError('Demasiadas solicitudes. Por favor intenta más tarde.')
            break

          case 500:
          case 502:
          case 503:
          case 504:
            authStore.setError('Error del servidor. Por favor intenta más tarde.')
            break

          default:
            authStore.setError('Error de conexión. Verifica tu conexión a internet.')
        }
      } else {
        authStore.setError('Error de red. Verifica tu conexión a internet.')
      }
    }
  })
}

// Token refresh link - retries failed requests with fresh token
export const createTokenRefreshLink = (): ApolloLink => {
  return setContext(async (_, { headers }) => {
    const { getAccessToken, isAuthenticated } = useAuth()

    if (isAuthenticated.value) {
      try {
        // Always try to get a fresh token for GraphQL requests
        const token = await getAccessToken()

        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        }
      } catch (error) {
        console.error('Token refresh failed:', error)

        // If refresh fails, user might need to re-authenticate
        const authStore = useAuthStore()
        authStore.setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
        authStore.clearAuth()

        // Redirect to login
        if (window.location.pathname !== '/auth/login') {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}&reason=token_expired`
        }
      }
    }

    return { headers }
  })
}

// Combined auth link that includes error handling and token refresh
export const createCombinedAuthLink = (): ApolloLink => {
  const authLink = createAuthLink()
  const errorLink = createErrorLink()
  const tokenRefreshLink = createTokenRefreshLink()

  return from([errorLink, tokenRefreshLink, authLink])
}

// Helper to check if an error is auth-related
export const isAuthError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false

  const err = error as {
    graphQLErrors?: Array<{ extensions?: { code: string }; message?: string }>
    networkError?: { statusCode?: number }
  }

  // Check GraphQL errors
  if (err.graphQLErrors) {
    return err.graphQLErrors.some(
      gqlError =>
        gqlError.extensions?.code === 'UNAUTHENTICATED' ||
        gqlError.extensions?.code === 'FORBIDDEN' ||
        gqlError.message?.includes('Unauthorized') ||
        gqlError.message?.includes('Authentication required')
    )
  }

  // Check network errors
  if (err.networkError) {
    const statusCode = err.networkError.statusCode
    return statusCode === 401 || statusCode === 403
  }

  return false
}

// Helper to extract user-friendly error message
export const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') return 'Error desconocido'

  const err = error as {
    graphQLErrors?: Array<{ extensions?: { code: string }; message?: string }>
    networkError?: { statusCode?: number }
    message?: string
  }

  // Check GraphQL errors first
  if (err.graphQLErrors && err.graphQLErrors.length > 0) {
    const gqlError = err.graphQLErrors[0]

    // Return custom message based on error code
    if (gqlError.extensions?.code === 'UNAUTHENTICATED') {
      return 'Debes iniciar sesión para realizar esta acción'
    }

    if (gqlError.extensions?.code === 'FORBIDDEN') {
      return 'No tienes permisos para realizar esta acción'
    }

    // Return the actual error message
    return gqlError.message || 'Error en la consulta'
  }

  // Check network errors
  if (err.networkError) {
    const statusCode = err.networkError.statusCode

    switch (statusCode) {
      case 401:
        return 'Credenciales inválidas'
      case 403:
        return 'Acceso denegado'
      case 404:
        return 'Recurso no encontrado'
      case 429:
        return 'Demasiadas solicitudes. Intenta más tarde'
      case 500:
        return 'Error interno del servidor'
      case 502:
      case 503:
      case 504:
        return 'Servicio no disponible'
      default:
        return 'Error de conexión'
    }
  }

  // Fallback to error message
  return err.message || 'Error desconocido'
}
