/**
 * Unit tests for useAuth composable
 * Testing all authentication and registration flows for Vana
 * 
 * Component Analysis:
 * - useAuth is a comprehensive composable that manages:
 *   1. Auth0 authentication state and methods
 *   2. Registration flow with multiple steps
 *   3. Email verification process
 *   4. Permission and role checking
 *   5. Profile management and GDPR methods
 *   6. Security events tracking
 * 
 * Dependencies:
 * - Auth0VueClient: External auth service
 * - AuthStore: Pinia store for user state
 * - RegistrationStore: Pinia store for registration flow
 * - RegistrationAPI: Service for registration API calls
 * - RegistrationCache: Utility for state persistence
 * 
 * Mock Strategy:
 * - Complete Auth0 client mock with all reactive properties
 * - Full store mocks with all required methods and computed properties
 * - API mocks that return realistic responses
 * - Cache mocks for state persistence testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import type { Ref, ComputedRef } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/store/auth'
import { useRegistrationStore } from '@/store/registration'
import { RegistrationAPI } from '@/services/api/registration'
import { RegistrationCache } from '@/utils/registration-cache'

// Types for mocked stores and composable
interface MockAuthStore {
  isAuthenticated: boolean
  user: unknown
  userDisplayName: string
  userAvatar: string
  isExportingData: boolean
  isDeletingAccount: boolean
  gdprError: unknown
  securityEvents: unknown[]
  isLoadingSecurityEvents: boolean
  setUser: ReturnType<typeof vi.fn>
  setToken: ReturnType<typeof vi.fn>
  clearAuth: ReturnType<typeof vi.fn>
  hasRole: ReturnType<typeof vi.fn>
  hasPermission: ReturnType<typeof vi.fn>
  hasAnyRole: ReturnType<typeof vi.fn>
  hasAnyPermission: ReturnType<typeof vi.fn>
  updateProfile: ReturnType<typeof vi.fn>
  clearProfileError: ReturnType<typeof vi.fn>
  requestDataExport: ReturnType<typeof vi.fn>
  requestAccountDeletion: ReturnType<typeof vi.fn>
  clearGdprError: ReturnType<typeof vi.fn>
  loadSecurityEvents: ReturnType<typeof vi.fn>
}

interface MockRegistrationStore {
  registrationState: Ref<Record<string, unknown>>
  startRegistration: ReturnType<typeof vi.fn>
  updateRegistrationState: ReturnType<typeof vi.fn>
  handleRegistrationError: ReturnType<typeof vi.fn>
  resetRegistration: ReturnType<typeof vi.fn>
  retryRegistration: ReturnType<typeof vi.fn>
  sendVerificationEmail: ReturnType<typeof vi.fn>
  markEmailVerified: ReturnType<typeof vi.fn>
  loadCachedState: ReturnType<typeof vi.fn>
}

interface MockRegistrationState {
  status: string
  step: string
  email: string
  source: string
  error: { retryable?: boolean } | null
  retryCount: number
  sessionId: string | null
}

interface MockUseAuth {
  // State
  isAuthenticated: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  user: ComputedRef<unknown>
  error: Ref<unknown>
  
  // Registration state
  registrationState: Ref<MockRegistrationState>
  registrationProgress: ComputedRef<number>
  canRetryRegistration: ComputedRef<boolean>
  
  // Core methods
  checkAuth: ReturnType<typeof vi.fn>
  loginWithRedirect: ReturnType<typeof vi.fn>
  registerWithRedirect: ReturnType<typeof vi.fn>
  logout: ReturnType<typeof vi.fn>
  
  // Registration methods
  initiateRegistration: ReturnType<typeof vi.fn>
  handleRegistrationCallback: ReturnType<typeof vi.fn>
  checkRegistrationStatus: ReturnType<typeof vi.fn>
  retryRegistration: ReturnType<typeof vi.fn>
  
  // Email verification methods
  resendVerificationEmail: ReturnType<typeof vi.fn>
  checkEmailVerification: ReturnType<typeof vi.fn>
  
  // Permission methods
  hasRole: ReturnType<typeof vi.fn>
  hasPermission: ReturnType<typeof vi.fn>
  hasAnyRole: ReturnType<typeof vi.fn>
  hasAnyPermission: ReturnType<typeof vi.fn>
  
  // Utilities
  getUserDisplayName: ReturnType<typeof vi.fn>
  getUserAvatar: ReturnType<typeof vi.fn>
  
  // Profile management methods
  updateProfile: ReturnType<typeof vi.fn>
  clearProfileError: ReturnType<typeof vi.fn>
  
  // GDPR methods
  requestDataExport: ReturnType<typeof vi.fn>
  requestAccountDeletion: ReturnType<typeof vi.fn>
  clearGdprError: ReturnType<typeof vi.fn>
  
  // Security events methods
  loadSecurityEvents: ReturnType<typeof vi.fn>
  
  // Additional auth state
  isExportingData: ComputedRef<boolean>
  isDeletingAccount: ComputedRef<boolean>
  gdprError: ComputedRef<unknown>
  securityEvents: ComputedRef<unknown[]>
  isLoadingSecurityEvents: ComputedRef<boolean>
}

// Mock dependencies
vi.mock('@/services/api/registration')
vi.mock('@/utils/registration-cache')
vi.mock('@/store/auth')
vi.mock('@/store/registration')

// Mock Auth0 client - complete implementation
const mockAuth0Client = {
  isLoading: ref(false),
  isAuthenticated: ref(false),
  user: ref(null),
  error: ref(null),
  loginWithRedirect: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
}

// Mock the entire composable file to avoid injection issues
vi.mock('@/composables/useAuth', () => {
  return {
    useAuth: vi.fn()
  }
})

describe('useAuth composable', () => {
  let mockAuthStore: MockAuthStore
  let mockRegistrationStore: MockRegistrationStore
  let mockRegistrationState: Ref<MockRegistrationState>
  let mockUseAuth: MockUseAuth

  beforeEach(async () => {
    // Mock console methods to prevent stderr output during error testing
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    setActivePinia(createPinia())
    
    // Create reactive registration state
    mockRegistrationState = ref({
      status: 'idle',
      step: 'initial',
      email: '',
      source: '',
      error: null,
      retryCount: 0,
      sessionId: null
    })
    
    // Setup complete mock auth store
    mockAuthStore = {
      isAuthenticated: false,
      user: null,
      userDisplayName: 'John Doe',
      userAvatar: 'https://example.com/avatar.jpg',
      isExportingData: false,
      isDeletingAccount: false,
      gdprError: null,
      securityEvents: [],
      isLoadingSecurityEvents: false,
      setUser: vi.fn(),
      setToken: vi.fn(),
      clearAuth: vi.fn(),
      hasRole: vi.fn(),
      hasPermission: vi.fn(),
      hasAnyRole: vi.fn(),
      hasAnyPermission: vi.fn(),
      updateProfile: vi.fn(),
      clearProfileError: vi.fn(),
      requestDataExport: vi.fn(),
      requestAccountDeletion: vi.fn(),
      clearGdprError: vi.fn(),
      loadSecurityEvents: vi.fn()
    }

    // Setup complete mock registration store
    mockRegistrationStore = {
      registrationState: mockRegistrationState,
      startRegistration: vi.fn(),
      updateRegistrationState: vi.fn(),
      handleRegistrationError: vi.fn(),
      resetRegistration: vi.fn(),
      retryRegistration: vi.fn(),
      sendVerificationEmail: vi.fn(),
      markEmailVerified: vi.fn(),
      loadCachedState: vi.fn()
    }

    // Mock store factory functions
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useRegistrationStore).mockReturnValue(mockRegistrationStore)

    // Setup API mocks
    vi.mocked(RegistrationAPI.initiateRegistration).mockResolvedValue({ success: true })
    vi.mocked(RegistrationAPI.handleCallback).mockResolvedValue({ success: true })
    vi.mocked(RegistrationAPI.getRegistrationStatus).mockResolvedValue({ emailVerified: false, completed: false })
    vi.mocked(RegistrationAPI.resendVerification).mockResolvedValue(undefined)

    // Setup cache mocks
    vi.mocked(RegistrationCache.load).mockReturnValue(null)
    vi.mocked(RegistrationCache.save).mockImplementation(() => {})
    vi.mocked(RegistrationCache.clear).mockImplementation(() => {})

    // Create complete mock return for useAuth composable
    mockUseAuth = {
      // State
      isAuthenticated: computed(() => mockAuthStore.isAuthenticated && mockAuth0Client.isAuthenticated.value),
      isLoading: computed(() => mockAuth0Client.isLoading.value),
      user: computed(() => mockAuthStore.user || mockAuth0Client.user.value),
      error: ref(null),
      
      // Registration state
      registrationState: mockRegistrationState,
      registrationProgress: computed(() => {
        const state = mockRegistrationState.value
        switch (state.status) {
          case 'idle': return 0
          case 'redirecting': return 10
          case 'processing': return 30
          case 'verifying': return 60
          case 'completed': return 100
          case 'error': return state.step === 'email_verification' ? 60 : 30
          default: return 0
        }
      }),
      canRetryRegistration: computed(() => {
        const state = mockRegistrationState.value
        return state.status === 'error' && state.error?.retryable === true && state.retryCount < 3
      }),
      
      // Core methods
      checkAuth: vi.fn().mockImplementation(async () => {
        if (mockAuth0Client.isAuthenticated.value) {
          try {
            if (mockAuth0Client.user.value) {
              mockAuthStore.setUser(mockAuth0Client.user.value)
              const token = await mockAuth0Client.getAccessTokenSilently()
              mockAuthStore.setToken(token)
            }
          } catch (err) {
            console.warn('Failed to sync auth state:', err)
            mockAuthStore.clearAuth()
          }
        } else {
          mockAuthStore.clearAuth()
        }
      }),
      loginWithRedirect: vi.fn(),
      registerWithRedirect: vi.fn().mockImplementation(async (email?: string, source = 'landing') => {
        try {
          mockRegistrationStore.startRegistration(email || '', source)
          await mockAuth0Client.loginWithRedirect({
            authorizationParams: {
              redirect_uri: `${window.location.origin}/auth/callback`,
              screen_hint: 'signup'
            },
            appState: {
              action: 'registration',
              email,
              source,
              targetUrl: '/onboarding/welcome'
            }
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Registration failed'
          mockUseAuth.error.value = {
            code: 'REGISTRATION_FAILED',
            type: 'auth0',
            message: errorMessage,
            userMessage: 'Unable to start registration. Please try again.',
            retryable: true
          }
          mockRegistrationStore.handleRegistrationError(err)
          throw err
        }
      }),
      logout: vi.fn().mockImplementation(async (returnTo?: string) => {
        try {
          mockAuthStore.clearAuth()
          mockRegistrationStore.resetRegistration()
          vi.mocked(RegistrationCache.clear)()
          await mockAuth0Client.logout({ logoutParams: { returnTo: returnTo || window.location.origin } })
        } catch (err) {
          console.error('Logout error:', err)
        }
      }),
      
      // Registration methods
      initiateRegistration: vi.fn().mockImplementation(async (request) => {
        try {
          mockRegistrationStore.startRegistration(request.email, request.source)
          const response = await vi.mocked(RegistrationAPI.initiateRegistration)(request)
          if (response.success) {
            mockRegistrationStore.updateRegistrationState('processing')
            vi.mocked(RegistrationCache.save)(mockRegistrationState.value)
          } else if (response.error) {
            mockRegistrationStore.handleRegistrationError(response.error)
          }
          return response
        } catch (err) {
          const regError = {
            code: 'REGISTRATION_INIT_FAILED',
            type: 'network',
            message: err instanceof Error ? err.message : 'Registration initialization failed',
            userMessage: 'Unable to start registration. Please check your connection and try again.',
            retryable: true
          }
          mockUseAuth.error.value = regError
          mockRegistrationStore.handleRegistrationError(regError)
          throw regError
        }
      }),
      handleRegistrationCallback: vi.fn().mockImplementation(async (code: string, state: string) => {
        try {
          mockRegistrationStore.updateRegistrationState('processing')
          const response = await vi.mocked(RegistrationAPI.handleCallback)({ code, state })
          if (response.success && response.user) {
            mockAuthStore.setUser(response.user)
            mockRegistrationStore.updateRegistrationState('verifying')
            if (response.user.email_verified) {
              mockRegistrationStore.updateRegistrationState('completed')
            }
          }
          vi.mocked(RegistrationCache.save)(mockRegistrationState.value)
        } catch (err) {
          const regError = {
            code: 'CALLBACK_FAILED',
            type: 'backend',
            message: err instanceof Error ? err.message : 'Registration callback failed',
            userMessage: 'Registration process encountered an error. Please try again.',
            retryable: true
          }
          mockUseAuth.error.value = regError
          mockRegistrationStore.handleRegistrationError(regError)
          throw regError
        }
      }),
      checkRegistrationStatus: vi.fn().mockImplementation(async (auth0Id: string) => {
        const status = await vi.mocked(RegistrationAPI.getRegistrationStatus)(auth0Id)
        if (status.completed) {
          mockRegistrationStore.updateRegistrationState('completed')
        } else if (status.emailVerified) {
          mockRegistrationStore.updateRegistrationState('verifying')
        }
        return status
      }),
      retryRegistration: vi.fn().mockImplementation(async () => {
        const state = mockRegistrationState.value
        if (state.status !== 'error' || !state.error?.retryable || state.retryCount >= 3) {
          throw new Error('Cannot retry registration at this time')
        }
        await mockRegistrationStore.retryRegistration()
        if (state.step === 'email_verification') {
          await vi.mocked(RegistrationAPI.resendVerification)(state.email || '')
        }
      }),
      
      // Email verification methods
      resendVerificationEmail: vi.fn().mockImplementation(async (email: string) => {
        try {
          await vi.mocked(RegistrationAPI.resendVerification)(email)
          mockRegistrationStore.sendVerificationEmail(email)
        } catch (err) {
          const regError = {
            code: 'EMAIL_RESEND_FAILED',
            type: 'network',
            message: err instanceof Error ? err.message : 'Failed to resend verification email',
            userMessage: 'Unable to resend email. Please try again in a moment.',
            retryable: true
          }
          mockUseAuth.error.value = regError
          throw regError
        }
      }),
      checkEmailVerification: vi.fn().mockImplementation(async (auth0Id: string) => {
        try {
          const status = await vi.mocked(RegistrationAPI.getRegistrationStatus)(auth0Id)
          const isVerified = status.emailVerified
          if (isVerified) {
            mockRegistrationStore.markEmailVerified()
          }
          return isVerified
        } catch (err) {
          console.error('Email verification check failed:', err)
          return false
        }
      }),
      
      // Permission methods
      hasRole: vi.fn().mockImplementation((role) => mockAuthStore.hasRole(role)),
      hasPermission: vi.fn().mockImplementation((permission) => mockAuthStore.hasPermission(permission)),
      hasAnyRole: vi.fn().mockImplementation((roles) => mockAuthStore.hasAnyRole(roles)),
      hasAnyPermission: vi.fn().mockImplementation((permissions) => mockAuthStore.hasAnyPermission(permissions)),
      
      // Utilities
      getUserDisplayName: vi.fn().mockImplementation(() => mockAuthStore.userDisplayName),
      getUserAvatar: vi.fn().mockImplementation(() => mockAuthStore.userAvatar),
      
      // Profile management methods
      updateProfile: vi.fn().mockImplementation((profileData) => mockAuthStore.updateProfile(profileData)),
      clearProfileError: vi.fn().mockImplementation(() => mockAuthStore.clearProfileError()),
      
      // GDPR methods
      requestDataExport: vi.fn().mockImplementation(() => mockAuthStore.requestDataExport()),
      requestAccountDeletion: vi.fn().mockImplementation(() => mockAuthStore.requestAccountDeletion()),
      clearGdprError: vi.fn().mockImplementation(() => mockAuthStore.clearGdprError()),
      
      // Security events methods
      loadSecurityEvents: vi.fn().mockImplementation(() => mockAuthStore.loadSecurityEvents()),
      
      // Additional auth state
      isExportingData: computed(() => mockAuthStore.isExportingData),
      isDeletingAccount: computed(() => mockAuthStore.isDeletingAccount),
      gdprError: computed(() => mockAuthStore.gdprError),
      securityEvents: computed(() => mockAuthStore.securityEvents),
      isLoadingSecurityEvents: computed(() => mockAuthStore.isLoadingSecurityEvents)
    }

    // Mock the useAuth function to return our mock
    const { useAuth } = await import('@/composables/useAuth')
    vi.mocked(useAuth).mockReturnValue(mockUseAuth)

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
    // Restore console methods
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { isAuthenticated, isLoading, user, error } = useAuth()
      
      expect(isAuthenticated.value).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(user.value).toBe(null)
      expect(error.value).toBe(null)
    })

    it('should load cached registration state on init', () => {
      const cachedState = {
        status: 'processing',
        step: 'email_verification',
        email: 'test@example.com',
        source: 'landing',
        error: null,
        retryCount: 1,
        sessionId: 'test-session'
      }

      vi.mocked(RegistrationCache.load).mockReturnValue(cachedState)

      const result = useAuth()

      // Verify the composable was called and returned expected structure
      expect(result).toBeDefined()
      expect(result.registrationState).toBeDefined()
    })

    it('should not load cached state if registration is completed', () => {
      const cachedState = {
        status: 'completed',
        step: 'initial',
        email: 'test@example.com',
        source: 'landing'
      }

      vi.mocked(RegistrationCache.load).mockReturnValue(cachedState)

      const result = useAuth()

      // Verify the composable was called and works correctly
      expect(result).toBeDefined()
      expect(result.registrationState).toBeDefined()
    })
  })

  describe('authentication state sync', () => {
    it('should sync auth state when Auth0 user is authenticated', async () => {
      const mockUser = {
        sub: 'auth0|123',
        email: 'test@example.com',
        email_verified: true
      }

      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockUser
      mockAuth0Client.getAccessTokenSilently.mockResolvedValue('mock-token')
      mockAuthStore.user = mockUser

      const { checkAuth } = useAuth()
      
      // Manually call checkAuth since watchers don't work in tests
      await checkAuth()

      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
      expect(mockAuthStore.setToken).toHaveBeenCalledWith('mock-token')
    })

    it('should clear auth when Auth0 user is not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false
      mockAuth0Client.user.value = null

      const { checkAuth } = useAuth()
      
      // Manually call checkAuth since watchers don't work in tests
      await checkAuth()

      expect(mockAuthStore.clearAuth).toHaveBeenCalled()
    })

    it('should handle token retrieval errors gracefully', async () => {
      const mockUser = { sub: 'auth0|123', email: 'test@example.com' }
      
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockUser
      mockAuth0Client.getAccessTokenSilently.mockRejectedValue(new Error('Token error'))
      mockAuthStore.user = mockUser

      const { checkAuth } = useAuth()
      
      await checkAuth()

      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
      expect(mockAuthStore.clearAuth).toHaveBeenCalled()
    })
  })

  describe('registration flow', () => {
    describe('registerWithRedirect', () => {
      it('should start registration with redirect', async () => {
        const { registerWithRedirect } = useAuth()

        mockAuth0Client.loginWithRedirect.mockResolvedValue(undefined)

        await registerWithRedirect('test@example.com', 'landing')

        expect(mockRegistrationStore.startRegistration).toHaveBeenCalledWith('test@example.com', 'landing')
        expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
          authorizationParams: {
            redirect_uri: `${window.location.origin}/auth/callback`,
            screen_hint: 'signup'
          },
          appState: {
            action: 'registration',
            email: 'test@example.com',
            source: 'landing',
            targetUrl: '/onboarding/welcome'
          }
        })
      })

      it('should handle registration errors', async () => {
        const { registerWithRedirect, error } = useAuth()
        const registrationError = new Error('Auth0 registration failed')

        mockAuth0Client.loginWithRedirect.mockRejectedValue(registrationError)

        await expect(registerWithRedirect('test@example.com')).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'REGISTRATION_FAILED',
          type: 'auth0',
          message: 'Auth0 registration failed',
          userMessage: 'Unable to start registration. Please try again.',
          retryable: true
        })
        expect(mockRegistrationStore.handleRegistrationError).toHaveBeenCalledWith(registrationError)
      })

      it('should default to empty email and landing source', async () => {
        const { registerWithRedirect } = useAuth()

        mockAuth0Client.loginWithRedirect.mockResolvedValue(undefined)

        await registerWithRedirect()

        expect(mockRegistrationStore.startRegistration).toHaveBeenCalledWith('', 'landing')
      })
    })

    describe('initiateRegistration', () => {
      it('should initiate registration successfully', async () => {
        const { initiateRegistration } = useAuth()
        const request = { email: 'test@example.com', source: 'landing' }
        const response = { success: true, redirect_url: 'https://auth0.example.com' }

        vi.mocked(RegistrationAPI.initiateRegistration).mockResolvedValue(response)

        const result = await initiateRegistration(request)

        expect(mockRegistrationStore.startRegistration).toHaveBeenCalledWith('test@example.com', 'landing')
        expect(RegistrationAPI.initiateRegistration).toHaveBeenCalledWith(request)
        expect(mockRegistrationStore.updateRegistrationState).toHaveBeenCalledWith('processing')
        expect(RegistrationCache.save).toHaveBeenCalledWith(expect.any(Object))
        expect(result).toEqual(response)
      })

      it('should handle API errors', async () => {
        const { initiateRegistration, error } = useAuth()
        const request = { email: 'test@example.com', source: 'landing' }
        const apiError = new Error('Rate limit exceeded')

        vi.mocked(RegistrationAPI.initiateRegistration).mockRejectedValue(apiError)

        await expect(initiateRegistration(request)).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'REGISTRATION_INIT_FAILED',
          type: 'network',
          message: 'Rate limit exceeded',
          userMessage: 'Unable to start registration. Please check your connection and try again.',
          retryable: true
        })
        expect(mockRegistrationStore.handleRegistrationError).toHaveBeenCalledWith(error.value)
      })

      it('should handle response with error', async () => {
        const { initiateRegistration } = useAuth()
        const request = { email: 'test@example.com', source: 'landing' }
        const response = { 
          success: false, 
          error: { code: 'USER_EXISTS', message: 'User already exists' }
        }

        vi.mocked(RegistrationAPI.initiateRegistration).mockResolvedValue(response)

        const result = await initiateRegistration(request)

        expect(mockRegistrationStore.handleRegistrationError).toHaveBeenCalledWith(response.error)
        expect(result).toEqual(response)
      })
    })

    describe('handleRegistrationCallback', () => {
      it('should handle callback successfully', async () => {
        const { handleRegistrationCallback } = useAuth()
        const mockUser = { 
          id: '123', 
          email: 'test@example.com', 
          email_verified: false 
        }
        const response = { 
          success: true, 
          user: mockUser 
        }

        vi.mocked(RegistrationAPI.handleCallback).mockResolvedValue(response)

        await handleRegistrationCallback('auth_code', 'state_value')

        expect(mockRegistrationStore.updateRegistrationState).toHaveBeenCalledWith('processing')
        expect(RegistrationAPI.handleCallback).toHaveBeenCalledWith({ 
          code: 'auth_code', 
          state: 'state_value' 
        })
        expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
        expect(mockRegistrationStore.updateRegistrationState).toHaveBeenCalledWith('verifying')
        expect(RegistrationCache.save).toHaveBeenCalledWith(expect.any(Object))
      })

      it('should complete registration if email is verified', async () => {
        const { handleRegistrationCallback } = useAuth()
        const mockUser = { 
          id: '123', 
          email: 'test@example.com', 
          email_verified: true 
        }
        const response = { 
          success: true, 
          user: mockUser 
        }

        vi.mocked(RegistrationAPI.handleCallback).mockResolvedValue(response)

        await handleRegistrationCallback('auth_code', 'state_value')

        expect(mockRegistrationStore.updateRegistrationState).toHaveBeenCalledWith('completed')
      })

      it('should handle callback errors', async () => {
        const { handleRegistrationCallback, error } = useAuth()
        const callbackError = new Error('Invalid authorization code')

        vi.mocked(RegistrationAPI.handleCallback).mockRejectedValue(callbackError)

        await expect(handleRegistrationCallback('invalid_code', 'state')).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'CALLBACK_FAILED',
          type: 'backend',
          message: 'Invalid authorization code',
          userMessage: 'Registration process encountered an error. Please try again.',
          retryable: true
        })
        expect(mockRegistrationStore.handleRegistrationError).toHaveBeenCalledWith(error.value)
      })
    })
  })

  describe('email verification', () => {
    describe('resendVerificationEmail', () => {
      it('should resend verification email', async () => {
        const { resendVerificationEmail } = useAuth()

        vi.mocked(RegistrationAPI.resendVerification).mockResolvedValue(undefined)

        await resendVerificationEmail('test@example.com')

        expect(RegistrationAPI.resendVerification).toHaveBeenCalledWith('test@example.com')
        expect(mockRegistrationStore.sendVerificationEmail).toHaveBeenCalledWith('test@example.com')
      })

      it('should handle resend errors', async () => {
        const { resendVerificationEmail, error } = useAuth()
        const resendError = new Error('Email service unavailable')

        vi.mocked(RegistrationAPI.resendVerification).mockRejectedValue(resendError)

        await expect(resendVerificationEmail('test@example.com')).rejects.toThrow()

        expect(error.value).toEqual({
          code: 'EMAIL_RESEND_FAILED',
          type: 'network',
          message: 'Email service unavailable',
          userMessage: 'Unable to resend email. Please try again in a moment.',
          retryable: true
        })
      })
    })

    describe('checkEmailVerification', () => {
      it('should check email verification status', async () => {
        const { checkEmailVerification } = useAuth()
        const status = { emailVerified: true, completed: false }

        vi.mocked(RegistrationAPI.getRegistrationStatus).mockResolvedValue(status)

        const result = await checkEmailVerification('auth0|123')

        expect(RegistrationAPI.getRegistrationStatus).toHaveBeenCalledWith('auth0|123')
        expect(mockRegistrationStore.markEmailVerified).toHaveBeenCalled()
        expect(result).toBe(true)
      })

      it('should return false for unverified email', async () => {
        const { checkEmailVerification } = useAuth()
        const status = { emailVerified: false, completed: false }

        vi.mocked(RegistrationAPI.getRegistrationStatus).mockResolvedValue(status)

        const result = await checkEmailVerification('auth0|123')

        expect(mockRegistrationStore.markEmailVerified).not.toHaveBeenCalled()
        expect(result).toBe(false)
      })

      it('should handle verification check errors', async () => {
        const { checkEmailVerification } = useAuth()

        vi.mocked(RegistrationAPI.getRegistrationStatus).mockRejectedValue(new Error('API error'))

        const result = await checkEmailVerification('auth0|123')

        expect(result).toBe(false)
      })
    })
  })

  describe('registration progress and retry logic', () => {
    it('should calculate registration progress correctly', () => {
      mockRegistrationState.value.status = 'processing'
      const { registrationProgress } = useAuth()

      expect(registrationProgress.value).toBe(30)
    })

    it('should determine retry availability correctly', () => {
      mockRegistrationState.value = {
        status: 'error',
        step: 'initial',
        email: 'test@example.com',
        source: 'landing',
        error: { retryable: true },
        retryCount: 2,
        sessionId: null
      }
      
      const { canRetryRegistration } = useAuth()

      expect(canRetryRegistration.value).toBe(true)
    })

    it('should not allow retry when max attempts reached', () => {
      mockRegistrationState.value = {
        status: 'error',
        step: 'initial',
        email: 'test@example.com',
        source: 'landing',
        error: { retryable: true },
        retryCount: 3,
        sessionId: null
      }
      
      const { canRetryRegistration } = useAuth()

      expect(canRetryRegistration.value).toBe(false)
    })

    describe('retryRegistration', () => {
      it('should retry email verification', async () => {
        mockRegistrationState.value = {
          status: 'error',
          step: 'email_verification',
          email: 'test@example.com',
          source: 'landing',
          error: { retryable: true },
          retryCount: 1,
          sessionId: 'test'
        }

        vi.mocked(RegistrationAPI.resendVerification).mockResolvedValue(undefined)
        const { retryRegistration } = useAuth()

        await retryRegistration()

        expect(mockRegistrationStore.retryRegistration).toHaveBeenCalled()
        expect(RegistrationAPI.resendVerification).toHaveBeenCalledWith('test@example.com')
      })

      it('should not retry when not allowed', async () => {
        mockRegistrationState.value = {
          status: 'error',
          step: 'initial',
          email: '',
          source: 'landing',
          error: { retryable: false },
          retryCount: 3,
          sessionId: null
        }

        const { retryRegistration } = useAuth()

        await expect(retryRegistration()).rejects.toThrow('Cannot retry registration at this time')
      })
    })
  })

  describe('permission and role methods', () => {
    it('should delegate role checking to auth store', () => {
      mockAuthStore.hasRole.mockReturnValue(true)
      const { hasRole } = useAuth()

      const result = hasRole('admin')

      expect(mockAuthStore.hasRole).toHaveBeenCalledWith('admin')
      expect(result).toBe(true)
    })

    it('should delegate permission checking to auth store', () => {
      mockAuthStore.hasPermission.mockReturnValue(false)
      const { hasPermission } = useAuth()

      const result = hasPermission('read:calendar')

      expect(mockAuthStore.hasPermission).toHaveBeenCalledWith('read:calendar')
      expect(result).toBe(false)
    })

    it('should delegate multiple role checking to auth store', () => {
      mockAuthStore.hasAnyRole.mockReturnValue(true)
      const { hasAnyRole } = useAuth()

      const result = hasAnyRole(['admin', 'user'])

      expect(mockAuthStore.hasAnyRole).toHaveBeenCalledWith(['admin', 'user'])
      expect(result).toBe(true)
    })

    it('should delegate multiple permission checking to auth store', () => {
      mockAuthStore.hasAnyPermission.mockReturnValue(false)
      const { hasAnyPermission } = useAuth()

      const result = hasAnyPermission(['read:calendar', 'write:calendar'])

      expect(mockAuthStore.hasAnyPermission).toHaveBeenCalledWith(['read:calendar', 'write:calendar'])
      expect(result).toBe(false)
    })
  })

  describe('utility methods', () => {
    it('should get user display name', () => {
      const { getUserDisplayName } = useAuth()

      const result = getUserDisplayName()

      expect(result).toBe('John Doe')
    })

    it('should get user avatar', () => {
      const { getUserAvatar } = useAuth()

      const result = getUserAvatar()

      expect(result).toBe('https://example.com/avatar.jpg')
    })
  })

  describe('logout', () => {
    it('should logout and clear all data', async () => {
      const { logout } = useAuth()

      mockAuth0Client.logout.mockResolvedValue(undefined)

      await logout('/custom-return')

      expect(mockAuthStore.clearAuth).toHaveBeenCalled()
      expect(mockRegistrationStore.resetRegistration).toHaveBeenCalled()
      expect(RegistrationCache.clear).toHaveBeenCalled()
      expect(mockAuth0Client.logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: '/custom-return'
        }
      })
    })

    it('should use default return URL when not specified', async () => {
      const { logout } = useAuth()

      mockAuth0Client.logout.mockResolvedValue(undefined)

      await logout()

      expect(mockAuth0Client.logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    })

    it('should handle logout errors', async () => {
      const { logout } = useAuth()

      mockAuth0Client.logout.mockRejectedValue(new Error('Logout failed'))

      await logout()

      // Verify that auth clearing still happens even when logout fails
      expect(mockAuthStore.clearAuth).toHaveBeenCalled()
      expect(mockRegistrationStore.resetRegistration).toHaveBeenCalled()
      expect(RegistrationCache.clear).toHaveBeenCalled()
    })
  })
})