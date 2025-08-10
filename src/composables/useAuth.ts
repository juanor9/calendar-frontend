/**
 * Enhanced Auth Composable for Vana Calendar
 * Includes registration flow, onboarding state, and email verification
 */

import { ref, computed, inject, watch, type Ref, type ComputedRef } from 'vue'
import type { Auth0VueClient } from '@auth0/auth0-vue'
import { useAuthStore } from '@/store/auth'
import { useRegistrationStore } from '@/store/registration'
import { RegistrationAPI } from '@/services/api/registration'
import { RegistrationCache } from '@/utils/registration-cache'
import type {
  User,
  LoginOptions,
  Role,
  Permission,
  RegistrationInitRequest,
  RegistrationResponse,
  RegistrationStatus,
  RegistrationStatusResponse,
  RegistrationState,
  RegistrationError,
} from '@/types/registration.types'

// Injection key for Auth0 client
export const Auth0ClientKey = Symbol('Auth0Client')

export interface UseAuthReturn {
  // Core Auth0 state
  isAuthenticated: Ref<boolean>
  isLoading: Ref<boolean>
  user: ComputedRef<User | null>
  error: Ref<RegistrationError | null>

  // Registration flow state
  registrationState: Ref<RegistrationState>
  registrationProgress: ComputedRef<number>
  canRetryRegistration: ComputedRef<boolean>

  // Methods - Core Auth
  loginWithRedirect: (options?: LoginOptions) => Promise<void>
  registerWithRedirect: (email?: string, source?: string) => Promise<void>
  logout: (returnTo?: string) => Promise<void>

  // Methods - Registration Flow
  initiateRegistration: (request: RegistrationInitRequest) => Promise<RegistrationResponse>
  handleRegistrationCallback: (code: string, state: string) => Promise<void>
  checkRegistrationStatus: (auth0Id: string) => Promise<RegistrationStatus>
  retryRegistration: () => Promise<void>

  // Methods - Email Verification
  resendVerificationEmail: (email: string) => Promise<void>
  checkEmailVerification: (auth0Id: string) => Promise<boolean>

  // Permission/Role checking
  hasRole: (role: Role) => boolean
  hasPermission: (permission: Permission) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean

  // Utilities
  getUserDisplayName: () => string | null
  getUserAvatar: () => string | null
}

export const useAuth = (): UseAuthReturn => {
  // Get Auth0 client from Vue injection
  const auth0Client = inject<Auth0VueClient>(Auth0ClientKey)
  if (!auth0Client) {
    throw new Error('Auth0 client not found. Make sure Auth0 plugin is installed.')
  }

  // Get stores
  const authStore = useAuthStore()
  const registrationStore = useRegistrationStore()

  // Local reactive state
  const isLoading = ref(false)
  const error = ref<RegistrationError | null>(null)

  // Auth0 reactive state
  const {
    isLoading: auth0Loading,
    isAuthenticated: auth0Authenticated,
    user: auth0User,
    error: auth0Error,
  } = auth0Client

  // Combined state
  const isAuthenticated = computed(() => auth0Authenticated.value && authStore.isAuthenticated)

  const user = computed(() => authStore.user || (auth0User.value as User))

  // Registration state
  const registrationState = computed(() => registrationStore.registrationState)

  const registrationProgress = computed(() => {
    const state = registrationState.value
    switch (state.status) {
      case 'idle':
        return 0
      case 'redirecting':
        return 10
      case 'processing':
        return 30
      case 'verifying':
        return 60
      case 'completed':
        return 100
      case 'error':
        return state.step === 'email_verification' ? 60 : 30
      default:
        return 0
    }
  })

  const canRetryRegistration = computed(() => {
    const state = registrationState.value
    return state.status === 'error' && state.error?.retryable === true && state.retryCount < 3
  })

  // Watch for Auth0 authentication changes
  watch(
    auth0Authenticated,
    async authenticated => {
      if (authenticated && auth0User.value) {
        await syncAuthState()
      } else {
        authStore.clearAuth()
      }
    },
    { immediate: true }
  )

  // Watch for Auth0 errors
  watch(auth0Error, auth0Err => {
    if (auth0Err) {
      error.value = {
        code: 'AUTH0_ERROR',
        type: 'auth0',
        message: auth0Err.message || 'Authentication error',
        userMessage: 'Unable to complete authentication. Please try again.',
        retryable: true,
      }
    }
  })

  /**
   * Sync Auth0 state with our stores
   */
  const syncAuthState = async () => {
    try {
      if (auth0User.value) {
        authStore.setUser(auth0User.value as User)

        // Get access token and store it
        const token = await auth0Client.getAccessTokenSilently()
        authStore.setToken(typeof token === 'string' ? token : token.access_token)
      }
    } catch (err) {
      console.warn('Failed to sync auth state:', err)
    }
  }

  /**
   * Core Authentication Methods
   */

  const loginWithRedirect = async (options?: LoginOptions) => {
    try {
      isLoading.value = true
      error.value = null

      await auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: options?.redirect_uri || `${window.location.origin}/auth/callback`,
          screen_hint: 'login',
        },
        appState: options?.appState,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      error.value = {
        code: 'LOGIN_FAILED',
        type: 'auth0',
        message: errorMessage,
        userMessage: 'Unable to start login process. Please try again.',
        retryable: true,
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const registerWithRedirect = async (email?: string, source = 'landing') => {
    try {
      isLoading.value = true
      error.value = null

      // Save registration intent
      registrationStore.startRegistration(email || '', source)

      await auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/auth/callback`,
          screen_hint: 'signup',
        },
        appState: {
          action: 'registration',
          email,
          source,
          targetUrl: '/onboarding/welcome',
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      error.value = {
        code: 'REGISTRATION_FAILED',
        type: 'auth0',
        message: errorMessage,
        userMessage: 'Unable to start registration. Please try again.',
        retryable: true,
      }
      registrationStore.handleRegistrationError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (returnTo?: string) => {
    try {
      isLoading.value = true
      authStore.clearAuth()
      registrationStore.resetRegistration()
      RegistrationCache.clear()

      await auth0Client.logout({
        logoutParams: {
          returnTo: returnTo || window.location.origin,
        },
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registration Flow Methods
   */

  const initiateRegistration = async (
    request: RegistrationInitRequest
  ): Promise<RegistrationResponse> => {
    try {
      isLoading.value = true
      error.value = null

      registrationStore.startRegistration(request.email, request.source)

      const response = await RegistrationAPI.initiateRegistration(request)

      if (response.success) {
        registrationStore.updateRegistrationState('processing')
        RegistrationCache.save(registrationState.value)
      } else if (response.error) {
        registrationStore.handleRegistrationError(response.error)
      }

      return response
    } catch (err) {
      const regError: RegistrationError = {
        code: 'REGISTRATION_INIT_FAILED',
        type: 'network',
        message: err instanceof Error ? err.message : 'Registration initialization failed',
        userMessage: 'Unable to start registration. Please check your connection and try again.',
        retryable: true,
      }
      error.value = regError
      registrationStore.handleRegistrationError(regError)
      throw regError
    } finally {
      isLoading.value = false
    }
  }

  const handleRegistrationCallback = async (code: string, state: string) => {
    try {
      isLoading.value = true
      error.value = null

      registrationStore.updateRegistrationState('processing')

      const response = await RegistrationAPI.handleCallback({ code, state })

      if (response.success && response.user) {
        authStore.setUser(response.user)
        registrationStore.updateRegistrationState('verifying')

        // Check if email is already verified
        if (response.user.email_verified) {
          registrationStore.updateRegistrationState('completed')
          return
        }
      }

      // Cache the current state
      RegistrationCache.save(registrationState.value)
    } catch (err) {
      const regError: RegistrationError = {
        code: 'CALLBACK_FAILED',
        type: 'backend',
        message: err instanceof Error ? err.message : 'Registration callback failed',
        userMessage: 'Registration process encountered an error. Please try again.',
        retryable: true,
      }
      error.value = regError
      registrationStore.handleRegistrationError(regError)
      throw regError
    } finally {
      isLoading.value = false
    }
  }

  const checkRegistrationStatus = async (auth0Id: string): Promise<RegistrationStatusResponse> => {
    try {
      const status = await RegistrationAPI.getRegistrationStatus(auth0Id)

      // Update local state based on backend status
      if (status.completed) {
        registrationStore.updateRegistrationState('completed')
      } else if (status.emailVerified) {
        registrationStore.updateRegistrationState('verifying')
      }

      return status
    } catch (err) {
      console.error('Failed to check registration status:', err)
      throw err
    }
  }

  const retryRegistration = async () => {
    if (!canRetryRegistration.value) {
      throw new Error('Cannot retry registration at this time')
    }

    try {
      const state = registrationState.value
      await registrationStore.retryRegistration()

      // Retry the last failed operation
      if (state.step === 'email_verification') {
        await resendVerificationEmail(state.email || '')
      } else {
        await registerWithRedirect(state.email || '', state.source || 'retry')
      }
    } catch (err) {
      console.error('Registration retry failed:', err)
      throw err
    }
  }

  /**
   * Email Verification Methods
   */

  const resendVerificationEmail = async (email: string) => {
    try {
      isLoading.value = true
      await RegistrationAPI.resendVerification(email)
      registrationStore.sendVerificationEmail(email)
    } catch (err) {
      const regError: RegistrationError = {
        code: 'EMAIL_RESEND_FAILED',
        type: 'network',
        message: err instanceof Error ? err.message : 'Failed to resend verification email',
        userMessage: 'Unable to resend email. Please try again in a moment.',
        retryable: true,
      }
      error.value = regError
      throw regError
    } finally {
      isLoading.value = false
    }
  }

  const checkEmailVerification = async (auth0Id: string): Promise<boolean> => {
    try {
      const status = await checkRegistrationStatus(auth0Id)
      const isVerified = status.emailVerified

      if (isVerified) {
        registrationStore.markEmailVerified()
      }

      return isVerified
    } catch (err) {
      console.error('Email verification check failed:', err)
      return false
    }
  }

  /**
   * Permission and Role Methods
   */

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

  /**
   * Utility Methods
   */

  const getUserDisplayName = (): string | null => {
    return authStore.userDisplayName
  }

  const getUserAvatar = (): string | null => {
    return authStore.userAvatar
  }

  // Load cached registration state on initialization
  const cachedState = RegistrationCache.load()
  if (cachedState && cachedState.status !== 'completed') {
    registrationStore.loadCachedState()
  }

  return {
    // State
    isAuthenticated,
    isLoading: computed(() => isLoading.value || auth0Loading.value),
    user,
    error,

    // Registration state
    registrationState,
    registrationProgress,
    canRetryRegistration,

    // Core methods
    loginWithRedirect,
    registerWithRedirect,
    logout,

    // Registration methods
    initiateRegistration,
    handleRegistrationCallback,
    checkRegistrationStatus,
    retryRegistration,

    // Email verification methods
    resendVerificationEmail,
    checkEmailVerification,

    // Permission methods
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,

    // Utilities
    getUserDisplayName,
    getUserAvatar,
  }
}
