import { computed, inject, type InjectionKey } from 'vue'
import type { Auth0VueClient } from '@auth0/auth0-vue'
import { useAuthStore } from '@/store/auth'
import type { User, LoginOptions, Role, Permission } from './types'

// Injection key for Auth0 client
export const Auth0ClientKey: InjectionKey<Auth0VueClient> = Symbol('Auth0Client')

export const useAuth = () => {
  // Get Auth0 client from Vue injection
  const auth0Client = inject(Auth0ClientKey)
  if (!auth0Client) {
    throw new Error('Auth0 client not found. Make sure Auth0 plugin is installed.')
  }

  // Get auth store
  const authStore = useAuthStore()

  // Auth0 reactive state
  const {
    isLoading: auth0Loading,
    isAuthenticated: auth0Authenticated,
    user: auth0User,
    error: auth0Error,
  } = auth0Client

  // Combined loading state
  const isLoading = computed(() => auth0Loading.value || authStore.isLoading)

  // Combined authenticated state
  const isAuthenticated = computed(() => auth0Authenticated.value && authStore.isAuthenticated)

  // Combined user state
  const user = computed(() => authStore.user || auth0User.value)

  // Combined error state
  const error = computed(() => authStore.error || auth0Error.value)

  // Login method
  const login = async (options?: LoginOptions) => {
    try {
      authStore.setError(null)
      authStore.setLoading(true)

      await auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: options?.redirect_uri || window.location.origin + '/auth/callback',
        },
        appState: options?.appState,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      authStore.setError(errorMessage)
      console.error('Login error:', err)
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  // Logout method
  const logout = async (returnToUrl?: string) => {
    try {
      authStore.setError(null)
      authStore.clearAuth()

      await auth0Client.logout({
        logoutParams: {
          returnTo: returnToUrl || window.location.origin + '/auth/logout',
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      authStore.setError(errorMessage)
      console.error('Logout error:', err)
      throw err
    }
  }

  // Get access token
  const getAccessToken = async (
    options: {
      audience?: string
      scope?: string
    } = {}
  ) => {
    try {
      if (!auth0Authenticated.value) {
        throw new Error('User not authenticated')
      }

      const tokenOptions: Record<string, string> = {}
      if (options?.audience) tokenOptions.audience = options.audience
      if (options?.scope) tokenOptions.scope = options.scope

      const token = await auth0Client.getAccessTokenSilently(
        Object.keys(tokenOptions).length > 0 ? tokenOptions : undefined
      )
      const accessToken =
        typeof token === 'string'
          ? token
          : (token as { access_token?: string })?.access_token || token
      authStore.setToken(accessToken)
      return accessToken
    } catch (err) {
      console.error('Error getting access token:', err)
      // If token refresh fails, might need to re-authenticate
      if (err instanceof Error && err.message.includes('consent_required')) {
        await login()
      }
      throw err
    }
  }

  // Check authentication and sync with store
  const checkAuth = async () => {
    try {
      authStore.setLoading(true)
      authStore.setError(null)

      if (auth0Authenticated.value && auth0User.value) {
        // Sync Auth0 user with store
        authStore.setUser(auth0User.value as User)

        // Get and store access token
        try {
          const token = await getAccessToken()
          authStore.setToken(
            typeof token === 'string'
              ? token
              : (token as { access_token?: string })?.access_token || token
          )
        } catch (tokenError) {
          console.warn('Could not get access token:', tokenError)
        }
      } else {
        authStore.clearAuth()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication check failed'
      authStore.setError(errorMessage)
      console.error('Auth check error:', err)
    } finally {
      authStore.setLoading(false)
    }
  }

  // Handle authentication callback
  const handleRedirectCallback = async () => {
    try {
      authStore.setLoading(true)
      authStore.setError(null)

      const result = await auth0Client.handleRedirectCallback()

      if (result && result.appState) {
        // Redirect to intended URL if stored in app state
        const targetUrl = result.appState.targetUrl || '/'
        window.history.replaceState({}, document.title, targetUrl)
      }

      await checkAuth()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Callback handling failed'
      authStore.setError(errorMessage)
      console.error('Callback error:', err)
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  // Permission and role checking methods
  const hasRole = (role: Role): boolean => {
    return authStore.hasRole(role)
  }

  const hasPermission = (permission: Permission): boolean => {
    return authStore.hasPermission(permission)
  }

  const hasAnyRole = (roles: Role[]): boolean => {
    return authStore.hasAnyRole(roles)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return authStore.hasAnyPermission(permissions)
  }

  const hasAllRoles = (roles: Role[]): boolean => {
    return authStore.hasAllRoles(roles)
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return authStore.hasAllPermissions(permissions)
  }

  // Utility methods
  const getUserDisplayName = () => authStore.userDisplayName
  const getUserAvatar = () => authStore.userAvatar
  const getUserRoles = () => authStore.userRoles
  const getUserPermissions = () => authStore.userPermissions
  const getUserMetadata = () => authStore.userMetadata
  const isAdmin = () => authStore.isAdmin
  const isPremium = () => authStore.isPremium

  return {
    // State
    isLoading,
    isAuthenticated,
    user,
    error,

    // Methods
    login,
    logout,
    getAccessToken,
    checkAuth,
    handleRedirectCallback,

    // Permission/Role checking
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,

    // Utilities
    getUserDisplayName,
    getUserAvatar,
    getUserRoles,
    getUserPermissions,
    getUserMetadata,
    isAdmin,
    isPremium,

    // Direct store access
    authStore,
  }
}
