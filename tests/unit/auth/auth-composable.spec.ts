/**
 * useAuth Composable Tests
 * Comprehensive unit tests for the auth composable
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
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
      length: 0
    }
    vi.stubGlobal('localStorage', mockLocalStorage)

    // Setup Pinia with proper mocking
    const pinia = createTestingPinia({ 
      createSpy: vi.fn, 
      stubActions: false 
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
    mockInject.mockImplementation((key) => {
      if (key === Auth0ClientKey) {
        return mockAuth0Client
      }
      return undefined
    })

    // Get auth store
    authStore = useAuthStore()
    
    // Create spy functions that still call originals but can be tracked
    vi.spyOn(authStore, 'setUser')
    vi.spyOn(authStore, 'setToken') 
    vi.spyOn(authStore, 'setLoading')
    vi.spyOn(authStore, 'setError')
    vi.spyOn(authStore, 'clearError')
    vi.spyOn(authStore, 'clearAuth')
    vi.spyOn(authStore, 'hasRole')
    vi.spyOn(authStore, 'hasPermission')
    vi.spyOn(authStore, 'hasAnyRole')
    vi.spyOn(authStore, 'hasAnyPermission')
    vi.spyOn(authStore, 'hasAllRoles')
    vi.spyOn(authStore, 'hasAllPermissions')
  })

  afterEach(() => {
    cleanupAuthMocks()
    mockInject.mockReset()
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

      // Set up store state
      authStore.setUser(mockAppUser)

      const auth = useAuth()

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

      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(loginError)

      await expect(auth.login()).rejects.toThrow('Login failed')
      expect(authStore.setError).toHaveBeenCalledWith('Login failed')
    })

    it('should set loading state during login', async () => {
      const auth = useAuth()

      await auth.login()

      expect(authStore.setLoading).toHaveBeenCalledWith(true)
      expect(authStore.setLoading).toHaveBeenCalledWith(false)
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
      // Setup authenticated state
      authStore.setUser(mockAppUser)
      authStore.setToken(mockAccessToken)

      const auth = useAuth()
      await auth.logout()

      expect(authStore.clearAuth).toHaveBeenCalled()
    })

    it('should handle logout errors correctly', async () => {
      const auth = useAuth()
      const logoutError = createAuthError('Logout failed')

      mockAuth0Client.logout.mockRejectedValueOnce(logoutError)

      await expect(auth.logout()).rejects.toThrow('Logout failed')
      expect(authStore.setError).toHaveBeenCalledWith('Logout failed')
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

      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(mockAccessToken)

      const token = await auth.getAccessToken()

      expect(token).toBe(mockAccessToken)
      expect(authStore.setToken).toHaveBeenCalledWith(mockAccessToken)
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
      await auth.checkAuth()

      expect(authStore.setUser).toHaveBeenCalledWith(mockAppUser)
      expect(authStore.setToken).toHaveBeenCalledWith(mockAccessToken)
    })

    it('should clear store when user not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false
      mockAuth0Client.user.value = null

      const auth = useAuth()
      await auth.checkAuth()

      expect(authStore.clearAuth).toHaveBeenCalled()
    })

    it('should handle token retrieval failure gracefully', async () => {
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(createAuthError('Token failed'))

      const auth = useAuth()
      await auth.checkAuth()

      // User should still be set even if token fails
      expect(authStore.setUser).toHaveBeenCalledWith(mockAppUser)
      expect(authStore.setToken).not.toHaveBeenCalled()
    })

    it('should handle auth check errors', async () => {
      const authError = createAuthError('Auth check failed')

      // Mock Auth0 client to throw error
      Object.defineProperty(mockAuth0Client, 'isAuthenticated', {
        get: () => {
          throw authError
        },
      })

      const auth = useAuth()
      await auth.checkAuth()

      expect(authStore.setError).toHaveBeenCalledWith('Auth check failed')
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

      await expect(auth.handleRedirectCallback()).rejects.toThrow('Callback failed')
      expect(authStore.setError).toHaveBeenCalledWith('Callback failed')
    })
  })

  describe('role and permission methods', () => {
    beforeEach(() => {
      // Directly set the store state since the testing pinia setup isn't working with setUser
      authStore.user = mockAdminUser
      authStore.isAuthenticated = true
    })

    it('should check single role correctly', () => {
      const auth = useAuth()

      expect(auth.hasRole('admin')).toBe(true)
      expect(auth.hasRole('user')).toBe(false)
    })

    it('should check single permission correctly', () => {
      const auth = useAuth()

      expect(auth.hasPermission('admin:users')).toBe(true)
      expect(auth.hasPermission('nonexistent:permission')).toBe(false)
    })

    it('should check multiple roles correctly', () => {
      const auth = useAuth()

      expect(auth.hasAnyRole(['admin', 'user'])).toBe(true)
      expect(auth.hasAnyRole(['user', 'guest'])).toBe(false)
      expect(auth.hasAllRoles(['admin'])).toBe(true)
      expect(auth.hasAllRoles(['admin', 'user'])).toBe(false)
    })

    it('should check multiple permissions correctly', () => {
      const auth = useAuth()

      expect(auth.hasAnyPermission(['admin:users', 'read:calendar'])).toBe(true)
      expect(auth.hasAnyPermission(['nonexistent:permission'])).toBe(false)
      expect(auth.hasAllPermissions(['admin:users', 'admin:system'])).toBe(true)
      expect(auth.hasAllPermissions(['admin:users', 'nonexistent:permission'])).toBe(false)
    })
  })

  describe('utility methods', () => {
    beforeEach(() => {
      // Directly set the store state since the testing pinia setup isn't working with setUser
      authStore.user = mockAdminUser
      authStore.isAuthenticated = true
    })

    it('should return correct user display name', () => {
      const auth = useAuth()
      expect(auth.getUserDisplayName()).toBe('Admin User')
    })

    it('should return correct user avatar', () => {
      const auth = useAuth()
      expect(auth.getUserAvatar()).toBe('https://example.com/avatar.jpg')
    })

    it('should return correct admin status', () => {
      const auth = useAuth()
      expect(auth.isAdmin()).toBe(true)
    })

    it('should return correct premium status', () => {
      const auth = useAuth()
      expect(auth.isPremium()).toBe(true) // Admin includes premium
    })

    it('should return user roles and permissions', () => {
      const auth = useAuth()

      expect(auth.getUserRoles()).toContain('admin')
      expect(auth.getUserPermissions()).toContain('admin:users')
      expect(auth.getUserMetadata()).toEqual(mockAdminUser['https://vana.app/user_metadata'])
    })
  })

  describe('reactive state updates', () => {
    it('should react to Auth0 state changes', async () => {
      const auth = useAuth()

      // Initially not authenticated
      expect(auth.isAuthenticated.value).toBe(false)

      // Simulate Auth0 state change - need to update both Auth0 and store state
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockAppUser
      authStore.setUser(mockAppUser)

      await nextTick()

      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.user.value).toEqual(mockAppUser)
    })

    it('should react to store state changes', async () => {
      const auth = useAuth()

      // Initially no error
      expect(auth.error.value).toBeNull()

      // Set store error using the proper method
      authStore.setError('Test error')

      await nextTick()

      expect(auth.error.value).toBe('Test error')
    })

    it('should combine loading states correctly', async () => {
      const auth = useAuth()

      // Test Auth0 loading
      mockAuth0Client.isLoading.value = true
      await nextTick()
      expect(auth.isLoading.value).toBe(true)

      // Test store loading
      mockAuth0Client.isLoading.value = false
      authStore.setLoading(true)
      await nextTick()
      expect(auth.isLoading.value).toBe(true)

      // Both false
      authStore.setLoading(false)
      await nextTick()
      expect(auth.isLoading.value).toBe(false)
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

      // Set initial error
      authStore.setError('Previous error')
      
      // Clear the spy call history
      vi.mocked(authStore.setError).mockClear()

      // Successful login should clear error
      await auth.login()
      expect(authStore.setError).toHaveBeenCalledWith(null)
    })
  })
})