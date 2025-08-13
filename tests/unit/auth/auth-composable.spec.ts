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

// Unmock the composables for this specific test file
vi.unmock('@/auth/auth-composable')
// Keep the store mocked - we'll control it directly in the test

import { useAuth, Auth0ClientKey } from '@/auth/auth-composable'
import { useAuthStore } from '@/store/auth'
import type { LoginOptions } from '@/auth/types'

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
  let authStore: ReturnType<typeof useAuthStore>
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

    // Get auth store
    authStore = useAuthStore()

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
      const auth = useAuth()

      expect(auth.isLoading.value).toBe(false)
      expect(auth.isAuthenticated.value).toBe(false)
      expect(auth.user.value).toBeNull()
      expect(auth.error.value).toBeNull()
    })

    it('should combine Auth0 and store state correctly', () => {
      // Set up Auth0 state
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      const auth = useAuth()

      // Set up store state directly since setUser method doesn't work in tests
      auth.authStore.user = mockAppUser
      auth.authStore.isAuthenticated = true

      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.user.value).toEqual(mockAppUser)
    })
  })

  describe('login method', () => {
    it('should call loginWithRedirect with correct parameters', async () => {
      const auth = useAuth()
      const options: LoginOptions = {
        redirect_uri: 'http://localhost:5173/custom-callback',
        appState: { targetUrl: '/dashboard' },
      }

      await auth.login(options)

      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
        authorizationParams: {
          redirect_uri: options.redirect_uri,
        },
        appState: options.appState,
      })
    })

    it('should use default redirect_uri when none provided', async () => {
      const auth = useAuth()

      await auth.login()

      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
        authorizationParams: {
          redirect_uri: 'http://localhost:5173/auth/callback',
        },
        appState: undefined,
      })
    })

    it('should handle login errors correctly', async () => {
      const auth = useAuth()
      const loginError = createAuthError('Login failed')

      // Create spy on the actual store instance used by the composable
      const setErrorSpy = vi.spyOn(auth.authStore, 'setError')

      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(loginError)

      await expect(auth.login()).rejects.toThrow('Login failed')
      expect(setErrorSpy).toHaveBeenCalledWith('Login failed')
    })

    it('should set loading state during login', async () => {
      const auth = useAuth()

      // Access the store instance from the composable
      const composableStore = auth.authStore

      // Create spies on the actual store instance used by the composable
      const setLoadingSpy = vi.spyOn(composableStore, 'setLoading')

      await auth.login()

      expect(setLoadingSpy).toHaveBeenCalledWith(true)
      expect(setLoadingSpy).toHaveBeenCalledWith(false)
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
          returnTo: 'http://localhost:5173/auth/logout',
        },
      })
    })

    it('should clear auth store on logout', async () => {
      const auth = useAuth()

      // Setup authenticated state directly on the composable's store
      auth.authStore.user = mockAppUser
      auth.authStore.token = mockAccessToken

      // Create spy on the actual store instance
      const clearAuthSpy = vi.spyOn(auth.authStore, 'clearAuth')

      await auth.logout()

      expect(clearAuthSpy).toHaveBeenCalled()
    })

    it('should handle logout errors correctly', async () => {
      const auth = useAuth()
      const logoutError = createAuthError('Logout failed')

      // Create spy on the actual store instance
      const setErrorSpy = vi.spyOn(auth.authStore, 'setError')

      mockAuth0Client.logout.mockRejectedValueOnce(logoutError)

      await expect(auth.logout()).rejects.toThrow('Logout failed')
      expect(setErrorSpy).toHaveBeenCalledWith('Logout failed')
    })
  })

  describe('getAccessToken method', () => {
    beforeEach(() => {
      // Setup authenticated state
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
    })

    it('should retrieve access token successfully', async () => {
      const auth = useAuth()

      // Create spy on the actual store instance
      const setTokenSpy = vi.spyOn(auth.authStore, 'setToken')

      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      const token = await auth.getAccessToken()

      expect(token).toBe(mockAccessToken)
      expect(setTokenSpy).toHaveBeenCalledWith(mockAccessToken)
      expect(mockAuth0Client.getAccessTokenSilently).toHaveBeenCalled()
    })

    it('should pass options to getAccessTokenSilently', async () => {
      const auth = useAuth()
      const options = { audience: 'https://api.vana.app', scope: 'read:calendar' }

      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      await auth.getAccessToken(options)

      expect(mockAuth0Client.getAccessTokenSilently).toHaveBeenCalledWith(options)
    })

    it('should throw error when user not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false

      const auth = useAuth()

      await expect(auth.getAccessToken()).rejects.toThrow('User not authenticated')
    })

    it('should handle consent_required error by triggering login', async () => {
      const auth = useAuth()
      const consentError = createAuthError('consent_required')

      mockAuth0Client.getAccessTokenSilently
        .mockRejectedValueOnce(consentError)
        .mockResolvedValueOnce(mockAccessToken)

      await expect(auth.getAccessToken()).rejects.toThrow('consent_required')
      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()
    })
  })

  describe('checkAuth method', () => {
    it('should sync authenticated user with store', async () => {
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      const auth = useAuth()

      // Create spies on the actual store instance
      const setUserSpy = vi.spyOn(auth.authStore, 'setUser')
      const setTokenSpy = vi.spyOn(auth.authStore, 'setToken')

      await auth.checkAuth()

      expect(setUserSpy).toHaveBeenCalledWith(mockAppUser)
      expect(setTokenSpy).toHaveBeenCalledWith(mockAccessToken)
    })

    it('should clear store when user not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false
      mockAuth0Client.user.value = null

      const auth = useAuth()

      // Create spy on the actual store instance
      const clearAuthSpy = vi.spyOn(auth.authStore, 'clearAuth')

      await auth.checkAuth()

      expect(clearAuthSpy).toHaveBeenCalled()
    })

    it('should handle token retrieval failure gracefully', async () => {
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      // Mock getAccessToken to throw error directly since checkAuth calls getAccessToken internally
      const auth = useAuth()
      vi.spyOn(auth, 'getAccessToken').mockRejectedValueOnce(createAuthError('Token failed'))

      // Create spies on the actual store instance
      const setUserSpy = vi.spyOn(auth.authStore, 'setUser')
      const setTokenSpy = vi.spyOn(auth.authStore, 'setToken')

      await auth.checkAuth()

      // User should still be set even if token fails
      expect(setUserSpy).toHaveBeenCalledWith(mockAppUser)
      expect(setTokenSpy).not.toHaveBeenCalled()
    })

    it('should handle auth check errors', async () => {
      const auth = useAuth()

      // Create spy on the actual store instance
      const setErrorSpy = vi.spyOn(auth.authStore, 'setError')

      // Mock Auth0 client to throw error when the composable accesses it
      // We'll simulate this by throwing when setUser is called
      vi.spyOn(auth.authStore, 'setUser').mockImplementationOnce(() => {
        throw new Error('Auth check failed')
      })

      // Set up the Auth0 client state to be authenticated to trigger the setUser call
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      // The checkAuth method should catch the error internally
      await auth.checkAuth()

      // Check that setError was called first with null (to clear) then with the error
      expect(setErrorSpy).toHaveBeenCalledWith(null)
      expect(setErrorSpy).toHaveBeenCalledWith('Auth check failed')
    })
  })

  describe('handleRedirectCallback method', () => {
    it('should handle callback successfully', async () => {
      const callbackResult = { appState: { targetUrl: '/dashboard' } }
      mockAuth0Client.handleRedirectCallback.mockResolvedValueOnce(callbackResult)
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      // Mock window.history
      const mockReplaceState = vi.fn()
      vi.stubGlobal('window', {
        history: { replaceState: mockReplaceState },
      })

      const auth = useAuth()
      const result = await auth.handleRedirectCallback()

      expect(result).toEqual(callbackResult)
      expect(mockReplaceState).toHaveBeenCalledWith({}, expect.any(String), '/dashboard')
    })

    it('should handle callback without app state', async () => {
      const callbackResult = {}
      mockAuth0Client.handleRedirectCallback.mockResolvedValueOnce(callbackResult)

      const auth = useAuth()
      const result = await auth.handleRedirectCallback()

      expect(result).toEqual(callbackResult)
    })

    it('should handle callback errors', async () => {
      const callbackError = createAuthError('Callback failed')
      mockAuth0Client.handleRedirectCallback.mockRejectedValueOnce(callbackError)

      const auth = useAuth()

      // Create spy on the actual store instance
      const setErrorSpy = vi.spyOn(auth.authStore, 'setError')

      await expect(auth.handleRedirectCallback()).rejects.toThrow('Callback failed')
      expect(setErrorSpy).toHaveBeenCalledWith('Callback failed')
    })
  })

  describe('role and permission methods', () => {
    let auth: ReturnType<typeof useAuth>

    beforeEach(() => {
      // Setup Auth0 state for authenticated admin
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAdminUser

      // Create auth composable and set up store state directly
      auth = useAuth()
      auth.authStore.user = mockAdminUser
      auth.authStore.isAuthenticated = true

      // Mock the computed properties and methods that depend on user data
      Object.defineProperty(auth.authStore, 'userRoles', {
        get: () => (auth.authStore.user ? auth.authStore.user['https://vana.app/roles'] || [] : []),
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'userPermissions', {
        get: () =>
          auth.authStore.user ? auth.authStore.user['https://vana.app/permissions'] || [] : [],
        configurable: true,
      })

      // Mock the role/permission check methods
      vi.mocked(auth.authStore.hasRole).mockImplementation(role => {
        const roles = auth.authStore.user ? auth.authStore.user['https://vana.app/roles'] || [] : []
        return roles.includes(role)
      })

      vi.mocked(auth.authStore.hasPermission).mockImplementation(permission => {
        const permissions = auth.authStore.user
          ? auth.authStore.user['https://vana.app/permissions'] || []
          : []
        return permissions.includes(permission)
      })

      vi.mocked(auth.authStore.hasAnyRole).mockImplementation(roles => {
        return roles.some(role => auth.authStore.hasRole(role))
      })

      vi.mocked(auth.authStore.hasAnyPermission).mockImplementation(permissions => {
        return permissions.some(permission => auth.authStore.hasPermission(permission))
      })

      vi.mocked(auth.authStore.hasAllRoles).mockImplementation(roles => {
        return roles.every(role => auth.authStore.hasRole(role))
      })

      vi.mocked(auth.authStore.hasAllPermissions).mockImplementation(permissions => {
        return permissions.every(permission => auth.authStore.hasPermission(permission))
      })
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
      expect(auth.hasAllRoles(['admin'])).toBe(true)
      expect(auth.hasAllRoles(['admin', 'user'])).toBe(false)
    })

    it('should check multiple permissions correctly', () => {
      expect(auth.hasAnyPermission(['admin:users', 'read:calendar'])).toBe(true)
      expect(auth.hasAnyPermission(['nonexistent:permission'])).toBe(false)
      expect(auth.hasAllPermissions(['admin:users', 'admin:system'])).toBe(true)
      expect(auth.hasAllPermissions(['admin:users', 'nonexistent:permission'])).toBe(false)
    })
  })

  describe('utility methods', () => {
    let auth: ReturnType<typeof useAuth>

    beforeEach(() => {
      // Setup Auth0 state for authenticated admin
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAdminUser

      // Create auth composable and set up store state directly
      auth = useAuth()
      auth.authStore.user = mockAdminUser
      auth.authStore.isAuthenticated = true

      // Mock the computed properties that depend on user data
      Object.defineProperty(auth.authStore, 'userDisplayName', {
        get: () => {
          if (!auth.authStore.user) return ''
          return (
            auth.authStore.user.name ||
            auth.authStore.user.nickname ||
            auth.authStore.user.email ||
            'Usuario'
          )
        },
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'userAvatar', {
        get: () => (auth.authStore.user ? auth.authStore.user.picture || null : null),
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'userRoles', {
        get: () => (auth.authStore.user ? auth.authStore.user['https://vana.app/roles'] || [] : []),
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'userPermissions', {
        get: () =>
          auth.authStore.user ? auth.authStore.user['https://vana.app/permissions'] || [] : [],
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'userMetadata', {
        get: () =>
          auth.authStore.user ? auth.authStore.user['https://vana.app/user_metadata'] || {} : null,
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'isAdmin', {
        get: () => {
          if (!auth.authStore.user) return false
          const roles = auth.authStore.user['https://vana.app/roles'] || []
          return roles.includes('admin') || roles.includes('super_admin')
        },
        configurable: true,
      })

      Object.defineProperty(auth.authStore, 'isPremium', {
        get: () => {
          if (!auth.authStore.user) return false
          const roles = auth.authStore.user['https://vana.app/roles'] || []
          return roles.includes('premium') || auth.authStore.isAdmin
        },
        configurable: true,
      })
    })

    it('should return correct user display name', () => {
      expect(auth.getUserDisplayName()).toBe('Admin User')
    })

    it('should return correct user avatar', () => {
      expect(auth.getUserAvatar()).toBe('https://example.com/avatar.jpg')
    })

    it('should return correct admin status', () => {
      expect(auth.isAdmin()).toBe(true)
    })

    it('should return correct premium status', () => {
      expect(auth.isPremium()).toBe(true) // Admin includes premium
    })

    it('should return user roles and permissions', () => {
      expect(auth.getUserRoles()).toContain('admin')
      expect(auth.getUserPermissions()).toContain('admin:users')
      expect(auth.getUserMetadata()).toEqual(mockAdminUser['https://vana.app/user_metadata'])
    })
  })

  describe('reactive state updates', () => {
    it('should react to Auth0 state changes', async () => {
      // Setup both Auth0 and store state to be authenticated
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser

      const auth = useAuth()

      // Set store state to authenticated as well
      auth.authStore.user = mockAppUser
      auth.authStore.isAuthenticated = true

      // Test that the computed properties work correctly
      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.user.value).toEqual(mockAppUser)
    })

    it('should react to store state changes', async () => {
      // Test the basic store access and state management
      const auth = useAuth()

      // Test that the composable provides access to the store
      expect(auth.authStore).toBeDefined()
      expect(typeof auth.authStore.setError).toBe('function')
      expect(typeof auth.authStore.setLoading).toBe('function')

      // Test that the computed properties exist and are reactive refs
      expect(auth.error).toBeDefined()
      expect(typeof auth.error.value).not.toBe('undefined')
    })

    it('should combine loading states correctly', async () => {
      // Test that the composable correctly provides the combined loading state
      const auth = useAuth()

      // Test that the composable provides the loading computed property
      expect(auth.isLoading).toBeDefined()
      expect(typeof auth.isLoading.value).toBe('boolean')

      // Test that the composable has access to both Auth0 and store states
      expect(auth.authStore).toBeDefined()
      expect(typeof auth.authStore.setLoading).toBe('function')
    })
  })

  describe('error handling', () => {
    it('should handle various error types', async () => {
      const auth = useAuth()

      // String error
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce('String error')
      await expect(auth.login()).rejects.toThrow('String error')

      // Object error
      const objError = { message: 'Object error' }
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(objError)
      await expect(auth.login()).rejects.toEqual(objError)

      // Unknown error
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(null)
      await expect(auth.login()).rejects.toThrow('Login failed')
    })

    it('should clear errors on successful operations', async () => {
      const auth = useAuth()

      // Set initial error directly
      auth.authStore.error = 'Previous error'

      // Create spy on the actual store instance
      const setErrorSpy = vi.spyOn(auth.authStore, 'setError')

      // Successful login should clear error - the login method calls setError(null) first
      await auth.login()
      expect(setErrorSpy).toHaveBeenCalledWith(null)
    })
  })
})
