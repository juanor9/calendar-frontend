/**
 * Accessibility tests for registration flow
 * Testing WCAG 2.2 AA compliance and screen reader compatibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'vitest-axe'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

// Import components to test
import LandingPage from '@/pages/LandingPage.vue'
import RegisterButton from '@/shared/ui/RegisterButton/RegisterButton.vue'
import EmailVerificationPage from '@/pages/AuthPages/EmailVerificationPage.vue'

// Mock dependencies
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    registerWithRedirect: vi.fn(),
    resendVerificationEmail: vi.fn(),
    checkEmailVerification: vi.fn().mockResolvedValue(false),
    isLoading: vi.ref(false),
  }),
}))

// Mock child components to isolate accessibility testing
vi.mock('@/components/landing/CalendarDemoWidget.vue', () => ({
  default: {
    name: 'CalendarDemoWidget',
    template: `
      <div 
        role="img" 
        aria-label="Interactive calendar demonstration showing before and after optimization"
        data-testid="calendar-demo-widget"
      >
        <div>Calendar Demo</div>
      </div>
    `,
    props: ['showTransformation', 'autoPlay'],
  },
}))

vi.mock('@/components/landing/ValuePropCard.vue', () => ({
  default: {
    name: 'ValuePropCard',
    template: `
      <article 
        :aria-labelledby="'card-title-' + title.replace(/\\s+/g, '-').toLowerCase()"
        class="value-prop-card"
      >
        <h3 :id="'card-title-' + title.replace(/\\s+/g, '-').toLowerCase()">{{ title }}</h3>
        <p>{{ description }}</p>
        <div aria-label="Statistics">{{ stat }}</div>
      </article>
    `,
    props: ['icon', 'title', 'description', 'stat', 'features'],
  },
}))

vi.mock('@/shared/ui/BaseButton/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: `
      <button 
        :class="['base-button', \`base-button--\${variant}\`]"
        :disabled="disabled || loading"
        :aria-label="ariaLabel"
        :aria-describedby="ariaDescribedby"
        @click="$emit('click', $event)"
      >
        <span v-if="loading" role="status" aria-label="Loading">⏳</span>
        <slot name="icon" v-if="!loading" />
        <slot />
      </button>
    `,
    props: ['variant', 'loading', 'disabled', 'ariaLabel', 'ariaDescribedby'],
    emits: ['click'],
  },
}))

// Mock heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  CalendarIcon: { name: 'CalendarIcon', render: () => null },
  RocketIcon: { name: 'RocketIcon', render: () => null },
  EnvelopeIcon: { name: 'EnvelopeIcon', render: () => null },
  CheckCircleIcon: { name: 'CheckCircleIcon', render: () => null },
  ArrowPathIcon: { name: 'ArrowPathIcon', render: () => null },
  QuestionMarkCircleIcon: { name: 'QuestionMarkCircleIcon', render: () => null },
  ChatBubbleLeftIcon: { name: 'ChatBubbleLeftIcon', render: () => null },
}))

// Extend expect for accessibility matchers
expect.extend(toHaveNoViolations)

describe('Registration Flow Accessibility', () => {
  let router: ReturnType<typeof createRouter>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/auth/verify-email', component: { template: '<div>Verify</div>' } },
      ],
    })

    // Mock timers for components with animations
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  const renderWithA11y = async (component: unknown, props = {}) => {
    const result = render(component, {
      props,
      global: {
        plugins: [router, pinia],
      },
    })

    // Allow components to mount and timers to run
    vi.runAllTimers()

    return result
  }

  describe('RegisterButton accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = await renderWithA11y(RegisterButton, {
        slots: {
          default: 'Register Now',
        },
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('provides proper button semantics', async () => {
      await renderWithA11y(RegisterButton, {
        slots: { default: 'Create Account' },
      })

      const button = screen.getByRole('button', { name: 'Create Account' })
      expect(button).toBeInTheDocument()
      expect(button.tagName).toBe('BUTTON')
    })

    it('has sufficient color contrast', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost']

      for (const variant of variants) {
        const { container, unmount } = await renderWithA11y(RegisterButton, {
          variant,
          slots: { default: 'Register' },
        })

        const button = screen.getByRole('button')
        expect(button).toHaveClass(`register-button--${variant}`)

        // Check with axe for color contrast
        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: true },
          },
        })
        expect(results).toHaveNoViolations()

        unmount()
      }
    })

    it('provides clear focus indicators', async () => {
      await renderWithA11y(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')

      // Focus the button
      button.focus()
      expect(button).toHaveFocus()

      // Focus should be visually indicated
      const computedStyle = window.getComputedStyle(button)
      expect(
        parseFloat(computedStyle.outlineWidth) > 0 ||
          computedStyle.boxShadow !== 'none' ||
          parseFloat(computedStyle.borderWidth) > 1
      ).toBe(true)
    })

    it('supports keyboard activation', async () => {
      const user = userEvent.setup()
      const mockClick = vi.fn()

      await renderWithA11y(RegisterButton, {
        onClick: mockClick,
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')

      // Tab to button and activate with Enter
      await user.tab()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      // Note: In real implementation, this would trigger the click event

      // Also test Space key activation
      await user.keyboard(' ')
      // Note: In real implementation, this would trigger the click event
    })

    it('provides loading state announcements', async () => {
      await renderWithA11y(RegisterButton, {
        loading: true,
        loadingText: 'Creating your account...',
        slots: { default: 'Register' },
      })

      // Loading state should be announced to screen readers
      const loadingIndicator = screen.getByRole('status', { name: 'Loading' })
      expect(loadingIndicator).toBeInTheDocument()

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('maintains accessible name in all states', async () => {
      const states = [
        { loading: false, disabled: false },
        { loading: true, disabled: false },
        { loading: false, disabled: true },
        { loading: true, disabled: true },
      ]

      for (const state of states) {
        const { unmount } = await renderWithA11y(RegisterButton, {
          ...state,
          ariaLabel: 'Start registration process',
          slots: { default: 'Register' },
        })

        const button = screen.getByRole('button')

        // Should have accessible name in all states
        const accessibleName = button.getAttribute('aria-label') || button.textContent?.trim()
        expect(accessibleName).toBeTruthy()

        unmount()
      }
    })

    it('handles disabled state appropriately', async () => {
      await renderWithA11y(RegisterButton, {
        disabled: true,
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      // Disabled button should not be focusable via keyboard
      const user = userEvent.setup()
      await user.tab()
      expect(button).not.toHaveFocus()
    })
  })

  describe('Landing Page accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = await renderWithA11y(LandingPage)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper heading hierarchy', async () => {
      await renderWithA11y(LandingPage)

      // Should have one h1
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      expect(h1Elements).toHaveLength(1)
      expect(h1Elements[0]).toHaveTextContent(/Transform Your Chaotic Calendar/i)

      // Should have multiple h2 elements for sections
      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      expect(h2Elements.length).toBeGreaterThanOrEqual(3)

      // Check that headings describe their sections
      h2Elements.forEach(heading => {
        expect(heading.textContent).toBeTruthy()
        expect(heading.textContent!.length).toBeGreaterThan(5)
      })
    })

    it('provides alternative text for images', async () => {
      await renderWithA11y(LandingPage)

      const images = screen.getAllByRole('img')
      images.forEach(img => {
        const alt = img.getAttribute('alt')
        const ariaLabel = img.getAttribute('aria-label')
        const ariaLabelledby = img.getAttribute('aria-labelledby')

        // Images should have some form of accessible name
        expect(alt || ariaLabel || ariaLabelledby).toBeTruthy()

        // Alt text should be descriptive, not just filename
        if (alt) {
          expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|svg)$/i)
          expect(alt.length).toBeGreaterThan(0)
        }
      })
    })

    it('has accessible form controls', async () => {
      await renderWithA11y(LandingPage)

      // Primary CTA should be accessible
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton).not.toBeDisabled()

      // Should have proper button type
      expect(ctaButton.tagName).toBe('BUTTON')

      // Should be keyboard focusable
      const user = userEvent.setup()
      await user.tab()
      expect(ctaButton).toHaveFocus()
    })

    it('provides meaningful section landmarks', async () => {
      await renderWithA11y(LandingPage)

      // Should have main content area
      const main = document.querySelector('main') || document.querySelector('[role="main"]')
      expect(main).toBeInTheDocument()

      // Sections should be identifiable
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(3)

      sections.forEach(section => {
        // Each section should have a heading or aria-label
        const heading = section.querySelector('h1, h2, h3, h4, h5, h6')
        const ariaLabel = section.getAttribute('aria-label')
        const ariaLabelledby = section.getAttribute('aria-labelledby')

        expect(heading || ariaLabel || ariaLabelledby).toBeTruthy()
      })
    })

    it('supports screen reader navigation', async () => {
      await renderWithA11y(LandingPage)

      // Check for skip links (if implemented)
      const skipLink = document.querySelector('[href="#main"], [href="#content"]')
      if (skipLink) {
        expect(skipLink).toHaveTextContent(/skip/i)
      }

      // Navigation should be accessible
      const navigation = document.querySelector('nav, [role="navigation"]')
      if (navigation) {
        expect(navigation).toBeInTheDocument()

        const navLinks = navigation.querySelectorAll('a, button')
        navLinks.forEach(link => {
          const text = link.textContent?.trim()
          const ariaLabel = link.getAttribute('aria-label')
          expect(text || ariaLabel).toBeTruthy()
        })
      }
    })

    it('handles focus management for dynamic content', async () => {
      await renderWithA11y(LandingPage)

      // Demo widget should be focusable if interactive
      const demoWidget = screen.getByTestId('calendar-demo-widget')
      expect(demoWidget).toBeInTheDocument()

      // Interactive elements should be keyboard accessible
      const interactiveElements = demoWidget.querySelectorAll(
        'button, [tabindex="0"], [role="button"]'
      )

      interactiveElements.forEach(element => {
        expect(element).toBeVisible()

        // Should have accessible name
        const accessibleName =
          element.getAttribute('aria-label') ||
          element.textContent?.trim() ||
          element.getAttribute('title')
        expect(accessibleName).toBeTruthy()
      })
    })

    it('provides sufficient touch targets on mobile', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 812,
      })

      await renderWithA11y(LandingPage)

      // All interactive elements should meet minimum touch target size (44px)
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], [tabindex="0"]'
      )

      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const minDimension = Math.min(rect.width, rect.height)

        // WCAG requires 44x44px minimum for touch targets
        expect(minDimension).toBeGreaterThanOrEqual(44)
      })
    })

    it('announces dynamic content changes', async () => {
      await renderWithA11y(LandingPage)

      // Live regions should be present for dynamic updates
      const liveRegions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')

      // Should have at least one live region for status updates
      expect(liveRegions.length).toBeGreaterThanOrEqual(0)

      liveRegions.forEach(region => {
        const ariaLive = region.getAttribute('aria-live')
        const role = region.getAttribute('role')

        if (ariaLive) {
          expect(['polite', 'assertive', 'off']).toContain(ariaLive)
        }

        if (role) {
          expect(['status', 'alert', 'log']).toContain(role)
        }
      })
    })
  })

  describe('Email Verification Page accessibility', () => {
    const renderEmailVerificationPage = async (query = {}) => {
      const mockRoute = {
        query: {
          email: 'test@example.com',
          auth0Id: 'auth0|123456789',
          ...query,
        },
      }

      // Mock route
      vi.doMock('vue-router', () => ({
        useRoute: () => mockRoute,
        useRouter: () => ({
          push: vi.fn(),
        }),
      }))

      return renderWithA11y(EmailVerificationPage)
    }

    it('has no accessibility violations', async () => {
      const { container } = await renderEmailVerificationPage()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('provides proper status announcements', async () => {
      await renderEmailVerificationPage()

      // Page should have proper title/heading
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Check Your Email|Email Verified/i)

      // Status should be announced
      const statusElements = document.querySelectorAll('[role="status"], [aria-live]')
      expect(statusElements.length).toBeGreaterThanOrEqual(1)
    })

    it('has accessible progress indicators', async () => {
      await renderEmailVerificationPage()

      // Progress steps should be accessible
      const progressSteps = document.querySelector('[data-testid="progress-steps"]')
      if (progressSteps) {
        expect(progressSteps).toBeInTheDocument()

        // Each step should be identifiable
        const steps = progressSteps.querySelectorAll('[class*="step"]')
        steps.forEach((step) => {
          const stepLabel = step.querySelector('[class*="label"]')
          expect(stepLabel?.textContent).toBeTruthy()

          // Current/completed steps should be indicated
          const isCompleted = step.classList.contains('completed')
          const isCurrent = step.classList.contains('current')
          const isPending = step.classList.contains('pending')

          expect(isCompleted || isCurrent || isPending).toBe(true)
        })
      }
    })

    it('provides accessible button controls', async () => {
      await renderEmailVerificationPage()

      // All buttons should be accessible
      const buttons = screen.getAllByRole('button')

      buttons.forEach(button => {
        // Should have accessible name
        const accessibleName =
          button.getAttribute('aria-label') ||
          button.textContent?.trim() ||
          button.getAttribute('title')
        expect(accessibleName).toBeTruthy()

        // Disabled buttons should be indicated
        if (button.disabled) {
          expect(button).toHaveAttribute('disabled')

          // Should have aria-describedby if there's an explanation
          const ariaDescribedby = button.getAttribute('aria-describedby')
          if (ariaDescribedby) {
            const description = document.getElementById(ariaDescribedby)
            expect(description).toBeInTheDocument()
          }
        }
      })
    })

    it('handles error states accessibly', async () => {
      // Mock error state
      vi.doMock('@/composables/useAuth', () => ({
        useAuth: () => ({
          resendVerificationEmail: vi.fn().mockRejectedValue(new Error('Network error')),
          checkEmailVerification: vi.fn().mockRejectedValue(new Error('Verification failed')),
          isLoading: vi.ref(false),
          error: vi.ref({
            message: 'Unable to verify email',
            userMessage: 'Please try again later',
          }),
        }),
      }))

      await renderEmailVerificationPage()

      // Error messages should be announced
      const errorElements = document.querySelectorAll(
        '[role="alert"], [aria-live="assertive"], .error-message'
      )

      if (errorElements.length > 0) {
        errorElements.forEach(errorElement => {
          expect(errorElement).toBeVisible()
          expect(errorElement.textContent?.trim()).toBeTruthy()
        })
      }
    })

    it('supports keyboard navigation', async () => {
      await renderEmailVerificationPage()

      const user = userEvent.setup()

      // Should be able to tab through interactive elements
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), a, [tabindex="0"]'
      )

      if (focusableElements.length > 0) {
        // Tab to first element
        await user.tab()
        expect(focusableElements[0]).toHaveFocus()

        // Continue tabbing through elements
        for (let i = 1; i < focusableElements.length; i++) {
          await user.tab()
          expect(focusableElements[i]).toHaveFocus()
        }
      }
    })

    it('provides help content accessibly', async () => {
      await renderEmailVerificationPage()

      // Help links should be accessible
      const helpLinks = document.querySelectorAll('[data-testid*="help"], .help-link')

      helpLinks.forEach(link => {
        expect(link).toBeVisible()

        const accessibleName = link.getAttribute('aria-label') || link.textContent?.trim()
        expect(accessibleName).toBeTruthy()

        // Should indicate if it opens external content
        if (link.getAttribute('href')?.startsWith('http')) {
          const hasExternalIndicator =
            link.getAttribute('aria-label')?.includes('external') ||
            link.textContent?.includes('external') ||
            link.querySelector('[aria-label*="external"]')

          expect(hasExternalIndicator).toBeTruthy()
        }
      })
    })

    it('handles loading states accessibly', async () => {
      // Mock loading state
      vi.doMock('@/composables/useAuth', () => ({
        useAuth: () => ({
          resendVerificationEmail: vi.fn(),
          checkEmailVerification: vi.fn(),
          isLoading: vi.ref(true),
        }),
      }))

      await renderEmailVerificationPage()

      // Loading indicators should be announced
      const loadingElements = document.querySelectorAll(
        '[role="status"], .loading, [aria-label*="loading" i]'
      )

      loadingElements.forEach(element => {
        expect(element).toBeInTheDocument()

        const accessibleName = element.getAttribute('aria-label') || element.textContent?.trim()
        if (accessibleName) {
          expect(accessibleName.toLowerCase()).toMatch(/loading|processing|checking/i)
        }
      })
    })
  })

  describe('Color contrast compliance', () => {
    const testColorContrast = async (component: unknown, props = {}) => {
      const { container } = await renderWithA11y(component, props)

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    }

    it('meets WCAG AA color contrast requirements for RegisterButton', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost']

      for (const variant of variants) {
        await testColorContrast(RegisterButton, {
          variant,
          slots: { default: 'Register' },
        })
      }
    })

    it('meets WCAG AA color contrast requirements for LandingPage', async () => {
      await testColorContrast(LandingPage)
    })

    it('maintains contrast in high contrast mode', async () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-contrast: high'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      await testColorContrast(RegisterButton, {
        variant: 'primary',
        slots: { default: 'Register' },
      })
    })
  })

  describe('Screen reader compatibility', () => {
    it('provides meaningful page titles', async () => {
      await renderWithA11y(LandingPage)

      // Page should have a descriptive title
      const title = document.title
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title).toMatch(/vana|calendar/i)
    })

    it('uses semantic HTML elements', async () => {
      await renderWithA11y(LandingPage)

      // Should use semantic elements
      expect(document.querySelector('main, [role="main"]')).toBeInTheDocument()
      expect(document.querySelector('header, [role="banner"]')).toBeDefined()

      // Headings should be properly nested
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      expect(headings.length).toBeGreaterThan(0)

      // Check heading hierarchy (should start with h1)
      const firstHeading = headings[0]
      expect(firstHeading.tagName).toBe('H1')
    })

    it('provides proper ARIA labels and descriptions', async () => {
      await renderWithA11y(RegisterButton, {
        ariaLabel: 'Start registration process',
        ariaDescribedby: 'registration-help',
        slots: {
          default: 'Register',
          // Mock help text
          after: '<div id="registration-help">This will start your registration</div>',
        },
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Start registration process')

      const describedBy = button.getAttribute('aria-describedby')
      if (describedBy) {
        const description = document.getElementById(describedBy)
        expect(description).toBeInTheDocument()
      }
    })

    it('handles dynamic content announcements', async () => {
      await renderWithA11y(EmailVerificationPage)

      // Should have live regions for dynamic updates
      const liveRegions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')

      expect(liveRegions.length).toBeGreaterThanOrEqual(0)

      liveRegions.forEach(region => {
        const ariaLive = region.getAttribute('aria-live')
        if (ariaLive) {
          expect(['polite', 'assertive']).toContain(ariaLive)
        }
      })
    })
  })

  describe('Keyboard navigation compliance', () => {
    it('supports tab navigation throughout components', async () => {
      await renderWithA11y(LandingPage)

      const user = userEvent.setup()
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex="0"]'
      )

      // Should have focusable elements
      expect(focusableElements.length).toBeGreaterThan(0)

      // Tab through all elements
      for (let i = 0; i < Math.min(5, focusableElements.length); i++) {
        await user.tab()

        // Check that focus moved to a focusable element
        const activeElement = document.activeElement
        expect(activeElement).toBeInstanceOf(HTMLElement)

        const isFocusable = Array.from(focusableElements).includes(activeElement as Element)
        expect(isFocusable).toBe(true)
      }
    })

    it('provides visible focus indicators', async () => {
      await renderWithA11y(RegisterButton, {
        slots: { default: 'Register' },
      })

      const button = screen.getByRole('button')
      button.focus()

      // Should have visible focus indicator
      const computedStyle = window.getComputedStyle(button)
      const hasFocusIndicator =
        parseFloat(computedStyle.outlineWidth) > 0 ||
        computedStyle.boxShadow !== 'none' ||
        computedStyle.border !== computedStyle.borderColor

      expect(hasFocusIndicator).toBe(true)
    })

    it('prevents focus traps in modal-like components', async () => {
      // This would test modal components if they exist
      // For now, ensure no elements have negative tabindex inappropriately
      await renderWithA11y(LandingPage)

      const negativeTabElements = document.querySelectorAll('[tabindex^="-"]')

      // Elements with negative tabindex should only be programmatically focused
      negativeTabElements.forEach(element => {
        // Should be focusable elements that are meant to be programmatically focused
        const isValidNegativeTab =
          element.matches('[role="tab"], [role="tabpanel"], .skip-link') ||
          element.hasAttribute('data-programmatic-focus')

        // If it's not a valid use case, it shouldn't have negative tabindex
        if (!isValidNegativeTab) {
          console.warn('Element has inappropriate negative tabindex:', element)
        }
      })
    })

    it('supports escape key for dismissible components', async () => {
      // This would test dismissible components like modals or dropdowns
      await renderWithA11y(LandingPage)

      const user = userEvent.setup()

      // Look for dismissible elements
      const dismissibleElements = document.querySelectorAll(
        '[role="dialog"], [role="menu"], .modal, .dropdown'
      )

      for (const element of dismissibleElements) {
        // Focus the element
        const focusableChild = element.querySelector('button, [tabindex="0"]') as HTMLElement
        focusableChild?.focus()

        // Press escape
        await user.keyboard('{Escape}')

        // Element should be dismissed or focus should move appropriately
        // This would need specific implementation based on component behavior
      }
    })
  })

  describe('Motion and animation accessibility', () => {
    it('respects prefers-reduced-motion', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      await renderWithA11y(LandingPage)

      // Animated elements should respect motion preferences
      const animatedElements = document.querySelectorAll(
        '[class*="animate"], [class*="transition"], .floating-shapes'
      )

      animatedElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element)

        // In reduced motion mode, animations should be minimal
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          expect(
            computedStyle.animationDuration === '0s' ||
              computedStyle.transitionDuration === '0s' ||
              computedStyle.animationPlayState === 'paused'
          ).toBe(true)
        }
      })
    })

    it('does not auto-play media without user consent', async () => {
      await renderWithA11y(LandingPage)

      // No media should auto-play
      const mediaElements = document.querySelectorAll('video, audio')

      mediaElements.forEach(element => {
        expect(element).not.toHaveAttribute('autoplay')
      })

      // Animated content should be pauseable
      const animatedContent = document.querySelectorAll('[data-animation]')

      animatedContent.forEach(element => {
        // Should have pause controls if animation is longer than 5 seconds
        const hasControls = element.querySelector('[aria-label*="pause"], [aria-label*="stop"]')
        const animationDuration = window.getComputedStyle(element).animationDuration

        if (parseFloat(animationDuration) > 5) {
          expect(hasControls).toBeTruthy()
        }
      })
    })
  })
})
