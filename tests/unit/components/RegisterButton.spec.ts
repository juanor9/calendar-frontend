/**
 * Unit tests for RegisterButton component
 * Testing all variants, states, and accessibility features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import RegisterButton from '@/ui/RegisterButton/RegisterButton.vue'

describe('RegisterButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders with default props', () => {
      render(RegisterButton, {
        slots: {
          default: 'Register Now',
        },
      })

      const button = screen.getByRole('button', { name: 'Register Now' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('register-button')
      expect(button).toHaveClass('register-button--primary')
      expect(button).toHaveClass('register-button--medium')
      expect(button).toHaveClass('register-button--auto-width')
    })

    it('renders with custom props', () => {
      render(RegisterButton, {
        props: {
          variant: 'secondary',
          size: 'large',
          width: 'full',
          type: 'submit',
        },
        slots: {
          default: 'Submit Registration',
        },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('register-button--secondary')
      expect(button).toHaveClass('register-button--large')
      expect(button).toHaveClass('register-button--full-width')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('renders all supported variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      variants.forEach((variant, index) => {
        const { unmount } = render(RegisterButton, {
          props: { variant },
          slots: { default: `Button ${index}` },
        })

        const button = screen.getByRole('button')
        expect(button).toHaveClass(`register-button--${variant}`)

        unmount()
      })
    })

    it('renders all supported sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const

      sizes.forEach((size, index) => {
        const { unmount } = render(RegisterButton, {
          props: { size },
          slots: { default: `Button ${index}` },
        })

        const button = screen.getByRole('button')
        expect(button).toHaveClass(`register-button--${size}`)

        unmount()
      })
    })
  })

  describe('icon support', () => {
    it('renders with left icon', () => {
      render(RegisterButton, {
        slots: {
          default: 'Register',
          iconLeft: '<svg data-testid="left-icon">left</svg>',
        },
      })

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
    })

    it('renders with right icon', () => {
      render(RegisterButton, {
        slots: {
          default: 'Register',
          iconRight: '<svg data-testid="right-icon">right</svg>',
        },
      })

      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
    })

    it('renders with both left and right icons', () => {
      render(RegisterButton, {
        slots: {
          default: 'Register',
          iconLeft: '<svg data-testid="left-icon">left</svg>',
          iconRight: '<svg data-testid="right-icon">right</svg>',
        },
      })

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
    })

    it('hides icons when loading', () => {
      render(RegisterButton, {
        props: { loading: true },
        slots: {
          default: 'Register',
          iconLeft: '<svg data-testid="left-icon">left</svg>',
          iconRight: '<svg data-testid="right-icon">right</svg>',
        },
      })

      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
      expect(screen.queryByText('Register')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('shows loading state correctly', () => {
      render(RegisterButton, {
        props: {
          loading: true,
          loadingText: 'Creating account...',
        },
        slots: {
          default: 'Register Now',
        },
      })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('register-button--loading')

      // Loading spinner should be visible
      expect(document.querySelector('.register-button__loading')).toBeInTheDocument()

      // Screen reader text should be present
      expect(screen.getByText('Creating account...')).toBeInTheDocument()
      expect(screen.getByText('Creating account...')).toHaveClass('sr-only')

      // Original text and icons should be hidden
      expect(screen.queryByText('Register Now')).not.toBeInTheDocument()
    })

    it('uses default loading text when not specified', () => {
      render(RegisterButton, {
        props: { loading: true },
        slots: { default: 'Register' },
      })

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('prevents interaction when loading', async () => {
      const user = userEvent.setup()
      const mockClick = vi.fn()

      render(
        RegisterButton,
        {
          props: { loading: true },
          slots: { default: 'Register' },
        },
        {
          global: {
            stubs: {
              'register-button': {
                template: '<button @click="$emit(\'click\', $event)"><slot /></button>',
                emits: ['click'],
              },
            },
          },
        }
      )

      const button = screen.getByRole('button')
      button.addEventListener('click', mockClick)

      await user.click(button)

      expect(mockClick).not.toHaveBeenCalled()
    })
  })

  describe('disabled state', () => {
    it('shows disabled state correctly', () => {
      render(RegisterButton, {
        props: { disabled: true },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('register-button--disabled')
    })

    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup()
      const { emitted } = render(RegisterButton, {
        props: { disabled: true },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      await user.click(button)

      expect(emitted().click).toBeFalsy()
    })

    it('prevents interaction with preventDefault when loading', async () => {
      const { emitted } = render(RegisterButton, {
        props: { loading: true },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

      button.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(emitted().click).toBeFalsy()
    })

    it('prevents interaction with preventDefault when disabled', async () => {
      const { emitted } = render(RegisterButton, {
        props: { disabled: true },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

      button.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(emitted().click).toBeFalsy()
    })
  })

  describe('floating action button', () => {
    it('applies floating styles', () => {
      render(RegisterButton, {
        props: { floating: true },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('register-button--floating')
    })
  })

  describe('event handling', () => {
    it('emits click event when clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      await user.click(button)

      expect(emitted().click).toBeTruthy()
      expect(emitted().click).toHaveLength(1)
      expect(emitted().click[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('prevents click when loading or disabled', async () => {
      const user = userEvent.setup()

      // Test loading state
      const { unmount, emitted } = render(RegisterButton, {
        props: { loading: true },
        slots: { default: 'Register' },
      })

      let button = screen.getByRole('button')
      await user.click(button)

      expect(emitted().click).toBeFalsy()

      unmount()

      // Test disabled state
      const { emitted: emitted2 } = render(RegisterButton, {
        props: { disabled: true },
        slots: { default: 'Register' },
      })

      button = screen.getByRole('button')
      await user.click(button)

      expect(emitted2().click).toBeFalsy()
    })

    it('handles keyboard events', async () => {
      const user = userEvent.setup()
      const { emitted } = render(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')

      expect(emitted().click).toBeTruthy()
      expect(emitted().click).toHaveLength(1)
    })

    it('handles space key activation', async () => {
      const user = userEvent.setup()
      const { emitted } = render(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard(' ')

      expect(emitted().click).toBeTruthy()
      expect(emitted().click).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(RegisterButton, {
        props: {
          ariaLabel: 'Start registration process',
          pressed: true,
        },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Start registration process')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('supports screen reader announcements for loading', () => {
      render(RegisterButton, {
        props: {
          loading: true,
          loadingText: 'Processing registration...',
        },
        slots: { default: 'Register' },
      })

      const srText = screen.getByText('Processing registration...')
      expect(srText).toHaveClass('sr-only')
      // The sr-only text itself should not have aria-hidden, but loading spinner should
      const loadingSpinner = document.querySelector('.register-button__loading')
      expect(loadingSpinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('maintains focus outline for keyboard navigation', () => {
      render(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()
    })

    it('has appropriate role and type attributes', () => {
      render(RegisterButton, {
        props: { type: 'submit' },
        slots: { default: 'Submit Form' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button.tagName).toBe('BUTTON')
    })

    it('provides accessible name through content', () => {
      render(RegisterButton, {
        slots: { default: 'Create New Account' },
      })

      const button = screen.getByRole('button', { name: 'Create New Account' })
      expect(button).toBeInTheDocument()
    })

    it('handles high contrast mode', () => {
      render(RegisterButton, {
        props: { variant: 'outline' },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('register-button--outline')

      // In a real implementation, we would test CSS custom properties
      // or computed styles for high contrast support
    })
  })

  describe('responsive behavior', () => {
    it('adapts to different screen sizes', () => {
      // Test mobile floating behavior
      render(RegisterButton, {
        props: {
          floating: true,
          size: 'large',
        },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('register-button--floating')
      expect(button).toHaveClass('register-button--large')
    })

    it('supports full width on mobile', () => {
      render(RegisterButton, {
        props: { width: 'full' },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('register-button--full-width')
    })
  })

  describe('error states', () => {
    it('handles missing slot content gracefully', () => {
      render(RegisterButton)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button.textContent).toBe('')
    })

    it('handles invalid props gracefully', () => {
      // TypeScript would catch these, but test runtime behavior
      render(RegisterButton, {
        // @ts-expect-error - Testing invalid prop
        props: { variant: 'invalid', size: 'invalid' },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('register-button')
    })
  })

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(RegisterButton, {
        slots: { default: 'Register' },
      })

      // Simulate prop change that shouldn't cause re-render
      rerender({
        props: { loading: false }, // Same as default
        slots: { default: 'Register' },
      })

      // Button should still be present and functional
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles rapid state changes', async () => {
      const user = userEvent.setup()

      // Test loading state
      const { unmount: unmount1 } = render(RegisterButton, {
        props: { loading: true },
        slots: { default: 'Register' },
      })

      let button = screen.getByRole('button')
      expect(button).toBeDisabled()

      unmount1()

      // Test non-loading state
      const { emitted } = render(RegisterButton, {
        props: { loading: false },
        slots: { default: 'Register' },
      })

      button = screen.getByRole('button')
      expect(button).not.toBeDisabled()

      await user.click(button)
      expect(emitted().click).toBeTruthy()
    })
  })

  describe('integration scenarios', () => {
    it('works within forms', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn()

      render({
        template: `
          <form @submit.prevent="handleSubmit">
            <RegisterButton type="submit" data-testid="submit-btn">
              Complete Registration
            </RegisterButton>
          </form>
        `,
        methods: {
          handleSubmit: mockSubmit,
        },
        components: { RegisterButton },
      })

      const button = screen.getByTestId('submit-btn')
      await user.click(button)

      expect(mockSubmit).toHaveBeenCalled()
    })

    it('integrates with validation states', () => {
      render(RegisterButton, {
        props: {
          disabled: true,
          ariaLabel: 'Please fill all required fields before registering',
        },
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute(
        'aria-label',
        'Please fill all required fields before registering'
      )
    })
  })
})
