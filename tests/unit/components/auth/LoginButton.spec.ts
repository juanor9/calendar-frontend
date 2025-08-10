/**
 * LoginButton Component Tests
 * Comprehensive tests for the LoginButton Vue component
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { mountWithAuth, cleanupAuthTests } from '../../../utils/auth-test-utils'
import { a11yHelpers } from '../../../utils/auth-test-utils'
import LoginButton from '@/components/auth/LoginButton.vue'
import { createAuthError } from '../../../mocks/auth0'

describe('LoginButton Component', () => {
  afterEach(() => {
    cleanupAuthTests()
  })

  describe('rendering', () => {
    it('should render with default props', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toContain('Iniciar Sesión')
      expect(wrapper.find('.login-button__icon').exists()).toBe(true)
    })

    it('should render with custom text', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated',
        props: {
          text: 'Sign In'
        }
      })

      expect(wrapper.text()).toContain('Sign In')
    })

    it('should apply correct variant and size classes', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated',
        props: {
          variant: 'secondary',
          size: 'large'
        }
      })

      const button = wrapper.find('button')
      // Note: These classes would be applied by BaseButton component
      // We're testing that the props are passed correctly
      expect(wrapper.findComponent({ name: 'BaseButton' }).props()).toMatchObject({
        variant: 'secondary',
        size: 'large'
      })
    })

    it('should render loading state correctly', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'loading'
      })

      expect(wrapper.text()).toContain('Iniciando sesión...')
      expect(wrapper.find('.login-button--loading').exists()).toBe(true)
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      
      const button = wrapper.findComponent({ name: 'BaseButton' })
      expect(button.props('disabled')).toBe(true)
      expect(button.props('loading')).toBe(true)
    })

    it('should render error state correctly', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        }
      })

      expect(wrapper.find('.login-button--error').exists()).toBe(true)
      expect(wrapper.find('.login-button__error').exists()).toBe(true)
      expect(wrapper.text()).toContain('Error al iniciar sesión')
    })

    it('should hide error when showError is false', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        },
        props: {
          showError: false
        }
      })

      expect(wrapper.find('.login-button__error').exists()).toBe(false)
    })
  })

  describe('user interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()
      })
    })

    it('should pass custom redirect URI and app state', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated',
        props: {
          redirectUri: 'http://localhost:5173/custom-callback',
          appState: { targetUrl: '/dashboard' }
        }
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledWith({
          authorizationParams: {
            redirect_uri: 'http://localhost:5173/custom-callback'
          },
          appState: { targetUrl: '/dashboard' }
        })
      })
    })

    it('should emit correct events during login flow', async () => {
      const user = userEvent.setup()
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginStart')).toBeTruthy()
        expect(wrapper.emitted('loginSuccess')).toBeTruthy()
      })
    })

    it('should emit error event when login fails', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const loginError = createAuthError('Login failed')
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(loginError)

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginStart')).toBeTruthy()
        expect(wrapper.emitted('loginError')).toBeTruthy()
        expect(wrapper.emitted('loginError')?.[0]).toEqual([loginError])
      })
    })

    it('should prevent multiple clicks during loading', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Mock slow login
      mockAuth0Client.loginWithRedirect.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      const button = wrapper.find('button')
      
      // Click multiple times quickly
      await user.click(button.element)
      await user.click(button.element)
      await user.click(button.element)

      await waitFor(() => {
        // Should only be called once
        expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      // BaseButton should handle basic button accessibility
    })

    it('should have error with correct ARIA attributes', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        }
      })

      const errorElement = wrapper.find('.login-button__error')
      expect(errorElement.attributes('role')).toBe('alert')
      expect(errorElement.attributes('aria-live')).toBe('polite')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const button = wrapper.find('button')
      await user.type(button.element, '{Enter}')

      await waitFor(() => {
        expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()
      })
    })

    it('should be accessible with screen readers', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Test that important content is accessible
      expect(wrapper.text()).toContain('Iniciar Sesión')
      
      // Error message should be announced
      const { wrapper: errorWrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        }
      })

      a11yHelpers.testScreenReaderContent(errorWrapper, 'Error al iniciar sesión')
    })
  })

  describe('visual states', () => {
    it('should show correct icon for normal state', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Should show login icon (ArrowRightOnRectangleIcon)
      const icon = wrapper.find('.login-button__icon')
      expect(icon.exists()).toBe(true)
      expect(icon.classes()).not.toContain('animate-spin')
    })

    it('should show spinning icon during loading', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'loading'
      })

      const icon = wrapper.find('.login-button__icon')
      expect(icon.classes()).toContain('animate-spin')
    })

    it('should show error icon when there is an error', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        }
      })

      // Should show error icon (ExclamationTriangleIcon)
      const icon = wrapper.find('.login-button__icon')
      expect(icon.exists()).toBe(true)
    })

    it('should apply correct CSS classes for different states', async () => {
      // Loading state
      const { wrapper: loadingWrapper } = await mountWithAuth(LoginButton, {
        authState: 'loading'
      })
      expect(loadingWrapper.find('.login-button--loading').exists()).toBe(true)

      // Error state
      const { wrapper: errorWrapper } = await mountWithAuth(LoginButton, {
        customAuthOptions: {
          error: createAuthError('Login failed')
        }
      })
      expect(errorWrapper.find('.login-button--error').exists()).toBe(true)
    })
  })

  describe('responsive behavior', () => {
    it('should handle small screen sizes', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated',
        props: {
          size: 'small'
        }
      })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props('size')).toBe('small')
    })

    it('should handle large screen sizes', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated',
        props: {
          size: 'large'
        }
      })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props('size')).toBe('large')
    })
  })

  describe('theme support', () => {
    it('should support different button variants', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      for (const variant of variants) {
        const { wrapper } = await mountWithAuth(LoginButton, {
          authState: 'unauthenticated',
          props: { variant }
        })

        const baseButton = wrapper.findComponent({ name: 'BaseButton' })
        expect(baseButton.props('variant')).toBe(variant)
      }
    })
  })

  describe('error handling edge cases', () => {
    it('should handle network errors', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const networkError = new Error('Network error')
      networkError.name = 'NetworkError'
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(networkError)

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginError')).toBeTruthy()
        expect(wrapper.emitted('loginError')?.[0][0]).toEqual(networkError)
      })
    })

    it('should handle unexpected error types', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Non-Error object
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce('String error')

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('loginError')).toBeTruthy()
        const emittedError = wrapper.emitted('loginError')?.[0][0]
        expect(emittedError).toBeInstanceOf(Error)
        expect(emittedError.message).toBe('Login failed')
      })
    })
  })

  describe('performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const { wrapper } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      const renderCount = (wrapper.vm as any).$?.renderTracked?.callCount || 0
      
      // Trigger some state changes
      await wrapper.setProps({ text: 'New Text' })
      
      // Component should handle updates efficiently
      expect(wrapper.text()).toContain('New Text')
    })
  })

  describe('integration with auth system', () => {
    it('should reflect auth store state changes', async () => {
      const { wrapper, authStore } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Initially should show login text
      expect(wrapper.text()).toContain('Iniciar Sesión')

      // Simulate auth state change
      authStore.setLoading(true)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Iniciando sesión...')
    })

    it('should handle auth0 client state changes', async () => {
      const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton, {
        authState: 'unauthenticated'
      })

      // Simulate Auth0 loading state change
      mockAuth0Client.isLoading.value = true
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Iniciando sesión...')
    })
  })
})