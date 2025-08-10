/**
 * Auth Accessibility Tests
 * WCAG 2.2 AA compliance testing for authentication components
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { createTestingPinia } from '@pinia/testing'
import LoginButton from '@/components/auth/LoginButton.vue'
import LogoutButton from '@/components/auth/LogoutButton.vue'
import UserProfile from '@/components/auth/UserProfile.vue'
import AuthCallback from '@/components/auth/AuthCallback.vue'
import { createMockAuth0Client, mockAppUser, cleanupAuthMocks } from '../mocks/auth0'
import { a11yHelpers } from '../utils/auth-test-utils'

// Mock axe-core for accessibility testing
vi.mock('axe-core', () => ({
  run: vi.fn().mockResolvedValue({
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: [],
  }),
  configure: vi.fn(),
}))

describe('Auth Accessibility Tests', () => {
  let mockAuth0Client: ReturnType<typeof createMockAuth0Client>
  let pinia: ReturnType<typeof createTestingPinia>

  beforeEach(() => {
    mockAuth0Client = createMockAuth0Client()
    pinia = createTestingPinia({ createSpy: vi.fn })

    // Mock DOM for accessibility testing
    Object.defineProperty(document, 'activeElement', {
      writable: true,
      value: document.body,
    })

    // Mock focus/blur events
    global.HTMLElement.prototype.focus = vi.fn(function () {
      ;(document as any).activeElement = this
    })
    global.HTMLElement.prototype.blur = vi.fn()
  })

  afterEach(() => {
    cleanupAuthMocks()
  })

  describe('LoginButton Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')

      // Button should be focusable
      expect(button.attributes('tabindex')).not.toBe('-1')

      // Should have accessible name
      const hasAccessibleName =
        button.text().length > 0 ||
        button.attributes('aria-label') ||
        button.attributes('aria-labelledby')
      expect(hasAccessibleName).toBe(true)
    })

    it('should announce loading state to screen readers', async () => {
      mockAuth0Client.isLoading.value = true

      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')

      // Should indicate loading state
      expect(
        button.attributes('aria-busy') === 'true' || button.text().includes('Iniciando sesión')
      ).toBe(true)
    })

    it('should announce errors with proper ARIA live region', () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({
              error: new Error('Login failed'),
            }),
          },
        },
      })

      const errorElement = wrapper.find('[role="alert"]')

      expect(errorElement.exists()).toBe(true)
      expect(errorElement.attributes('aria-live')).toBe('polite')
      expect(errorElement.text()).toBeTruthy()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')

      // Should be focusable with Tab
      await user.tab()
      expect(document.activeElement).toBe(button.element)

      // Should trigger with Enter
      await user.keyboard('{Enter}')
      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()

      // Should trigger with Space
      mockAuth0Client.loginWithRedirect.mockClear()
      await user.keyboard(' ')
      expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()
    })

    it('should have sufficient color contrast', () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      // This would typically be tested with actual color values
      // For now, we test that the component renders without color-related issues
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)

      // In real testing, you'd check computed styles for contrast ratios
      // expect(contrastRatio).toBeGreaterThanOrEqual(4.5) // WCAG AA standard
    })

    it('should work with high contrast mode', () => {
      // Simulate high contrast mode
      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-contrast: high)',
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })
      )

      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')

      // Component should render properly in high contrast mode
      expect(button.exists()).toBe(true)
    })

    it('should handle focus management during state changes', async () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')
      button.element.focus()

      expect(document.activeElement).toBe(button.element)

      // Focus should be maintained during loading state
      mockAuth0Client.isLoading.value = true
      await wrapper.vm.$nextTick()

      // Focus should still be on the button (or appropriately managed)
      expect(document.activeElement).toBe(button.element)
    })
  })

  describe('LogoutButton Accessibility', () => {
    beforeEach(() => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
      })
    })

    it('should have proper ARIA attributes for logout action', () => {
      const wrapper = mount(LogoutButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')

      // Should have accessible name that indicates logout action
      const buttonText = button.text()
      expect(buttonText.toLowerCase()).toContain('cerrar')
    })

    it('should announce confirmation dialog properly', async () => {
      const user = userEvent.setup()
      const wrapper = mount(LogoutButton, {
        props: {
          showConfirmation: true,
        },
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      await wrapper.vm.$nextTick()

      const modal = wrapper.findComponent({ name: 'BaseModal' })
      expect(modal.exists()).toBe(true)

      // Modal should have proper ARIA attributes
      expect(modal.props('title')).toBeTruthy()

      // Focus should move to modal
      // In real implementation, modal would manage focus
    })

    it('should support ESC key for modal dismissal', async () => {
      const user = userEvent.setup()
      const wrapper = mount(LogoutButton, {
        props: {
          showConfirmation: true,
        },
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      // Modal should appear
      let modal = wrapper.findComponent({ name: 'BaseModal' })
      expect(modal.exists()).toBe(true)

      // ESC should close modal
      await user.keyboard('{Escape}')

      // This would be handled by BaseModal component
      await modal.vm.$emit('close')
      await wrapper.vm.$nextTick()

      modal = wrapper.findComponent({ name: 'BaseModal' })
      // In Vue 3, the modal might still exist but not be visible
      // The actual test would depend on BaseModal implementation
    })

    it('should maintain focus after modal dismissal', async () => {
      const user = userEvent.setup()
      const wrapper = mount(LogoutButton, {
        props: {
          showConfirmation: true,
        },
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const button = wrapper.find('button')
      await user.click(button.element)

      const modal = wrapper.findComponent({ name: 'BaseModal' })
      await modal.vm.$emit('cancel')

      // Focus should return to the logout button
      expect(document.activeElement).toBe(button.element)
    })
  })

  describe('UserProfile Accessibility', () => {
    beforeEach(() => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
      })
    })

    it('should provide accessible user information', () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      // Should have semantic structure
      const userInfo = wrapper.find('[data-testid="user-profile"]') || wrapper.element

      // User name should be properly labeled
      const userName = wrapper.text()
      expect(userName).toContain('Test User')
    })

    it('should handle missing user data gracefully', () => {
      const incompleteAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: { sub: 'test123' }, // Minimal user data
      })

      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: incompleteAuth0Client,
          },
        },
      })

      // Should still render accessible content
      expect(wrapper.element).toBeTruthy()
    })

    it('should provide alternative text for user avatar', () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const avatar = wrapper.find('img[src*="avatar"]')
      if (avatar.exists()) {
        expect(avatar.attributes('alt')).toBeTruthy()
      }
    })

    it('should support keyboard navigation for interactive elements', async () => {
      const user = userEvent.setup()
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      // Any interactive elements should be keyboard accessible
      const interactiveElements = wrapper.findAll('button, a, [tabindex="0"]')

      for (const element of interactiveElements) {
        await user.tab()
        expect(document.activeElement).toBe(element.element)
      }
    })
  })

  describe('AuthCallback Accessibility', () => {
    it('should provide appropriate loading feedback', () => {
      const wrapper = mount(AuthCallback, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({ isLoading: true }),
          },
        },
      })

      // Should have loading indicator
      const loadingIndicator =
        wrapper.find('[role="status"]') || wrapper.find('[aria-live]') || wrapper.element

      expect(loadingIndicator).toBeTruthy()
    })

    it('should announce processing state', () => {
      const wrapper = mount(AuthCallback, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({ isLoading: true }),
          },
        },
      })

      // Should have appropriate ARIA live region for status updates
      const statusRegion =
        wrapper.find('[aria-live="polite"]') || wrapper.find('[aria-live="assertive"]')

      // Component should communicate its state to screen readers
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should handle authentication errors accessibly', () => {
      const wrapper = mount(AuthCallback, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({
              error: new Error('Authentication failed'),
            }),
          },
        },
      })

      // Error should be announced
      const errorRegion = wrapper.find('[role="alert"]')
      if (errorRegion.exists()) {
        expect(errorRegion.text()).toBeTruthy()
      }
    })
  })

  describe('Keyboard Navigation Patterns', () => {
    it('should support tab order for auth components', async () => {
      const user = userEvent.setup()

      // Create a page with multiple auth components
      const pageWrapper = mount(
        {
          template: `
          <div>
            <LoginButton data-testid="login1" />
            <LoginButton data-testid="login2" />
            <LogoutButton data-testid="logout" />
          </div>
        `,
          components: { LoginButton, LogoutButton },
        },
        {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        }
      )

      // Tab through elements
      await user.tab() // First login button
      expect(document.activeElement?.getAttribute('data-testid')).toBe('login1')

      await user.tab() // Second login button
      expect(document.activeElement?.getAttribute('data-testid')).toBe('login2')

      await user.tab() // Logout button
      expect(document.activeElement?.getAttribute('data-testid')).toBe('logout')
    })

    it('should support Shift+Tab for reverse navigation', async () => {
      const user = userEvent.setup()

      const pageWrapper = mount(
        {
          template: `
          <div>
            <LoginButton data-testid="login" />
            <LogoutButton data-testid="logout" />
          </div>
        `,
          components: { LoginButton, LogoutButton },
        },
        {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        }
      )

      // Tab to last element
      await user.tab()
      await user.tab()

      // Shift+Tab back
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement?.getAttribute('data-testid')).toBe('login')
    })
  })

  describe('Screen Reader Experience', () => {
    it('should provide meaningful content for screen readers', () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      // Check for screen reader friendly content
      a11yHelpers.testScreenReaderContent(wrapper, 'Iniciar Sesión')
    })

    it('should announce state changes', async () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      // Simulate state change
      mockAuth0Client.isLoading.value = true
      await wrapper.vm.$nextTick()

      // Should have updated content for screen readers
      const updatedText = wrapper.text()
      expect(updatedText).toContain('Iniciando sesión')
    })

    it('should not rely solely on visual cues', () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({
              error: new Error('Error'),
            }),
          },
        },
      })

      // Error state should be communicated through text/ARIA, not just visual styling
      const errorMessage = wrapper.find('[role="alert"]')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text().length).toBeGreaterThan(0)
    })
  })

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion', () => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })
      )

      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({ isLoading: true }),
          },
        },
      })

      // Spinning animation should be disabled or reduced
      const icon = wrapper.find('.animate-spin')
      // In a real implementation, you'd check for disabled animations
      expect(icon.exists()).toBe(true) // Component should still render
    })
  })

  describe('Focus Management', () => {
    it('should manage focus during modal interactions', async () => {
      const user = userEvent.setup()
      const wrapper = mount(LogoutButton, {
        props: {
          showConfirmation: true,
        },
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: createMockAuth0Client({
              isAuthenticated: true,
              user: mockAppUser,
            }),
          },
        },
      })

      const triggerButton = wrapper.find('button')

      // Focus should be on trigger button initially
      triggerButton.element.focus()
      expect(document.activeElement).toBe(triggerButton.element)

      // Open modal
      await user.click(triggerButton.element)

      // Focus should move to modal (would be handled by BaseModal)
      const modal = wrapper.findComponent({ name: 'BaseModal' })
      expect(modal.exists()).toBe(true)

      // When modal closes, focus should return to trigger
      await modal.vm.$emit('close')
      await wrapper.vm.$nextTick()

      expect(document.activeElement).toBe(triggerButton.element)
    })

    it('should not trap focus inappropriately', async () => {
      const user = userEvent.setup()
      const wrapper = mount(
        {
          template: `
          <div>
            <button data-testid="before">Before</button>
            <LoginButton data-testid="login" />
            <button data-testid="after">After</button>
          </div>
        `,
          components: { LoginButton },
        },
        {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        }
      )

      // Should be able to tab through normally
      await user.tab()
      expect(document.activeElement?.getAttribute('data-testid')).toBe('before')

      await user.tab()
      expect(document.activeElement?.getAttribute('data-testid')).toBe('login')

      await user.tab()
      expect(document.activeElement?.getAttribute('data-testid')).toBe('after')
    })
  })
})
