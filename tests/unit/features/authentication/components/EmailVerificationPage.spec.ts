/**
 * COMPONENT ANALYSIS TEMPLATE - EmailVerificationPage.vue
 * 
 * COMPONENT: EmailVerificationPage.vue (Main Container)
 * DEPENDENCIES FOUND:
 * - Composable: useEmailVerification (main business logic)
 * - Route: useRoute (query parameters)
 * - Child Components: VerificationStatus, VerificationProgress, VerificationActions, VerificationHelp, BackgroundAnimation
 * - Watch: route.query for external verification
 * - No props (route-driven)
 * - Container component that orchestrates verification flow
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Router } from 'vue-router'
import EmailVerificationPage from '@/features/authentication/pages/EmailVerificationPage.vue'

// Mock the useEmailVerification composable
const mockVerificationState = {
  status: 'pending',
  isResending: false,
  isChecking: false,
  canResend: true,
  timeUntilResend: 0,
  currentStepIndex: 1
}

const mockVerificationSteps = [
  { id: 1, label: 'Email sent' },
  { id: 2, label: 'Check your inbox' },
  { id: 3, label: 'Click verify link' },
  { id: 4, label: 'Account activated' }
]

const mockUseEmailVerification = {
  verificationState: { value: mockVerificationState },
  verificationSteps: mockVerificationSteps,
  email: { value: 'test@example.com' },
  resendVerification: vi.fn(),
  checkNow: vi.fn(),
  handlePrimaryAction: vi.fn()
}

vi.mock('@/features/authentication/composables/useEmailVerification', () => ({
  useEmailVerification: () => mockUseEmailVerification
}))

// Mock child components to focus on container logic
vi.mock('@/features/authentication/components/email-verification/VerificationStatus.vue', () => ({
  default: {
    name: 'VerificationStatus',
    template: '<div data-testid="verification-status">Status: {{ status }}, Email: {{ email }}</div>',
    props: ['status', 'email']
  }
}))

vi.mock('@/features/authentication/components/email-verification/VerificationProgress.vue', () => ({
  default: {
    name: 'VerificationProgress',
    template: '<div data-testid="verification-progress" v-if="status === \'pending\'">Step {{ currentStepIndex + 1 }} of {{ steps.length }}</div>',
    props: ['currentStepIndex', 'steps', 'status']
  }
}))

vi.mock('@/features/authentication/components/email-verification/VerificationActions.vue', () => ({
  default: {
    name: 'VerificationActions',
    template: `
      <div data-testid="verification-actions">
        <button v-if="status === 'pending'" @click="$emit('checkNow')" data-testid="check-now-btn">Check Now</button>
        <button v-if="canResend" @click="$emit('resend')" data-testid="resend-btn">Resend</button>
        <button v-if="status === 'verified'" @click="$emit('primaryAction', 'continue')" data-testid="continue-btn">Continue</button>
      </div>
    `,
    props: ['status', 'isResending', 'isChecking', 'canResend', 'timeUntilResend'],
    emits: ['resend', 'primaryAction', 'checkNow']
  }
}))

vi.mock('@/features/authentication/components/email-verification/VerificationHelp.vue', () => ({
  default: {
    name: 'VerificationHelp',
    template: '<div data-testid="verification-help">Help content</div>'
  }
}))

vi.mock('@/features/authentication/components/email-verification/BackgroundAnimation.vue', () => ({
  default: {
    name: 'BackgroundAnimation',
    template: '<div data-testid="background-animation">Animation</div>'
  }
}))

describe('EmailVerificationPage Container', () => {
  let router: Router

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mock state
    mockUseEmailVerification.verificationState.value = { ...mockVerificationState }
    mockUseEmailVerification.email.value = 'test@example.com'

    // Setup router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/auth/verify-email',
          name: 'EmailVerification',
          component: { template: '<div>EmailVerification</div>' }
        }
      ]
    })

    // Mock useRoute to return query parameters
    const { useRoute } = require('vue-router')
    vi.mocked(useRoute).mockReturnValue({
      params: {},
      query: {
        email: 'test@example.com',
        auth0Id: 'auth0|123456789'
      },
      path: '/auth/verify-email',
      meta: {},
      name: 'EmailVerification',
      fullPath: '/auth/verify-email?email=test@example.com&auth0Id=auth0|123456789',
      hash: '',
      matched: [],
      redirectedFrom: undefined
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = async () => {
    const result = render(EmailVerificationPage, {
      global: {
        plugins: [router]
      }
    })
    
    await nextTick()
    return result
  }

  describe('Component Structure and Rendering', () => {
    it('renders main container with correct structure', async () => {
      await renderComponent()

      expect(document.querySelector('.email-verification-page')).toBeInTheDocument()
      expect(document.querySelector('.verification-container')).toBeInTheDocument()
      expect(document.querySelector('.verification-card')).toBeInTheDocument()
    })

    it('renders all child components', async () => {
      await renderComponent()

      expect(screen.getByTestId('verification-status')).toBeInTheDocument()
      expect(screen.getByTestId('verification-progress')).toBeInTheDocument()
      expect(screen.getByTestId('verification-actions')).toBeInTheDocument()
      expect(screen.getByTestId('verification-help')).toBeInTheDocument()
      expect(screen.getByTestId('background-animation')).toBeInTheDocument()
    })

    it('passes correct props to VerificationStatus', async () => {
      await renderComponent()

      const statusComponent = screen.getByTestId('verification-status')
      expect(statusComponent).toHaveTextContent('Status: pending')
      expect(statusComponent).toHaveTextContent('Email: test@example.com')
    })

    it('shows VerificationProgress only for pending status', async () => {
      await renderComponent()

      expect(screen.getByTestId('verification-progress')).toBeInTheDocument()
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    })

    it('hides VerificationProgress for non-pending status', async () => {
      mockUseEmailVerification.verificationState.value.status = 'verified'
      
      await renderComponent()

      expect(screen.queryByTestId('verification-progress')).not.toBeInTheDocument()
    })
  })

  describe('Props Passing to Child Components', () => {
    it('passes verification state to VerificationActions', async () => {
      mockUseEmailVerification.verificationState.value = {
        status: 'pending',
        isResending: true,
        isChecking: false,
        canResend: false,
        timeUntilResend: 30,
        currentStepIndex: 1
      }

      await renderComponent()

      const actionsComponent = screen.getByTestId('verification-actions')
      expect(actionsComponent).toBeInTheDocument()
      
      // Actions component should receive all the state props
      // This is tested through the component's behavior
      expect(screen.getByTestId('check-now-btn')).toBeInTheDocument()
    })

    it('passes current step and steps to VerificationProgress', async () => {
      await renderComponent()

      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    })
  })

  describe('Event Handling from Child Components', () => {
    it('handles resend event from VerificationActions', async () => {
      const user = userEvent.setup()
      await renderComponent()

      const resendButton = screen.getByTestId('resend-btn')
      await user.click(resendButton)

      expect(mockUseEmailVerification.resendVerification).toHaveBeenCalledTimes(1)
    })

    it('handles checkNow event from VerificationActions', async () => {
      const user = userEvent.setup()
      await renderComponent()

      const checkNowButton = screen.getByTestId('check-now-btn')
      await user.click(checkNowButton)

      expect(mockUseEmailVerification.checkNow).toHaveBeenCalledTimes(1)
    })

    it('handles primaryAction event from VerificationActions', async () => {
      const user = userEvent.setup()
      mockUseEmailVerification.verificationState.value.status = 'verified'
      
      await renderComponent()

      const continueButton = screen.getByTestId('continue-btn')
      await user.click(continueButton)

      expect(mockUseEmailVerification.handlePrimaryAction).toHaveBeenCalledWith('continue')
    })
  })

  describe('Route Query Watching', () => {
    it('handles external verification via route query', async () => {
      // Mock route with verified query parameter
      const { useRoute } = require('vue-router')
      vi.mocked(useRoute).mockReturnValue({
        params: {},
        query: {
          email: 'test@example.com',
          auth0Id: 'auth0|123456789',
          verified: 'true'
        },
        path: '/auth/verify-email',
        meta: {},
        name: 'EmailVerification',
        fullPath: '/auth/verify-email?email=test@example.com&auth0Id=auth0|123456789&verified=true',
        hash: '',
        matched: [],
        redirectedFrom: undefined
      })

      await renderComponent()
      
      // Wait for the watcher to trigger
      await nextTick()
      await flushPromises()

      expect(mockUseEmailVerification.handlePrimaryAction).toHaveBeenCalledWith('continue')
    })

    it('does not trigger on route query without verified flag', async () => {
      await renderComponent()
      
      // Normal route should not trigger primary action
      expect(mockUseEmailVerification.handlePrimaryAction).not.toHaveBeenCalled()
    })
  })

  describe('State-Dependent Rendering', () => {
    it('shows different content for different verification states', async () => {
      // Test pending state
      mockUseEmailVerification.verificationState.value.status = 'pending'
      const { rerender } = await renderComponent()

      expect(screen.getByText('Status: pending')).toBeInTheDocument()
      expect(screen.getByTestId('verification-progress')).toBeInTheDocument()
      expect(screen.getByTestId('check-now-btn')).toBeInTheDocument()

      // Test verified state
      mockUseEmailVerification.verificationState.value.status = 'verified'
      await rerender({})
      await nextTick()

      expect(screen.queryByTestId('verification-progress')).not.toBeInTheDocument()
      expect(screen.getByTestId('continue-btn')).toBeInTheDocument()
    })
  })
})

describe('Responsive Design and Layout', () => {
    it('applies correct CSS classes for responsive design', async () => {
      await renderComponent()

      const page = document.querySelector('.email-verification-page')
      expect(page).toHaveStyle('min-height: 100vh')
      expect(page).toHaveStyle('display: flex')
      expect(page).toHaveStyle('align-items: center')
      expect(page).toHaveStyle('justify-content: center')
    })

    it('container has proper max-width', async () => {
      await renderComponent()

      const container = document.querySelector('.verification-container')
      expect(container).toHaveStyle('max-width: 500px')
    })

    it('card has proper styling and positioning', async () => {
      await renderComponent()

      const card = document.querySelector('.verification-card')
      expect(card).toHaveStyle('background: white')
      expect(card).toHaveStyle('border-radius: 1rem')
      expect(card).toHaveStyle('text-align: center')
    })
  })

describe('Integration with Composable', () => {
    it('uses useEmailVerification composable correctly', async () => {
      await renderComponent()

      // Verify that the component gets all necessary data from the composable
      expect(screen.getByText('Status: pending')).toBeInTheDocument()
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    })

    it('reflects composable state changes', async () => {
      const { rerender } = await renderComponent()

      // Change composable state
      mockUseEmailVerification.verificationState.value.status = 'verified'
      mockUseEmailVerification.verificationState.value.currentStepIndex = 3
      
      await rerender({})
      await nextTick()

      expect(screen.queryByTestId('verification-progress')).not.toBeInTheDocument()
      expect(screen.getByTestId('continue-btn')).toBeInTheDocument()
    })
  })

describe('Error Handling', () => {
    it('handles missing email gracefully', async () => {
      mockUseEmailVerification.email.value = ''
      
      await renderComponent()

      // Should still render without crashing
      expect(screen.getByTestId('verification-status')).toBeInTheDocument()
    })

    it('handles composable errors gracefully', async () => {
      mockUseEmailVerification.verificationState.value.status = 'error'
      
      await renderComponent()

      expect(screen.getByText('Status: error')).toBeInTheDocument()
      expect(screen.queryByTestId('verification-progress')).not.toBeInTheDocument()
    })
  })

describe('Accessibility', () => {
    it('maintains proper semantic structure', async () => {
      await renderComponent()

      const main = document.querySelector('.email-verification-page')
      expect(main).toBeInTheDocument()
      
      const container = document.querySelector('.verification-container')
      expect(container).toBeInTheDocument()
      
      const card = document.querySelector('.verification-card')
      expect(card).toBeInTheDocument()
    })

    it('provides proper focus management', async () => {
      await renderComponent()

      // Interactive elements should be focusable
      const interactiveElements = screen.getAllByRole('button')
      expect(interactiveElements.length).toBeGreaterThan(0)
      
      interactiveElements.forEach(element => {
        expect(element).toBeVisible()
      })
    })
  })

describe('Animation and Visual Effects', () => {
    it('includes background animation component', async () => {
      await renderComponent()

      expect(screen.getByTestId('background-animation')).toBeInTheDocument()
    })

    it('positions background animation correctly', async () => {
      await renderComponent()

      const animation = screen.getByTestId('background-animation')
      expect(animation).toBeInTheDocument()
      
      // Animation should be positioned as background
      const page = document.querySelector('.email-verification-page')
      expect(page).toHaveStyle('position: relative')
    })
  })

describe('Component Lifecycle', () => {
    it('initializes correctly on mount', async () => {
      await renderComponent()

      // All child components should be rendered
      expect(screen.getByTestId('verification-status')).toBeInTheDocument()
      expect(screen.getByTestId('verification-actions')).toBeInTheDocument()
      expect(screen.getByTestId('verification-help')).toBeInTheDocument()
      expect(screen.getByTestId('background-animation')).toBeInTheDocument()
    })

    it('cleans up properly on unmount', async () => {
      const { unmount } = await renderComponent()
      
      expect(() => unmount()).not.toThrow()
    })
  })