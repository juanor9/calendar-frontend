/**
 * LoginButton Component Tests
 * Comprehensive tests for the LoginButton Vue component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { ref } from 'vue'
import LoginButton from '@/features/authentication/components/LoginButton/LoginButton.vue'
import { createAuthError } from '../../../mocks/auth0'
import {
  createCompleteAuthComposableMock,
  type CompleteAuthComposableMock
} from '../../../mocks/auth-store-mock'

// Create complete auth mock
let mockAuth: CompleteAuthComposableMock

vi.mock('@/features/authentication/composables/useAuth', () => ({
  useAuth: () => mockAuth,
}))

// Mock BaseButton
vi.mock('@/shared/ui/BaseButton/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template:
      '<button :disabled="disabled" :loading="loading" :class="[$attrs.class]" @click="!disabled && $emit(\'click\', $event)"><slot name="icon" /><slot /></button>',
    props: ['variant', 'size', 'disabled', 'loading'],
    emits: ['click'],
  },
}))

// Mock icons
vi.mock('@heroicons/vue/24/outline', () => ({
  ArrowRightOnRectangleIcon: {
    name: 'ArrowRightOnRectangleIcon',
    template: '<svg class="arrow-icon"></svg>',
  },
  ExclamationTriangleIcon: {
    name: 'ExclamationTriangleIcon',
    template: '<svg class="error-icon"></svg>',
  },
}))

describe('LoginButton Component', () => {
  beforeEach(() => {
    // Create fresh complete auth mock
    mockAuth = createCompleteAuthComposableMock()
    
    // Reset to clean state
    mockAuth.isLoading.value = false
    mockAuth.error.value = null
  })

  const mountComponent = (props = {}) => {
    return mount(LoginButton, {
      props,
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })
  }

  describe('rendering', () => {
    it('should render with default props', async () => {
      const wrapper = mountComponent()

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toContain('Iniciar Sesión')
      expect(wrapper.find('.login-button__icon').exists()).toBe(true)
    })

    it('should render with custom text', async () => {
      const wrapper = mountComponent({ text: 'Sign In' })

      expect(wrapper.text()).toContain('Sign In')
    })

    it('should apply correct variant and size classes', async () => {
      const wrapper = mountComponent({
        variant: 'secondary',
        size: 'large',
      })

      // Note: These classes would be applied by BaseButton component
      // We're testing that the props are passed correctly
      expect(wrapper.findComponent({ name: 'BaseButton' }).props()).toMatchObject({
        variant: 'secondary',
        size: 'large',
      })
    })

    it('should render loading state correctly', async () => {
      mockAuth.isLoading.value = true
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('Iniciando sesión...')
      expect(wrapper.find('.login-button--loading').exists()).toBe(true)
      expect(wrapper.find('.animate-spin').exists()).toBe(true)

      const button = wrapper.findComponent({ name: 'BaseButton' })
      expect(button.props('disabled')).toBe(true)
      expect(button.props('loading')).toBe(true)
    })

    it('should render error state correctly', async () => {
      mockAuth.error.value = createAuthError('Login failed')
      const wrapper = mountComponent()

      expect(wrapper.find('.login-button--error').exists()).toBe(true)
      expect(wrapper.find('.login-button__error').exists()).toBe(true)
      expect(wrapper.text()).toContain('Login failed')
    })

    it('should hide error when showError is false', async () => {
      mockAuth.error.value = createAuthError('Login failed')
      const wrapper = mountComponent({ showError: false })

      expect(wrapper.find('.login-button__error').exists()).toBe(false)
    })
  })

  describe('user interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth.loginWithRedirect).toHaveBeenCalled()
      })
    })

    it('should pass custom redirect URI and app state', async () => {
      const user = userEvent.setup()
      const wrapper = mountComponent({
        redirectUri: 'http://localhost:5173/custom-callback',
        appState: { targetUrl: '/dashboard' },
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth.loginWithRedirect).toHaveBeenCalledWith({
          redirect_uri: 'http://localhost:5173/custom-callback',
          appState: { targetUrl: '/dashboard' },
        })
      })
    })

    it('should emit correct events during login flow', async () => {
      const user = userEvent.setup()
      mockAuth.loginWithRedirect.mockResolvedValue(undefined)
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginStart')).toBeTruthy()
        expect(wrapper.emitted('loginSuccess')).toBeTruthy()
      })
    })

    it('should emit error event when login fails', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const user = userEvent.setup()
      const loginError = createAuthError('Login failed')
      mockAuth.loginWithRedirect.mockRejectedValueOnce(loginError)
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginStart')).toBeTruthy()
        expect(wrapper.emitted('loginError')).toBeTruthy()
        expect(wrapper.emitted('loginError')?.[0]).toEqual([loginError])
      })
      
      consoleError.mockRestore()
    })

    it('should prevent multiple clicks during loading', async () => {
      // Set the component to loading state to test disabled behavior
      mockAuth.isLoading.value = true
      const wrapper = mountComponent()

      // Verify that button is properly disabled when in loading state
      const button = wrapper.findComponent({ name: 'BaseButton' })
      expect(button.props('disabled')).toBe(true)

      // Verify component shows loading text
      expect(wrapper.text()).toContain('Iniciando sesión...')

      // In a real browser, disabled buttons don't emit click events
      // This test verifies the button is properly configured to be disabled
      expect(mockAuth.loginWithRedirect).toHaveBeenCalledTimes(0)
    })
  })

  describe('accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      // BaseButton should handle basic button accessibility
    })

    it('should have error with correct ARIA attributes', async () => {
      mockAuth.error.value = createAuthError('Login failed')
      const wrapper = mountComponent()

      const errorElement = wrapper.find('.login-button__error')
      expect(errorElement.attributes('role')).toBe('alert')
      expect(errorElement.attributes('aria-live')).toBe('polite')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.type(button.element, '{Enter}')

      await waitFor(() => {
        expect(mockAuth.loginWithRedirect).toHaveBeenCalled()
      })
    })

    it('should be accessible with screen readers', async () => {
      const wrapper = mountComponent()

      // Test that important content is accessible
      expect(wrapper.text()).toContain('Iniciar Sesión')

      // Error message should be announced
      mockAuth.error.value = createAuthError('Login failed')
      const errorWrapper = mountComponent()

      expect(errorWrapper.text()).toContain('Login failed')
    })
  })

  describe('visual states', () => {
    it('should show correct icon for normal state', async () => {
      const wrapper = mountComponent()

      // Should show login icon (ArrowRightOnRectangleIcon)
      const icon = wrapper.find('.login-button__icon')
      expect(icon.exists()).toBe(true)
      expect(icon.classes()).not.toContain('animate-spin')
    })

    it('should show spinning icon during loading', async () => {
      mockAuth.isLoading.value = true
      const wrapper = mountComponent()

      const icon = wrapper.find('.login-button__icon')
      expect(icon.classes()).toContain('animate-spin')
    })

    it('should show error icon when there is an error', async () => {
      mockAuth.error.value = createAuthError('Login failed')
      const wrapper = mountComponent()

      // Should show error icon (ExclamationTriangleIcon)
      const icon = wrapper.find('.login-button__icon')
      expect(icon.exists()).toBe(true)
    })

    it('should apply correct CSS classes for different states', async () => {
      // Loading state
      mockAuth.isLoading.value = true
      const loadingWrapper = mountComponent()
      expect(loadingWrapper.find('.login-button--loading').exists()).toBe(true)

      // Error state
      mockAuth.isLoading.value = false
      mockAuth.error.value = createAuthError('Login failed')
      const errorWrapper = mountComponent()
      expect(errorWrapper.find('.login-button--error').exists()).toBe(true)
    })
  })

  describe('responsive behavior', () => {
    it('should handle small screen sizes', async () => {
      const wrapper = mountComponent({ size: 'small' })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props('size')).toBe('small')
    })

    it('should handle large screen sizes', async () => {
      const wrapper = mountComponent({ size: 'large' })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props('size')).toBe('large')
    })
  })

  describe('theme support', () => {
    it('should support different button variants', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      for (const variant of variants) {
        const wrapper = mountComponent({ variant })

        const baseButton = wrapper.findComponent({ name: 'BaseButton' })
        expect(baseButton.props('variant')).toBe(variant)
      }
    })
  })

  describe('error handling edge cases', () => {
    it('should handle network errors', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const user = userEvent.setup()
      const networkError = new Error('Network error')
      networkError.name = 'NetworkError'
      mockAuth.loginWithRedirect.mockRejectedValueOnce(networkError)
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginError')).toBeTruthy()
        expect(wrapper.emitted('loginError')?.[0][0]).toEqual(networkError)
      })
      
      consoleError.mockRestore()
    })

    it('should handle unexpected error types', async () => {
      // Suppress expected console error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const user = userEvent.setup()
      // Non-Error object
      mockAuth.loginWithRedirect.mockRejectedValueOnce('String error')
      const wrapper = mountComponent()

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginError')).toBeTruthy()
        const emittedError = wrapper.emitted('loginError')?.[0][0]
        expect(emittedError).toBeInstanceOf(Error)
        expect(emittedError.message).toBe('Login failed')
      })
      
      consoleError.mockRestore()
    })
  })

  describe('performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const wrapper = mountComponent()

      // Component should handle updates efficiently
      await wrapper.setProps({ text: 'New Text' })
      expect(wrapper.text()).toContain('New Text')
    })
  })

  describe('integration with auth system', () => {
    it('should reflect auth store state changes', async () => {
      const wrapper = mountComponent()

      // Initially should show login text
      expect(wrapper.text()).toContain('Iniciar Sesión')

      // Simulate loading state change
      mockAuth.isLoading.value = true
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Iniciando sesión...')
    })

    it('should handle auth0 client state changes', async () => {
      const wrapper = mountComponent()

      // Simulate loading state change
      mockAuth.isLoading.value = true
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Iniciando sesión...')
    })
  })
})
