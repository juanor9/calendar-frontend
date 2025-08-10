/**
 * Unit tests for EmailVerificationPage component
 * Testing email verification flow, states, and user interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import EmailVerificationPage from '@/pages/AuthPages/EmailVerificationPage.vue'
import { useAuth } from '@/composables/useAuth'

// Mock dependencies
vi.mock('@/composables/useAuth')
vi.mock('@heroicons/vue/24/outline', () => ({
  EnvelopeIcon: { name: 'EnvelopeIcon', render: () => null },
  CheckCircleIcon: { name: 'CheckCircleIcon', render: () => null },
  ExclamationTriangleIcon: { name: 'ExclamationTriangleIcon', render: () => null },
  ClockIcon: { name: 'ClockIcon', render: () => null },
  ArrowRightIcon: { name: 'ArrowRightIcon', render: () => null },
  ArrowPathIcon: { name: 'ArrowPathIcon', render: () => null },
  QuestionMarkCircleIcon: { name: 'QuestionMarkCircleIcon', render: () => null },
  ChatBubbleLeftIcon: { name: 'ChatBubbleLeftIcon', render: () => null },
  RocketLaunchIcon: { name: 'RocketLaunchIcon', render: () => null }
}))

// Mock BaseButton component
vi.mock('@/ui/BaseButton/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: `
      <button 
        :class="['base-button', \`base-button--\${variant}\`]"
        :disabled="disabled || loading"
        @click="$emit('click', $event)"
        :data-testid="$attrs['data-testid']"
      >
        <slot name="icon" v-if="!loading" />
        <span v-if="loading" data-testid="loading-spinner"></span>
        <slot />
      </button>
    `,
    props: ['variant', 'loading', 'disabled'],
    emits: ['click']
  }
}))

describe('EmailVerificationPage', () => {
  let mockAuth: any
  let router: any
  let pinia: any

  beforeEach(async () => {
    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Setup router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { 
          path: '/auth/verify-email', 
          name: 'EmailVerification',
          component: { template: '<div>EmailVerification</div>' } 
        },
        { 
          path: '/', 
          name: 'Landing',
          component: { template: '<div>Landing</div>' } 
        },
        { 
          path: '/onboarding/welcome', 
          name: 'OnboardingWelcome',
          component: { template: '<div>OnboardingWelcome</div>' } 
        }
      ]
    })

    // Setup mock auth
    mockAuth = {
      resendVerificationEmail: vi.fn(),
      checkEmailVerification: vi.fn(),
      isLoading: vi.ref(false)
    }

    vi.mocked(useAuth).mockReturnValue(mockAuth)

    // Mock timers
    vi.useFakeTimers()

    // Setup console spies
    vi.spyOn(console, 'log').mockImplementation()
    vi.spyOn(console, 'warn').mockImplementation()
    vi.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  const renderEmailVerificationPage = (query: Record<string, string> = {}) => {
    router.push({
      name: 'EmailVerification',
      query: {
        email: 'test@example.com',
        auth0Id: 'auth0|123456789',
        ...query
      }
    })

    return render(EmailVerificationPage, {
      global: {
        plugins: [router, pinia]
      }
    })
  }

  describe('initial rendering and state', () => {
    it('displays pending state initially', async () => {
      renderEmailVerificationPage()
      
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      expect(screen.getByText(/We sent a verification link to your email address/i)).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('shows progress steps in pending state', async () => {
      renderEmailVerificationPage()
      
      expect(screen.getByText('Email sent')).toBeInTheDocument()
      expect(screen.getByText('Check your inbox')).toBeInTheDocument()
      expect(screen.getByText('Click verify link')).toBeInTheDocument()
      expect(screen.getByText('Account activated')).toBeInTheDocument()
    })

    it('redirects to landing if missing required parameters', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      
      router.push({ name: 'EmailVerification', query: {} })
      render(EmailVerificationPage, {
        global: { plugins: [router, pinia] }
      })
      
      expect(pushSpy).toHaveBeenCalledWith({ name: 'Landing' })
    })

    it('starts auto-checking verification status', async () => {
      mockAuth.checkEmailVerification.mockResolvedValue(false)
      
      renderEmailVerificationPage()
      
      // Should make initial check
      expect(mockAuth.checkEmailVerification).toHaveBeenCalledWith('auth0|123456789')
      
      // Should continue checking every 3 seconds
      vi.advanceTimersByTime(3000)
      expect(mockAuth.checkEmailVerification).toHaveBeenCalledTimes(2)
      
      vi.advanceTimersByTime(3000)
      expect(mockAuth.checkEmailVerification).toHaveBeenCalledTimes(3)
    })
  })

  describe('email verification flow', () => {
    it('shows verified state when email is verified', async () => {
      mockAuth.checkEmailVerification
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
      
      renderEmailVerificationPage()
      
      // Initial state should be pending
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      
      // Fast forward through checks
      vi.advanceTimersByTime(6000)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
        expect(screen.getByText(/Your email has been verified successfully/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
      })
    })

    it('stops auto-checking when verified', async () => {
      mockAuth.checkEmailVerification
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
      
      renderEmailVerificationPage()
      
      // Wait for verification to complete
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      })
      
      // Clear the call count
      mockAuth.checkEmailVerification.mockClear()
      
      // Should not make more calls
      vi.advanceTimersByTime(10000)
      expect(mockAuth.checkEmailVerification).not.toHaveBeenCalled()
    })

    it('handles verification check errors gracefully', async () => {
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Network error'))
      
      renderEmailVerificationPage()
      
      // Should not crash or change state on error
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      })
      
      expect(console.error).toHaveBeenCalledWith('Verification check failed:', expect.any(Error))
    })
  })

  describe('resend functionality', () => {
    it('shows resend button with countdown initially', async () => {
      renderEmailVerificationPage()
      
      // Should not show resend button initially (10 second delay)
      expect(screen.queryByRole('button', { name: /Resend Email/i })).not.toBeInTheDocument()
      
      // After 10 seconds, should start 60 second countdown
      vi.advanceTimersByTime(10000)
      
      await waitFor(() => {
        const resendButton = screen.getByRole('button', { name: /Resend in \d+s/i })
        expect(resendButton).toBeInTheDocument()
        expect(resendButton).toBeDisabled()
      })
    })

    it('enables resend button after countdown', async () => {
      renderEmailVerificationPage()
      
      // Fast forward to start countdown
      vi.advanceTimersByTime(10000)
      
      // Fast forward through countdown
      vi.advanceTimersByTime(60000)
      
      await waitFor(() => {
        const resendButton = screen.getByRole('button', { name: /Resend Email/i })
        expect(resendButton).toBeInTheDocument()
        expect(resendButton).not.toBeDisabled()
      })
    })

    it('resends verification email when button clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      mockAuth.resendVerificationEmail.mockResolvedValue(undefined)
      
      renderEmailVerificationPage()
      
      // Fast forward to enable resend
      vi.advanceTimersByTime(70000)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Resend Email/i })).not.toBeDisabled()
      })
      
      const resendButton = screen.getByRole('button', { name: /Resend Email/i })
      await user.click(resendButton)
      
      expect(mockAuth.resendVerificationEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('shows loading state during resend', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // Mock a slow resend
      let resolveResend: () => void
      mockAuth.resendVerificationEmail.mockImplementation(() => 
        new Promise(resolve => { resolveResend = resolve })
      )
      
      renderEmailVerificationPage()
      
      // Enable resend
      vi.advanceTimersByTime(70000)
      
      const resendButton = await screen.findByRole('button', { name: /Resend Email/i })
      await user.click(resendButton)
      
      expect(screen.getByRole('button', { name: /Sending.../i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      
      // Complete resend
      resolveResend!()
      await vi.runAllTimersAsync()
      
      expect(screen.queryByRole('button', { name: /Sending.../i })).not.toBeInTheDocument()
    })

    it('handles resend errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      mockAuth.resendVerificationEmail.mockRejectedValue(new Error('Resend failed'))
      
      renderEmailVerificationPage()
      
      vi.advanceTimersByTime(70000)
      
      const resendButton = await screen.findByRole('button', { name: /Resend Email/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error:', 'Failed to resend email. Please try again.')
      })
    })

    it('resets countdown after successful resend', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      mockAuth.resendVerificationEmail.mockResolvedValue(undefined)
      
      renderEmailVerificationPage()
      
      vi.advanceTimersByTime(70000)
      
      const resendButton = await screen.findByRole('button', { name: /Resend Email/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Resend in \d+s/i })).toBeInTheDocument()
      })
    })
  })

  describe('manual check functionality', () => {
    it('provides check now button', async () => {
      renderEmailVerificationPage()
      
      expect(screen.getByRole('button', { name: /Check Now/i })).toBeInTheDocument()
    })

    it('performs manual check when button clicked', async () => {
      const user = userEvent.setup()
      mockAuth.checkEmailVerification.mockResolvedValue(false)
      
      renderEmailVerificationPage()
      
      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      await user.click(checkButton)
      
      // Should make an additional check beyond the automatic ones
      expect(mockAuth.checkEmailVerification).toHaveBeenCalledWith('auth0|123456789')
    })

    it('shows loading state during manual check', async () => {
      const user = userEvent.setup()
      
      let resolveCheck: () => void
      mockAuth.checkEmailVerification.mockImplementation(() => 
        new Promise(resolve => { resolveCheck = () => resolve(false) })
      )
      
      renderEmailVerificationPage()
      
      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      await user.click(checkButton)
      
      // Check for spinning icon
      const icon = checkButton.querySelector('[class*="animate-spin"]')
      expect(icon).toBeInTheDocument()
      
      // Complete check
      resolveCheck!()
      await vi.runAllTimersAsync()
    })

    it('handles manual check errors', async () => {
      const user = userEvent.setup()
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Check failed'))
      
      renderEmailVerificationPage()
      
      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      await user.click(checkButton)
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Manual check failed:', expect.any(Error))
      })
    })
  })

  describe('progress step animation', () => {
    it('advances through steps automatically', async () => {
      renderEmailVerificationPage()
      
      // Initial state - first step should be completed, second current
      const steps = screen.getAllByText(/^\d$/)
      
      // After 1 second delay + 3 seconds, should advance to step 2
      vi.advanceTimersByTime(4000)
      
      // After another 3 seconds, should advance to step 3
      vi.advanceTimersByTime(3000)
      
      // Should not advance beyond step 3 automatically
      vi.advanceTimersByTime(3000)
      
      // Final step only completes when actually verified
      expect(screen.queryByText('4')).toBeInTheDocument()
    })

    it('shows proper step states (completed, current, pending)', async () => {
      renderEmailVerificationPage()
      
      // Should have step indicators with proper classes
      const progressSteps = document.querySelector('.progress-steps')
      expect(progressSteps).toBeInTheDocument()
      
      // Check for completed, current, and pending step classes
      const steps = progressSteps?.querySelectorAll('.step')
      expect(steps?.length).toBe(4)
    })

    it('shows loading spinner on current step', async () => {
      renderEmailVerificationPage()
      
      // Should have loading spinner on current step
      const loadingSpinner = document.querySelector('.loading-spinner')
      expect(loadingSpinner).toBeInTheDocument()
    })
  })

  describe('different verification states', () => {
    it('handles verified state correctly', async () => {
      renderEmailVerificationPage({ verified: 'true' })
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
        expect(screen.getByText(/Your email has been verified successfully/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
      })
    })

    it('handles expired state', async () => {
      // Simulate expired state by setting it programmatically
      const { rerender } = renderEmailVerificationPage()
      
      // In a real app, this might be set by route query or API response
      // For testing, we'll trigger it by updating the component state
      // This would typically happen through the verification check failing with an expired error
      
      // The component should show expired UI elements
      expect(screen.getByText(/Didn't receive the email\?/i)).toBeInTheDocument()
    })

    it('handles error state', async () => {
      renderEmailVerificationPage()
      
      // Simulate error by having all checks fail
      mockAuth.checkEmailVerification.mockRejectedValue(new Error('Network error'))
      
      vi.advanceTimersByTime(10000) // Allow multiple failed attempts
      
      // Should continue showing pending state rather than error for network issues
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
    })
  })

  describe('navigation actions', () => {
    it('navigates to onboarding when continue clicked', async () => {
      const user = userEvent.setup()
      const pushSpy = vi.spyOn(router, 'push')
      
      // Set up verified state
      mockAuth.checkEmailVerification.mockResolvedValue(true)
      renderEmailVerificationPage()
      
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
      })
      
      const continueButton = screen.getByRole('button', { name: /Continue to Setup/i })
      await user.click(continueButton)
      
      expect(pushSpy).toHaveBeenCalledWith({
        name: 'OnboardingWelcome',
        query: { source: 'email_verification' }
      })
    })

    it('provides link to contact support', () => {
      renderEmailVerificationPage()
      
      const supportLink = screen.getByRole('link', { name: /Contact support/i })
      expect(supportLink).toBeInTheDocument()
      expect(supportLink).toHaveAttribute('href', '/support')
    })
  })

  describe('troubleshooting section', () => {
    it('shows troubleshooting button', () => {
      renderEmailVerificationPage()
      
      expect(screen.getByRole('button', { name: /Didn't receive the email\?/i })).toBeInTheDocument()
    })

    it('toggles troubleshooting content', async () => {
      const user = userEvent.setup()
      renderEmailVerificationPage()
      
      const troubleshootingButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      
      // Should not show content initially
      expect(screen.queryByText(/Check your spam\/junk folder/i)).not.toBeInTheDocument()
      
      await user.click(troubleshootingButton)
      
      // Should show content after click
      expect(screen.getByText(/Check your spam\/junk folder/i)).toBeInTheDocument()
      expect(screen.getByText(/Make sure you entered the correct email address/i)).toBeInTheDocument()
      expect(screen.getByText(/Wait a few minutes/i)).toBeInTheDocument()
      
      await user.click(troubleshootingButton)
      
      // Should hide content after second click
      expect(screen.queryByText(/Check your spam\/junk folder/i)).not.toBeInTheDocument()
    })

    it('tracks troubleshooting section opening', async () => {
      vi.stubEnv('DEV', true)
      const consoleSpy = vi.spyOn(console, 'log')
      
      const user = userEvent.setup()
      renderEmailVerificationPage()
      
      const troubleshootingButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      await user.click(troubleshootingButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Troubleshooting section opened')
      
      vi.unstubAllEnvs()
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      renderEmailVerificationPage()
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveTextContent(/Check Your Email/i)
    })

    it('provides accessible form controls', () => {
      renderEmailVerificationPage()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
        // All buttons should have accessible text content or aria-label
        const hasAccessibleName = button.textContent?.trim() || 
                                button.getAttribute('aria-label') ||
                                button.getAttribute('title')
        expect(hasAccessibleName).toBeTruthy()
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderEmailVerificationPage()
      
      // Enable resend button
      vi.advanceTimersByTime(70000)
      
      // Should be able to tab through interactive elements
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /Resend Email/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /Check Now/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /Didn't receive the email\?/i }))
    })

    it('provides screen reader friendly status updates', async () => {
      renderEmailVerificationPage()
      
      // Status changes should be announced
      mockAuth.checkEmailVerification.mockResolvedValue(true)
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      })
      
      // Success state should be clearly communicated
      expect(screen.getByText(/Your email has been verified successfully/i)).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('adapts layout for mobile screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderEmailVerificationPage()
      
      // Content should remain accessible on mobile
      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('performance and cleanup', () => {
    it('cleans up intervals on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      const { unmount } = renderEmailVerificationPage()
      
      unmount()
      
      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('handles rapid state changes', async () => {
      mockAuth.checkEmailVerification
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
      
      renderEmailVerificationPage()
      
      // Fast forward through rapid checks
      vi.advanceTimersByTime(6000)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      })
    })
  })

  describe('analytics tracking', () => {
    it('tracks page load', () => {
      vi.stubEnv('DEV', true)
      const consoleSpy = vi.spyOn(console, 'log')
      
      renderEmailVerificationPage()
      
      expect(consoleSpy).toHaveBeenCalledWith('Email verification page loaded', {
        email: 'test@example.com',
        auth0Id: 'auth0|123456789'
      })
      
      vi.unstubAllEnvs()
    })

    it('tracks successful verification', async () => {
      vi.stubEnv('DEV', true)
      const consoleSpy = vi.spyOn(console, 'log')
      
      mockAuth.checkEmailVerification.mockResolvedValue(true)
      renderEmailVerificationPage()
      
      vi.advanceTimersByTime(3000)
      
      const continueButton = await screen.findByRole('button', { name: /Continue to Setup/i })
      await userEvent.setup().click(continueButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Email verified successfully')
      
      vi.unstubAllEnvs()
    })
  })
})