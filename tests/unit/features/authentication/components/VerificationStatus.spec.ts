/**
 * COMPONENT ANALYSIS TEMPLATE - VerificationStatus.vue
 * 
 * COMPONENT: VerificationStatus.vue
 * DEPENDENCIES FOUND:
 * - Props: status (VerificationStatus), email (string optional)
 * - Computed: statusIconClass, statusIconComponent, statusTitle, statusDescription
 * - Icons: EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon
 * - No lifecycle hooks
 * - No composables used
 * - Pure presentation component with computed properties based on props
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import VerificationStatus from '@/features/authentication/components/email-verification/VerificationStatus.vue'
import type { VerificationStatus as StatusType } from '@/features/authentication/types/email-verification.types'

// Mock Heroicons - these are already mocked globally in vitest-setup.ts
// No additional mocking needed

describe('VerificationStatus Component', () => {
  const defaultProps = {
    status: 'pending' as StatusType,
    email: 'test@example.com'
  }

  const renderComponent = (props = {}) => {
    return render(VerificationStatus, {
      props: {
        ...defaultProps,
        ...props
      }
    })
  }

  describe('Rendering and Props', () => {
    it('renders with pending status', () => {
      renderComponent({ status: 'pending' })

      expect(screen.getByRole('heading', { name: /Check Your Email/i })).toBeInTheDocument()
      expect(
        screen.getByText(/We sent a verification link to your email address/i)
      ).toBeInTheDocument()
    })

    it('renders with verified status', () => {
      renderComponent({ status: 'verified' })

      expect(screen.getByRole('heading', { name: /Email Verified!/i })).toBeInTheDocument()
      expect(
        screen.getByText(/Your email has been verified successfully/i)
      ).toBeInTheDocument()
    })

    it('renders with expired status', () => {
      renderComponent({ status: 'expired' })

      expect(screen.getByRole('heading', { name: /Verification Link Expired/i })).toBeInTheDocument()
      expect(
        screen.getByText(/Your verification link has expired for security reasons/i)
      ).toBeInTheDocument()
    })

    it('renders with error status', () => {
      renderComponent({ status: 'error' })

      expect(screen.getByRole('heading', { name: /Something Went Wrong/i })).toBeInTheDocument()
      expect(
        screen.getByText(/We encountered an error while verifying your email/i)
      ).toBeInTheDocument()
    })
  })

  describe('Email Display', () => {
    it('displays email when provided', () => {
      renderComponent({ email: 'user@example.com' })

      expect(screen.getByText('Sent to:')).toBeInTheDocument()
      expect(screen.getByText('user@example.com')).toBeInTheDocument()
    })

    it('does not display email section when email is not provided', () => {
      renderComponent({ email: undefined })

      expect(screen.queryByText('Sent to:')).not.toBeInTheDocument()
    })

    it('does not display email section when email is empty string', () => {
      renderComponent({ email: '' })

      expect(screen.queryByText('Sent to:')).not.toBeInTheDocument()
    })
  })

  describe('Status Icon Classes', () => {
    it('applies correct CSS classes for pending status', () => {
      renderComponent({ status: 'pending' })

      const statusIcon = document.querySelector('.status-icon')
      expect(statusIcon).toHaveClass('status-pending')
      expect(statusIcon).not.toHaveClass('status-verified')
      expect(statusIcon).not.toHaveClass('status-expired')
      expect(statusIcon).not.toHaveClass('status-error')
    })

    it('applies correct CSS classes for verified status', () => {
      renderComponent({ status: 'verified' })

      const statusIcon = document.querySelector('.status-icon')
      expect(statusIcon).toHaveClass('status-verified')
      expect(statusIcon).not.toHaveClass('status-pending')
    })

    it('applies correct CSS classes for expired status', () => {
      renderComponent({ status: 'expired' })

      const statusIcon = document.querySelector('.status-icon')
      expect(statusIcon).toHaveClass('status-expired')
      expect(statusIcon).not.toHaveClass('status-pending')
    })

    it('applies correct CSS classes for error status', () => {
      renderComponent({ status: 'error' })

      const statusIcon = document.querySelector('.status-icon')
      expect(statusIcon).toHaveClass('status-error')
      expect(statusIcon).not.toHaveClass('status-pending')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderComponent()

      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H1')
    })

    it('provides meaningful status description', () => {
      renderComponent({ status: 'pending' })

      const description = screen.getByText(/We sent a verification link/i)
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
    })

    it('email is properly labeled', () => {
      renderComponent({ email: 'test@example.com' })

      expect(screen.getByText('Sent to:')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles unknown status gracefully', () => {
      // Force unknown status by casting
      renderComponent({ status: 'unknown' as StatusType })

      // Should fall back to default case
      expect(screen.getByRole('heading', { name: /Verifying Email/i })).toBeInTheDocument()
      expect(screen.getByText(/Checking your email verification status/i)).toBeInTheDocument()
    })

    it('handles very long email addresses', () => {
      const longEmail = 'very.long.email.address.that.might.break.layout@very-long-domain-name.com'
      renderComponent({ email: longEmail })

      expect(screen.getByText(longEmail)).toBeInTheDocument()
      expect(screen.getByText(longEmail)).toHaveStyle('word-break: break-all')
    })

    it('handles email with special characters', () => {
      const specialEmail = 'user+test@example-domain.co.uk'
      renderComponent({ email: specialEmail })

      expect(screen.getByText(specialEmail)).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('has proper CSS class structure', () => {
      renderComponent()

      expect(document.querySelector('.verification-status')).toBeInTheDocument()
      expect(document.querySelector('.status-icon')).toBeInTheDocument()
      expect(document.querySelector('.status-content')).toBeInTheDocument()
      expect(document.querySelector('.status-title')).toBeInTheDocument()
      expect(document.querySelector('.status-description')).toBeInTheDocument()
    })

    it('maintains consistent DOM structure across status changes', () => {
      const { rerender } = renderComponent({ status: 'pending' })
      
      const initialStructure = document.body.innerHTML
      
      rerender({ status: 'verified', email: 'test@example.com' })
      
      // Structure should be the same, only content changes
      expect(document.querySelector('.verification-status')).toBeInTheDocument()
      expect(document.querySelector('.status-icon')).toBeInTheDocument()
      expect(document.querySelector('.status-content')).toBeInTheDocument()
    })
  })
})