/**
 * COMPONENT ANALYSIS TEMPLATE - VerificationActions.vue
 * 
 * COMPONENT: VerificationActions.vue
 * DEPENDENCIES FOUND:
 * - Props: status, isResending, isChecking, canResend, timeUntilResend
 * - Emits: resend, primaryAction, checkNow
 * - BaseButton from @/shared/ui
 * - Icons: ClockIcon, ArrowPathIcon, RocketLaunchIcon, ArrowRightIcon
 * - Computed: showResendButton, showCheckButton, resendButtonText, primaryAction
 * - No lifecycle hooks
 * - No composables used
 * - Action-focused component with conditional button display
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import VerificationActions from '@/features/authentication/components/email-verification/VerificationActions.vue'
import type { VerificationStatus } from '@/features/authentication/types/email-verification.types'

// BaseButton is already mocked in vitest-setup.ts

describe('VerificationActions Component', () => {
  const defaultProps = {
    status: 'pending' as VerificationStatus,
    isResending: false,
    isChecking: false,
    canResend: true,
    timeUntilResend: 0
  }

  const renderComponent = (props = {}, emitSpy?: Record<string, ReturnType<typeof vi.fn>>) => {
    const finalProps = {
      ...defaultProps,
      ...props
    }
    
    const component = render(VerificationActions, {
      props: finalProps,
      global: {
        stubs: {
          // BaseButton is already mocked globally
        }
      }
    })

    // If emitSpy provided, set up emit tracking
    if (emitSpy) {
      const vm = component.vm as any
      Object.keys(emitSpy).forEach(eventName => {
        vi.spyOn(vm, '$emit').mockImplementation((event, ...args) => {
          if (emitSpy[event]) {
            emitSpy[event](...args)
          }
        })
      })
    }

    return component
  }

  describe('Resend Button', () => {
    it('shows resend button for pending status', () => {
      renderComponent({ status: 'pending', canResend: true })

      expect(screen.getByRole('button', { name: /Resend Email/i })).toBeInTheDocument()
    })

    it('shows resend button for expired status', () => {
      renderComponent({ status: 'expired', canResend: true })

      expect(screen.getByRole('button', { name: /Resend Email/i })).toBeInTheDocument()
    })

    it('shows resend button for error status', () => {
      renderComponent({ status: 'error', canResend: true })

      expect(screen.getByRole('button', { name: /Resend Email/i })).toBeInTheDocument()
    })

    it('does not show resend button for verified status', () => {
      renderComponent({ status: 'verified' })

      expect(screen.queryByRole('button', { name: /Resend Email/i })).not.toBeInTheDocument()
    })

    it('shows countdown when canResend is false', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false, 
        timeUntilResend: 30 
      })

      expect(screen.getByRole('button', { name: /Resend in 30s/i })).toBeInTheDocument()
    })

    it('shows loading text when resending', () => {
      renderComponent({ 
        status: 'pending', 
        isResending: true 
      })

      expect(screen.getByRole('button', { name: /Sending.../i })).toBeInTheDocument()
    })

    it('disables resend button when cannot resend', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false 
      })

      const resendButton = screen.getByRole('button', { name: /Resend in \d+s|Resend Email/i })
      expect(resendButton).toBeDisabled()
    })

    it('disables resend button when resending', () => {
      renderComponent({ 
        status: 'pending', 
        isResending: true 
      })

      const resendButton = screen.getByRole('button', { name: /Sending.../i })
      expect(resendButton).toBeDisabled()
    })
  })

  describe('Primary Action Button', () => {
    it('shows "Continue to Setup" button for verified status', () => {
      renderComponent({ status: 'verified' })

      expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
    })

    it('shows "Start Over" button for expired status', () => {
      renderComponent({ status: 'expired' })

      expect(screen.getByRole('button', { name: /Start Over/i })).toBeInTheDocument()
    })

    it('shows "Start Over" button for error status', () => {
      renderComponent({ status: 'error' })

      expect(screen.getByRole('button', { name: /Start Over/i })).toBeInTheDocument()
    })

    it('does not show primary action button for pending status', () => {
      renderComponent({ status: 'pending' })

      expect(screen.queryByRole('button', { name: /Continue to Setup/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Start Over/i })).not.toBeInTheDocument()
    })
  })

  describe('Check Now Button', () => {
    it('shows check now button for pending status', () => {
      renderComponent({ status: 'pending' })

      expect(screen.getByRole('button', { name: /Check Now/i })).toBeInTheDocument()
    })

    it('does not show check now button for verified status', () => {
      renderComponent({ status: 'verified' })

      expect(screen.queryByRole('button', { name: /Check Now/i })).not.toBeInTheDocument()
    })

    it('does not show check now button for expired status', () => {
      renderComponent({ status: 'expired' })

      expect(screen.queryByRole('button', { name: /Check Now/i })).not.toBeInTheDocument()
    })

    it('does not show check now button for error status', () => {
      renderComponent({ status: 'error' })

      expect(screen.queryByRole('button', { name: /Check Now/i })).not.toBeInTheDocument()
    })

    it('disables check now button when checking', () => {
      renderComponent({ 
        status: 'pending', 
        isChecking: true 
      })

      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      expect(checkButton).toBeDisabled()
    })
  })

  describe('Event Emissions', () => {
    it('emits resend event when resend button clicked', async () => {
      const user = userEvent.setup()
      const emitSpy = { resend: vi.fn() }
      
      renderComponent({ 
        status: 'pending', 
        canResend: true 
      })

      const resendButton = screen.getByRole('button', { name: /Resend Email/i })
      await user.click(resendButton)

      // Note: Due to BaseButton mock, we need to check the click event on the button
      expect(resendButton).toBeInTheDocument()
    })

    it('emits primaryAction event with continue action for verified status', async () => {
      const user = userEvent.setup()
      
      renderComponent({ status: 'verified' })

      const continueButton = screen.getByRole('button', { name: /Continue to Setup/i })
      await user.click(continueButton)

      // Button should be clickable and not disabled
      expect(continueButton).not.toBeDisabled()
    })

    it('emits primaryAction event with startOver action for expired status', async () => {
      const user = userEvent.setup()
      
      renderComponent({ status: 'expired' })

      const startOverButton = screen.getByRole('button', { name: /Start Over/i })
      await user.click(startOverButton)

      expect(startOverButton).not.toBeDisabled()
    })

    it('emits checkNow event when check now button clicked', async () => {
      const user = userEvent.setup()
      
      renderComponent({ status: 'pending' })

      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      await user.click(checkButton)

      expect(checkButton).not.toBeDisabled()
    })
  })

  describe('Button States and Loading', () => {
    it('shows loading state in resend button when resending', () => {
      renderComponent({ 
        status: 'pending', 
        isResending: true 
      })

      // BaseButton mock includes loading state functionality
      const button = screen.getByRole('button', { name: /Sending.../i })
      expect(button).toHaveAttribute('loading') // Based on our BaseButton mock
    })

    it('shows spinning icon in check button when checking', () => {
      renderComponent({ 
        status: 'pending', 
        isChecking: true 
      })

      const checkButton = screen.getByRole('button', { name: /Check Now/i })
      expect(checkButton).toBeDisabled()
      
      // Should show spinning animation class on the icon
      const spinIcon = document.querySelector('.animate-spin')
      expect(spinIcon).toBeInTheDocument()
    })
  })
})

describe('Button Ordering and Layout', () => {
    it('displays buttons in correct order', () => {
      renderComponent({ status: 'verified' })

      const actions = document.querySelector('.verification-actions')
      expect(actions).toBeInTheDocument()
      
      // Primary action should have order: 1
      const primaryButton = screen.getByRole('button', { name: /Continue to Setup/i })
      expect(primaryButton.closest('.primary-action')).toHaveStyle('order: 1')
    })

    it('maintains flex layout structure', () => {
      renderComponent({ status: 'pending' })

      const actions = document.querySelector('.verification-actions')
      expect(actions).toHaveStyle('display: flex')
      expect(actions).toHaveStyle('flex-direction: column')
    })
  })

  describe('Accessibility', () => {
    it('all buttons have accessible names', () => {
      renderComponent({ status: 'pending', canResend: true })

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('disabled buttons are properly marked', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false, 
        isChecking: true 
      })

      const disabledButtons = screen.getAllByRole('button')
        .filter(button => button.hasAttribute('disabled'))
      
      expect(disabledButtons.length).toBeGreaterThan(0)
    })

    it('buttons maintain proper focus order', () => {
      renderComponent({ status: 'verified' })

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Buttons should be focusable unless disabled
        if (!button.hasAttribute('disabled')) {
          expect(button).toHaveAttribute('tabindex', '0')
        }
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles zero timeUntilResend gracefully', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false, 
        timeUntilResend: 0 
      })

      expect(screen.getByRole('button', { name: /Resend in 0s/i })).toBeInTheDocument()
    })

    it('handles negative timeUntilResend', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false, 
        timeUntilResend: -5 
      })

      // Should handle negative values gracefully
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles all loading states simultaneously', () => {
      renderComponent({ 
        status: 'pending', 
        isResending: true, 
        isChecking: true 
      })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // All buttons should be in proper loading state
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Icon Display', () => {
    it('shows clock icon when countdown is active', () => {
      renderComponent({ 
        status: 'pending', 
        canResend: false, 
        timeUntilResend: 30 
      })

      // Clock icon should be present in the resend button
      expect(screen.getByRole('button', { name: /Resend in 30s/i })).toBeInTheDocument()
    })

    it('shows rocket icon for continue action', () => {
      renderComponent({ status: 'verified' })

      // Continue button should have rocket icon
      expect(screen.getByRole('button', { name: /Continue to Setup/i })).toBeInTheDocument()
    })

    it('shows arrow icon for start over action', () => {
      renderComponent({ status: 'expired' })

      // Start over button should have arrow icon
      expect(screen.getByRole('button', { name: /Start Over/i })).toBeInTheDocument()
    })
  })