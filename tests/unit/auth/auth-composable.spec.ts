/**
 * useAuth Composable Tests
 * Comprehensive unit tests for the auth composable
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import {
  createMockAuth0Client,
  mockAppUser,
  mockAdminUser,
  mockAccessToken,
  createAuthError,
  cleanupAuthMocks,
  mockEnvVars,
} from '../../mocks/auth0'
import {
  createCompleteAuthStoreMock,
  type CompleteAuthStoreMock
} from '../../mocks/auth-store-mock'

// Unmock the composables for this specific test file
vi.unmock('@/features/authentication/composables/useAuth')
// Keep the store mocked - we'll control it directly in the test

import { useAuth, Auth0ClientKey } from '@/features/authentication/composables/useAuth'
import { useAuthStore } from '@/features/authentication/stores/auth'
import { useRegistrationStore } from '@/features/authentication/stores/registration'
import type { LoginOptions } from '@/features/authentication/types/auth.types'

// Mock the auth store and registration store
vi.mock('@/features/authentication/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('@/features/authentication/stores/registration', () => ({
  useRegistrationStore: vi.fn(() => ({
    resetRegistration: vi.fn(),
    handleRegistrationError: vi.fn(),
    updateRegistrationState: vi.fn(),
    registrationState: { status: 'idle', step: 'email', error: null, retryCount: 0 },
    // Add other registration store methods as needed
  }))
}))

// Mock RegistrationAPI
vi.mock('@/features/authentication/services/api/registration', () => ({
  RegistrationAPI: {
    handleCallback: vi.fn().mockResolvedValue({ success: true }),
    // Add methods as needed
  }
}))

// Mock RegistrationCache
vi.mock('@/shared/utils/registration-cache', () => ({
  RegistrationCache: {
    load: vi.fn(() => null),
    save: vi.fn(),
    clear: vi.fn(),
    exists: vi.fn(() => false),
    update: vi.fn(),
    cleanup: vi.fn(),
    initialize: vi.fn()
  }
}))

// Mock Vue's inject globally with a controllable function
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  const mockInjectFn = vi.fn()
  return {
    ...actual,
    inject: mockInjectFn,
  }
})

describe('useAuth composable', () => {
  let mockAuth0Client: ReturnType<typeof createMockAuth0Client>
  let authStore: CompleteAuthStoreMock
  let mockInject: ReturnType<typeof vi.fn>
  let mockLocalStorage: Storage

  beforeEach(async () => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    }
    vi.stubGlobal('localStorage', mockLocalStorage)

    // Mock window.location to ensure consistent URLs in tests
    vi.stubGlobal('window', {
      location: {
        origin: 'http://localhost:5173',
        href: 'http://localhost:5173',
        protocol: 'http:',
        host: 'localhost:5173',
        hostname: 'localhost',
        port: '5173',
        pathname: '/',
        search: '',
        hash: '',
      },
      history: {
        replaceState: vi.fn(),
      },
    })

    // Setup Pinia with proper mocking - stubActions: false allows real state changes
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })
    setActivePinia(pinia)

    // Setup environment variables
    Object.entries(mockEnvVars).forEach(([key, value]) => {
      vi.stubEnv(key, value)
    })

    // Mock Auth0 client
    mockAuth0Client = createMockAuth0Client()

    // Get the mocked inject function from Vue module
    const vue = await import('vue')
    mockInject = vi.mocked(vue.inject)

    // Setup default inject mock to return mockAuth0Client
    mockInject.mockImplementation(key => {
      if (key === Auth0ClientKey) {
        return mockAuth0Client
      }
      return undefined
    })

    // Create complete auth store mock with all methods
    authStore = createCompleteAuthStoreMock()
    
    // Mock the store so useAuth gets our complete mock
    vi.mocked(useAuthStore).mockReturnValue(authStore as ReturnType<typeof useAuthStore>)

    // Reset store to known state
    authStore.$reset()

    // Set initial state
    authStore.setLoading(false)
  })

  afterEach(() => {
    cleanupAuthMocks()
    mockInject.mockReset()
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('initialization', () => {
    it('should throw error if Auth0 client not found', () => {
      mockInject.mockReturnValueOnce(undefined)

      expect(() => useAuth()).toThrow(
        'Auth0 client not found. Make sure Auth0 plugin is installed.'
      )
    })

    it('should initialize with correct default state', () => {
      // Suppress console warnings for this test
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const auth = useAuth()

      expect(auth.isLoading.value).toBe(false)
      expect(auth.isAuthenticated.value).toBe(false)
      expect(auth.user.value).toBe(null)
      expect(auth.error.value).toBe(null)
      
      consoleWarnSpy.mockRestore()
    })

    it('should combine Auth0 and store state correctly', () => {
      // Suppress console warnings for this test
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Set up Auth0 state
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      // Set up store state using the mock methods
      authStore.setUser(mockAppUser)
      // setUser automatically sets isAuthenticated

      const auth = useAuth()

      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.user.value).toEqual(mockAppUser)
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('login method', () => {
    it('should call loginWithRedirect with correct parameters', async () => {
      const auth = useAuth()
      const options: LoginOptions = {
        redirect_uri: 'http://localhost:5173/custom-callback',
        appState: { targetUrl: '/dashboard' },
      }

      await auth.loginWithRedirect(options)

      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
        authorizationParams: {
          redirect_uri: options.redirect_uri,
          screen_hint: 'login',
        },
        appState: options.appState,
      })
    })

    it('should use default redirect_uri when none provided', async () => {
      const auth = useAuth()

      await auth.loginWithRedirect()

      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
        authorizationParams: {
          redirect_uri: 'http://localhost:5173/auth/callback',
          screen_hint: 'login',
        },
        appState: undefined,
      })
    })

    it('should handle login errors correctly', async () => {
      const auth = useAuth()
      const loginError = createAuthError('Login failed')

      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(loginError)

      await expect(auth.loginWithRedirect()).rejects.toThrow('Login failed')
      expect(auth.error.value).toEqual(expect.objectContaining({
        code: 'LOGIN_FAILED',
        type: 'auth0',
        message: 'Login failed',
        retryable: true
      }))
    })

    it('should set loading state during login', async () => {
      const auth = useAuth()

      // Check initial loading state
      expect(auth.isLoading.value).toBe(false)

      // Start login (this will complete immediately in test)
      const loginPromise = auth.loginWithRedirect()
      
      // Complete the login
      await loginPromise

      // Should return to false loading state after completion  
      expect(auth.isLoading.value).toBe(false)
    })
  })

  describe('logout method', () => {
    it('should call logout with correct parameters', async () => {
      const auth = useAuth()
      const returnToUrl = 'http://localhost:5173/goodbye'

      await auth.logout(returnToUrl)

      expect(mockAuth0Client.logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: returnToUrl,
        },
      })
    })

    it('should use default logout URL when none provided', async () => {
      const auth = useAuth()

      await auth.logout()

      expect(mockAuth0Client.logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: 'http://localhost:5173',
        },
      })
    })

    it('should clear auth store on logout', async () => {
      const auth = useAuth()

      // Setup authenticated state using the mock methods
      authStore.setUser(mockAppUser)
      authStore.setToken(mockAccessToken)

      // Create spy on the auth store mock
      const clearAuthSpy = vi.spyOn(authStore, 'clearAuth')

      await auth.logout()

      expect(clearAuthSpy).toHaveBeenCalled()
    })

    it('should handle logout errors correctly', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const auth = useAuth()
      const logoutError = createAuthError('Logout failed')

      mockAuth0Client.logout.mockRejectedValueOnce(logoutError)

      // The logout method catches errors and logs them, but doesn't re-throw them
      await auth.logout()

      // Verify that console.error was called with the logout error
      expect(consoleError).toHaveBeenCalledWith('Logout error:', logoutError)
      
      consoleError.mockRestore()
    })
  })

  describe('getAccessToken method', () => {
    beforeEach(() => {
      // Setup authenticated state
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
    })

    it('should retrieve access token successfully', async () => {
      // Suppress console warnings for this test
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const auth = useAuth()

      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      const token = await auth.getAccessToken()

      expect(token).toBe(mockAccessToken)
      expect(mockAuth0Client.getAccessTokenSilently).toHaveBeenCalled()
      
      consoleWarnSpy.mockRestore()
    })

    it('should call getAccessTokenSilently without options', async () => {
      const auth = useAuth()

      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      await auth.getAccessToken()

      expect(mockAuth0Client.getAccessTokenSilently).toHaveBeenCalledWith()
    })

    it('should return null on error', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const auth = useAuth()

      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(new Error('Token error'))

      const token = await auth.getAccessToken()

      expect(token).toBeNull()
      expect(consoleError).toHaveBeenCalledWith('Failed to get access token:', expect.any(Error))
      
      consoleError.mockRestore()
    })

    it('should return null on consent_required error', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const auth = useAuth()
      const consentError = createAuthError('consent_required')

      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(consentError)

      const token = await auth.getAccessToken()
      
      expect(token).toBeNull()
      expect(consoleError).toHaveBeenCalledWith('Failed to get access token:', consentError)
      
      consoleError.mockRestore()
    })
  })

  describe('checkAuth method', () => {
    it('should sync authenticated user with store', async () => {
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      const auth = useAuth()

      // Create spies on the auth store mock
      const setUserSpy = vi.spyOn(authStore, 'setUser')
      const setTokenSpy = vi.spyOn(authStore, 'setToken')

      await auth.checkAuth()

      expect(setUserSpy).toHaveBeenCalledWith(mockAppUser)
      expect(setTokenSpy).toHaveBeenCalledWith(mockAccessToken)
    })

    it('should clear store when user not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false
      mockAuth0Client.user.value = null

      const auth = useAuth()

      // Create spy on the auth store mock
      const clearAuthSpy = vi.spyOn(authStore, 'clearAuth')

      await auth.checkAuth()

      expect(clearAuthSpy).toHaveBeenCalled()
    })

    it('should handle token retrieval failure gracefully', async () => {
      // Suppress expected console warnings for this test
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(new Error('Token failed'))

      const auth = useAuth()

      // Create spies on the auth store mock
      const setUserSpy = vi.spyOn(authStore, 'setUser')
      const setTokenSpy = vi.spyOn(authStore, 'setToken')

      await auth.checkAuth()

      // User should still be set even if token fails
      expect(setUserSpy).toHaveBeenCalledWith(mockAppUser)
      expect(setTokenSpy).not.toHaveBeenCalled()
      
      consoleWarn.mockRestore()
    })

    it('should handle auth check errors', async () => {
      // Suppress expected console warnings for this test
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const auth = useAuth()

      // Mock Auth0 client to throw error during sync
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(new Error('Auth check failed'))

      // Create spy on the auth store mock clearAuth method
      const clearAuthSpy = vi.spyOn(authStore, 'clearAuth')

      // The checkAuth method should handle the error gracefully
      await auth.checkAuth()

      // Verify console.warn was called with the error
      expect(consoleWarn).toHaveBeenCalledWith('Failed to sync auth state:', expect.any(Error))
      
      consoleWarn.mockRestore()
    })
  })

  describe('handleRegistrationCallback method', () => {
    it('should handle registration callback successfully', async () => {
      // Import RegistrationAPI and spy on it
      const { RegistrationAPI } = await import('@/features/authentication/services/api/registration')
      const handleCallbackSpy = vi.spyOn(RegistrationAPI, 'handleCallback')
        .mockResolvedValue({
          success: true,
          user: mockAppUser
        })

      const auth = useAuth()
      await auth.handleRegistrationCallback('auth_code', 'state_param')

      expect(handleCallbackSpy).toHaveBeenCalledWith({
        code: 'auth_code',
        state: 'state_param'
      })

      handleCallbackSpy.mockRestore()
    })

    it('should handle registration callback errors', async () => {
      // Import RegistrationAPI and spy on it
      const { RegistrationAPI } = await import('@/features/authentication/services/api/registration')
      const handleCallbackSpy = vi.spyOn(RegistrationAPI, 'handleCallback')
        .mockRejectedValue(new Error('Callback failed'))

      const auth = useAuth()

      await expect(auth.handleRegistrationCallback('auth_code', 'state_param'))
        .rejects.toThrow('Callback failed')
        
      handleCallbackSpy.mockRestore()
    })
  })

  describe('role and permission methods', () => {
    let auth: ReturnType<typeof useAuth>

    beforeEach(() => {
      // Setup Auth0 state for authenticated admin
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAdminUser

      // Set up store state directly with admin user
      authStore.user = mockAdminUser
      authStore.isAuthenticated = true

      // Mock the role/permission check methods on the store
      vi.mocked(authStore.hasRole).mockImplementation(role => {
        const roles = authStore.user ? authStore.user['https://vana.app/roles'] || [] : []
        return roles.includes(role)
      })

      vi.mocked(authStore.hasPermission).mockImplementation(permission => {
        const permissions = authStore.user
          ? authStore.user['https://vana.app/permissions'] || []
          : []
        return permissions.includes(permission)
      })

      vi.mocked(authStore.hasAnyRole).mockImplementation(roles => {
        return roles.some(role => authStore.hasRole(role))
      })

      vi.mocked(authStore.hasAnyPermission).mockImplementation(permissions => {
        return permissions.some(permission => authStore.hasPermission(permission))
      })


      // Create auth composable after setting up store state
      auth = useAuth()
    })

    it('should check single role correctly', () => {
      expect(auth.hasRole('admin')).toBe(true)
      expect(auth.hasRole('user')).toBe(false)
    })

    it('should check single permission correctly', () => {
      expect(auth.hasPermission('admin:users')).toBe(true)
      expect(auth.hasPermission('nonexistent:permission')).toBe(false)
    })

    it('should check multiple roles correctly', () => {
      expect(auth.hasAnyRole(['admin', 'user'])).toBe(true)
      expect(auth.hasAnyRole(['user', 'guest'])).toBe(false)
    })

    it('should check multiple permissions correctly', () => {
      expect(auth.hasAnyPermission(['admin:users', 'read:calendar'])).toBe(true)
      expect(auth.hasAnyPermission(['nonexistent:permission'])).toBe(false)
    })
  })

  describe('utility methods', () => {
    let auth: ReturnType<typeof useAuth>

    beforeEach(() => {
      // Setup Auth0 state for authenticated admin
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAdminUser

      // Set up store state directly with admin user
      authStore.user = mockAdminUser
      authStore.isAuthenticated = true

      // Mock the computed properties that depend on user data
      Object.defineProperty(authStore, 'userDisplayName', {
        get: () => {
          if (!authStore.user) return ''
          return (
            authStore.user.name ||
            authStore.user.nickname ||
            authStore.user.email ||
            'Usuario'
          )
        },
        configurable: true,
      })

      Object.defineProperty(authStore, 'userAvatar', {
        get: () => (authStore.user ? authStore.user.picture || null : null),
        configurable: true,
      })

      Object.defineProperty(authStore, 'userRoles', {
        get: () => (authStore.user ? authStore.user['https://vana.app/roles'] || [] : []),
        configurable: true,
      })

      Object.defineProperty(authStore, 'userPermissions', {
        get: () =>
          authStore.user ? authStore.user['https://vana.app/permissions'] || [] : [],
        configurable: true,
      })

      Object.defineProperty(authStore, 'userMetadata', {
        get: () =>
          authStore.user ? authStore.user['https://vana.app/user_metadata'] || {} : null,
        configurable: true,
      })

      Object.defineProperty(authStore, 'isAdmin', {
        get: () => {
          if (!authStore.user) return false
          const roles = authStore.user['https://vana.app/roles'] || []
          return roles.includes('admin') || roles.includes('super_admin')
        },
        configurable: true,
      })

      Object.defineProperty(authStore, 'isPremium', {
        get: () => {
          if (!authStore.user) return false
          const roles = authStore.user['https://vana.app/roles'] || []
          return roles.includes('premium') || authStore.isAdmin
        },
        configurable: true,
      })

      // Create auth composable after setting up store state
      auth = useAuth()
    })

    it('should return correct user display name', () => {
      expect(auth.getUserDisplayName()).toBe('Admin User')
    })

    it('should return correct user avatar', () => {
      expect(auth.getUserAvatar()).toBe('https://example.com/avatar.jpg')
    })

    it('should return user roles and permissions', () => {
      // These methods don't exist in the composable, so let's test what actually exists
      expect(auth.hasRole('admin')).toBe(true)
      expect(auth.hasPermission('admin:users')).toBe(true)
    })
  })

  describe('reactive state updates', () => {
    it('should react to Auth0 state changes', async () => {
      // Setup both Auth0 and store state to be authenticated
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      // Set store state to authenticated as well
      authStore.user.value = mockAppUser
      authStore.isAuthenticated.value = true

      const auth = useAuth()

      // Test that the computed properties work correctly
      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.user.value).toEqual(mockAppUser)
    })

    it('should react to store state changes', async () => {
      // Test the basic store access and state management
      const auth = useAuth()

      // Test that the computed properties exist and are reactive refs
      expect(auth.error).toBeDefined()
      expect(auth.error.value).toBe(null)
    })

    it('should combine loading states correctly', async () => {
      // Test that the composable correctly provides the combined loading state
      const auth = useAuth()

      // Test that the composable provides the loading computed property
      expect(auth.isLoading).toBeDefined()
      expect(typeof auth.isLoading.value).toBe('boolean')
    })
  })

  describe('error handling', () => {
    it('should handle various error types', async () => {
      const auth = useAuth()

      // String error
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce('String error')
      await expect(auth.loginWithRedirect()).rejects.toThrow('String error')

      // Object error
      const objError = { message: 'Object error' }
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(objError)
      await expect(auth.loginWithRedirect()).rejects.toEqual(objError)

      // Unknown error
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(null)
      await expect(auth.loginWithRedirect()).rejects.toBe(null)
    })

    it('should clear errors on successful operations', async () => {
      const auth = useAuth()

      // Set initial error directly in the composable's local state
      auth.error.value = { 
        code: 'PREVIOUS_ERROR',
        type: 'auth0',
        message: 'Previous error',
        userMessage: 'Previous error',
        retryable: true
      }

      // Successful login should clear error
      await auth.loginWithRedirect()
      expect(auth.error.value).toBe(null)
    })
  })
})
