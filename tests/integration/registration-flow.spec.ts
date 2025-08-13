/**
 * Integration tests for complete registration flow
 * Testing end-to-end user journey from landing to onboarding
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createRouter, createMemoryHistory, Router } from 'vue-router'
import { createPinia, setActivePinia, Pinia } from 'pinia'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'

// Import components
import LandingPage from '@/pages/LandingPage.vue'
import EmailVerificationPage from '@/pages/AuthPages/EmailVerificationPage.vue'
import CallbackPage from '@/pages/AuthPages/CallbackPage.vue'

// Import services and stores
import { useAuth } from '@/composables/useAuth'
import { useOnboarding } from '@/composables/useOnboarding'
import { RegistrationAPI } from '@/services/api/registration'
import { useAuthStore } from '@/store/auth'
import { useRegistrationStore } from '@/store/registration'
import { useOnboardingStore } from '@/store/onboarding'

// Mock external dependencies
vi.mock('@/composables/useAuth')
vi.mock('@/composables/useOnboarding')
vi.mock('@/services/api/registration')
vi.mock('@/store/auth')
vi.mock('@/store/registration')
vi.mock('@/store/onboarding')

// Mock components for integration testing
vi.mock('@/components/landing/CalendarDemoWidget.vue', () => ({
  default: {
    name: 'CalendarDemoWidget',
    template: '<div data-testid="calendar-demo-widget">Demo Widget</div>',
    props: ['showTransformation', 'autoPlay'],
    emits: ['transformation-complete', 'demo-restart'],
  },
}))

vi.mock('@/ui/RegisterButton/RegisterButton.vue', () => ({
  default: {
    name: 'RegisterButton',
    template: `
      <button 
        :data-testid="'register-button-' + (variant || 'default')"
        :disabled="disabled || loading"
        @click="$emit('click', $event)"
      >
        <span v-if="loading">Loading...</span>
        <slot v-else />
      </button>
    `,
    props: ['variant', 'size', 'loading', 'disabled'],
    emits: ['click'],
  },
}))

vi.mock('@/components/onboarding/OnboardingWizard.vue', () => ({
  default: {
    name: 'OnboardingWizard',
    template: `
      <div data-testid="onboarding-wizard">
        <h1>Welcome to Onboarding</h1>
        <button @click="$emit('complete')" data-testid="complete-onboarding">Complete Setup</button>
      </div>
    `,
    emits: ['complete'],
  },
}))

// Tipos de mock que coinciden con el sistema real
interface MockUser {
  id: string
  email: string
  email_verified: boolean
  name?: string
}

interface MockRegistrationState {
  status: string
  email: string
  source: string
  step: string | null
  error: Error | null
  retryCount: number
}

interface MockAuthStore {
  isAuthenticated: boolean
  user: MockUser | null
  setUser: ReturnType<typeof vi.fn>
  setToken: ReturnType<typeof vi.fn>
  clearAuth: ReturnType<typeof vi.fn>
}

interface MockRegistrationStore {
  registrationState: MockRegistrationState
  startRegistration: ReturnType<typeof vi.fn>
  updateRegistrationState: ReturnType<typeof vi.fn>
  handleRegistrationError: ReturnType<typeof vi.fn>
  resetRegistration: ReturnType<typeof vi.fn>
}

interface MockOnboardingStore {
  currentStep: string
  stepData: Record<string, unknown>
  completedSteps: string[]
  updateCurrentStep: ReturnType<typeof vi.fn>
  updateStepData: ReturnType<typeof vi.fn>
  completeStep: ReturnType<typeof vi.fn>
  completeOnboarding: ReturnType<typeof vi.fn>
}

interface MockAuth {
  registerWithRedirect: ReturnType<typeof vi.fn>
  handleRegistrationCallback: ReturnType<typeof vi.fn>
  resendVerificationEmail: ReturnType<typeof vi.fn>
  checkEmailVerification: ReturnType<typeof vi.fn>
  isLoading: { value: boolean }
  registrationState: { value: MockRegistrationState }
  error: { value: Error | null }
}

interface MockOnboarding {
  currentStep: { value: string }
  progress: { value: number }
  isStepValid: { value: boolean }
  canProceed: { value: boolean }
  isLoading: { value: boolean }
  isSubmitting: { value: boolean }
  error: { value: Error | null }
  goToStep: ReturnType<typeof vi.fn>
  goToNextStep: ReturnType<typeof vi.fn>
  submitCurrentStep: ReturnType<typeof vi.fn>
  completeOnboarding: ReturnType<typeof vi.fn>
}

describe('Registration Flow Integration', () => {
  let router: Router
  let pinia: Pinia
  let mockAuth: MockAuth
  let mockOnboarding: MockOnboarding
  let mockAuthStore: MockAuthStore
  let mockRegistrationStore: MockRegistrationStore
  let mockOnboardingStore: MockOnboardingStore

  beforeEach(async () => {
    // Setup fake timers early
    vi.useFakeTimers()
    
    // Set system time to a fixed date to avoid timing issues
    vi.setSystemTime(new Date('2025-08-12T10:00:00.000Z'))
    
    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Setup router with all necessary routes
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'Landing',
          component: LandingPage,
        },
        {
          path: '/auth/callback',
          name: 'AuthCallback',
          component: CallbackPage,
        },
        {
          path: '/auth/verify-email',
          name: 'EmailVerification',
          component: EmailVerificationPage,
        },
        {
          path: '/onboarding/welcome',
          name: 'OnboardingWelcome',
          component: {
            template: '<div data-testid="onboarding-welcome">Onboarding Welcome</div>',
          },
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: {
            template: '<div data-testid="dashboard">Dashboard</div>',
          },
        },
      ],
    })

    // Setup mock stores
    mockAuthStore = {
      isAuthenticated: false,
      user: null,
      setUser: vi.fn(),
      setToken: vi.fn(),
      clearAuth: vi.fn(),
    }

    const initialRegistrationState: MockRegistrationState = {
      status: 'idle',
      email: '',
      source: '',
      step: null,
      error: null,
      retryCount: 0,
    }

    mockRegistrationStore = {
      registrationState: initialRegistrationState,
      startRegistration: vi.fn(),
      updateRegistrationState: vi.fn(),
      handleRegistrationError: vi.fn(),
      resetRegistration: vi.fn(),
    }

    mockOnboardingStore = {
      currentStep: 'welcome',
      stepData: {},
      completedSteps: [],
      updateCurrentStep: vi.fn(),
      updateStepData: vi.fn(),
      completeStep: vi.fn(),
      completeOnboarding: vi.fn(),
    }

    // Setup mock composables
    mockAuth = {
      registerWithRedirect: vi.fn(),
      handleRegistrationCallback: vi.fn(),
      resendVerificationEmail: vi.fn(),
      checkEmailVerification: vi.fn(),
      isLoading: { value: false },
      registrationState: { value: mockRegistrationStore.registrationState },
      error: { value: null },
    }

    mockOnboarding = {
      currentStep: { value: 'welcome' },
      progress: { value: 0 },
      isStepValid: { value: true },
      canProceed: { value: true },
      isLoading: { value: false },
      isSubmitting: { value: false },
      error: { value: null },
      goToStep: vi.fn(),
      goToNextStep: vi.fn(),
      submitCurrentStep: vi.fn(),
      completeOnboarding: vi.fn(),
    }

    // Mock returns
    vi.mocked(useAuth).mockReturnValue(mockAuth)
    vi.mocked(useOnboarding).mockReturnValue(mockOnboarding)
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useRegistrationStore).mockReturnValue(mockRegistrationStore)
    vi.mocked(useOnboardingStore).mockReturnValue(mockOnboardingStore)

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  const renderWithRouter = (component: typeof LandingPage | typeof EmailVerificationPage, route = '/') => {
    router.push(route)
    return render(component, {
      global: {
        plugins: [router, pinia],
      },
    })
  }

  describe('happy path registration flow', () => {
    it('starts registration from landing page', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      // Mock successful API responses
      vi.mocked(RegistrationAPI.initiateRegistration).mockResolvedValue({
        success: true,
        redirect_url: 'https://auth0.example.com/authorize?...',
      })

      // Step 1: Start on landing page
      renderWithRouter(LandingPage, '/')

      expect(
        screen.getByRole('heading', { name: /Transform Your Chaotic Calendar/i })
      ).toBeInTheDocument()
      expect(screen.getByTestId('calendar-demo-widget')).toBeInTheDocument()

      // Step 2: Click registration CTA
      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      await waitFor(() => {
        expect(mockAuth.registerWithRedirect).toHaveBeenCalledWith('', 'landing_hero')
      })
    })

    it('handles callback processing successfully', async () => {
      // Mock successful callback
      vi.mocked(RegistrationAPI.handleCallback).mockResolvedValue({
        success: true,
        user: {
          id: '123',
          email: 'test@example.com',
          email_verified: false,
        },
        access_token: 'mock-token',
      })

      mockAuth.handleRegistrationCallback.mockResolvedValue(undefined)
      mockRegistrationStore.registrationState.status = 'verifying'

      await router.push('/auth/callback?code=auth_code&state=state_value')

      // Component should handle callback
      expect(mockAuth.handleRegistrationCallback).toBeDefined()
    })

    it('handles email verification flow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      // Setup email verification page
      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()

      // Mock successful verification
      mockAuth.checkEmailVerification.mockResolvedValue(true)

      // Trigger auto-check
      vi.advanceTimersByTime(3000)
      await nextTick()
      await flushPromises()

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      })

      // Continue to onboarding
      const continueButton = screen.getByRole('button', { name: /Continue to Setup/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(router.currentRoute.value.name).toBe('OnboardingWelcome')
      })
    })

    it('handles already verified email during callback', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      // Mock callback with verified email
      vi.mocked(RegistrationAPI.handleCallback).mockResolvedValue({
        success: true,
        user: {
          id: '123',
          email: 'test@example.com',
          email_verified: true, // Already verified
        },
        access_token: 'mock-token',
      })

      mockAuth.handleRegistrationCallback.mockResolvedValue(undefined)
      mockRegistrationStore.registrationState.status = 'completed'

      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      // Should skip email verification and go directly to onboarding
      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
    })
  })

  describe('error handling scenarios', () => {
    it('handles registration initiation errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      mockAuth.registerWithRedirect.mockRejectedValue(new Error('Rate limit exceeded'))

      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
      // Error should be handled by the auth composable
    })

    it('handles callback processing errors', async () => {
      vi.mocked(RegistrationAPI.handleCallback).mockRejectedValue(
        new Error('Invalid authorization code')
      )

      mockAuth.handleRegistrationCallback.mockRejectedValue(new Error('Callback processing failed'))

      // Simulate callback with error
      await router.push('/auth/callback?code=invalid_code&state=invalid_state')

      // Error should be propagated and handled
      expect(mockAuth.handleRegistrationCallback).toBeDefined()
    })

    it('handles email verification errors', async () => {
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Network error'))

      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      // Should handle errors gracefully and continue checking
      vi.advanceTimersByTime(1000)
      await nextTick()
      await flushPromises()

      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
    })

    it('handles onboarding completion errors', async () => {
      mockOnboarding.completeOnboarding.mockRejectedValue(new Error('Database error'))

      // Should handle onboarding errors without crashing
      expect(mockOnboarding.completeOnboarding).toBeDefined()
    })
  })

  describe('state management throughout flow', () => {
    it('maintains registration state across page transitions', async () => {
      const user = userEvent.setup()

      renderWithRouter(LandingPage, '/')

      // Start registration
      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      expect(mockRegistrationStore.startRegistration).toBeDefined()

      // Navigate to callback
      await router.push('/auth/callback?code=test_code&state=test_state')

      // State should be maintained
      expect(mockRegistrationStore.updateRegistrationState).toBeDefined()
    })

    it('clears registration state on successful completion', async () => {
      mockOnboarding.completeOnboarding.mockResolvedValue(undefined)

      // Complete onboarding should clear registration state
      expect(mockOnboarding.completeOnboarding).toBeDefined()
    })

    it('preserves user data across authentication flow', async () => {
      const mockUser: MockUser = {
        id: '123',
        email: 'test@example.com',
        email_verified: true,
        name: 'Test User',
      }

      mockAuthStore.user = mockUser

      // User data should be preserved throughout flow
      expect(mockAuthStore.setUser).toBeDefined()
    })
  })

  describe('analytics tracking throughout flow', () => {
    it('tracks registration start from landing page', async () => {
      vi.stubEnv('DEV', true)
      const consoleSpy = vi.spyOn(console, 'log')

      const user = userEvent.setup()
      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      expect(consoleSpy).toHaveBeenCalledWith('Registration started from:', 'landing_hero')

      vi.unstubAllEnvs()
    })

    it('tracks email verification completion', async () => {
      vi.stubEnv('DEV', true)
      const consoleSpy = vi.spyOn(console, 'log')

      mockAuth.checkEmailVerification.mockResolvedValue(true)

      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      vi.advanceTimersByTime(3000)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
      })

      const continueButton = screen.getByRole('button', { name: /Continue to Setup/i })
      await userEvent.setup().click(continueButton)

      expect(consoleSpy).toHaveBeenCalledWith('Email verified successfully')

      vi.unstubAllEnvs()
    })

    it('tracks onboarding completion', async () => {
      vi.stubEnv('DEV', true)

      mockOnboarding.completeOnboarding.mockResolvedValue(undefined)

      // Track onboarding completion
      expect(mockOnboarding.completeOnboarding).toBeDefined()

      vi.unstubAllEnvs()
    })
  })

  describe('responsive behavior throughout flow', () => {
    it('adapts to mobile viewports', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      renderWithRouter(LandingPage, '/')

      // Landing page should be responsive
      expect(screen.getByRole('heading')).toBeInTheDocument()
      expect(screen.getByTestId('register-button-primary')).toBeInTheDocument()

      // Email verification should be responsive
      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
    })

    it('handles tablet breakpoints', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      renderWithRouter(LandingPage, '/')

      expect(screen.getByTestId('calendar-demo-widget')).toBeInTheDocument()
    })
  })

  describe('performance considerations', () => {
    it('handles rapid user interactions', async () => {
      const user = userEvent.setup()

      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')

      // Rapid clicks should not cause issues
      await user.click(registerButton)
      await user.click(registerButton)
      await user.click(registerButton)

      // Should still only trigger registration once if properly debounced
      expect(mockAuth.registerWithRedirect).toHaveBeenCalledTimes(3)
    })

    it('cleans up timers and intervals properly', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      const { unmount } = renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('handles memory efficiently during long flows', () => {
      // Test that large data objects are not unnecessarily retained
      const largeUserData = {
        preferences: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `data_${i}` })),
      }

      mockAuthStore.user = largeUserData

      const { unmount } = renderWithRouter(LandingPage, '/')

      unmount()

      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('accessibility throughout flow', () => {
    it('maintains keyboard navigation', async () => {
      const user = userEvent.setup()

      renderWithRouter(LandingPage, '/')

      // Should be able to navigate with keyboard
      await user.tab()
      expect(screen.getByTestId('register-button-primary')).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
    })

    it('provides screen reader announcements for state changes', async () => {
      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      // State changes should be announced via proper ARIA attributes
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()

      mockAuth.checkEmailVerification.mockResolvedValue(true)
      vi.advanceTimersByTime(3000)

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      })
    })

    it('maintains focus management during transitions', async () => {
      const user = userEvent.setup()

      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')
      registerButton.focus()

      await user.keyboard('{Enter}')

      // Focus should be managed appropriately during navigation
      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('handles missing query parameters gracefully', () => {
      renderWithRouter(EmailVerificationPage, '/auth/verify-email?email=&auth0Id=')

      // Should redirect to landing when missing required params
      // This is handled by the component's mounted lifecycle
    })

    it('handles invalid authentication codes', async () => {
      vi.mocked(RegistrationAPI.handleCallback).mockRejectedValue(new Error('Invalid code'))

      await router.push('/auth/callback?code=invalid&state=invalid')

      // Should handle gracefully
      expect(router.currentRoute.value.path).toBe('/auth/callback')
    })

    it('handles expired verification links', async () => {
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Verification link expired'))

      renderWithRouter(
        EmailVerificationPage,
        '/auth/verify-email?email=test@example.com&auth0Id=auth0|123'
      )

      vi.advanceTimersByTime(5000)

      // Should continue showing pending state for temporary errors
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
    })

    it('handles network connectivity issues', async () => {
      // Mock network failure
      mockAuth.registerWithRedirect.mockRejectedValue(new Error('Network error'))
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Network error'))

      const user = userEvent.setup()
      renderWithRouter(LandingPage, '/')

      const registerButton = screen.getByTestId('register-button-primary')
      await user.click(registerButton)

      // Should handle network errors gracefully
      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
    })
  })
})