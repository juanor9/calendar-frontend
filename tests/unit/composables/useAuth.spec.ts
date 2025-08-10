/**
 * Unit tests for useAuth composable
 * Testing all authentication and registration flows for Vana
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/store/auth'
import { useRegistrationStore } from '@/store/registration'
import { RegistrationAPI } from '@/services/api/registration'
import { RegistrationCache } from '@/utils/registration-cache'

// Mock dependencies
vi.mock('@/services/api/registration')
vi.mock('@/utils/registration-cache')
vi.mock('@/store/auth')
vi.mock('@/store/registration')

// Mock Auth0 client
const mockAuth0Client = {
  isLoading: ref(false),
  isAuthenticated: ref(false),
  user: ref(null),
  error: ref(null),
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn()
}

// Mock Vue injection
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    inject: vi.fn(() => mockAuth0Client)
  }
})

describe('useAuth composable', () => {
  let mockAuthStore: any
  let mockRegistrationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Setup mock stores
    mockAuthStore = {
      isAuthenticated: false,
      user: null,
      setUser: vi.fn(),
      setToken: vi.fn(),
      clearAuth: vi.fn(),
      hasRole: vi.fn(),
      hasPermission: vi.fn(),
      hasAnyRole: vi.fn(),
      hasAnyPermission: vi.fn(),
      userDisplayName: 'John Doe',
      userAvatar: 'https://example.com/avatar.jpg'
    }

    mockRegistrationStore = {
      registrationState: {
        status: 'idle',
        email: '',
        source: '',
        step: null,
        error: null,
        retryCount: 0,
        retryable: true
      },
      startRegistration: vi.fn(),
      updateRegistrationState: vi.fn(),
      handleRegistrationError: vi.fn(),
      resetRegistration: vi.fn(),
      retryRegistration: vi.fn(),
      sendVerificationEmail: vi.fn(),
      markEmailVerified: vi.fn(),
      $patch: vi.fn()
    }

    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useRegistrationStore).mockReturnValue(mockRegistrationStore)

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
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
        email: 'test@example.com',
        source: 'landing',
        step: 'email_verification',
        error: null,
        retryCount: 1,
        retryable: true
      }

      vi.mocked(RegistrationCache.load).mockReturnValue(cachedState)

      useAuth()

      expect(mockRegistrationStore.$patch).toHaveBeenCalledWith({
        registrationState: cachedState
      })
    })

    it('should not load cached state if registration is completed', () => {
      const cachedState = {
        status: 'completed',
        email: 'test@example.com',
        source: 'landing'
      }

      vi.mocked(RegistrationCache.load).mockReturnValue(cachedState)

      useAuth()

      expect(mockRegistrationStore.$patch).not.toHaveBeenCalled()
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

      useAuth()
      
      // Trigger the watcher
      await nextTick()

      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
      expect(mockAuthStore.setToken).toHaveBeenCalledWith('mock-token')
    })

    it('should clear auth when Auth0 user is not authenticated', async () => {
      mockAuth0Client.isAuthenticated.value = false
      mockAuth0Client.user.value = null

      useAuth()
      
      // Trigger the watcher
      await nextTick()

      expect(mockAuthStore.clearAuth).toHaveBeenCalled()
    })

    it('should handle token retrieval errors gracefully', async () => {
      const mockUser = { sub: 'auth0|123', email: 'test@example.com' }
      
      mockAuth0Client.isAuthenticated.value = true
      mockAuth0Client.user.value = mockUser
      mockAuth0Client.getAccessTokenSilently.mockRejectedValue(new Error('Token error'))

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()

      useAuth()
      
      await nextTick()

      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to sync auth state:', expect.any(Error))
      
      consoleSpy.mockRestore()
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
        expect(RegistrationCache.save).toHaveBeenCalledWith(mockRegistrationStore.registrationState)
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
        expect(RegistrationCache.save).toHaveBeenCalledWith(mockRegistrationStore.registrationState)
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
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation()

        vi.mocked(RegistrationAPI.getRegistrationStatus).mockRejectedValue(new Error('API error'))

        const result = await checkEmailVerification('auth0|123')

        expect(consoleSpy).toHaveBeenCalledWith('Email verification check failed:', expect.any(Error))
        expect(result).toBe(false)
        
        consoleSpy.mockRestore()
      })
    })
  })

  describe('registration progress and retry logic', () => {
    it('should calculate registration progress correctly', () => {
      mockRegistrationStore.registrationState.status = 'processing'
      const { registrationProgress } = useAuth()

      expect(registrationProgress.value).toBe(30)
    })

    it('should determine retry availability correctly', () => {
      mockRegistrationStore.registrationState = {
        status: 'error',
        error: { retryable: true },
        retryCount: 2
      }
      
      const { canRetryRegistration } = useAuth()

      expect(canRetryRegistration.value).toBe(true)
    })

    it('should not allow retry when max attempts reached', () => {
      mockRegistrationStore.registrationState = {
        status: 'error',
        error: { retryable: true },
        retryCount: 3
      }
      
      const { canRetryRegistration } = useAuth()

      expect(canRetryRegistration.value).toBe(false)
    })

    describe('retryRegistration', () => {
      it('should retry email verification', async () => {
        mockRegistrationStore.registrationState = {
          status: 'error',
          step: 'email_verification',
          email: 'test@example.com',
          error: { retryable: true },
          retryCount: 1
        }

        const { retryRegistration, resendVerificationEmail } = useAuth()
        const resendSpy = vi.fn().mockResolvedValue(undefined)
        vi.mocked(resendVerificationEmail).mockImplementation(resendSpy)

        await retryRegistration()

        expect(mockRegistrationStore.retryRegistration).toHaveBeenCalled()
      })

      it('should not retry when not allowed', async () => {
        mockRegistrationStore.registrationState = {
          status: 'error',
          error: { retryable: false },
          retryCount: 3
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
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation()

      mockAuth0Client.logout.mockRejectedValue(new Error('Logout failed'))

      await logout()

      expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})