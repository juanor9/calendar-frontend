/**
 * COMPONENT ANALYSIS TEMPLATE - VerificationHelp.vue
 * 
 * COMPONENT: VerificationHelp.vue
 * DEPENDENCIES FOUND:
 * - No props
 * - Reactive state: showTroubleshooting (ref<boolean>)
 * - Icons: QuestionMarkCircleIcon, ChatBubbleLeftIcon
 * - Method: toggleTroubleshooting
 * - Static data: troubleshootingTips array
 * - No lifecycle hooks
 * - No composables used
 * - Simple toggle component with static help content
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import VerificationHelp from '@/features/authentication/components/email-verification/VerificationHelp.vue'

describe('VerificationHelp Component', () => {
  const renderComponent = () => {
    return render(VerificationHelp)
  }

  describe('Initial State', () => {
    it('renders help links', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: /Didn't receive the email\?/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Contact support/i })).toBeInTheDocument()
    })

    it('does not show troubleshooting content initially', () => {
      renderComponent()

      expect(screen.queryByText(/Check your spam\/junk folder/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Troubleshooting Tips:/i)).not.toBeInTheDocument()
    })

    it('support link has correct href', () => {
      renderComponent()

      const supportLink = screen.getByRole('link', { name: /Contact support/i })
      expect(supportLink).toHaveAttribute('href', '/support')
    })
  })

  describe('Troubleshooting Toggle', () => {
    it('shows troubleshooting content when toggle button clicked', async () => {
      const user = userEvent.setup()
      renderComponent()

      const toggleButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      await user.click(toggleButton)

      expect(screen.getByText(/Troubleshooting Tips:/i)).toBeInTheDocument()
      expect(screen.getByText(/Check your spam\/junk folder/i)).toBeInTheDocument()
    })

    it('hides troubleshooting content when toggle button clicked again', async () => {
      const user = userEvent.setup()
      renderComponent()

      const toggleButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      
      // Show content
      await user.click(toggleButton)
      expect(screen.getByText(/Troubleshooting Tips:/i)).toBeInTheDocument()
      
      // Hide content
      await user.click(toggleButton)
      expect(screen.queryByText(/Troubleshooting Tips:/i)).not.toBeInTheDocument()
    })
  })

  describe('Troubleshooting Content', () => {
    it('displays all troubleshooting tips when expanded', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      const expectedTips = [
        'Check your spam/junk folder',
        'Make sure you entered the correct email address',
        'Wait a few minutes - emails can take time to arrive',
        'Try adding no-reply@vana.ai to your contacts'
      ]

      expectedTips.forEach(tip => {
        expect(screen.getByText(tip)).toBeInTheDocument()
      })
    })

    it('displays tips as a list with proper structure', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      const troubleshootingSection = screen.getByText(/Troubleshooting Tips:/i).closest('.troubleshooting')
      expect(troubleshootingSection).toBeInTheDocument()

      const list = troubleshootingSection!.querySelector('ul')
      expect(list).toBeInTheDocument()

      const listItems = troubleshootingSection!.querySelectorAll('li')
      expect(listItems).toHaveLength(4)
    })

    it('each tip has proper bullet styling', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      const listItems = document.querySelectorAll('.troubleshooting li')
      listItems.forEach(item => {
        expect(item).toHaveStyle('position: relative')
        expect(item).toHaveStyle('padding-left: 1rem')
      })
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive layout classes', () => {
      renderComponent()

      const helpLinks = document.querySelector('.help-links')
      expect(helpLinks).toHaveStyle('display: flex')
      expect(helpLinks).toHaveStyle('justify-content: center')
    })

    it('maintains proper spacing between help links', () => {
      renderComponent()

      const helpLinks = document.querySelector('.help-links')
      expect(helpLinks).toHaveStyle('gap: 2rem')
    })
  })

  describe('Accessibility', () => {
    it('toggle button has proper interactive attributes', () => {
      renderComponent()

      const toggleButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).not.toBeDisabled()
    })

    it('support link is keyboard accessible', async () => {
      const user = userEvent.setup()
      renderComponent()

      const supportLink = screen.getByRole('link', { name: /Contact support/i })
      
      await user.tab()
      // Link should be focusable
      expect(document.activeElement).toBe(supportLink)
    })

    it('maintains proper focus order', async () => {
      const user = userEvent.setup()
      renderComponent()

      // First tab should focus toggle button
      await user.tab()
      expect(document.activeElement).toBe(
        screen.getByRole('button', { name: /Didn't receive the email\?/i })
      )

      // Second tab should focus support link
      await user.tab()
      expect(document.activeElement).toBe(
        screen.getByRole('link', { name: /Contact support/i })
      )
    })

    it('toggle button works with keyboard', async () => {
      const user = userEvent.setup()
      renderComponent()

      const toggleButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      
      // Focus the button and press Enter
      toggleButton.focus()
      await user.keyboard('{Enter}')

      expect(screen.getByText(/Troubleshooting Tips:/i)).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('displays question mark icon in toggle button', () => {
      renderComponent()

      const toggleButton = screen.getByRole('button', { name: /Didn't receive the email\?/i })
      expect(toggleButton).toBeInTheDocument()
      
      // Icon should be present (mocked by heroicons mock)
      const icon = toggleButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('displays chat bubble icon in support link', () => {
      renderComponent()

      const supportLink = screen.getByRole('link', { name: /Contact support/i })
      expect(supportLink).toBeInTheDocument()
      
      // Icon should be present (mocked by heroicons mock)
      const icon = supportLink.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })
})

describe('Styling and Visual States', () => {
    it('applies correct CSS classes to help links', () => {
      renderComponent()

      const helpLinks = document.querySelectorAll('.help-link')
      expect(helpLinks).toHaveLength(2)
      
      helpLinks.forEach(link => {
        expect(link).toHaveClass('help-link')
      })
    })

    it('applies proper hover states', () => {
      renderComponent()

      const helpLinks = document.querySelectorAll('.help-link')
      helpLinks.forEach(link => {
        // CSS hover states should be defined
        expect(link).toHaveStyle('transition: color 0.2s ease')
      })
    })

    it('troubleshooting section has proper background styling', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      const troubleshootingSection = document.querySelector('.troubleshooting')
      expect(troubleshootingSection).toHaveStyle('background: #f7fafc')
      expect(troubleshootingSection).toHaveStyle('border-radius: 0.5rem')
      expect(troubleshootingSection).toHaveStyle('padding: 1rem')
    })
  })

  describe('Component Structure', () => {
    it('has proper overall structure', () => {
      renderComponent()

      const helpComponent = document.querySelector('.verification-help')
      expect(helpComponent).toBeInTheDocument()
      
      const helpLinks = helpComponent!.querySelector('.help-links')
      expect(helpLinks).toBeInTheDocument()
    })

    it('maintains structure when troubleshooting is toggled', async () => {
      const user = userEvent.setup()
      renderComponent()

      const initialStructure = document.querySelector('.verification-help')
      expect(initialStructure).toBeInTheDocument()

      // Toggle troubleshooting
      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      // Structure should remain intact
      expect(document.querySelector('.verification-help')).toBeInTheDocument()
      expect(document.querySelector('.help-links')).toBeInTheDocument()
      expect(document.querySelector('.troubleshooting')).toBeInTheDocument()
    })
  })

  describe('Text Content', () => {
    it('has appropriate help text content', () => {
      renderComponent()

      expect(screen.getByText(/Didn't receive the email\?/i)).toBeInTheDocument()
      expect(screen.getByText(/Contact support/i)).toBeInTheDocument()
    })

    it('troubleshooting heading is properly formatted', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Didn't receive the email\?/i }))

      const heading = screen.getByText(/Troubleshooting Tips:/i)
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H3')
    })
  })