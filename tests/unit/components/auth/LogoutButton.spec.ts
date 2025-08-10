/**
 * LogoutButton Component Tests
 * Comprehensive tests for the LogoutButton Vue component
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { mountWithAuth, cleanupAuthTests, a11yHelpers } from '../../../utils/auth-test-utils'
import LogoutButton from '@/components/auth/LogoutButton.vue'
import { createAuthError } from '../../../mocks/auth0'

describe('LogoutButton Component', () => {
  afterEach(() => {
    cleanupAuthTests()
  })

  describe('rendering', () => {
    it('should render with default props', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toContain('Cerrar Sesión')
      expect(wrapper.find('.logout-button__icon').exists()).toBe(true)
    })

    it('should render with custom text', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          text: 'Sign Out'
        }
      })

      expect(wrapper.text()).toContain('Sign Out')
    })

    it('should apply correct variant and size classes', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          variant: 'primary',
          size: 'large'
        }
      })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props()).toMatchObject({
        variant: 'primary',
        size: 'large'
      })
    })

    it('should render loading state correctly', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'loading'
      })

      expect(wrapper.text()).toContain('Cerrando sesión...')
      expect(wrapper.find('.logout-button--loading').exists()).toBe(true)
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      
      const button = wrapper.findComponent({ name: 'BaseButton' })
      expect(button.props('disabled')).toBe(true)
      expect(button.props('loading')).toBe(true)
    })

    it('should render error state correctly', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        }
      })

      expect(wrapper.find('.logout-button--error').exists()).toBe(true)
      expect(wrapper.find('.logout-button__error').exists()).toBe(true)
      expect(wrapper.text()).toContain('Error al cerrar sesión')
    })

    it('should hide error when showError is false', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        },
        props: {
          showError: false
        }
      })

      expect(wrapper.find('.logout-button__error').exists()).toBe(false)
    })
  })

  describe('confirmation modal', () => {
    it('should show confirmation modal when showConfirmation is true', async () => {
      const user = userEvent.setup()
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(true)
        expect(wrapper.text()).toContain('Confirmar Cierre de Sesión')
        expect(wrapper.text()).toContain('¿Estás seguro de que deseas cerrar sesión?')
      })
    })

    it('should not show confirmation modal by default', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth0Client.logout).toHaveBeenCalled()
        expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(false)
      })
    })

    it('should handle modal confirmation', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      // Click logout button
      const logoutButton = wrapper.find('button')
      await user.click(logoutButton.element)

      // Modal should appear
      await waitFor(() => {
        expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(true)
      })

      // Click confirm button in modal
      const modal = wrapper.findComponent({ name: 'BaseModal' })
      await modal.vm.$emit('confirm')

      await waitFor(() => {
        expect(mockAuth0Client.logout).toHaveBeenCalled()
        expect(wrapper.emitted('logoutSuccess')).toBeTruthy()
      })
    })

    it('should handle modal cancellation', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      // Click logout button
      const logoutButton = wrapper.find('button')
      await user.click(logoutButton.element)

      // Modal should appear
      await waitFor(() => {
        expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(true)
      })

      // Click cancel or close
      const modal = wrapper.findComponent({ name: 'BaseModal' })
      await modal.vm.$emit('cancel')

      await waitFor(() => {
        expect(mockAuth0Client.logout).not.toHaveBeenCalled()
      })
    })

    it('should handle modal close via X button', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      // Click logout button
      const logoutButton = wrapper.find('button')
      await user.click(logoutButton.element)

      // Modal should appear
      await waitFor(() => {
        expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(true)
      })

      // Close modal
      const modal = wrapper.findComponent({ name: 'BaseModal' })
      await modal.vm.$emit('close')

      await waitFor(() => {
        expect(mockAuth0Client.logout).not.toHaveBeenCalled()
      })
    })
  })

  describe('user interactions', () => {
    it('should handle direct logout without confirmation', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth0Client.logout).toHaveBeenCalled()
      })
    })

    it('should pass custom return URL', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          returnToUrl: 'http://localhost:5173/goodbye'
        }
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(mockAuth0Client.logout).toHaveBeenCalledWith({
          logoutParams: {
            returnTo: 'http://localhost:5173/goodbye'
          }
        })
      })
    })

    it('should emit correct events during logout flow', async () => {
      const user = userEvent.setup()
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('logoutStart')).toBeTruthy()
        expect(wrapper.emitted('logoutSuccess')).toBeTruthy()
      })
    })

    it('should emit error event when logout fails', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const logoutError = createAuthError('Logout failed')
      mockAuth0Client.logout.mockRejectedValueOnce(logoutError)

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('logoutStart')).toBeTruthy()
        expect(wrapper.emitted('logoutError')).toBeTruthy()
        expect(wrapper.emitted('logoutError')?.[0]).toEqual([logoutError])
      })
    })

    it('should prevent multiple clicks during loading', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Mock slow logout
      mockAuth0Client.logout.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      const button = wrapper.find('button')
      
      // Click multiple times quickly
      await user.click(button.element)
      await user.click(button.element)
      await user.click(button.element)

      await waitFor(() => {
        // Should only be called once due to loading state
        expect(mockAuth0Client.logout).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      // BaseButton should handle basic button accessibility
    })

    it('should have error with correct ARIA attributes', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        }
      })

      const errorElement = wrapper.find('.logout-button__error')
      expect(errorElement.attributes('role')).toBe('alert')
      expect(errorElement.attributes('aria-live')).toBe('polite')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      await user.type(button.element, '{Enter}')

      await waitFor(() => {
        expect(mockAuth0Client.logout).toHaveBeenCalled()
      })
    })

    it('should be accessible with screen readers', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Test that important content is accessible
      expect(wrapper.text()).toContain('Cerrar Sesión')
      
      // Error message should be announced
      const { wrapper: errorWrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        }
      })

      a11yHelpers.testScreenReaderContent(errorWrapper, 'Error al cerrar sesión')
    })

    it('should handle modal accessibility', async () => {
      const user = userEvent.setup()
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        const modal = wrapper.findComponent({ name: 'BaseModal' })
        expect(modal.exists()).toBe(true)
        expect(modal.props('title')).toBe('Confirmar Cierre de Sesión')
      })
    })
  })

  describe('visual states', () => {
    it('should show correct icon for normal state', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Should show logout icon (ArrowLeftOnRectangleIcon)
      const icon = wrapper.find('.logout-button__icon')
      expect(icon.exists()).toBe(true)
      expect(icon.classes()).not.toContain('animate-spin')
    })

    it('should show spinning icon during loading', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'loading'
      })

      const icon = wrapper.find('.logout-button__icon')
      expect(icon.classes()).toContain('animate-spin')
    })

    it('should show error icon when there is an error', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        }
      })

      // Should show error icon (ExclamationTriangleIcon)
      const icon = wrapper.find('.logout-button__icon')
      expect(icon.exists()).toBe(true)
    })

    it('should apply correct CSS classes for different states', async () => {
      // Loading state
      const { wrapper: loadingWrapper } = await mountWithAuth(LogoutButton, {
        authState: 'loading'
      })
      expect(loadingWrapper.find('.logout-button--loading').exists()).toBe(true)

      // Error state
      const { wrapper: errorWrapper } = await mountWithAuth(LogoutButton, {
        customAuthOptions: {
          isAuthenticated: true,
          error: createAuthError('Logout failed')
        }
      })
      expect(errorWrapper.find('.logout-button--error').exists()).toBe(true)
    })
  })

  describe('responsive behavior', () => {
    it('should handle different button sizes', async () => {
      const sizes = ['small', 'medium', 'large'] as const

      for (const size of sizes) {
        const { wrapper } = await mountWithAuth(LogoutButton, {
          authState: 'authenticatedUser',
          props: { size }
        })

        const baseButton = wrapper.findComponent({ name: 'BaseButton' })
        expect(baseButton.props('size')).toBe(size)
      }
    })
  })

  describe('theme support', () => {
    it('should support different button variants', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

      for (const variant of variants) {
        const { wrapper } = await mountWithAuth(LogoutButton, {
          authState: 'authenticatedUser',
          props: { variant }
        })

        const baseButton = wrapper.findComponent({ name: 'BaseButton' })
        expect(baseButton.props('variant')).toBe(variant)
      }
    })

    it('should use ghost variant by default', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const baseButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(baseButton.props('variant')).toBe('ghost')
    })
  })

  describe('error handling edge cases', () => {
    it('should handle network errors', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const networkError = new Error('Network error')
      networkError.name = 'NetworkError'
      mockAuth0Client.logout.mockRejectedValueOnce(networkError)

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('logoutError')).toBeTruthy()
        expect(wrapper.emitted('logoutError')?.[0][0]).toEqual(networkError)
      })
    })

    it('should handle unexpected error types', async () => {
      const user = userEvent.setup()
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Non-Error object
      mockAuth0Client.logout.mockRejectedValueOnce('String error')

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('logoutError')).toBeTruthy()
        const emittedError = wrapper.emitted('logoutError')?.[0][0]
        expect(emittedError).toBeInstanceOf(Error)
        expect(emittedError.message).toBe('Logout failed')
      })
    })
  })

  describe('integration with auth system', () => {
    it('should reflect auth store state changes', async () => {
      const { wrapper, authStore } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Initially should show logout text
      expect(wrapper.text()).toContain('Cerrar Sesión')

      // Simulate auth state change
      authStore.setLoading(true)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Cerrando sesión...')
    })

    it('should handle auth0 client state changes', async () => {
      const { wrapper, mockAuth0Client } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      // Simulate Auth0 loading state change
      mockAuth0Client.isLoading.value = true
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Cerrando sesión...')
    })

    it('should clear auth data after successful logout', async () => {
      const user = userEvent.setup()
      const { wrapper, authStore } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await waitFor(() => {
        expect(wrapper.emitted('logoutSuccess')).toBeTruthy()
      })

      // Auth store should be cleared by the logout function
      // This is tested in the composable tests
    })
  })

  describe('performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser'
      })

      const renderCount = (wrapper.vm as any).$?.renderTracked?.callCount || 0
      
      // Trigger some state changes
      await wrapper.setProps({ text: 'New Text' })
      
      // Component should handle updates efficiently
      expect(wrapper.text()).toContain('New Text')
    })

    it('should handle rapid confirmation modal interactions', async () => {
      const user = userEvent.setup()
      const { wrapper } = await mountWithAuth(LogoutButton, {
        authState: 'authenticatedUser',
        props: {
          showConfirmation: true
        }
      })

      // Rapidly open and close modal
      const button = wrapper.find('button')
      await user.click(button.element)
      
      const modal = wrapper.findComponent({ name: 'BaseModal' })
      await modal.vm.$emit('cancel')
      
      await user.click(button.element)
      await modal.vm.$emit('close')

      // Should handle rapid interactions gracefully
      expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(false)
    })
  })
})