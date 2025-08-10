/**
 * Unit tests for LandingPage component
 * Testing hero content, CTAs, demo interactions, and analytics tracking
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import LandingPage from '@/pages/LandingPage.vue'
import { useAuth } from '@/composables/useAuth'

// Mock dependencies
vi.mock('@/composables/useAuth')
vi.mock('@heroicons/vue/24/outline', () => ({
  CalendarIcon: { name: 'CalendarIcon', render: () => null },
  RocketIcon: { name: 'RocketIcon', render: () => null },
  PlayIcon: { name: 'PlayIcon', render: () => null },
  ShieldCheckIcon: { name: 'ShieldCheckIcon', render: () => null },
  ClockIcon: { name: 'ClockIcon', render: () => null },
  CurrencyDollarIcon: { name: 'CurrencyDollarIcon', render: () => null }
}))

// Mock child components
vi.mock('@/ui/RegisterButton/RegisterButton.vue', () => ({
  default: {
    name: 'RegisterButton',
    template: `
      <button 
        :class="['register-button', \`register-button--\${variant}\`, \`register-button--\${size}\`]"
        :disabled="disabled || loading"
        @click="$emit('click', $event)"
        data-testid="register-button"
      >
        <slot />
      </button>
    `,
    props: ['variant', 'size', 'loading', 'disabled'],
    emits: ['click']
  }
}))

vi.mock('@/components/landing/CalendarDemoWidget.vue', () => ({
  default: {
    name: 'CalendarDemoWidget',
    template: `
      <div data-testid="calendar-demo-widget">
        <div v-if="showTransformation">Demo Animation</div>
        <button v-if="autoPlay" @click="$emit('transformation-complete')" data-testid="demo-complete-btn">Complete</button>
        <button @click="$emit('demo-restart')" data-testid="demo-restart-btn">Restart</button>
      </div>
    `,
    props: ['showTransformation', 'autoPlay'],
    emits: ['transformation-complete', 'demo-restart']
  }
}))

vi.mock('@/components/landing/ValuePropCard.vue', () => ({
  default: {
    name: 'ValuePropCard',
    template: `
      <div data-testid="value-prop-card">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <div>{{ stat }}</div>
      </div>
    `,
    props: ['icon', 'title', 'description', 'stat', 'features']
  }
}))

vi.mock('@/components/landing/FeatureShowcase.vue', () => ({
  default: {
    name: 'FeatureShowcase',
    template: `
      <div 
        :data-testid="\`feature-\${index}\`"
        :class="{ active: isActive }"
        @click="$emit('feature-select', index)"
      >
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    `,
    props: ['feature', 'isActive', 'index'],
    emits: ['feature-select']
  }
}))

vi.mock('@/components/landing/TestimonialGrid.vue', () => ({
  default: {
    name: 'TestimonialGrid',
    template: `
      <div data-testid="testimonial-grid">
        <div v-for="testimonial in testimonials" :key="testimonial.id" data-testid="testimonial">
          {{ testimonial.name }} - {{ testimonial.company }}
        </div>
      </div>
    `,
    props: ['testimonials']
  }
}))

describe('LandingPage', () => {
  let mockAuth: any
  let router: any
  let pinia: any

  beforeEach(async () => {
    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Setup router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/auth/callback', component: { template: '<div>Callback</div>' } }
      ]
    })

    // Setup mock auth
    mockAuth = {
      registerWithRedirect: vi.fn(),
      isLoading: vi.ref(false)
    }

    vi.mocked(useAuth).mockReturnValue(mockAuth)

    // Mock timers for animations
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  const renderLandingPage = () => {
    return render(LandingPage, {
      global: {
        plugins: [router, pinia]
      }
    })
  }

  describe('hero section rendering', () => {
    it('displays hero content correctly', () => {
      renderLandingPage()
      
      expect(screen.getByRole('heading', { name: /Transform Your Chaotic Calendar Into Productive Focus Time/i })).toBeInTheDocument()
      expect(screen.getByText(/AI-powered calendar optimization that saves you 4\+ hours every week/i)).toBeInTheDocument()
      expect(screen.getByText(/12,847 professionals already saving time/i)).toBeInTheDocument()
    })

    it('shows primary CTA button', () => {
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton).toHaveClass('register-button--primary')
      expect(ctaButton).toHaveClass('register-button--large')
    })

    it('displays social proof elements', () => {
      renderLandingPage()
      
      expect(screen.getByText(/12,847/)).toBeInTheDocument()
      expect(screen.getByText('professionals already saving time')).toBeInTheDocument()
      
      // Company logos
      const logos = screen.getAllByRole('img')
      expect(logos.length).toBeGreaterThanOrEqual(4)
    })

    it('shows CTA disclaimer text', () => {
      renderLandingPage()
      
      expect(screen.getByText(/Free 14-day trial • No credit card required • 2-minute setup/i)).toBeInTheDocument()
    })
  })

  describe('calendar demo widget', () => {
    it('shows calendar demo widget', () => {
      renderLandingPage()
      
      expect(screen.getByTestId('calendar-demo-widget')).toBeInTheDocument()
    })

    it('starts demo animation after delay', async () => {
      renderLandingPage()
      
      // Demo should not be shown initially
      expect(screen.queryByText('Demo Animation')).not.toBeInTheDocument()
      
      // Fast forward 1.5 seconds
      vi.advanceTimersByTime(1500)
      await waitFor(() => {
        expect(screen.getByText('Demo Animation')).toBeInTheDocument()
      })
    })

    it('handles demo completion', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderLandingPage()
      
      vi.advanceTimersByTime(1500) // Start demo
      await waitFor(() => screen.getByText('Demo Animation'))
      
      const completeBtn = screen.getByTestId('demo-complete-btn')
      await user.click(completeBtn)
      
      // Should trigger CTA highlight animation after 500ms
      vi.advanceTimersByTime(500)
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      expect(ctaButton).toHaveClass('pulse-highlight')
      
      // Animation should end after 2 seconds
      vi.advanceTimersByTime(2000)
      expect(ctaButton).not.toHaveClass('pulse-highlight')
    })

    it('handles demo restart', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderLandingPage()
      
      const restartBtn = screen.getByTestId('demo-restart-btn')
      await user.click(restartBtn)
      
      // Should track demo restart (tested in analytics section)
    })
  })

  describe('registration flow', () => {
    it('initiates registration when CTA clicked', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      await user.click(ctaButton)
      
      expect(mockAuth.registerWithRedirect).toHaveBeenCalledWith('', 'landing_hero')
    })

    it('shows loading state during registration', () => {
      mockAuth.isLoading.value = true
      renderLandingPage()
      
      const ctaButtons = screen.getAllByTestId('register-button')
      ctaButtons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })

    it('handles registration errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation()
      
      mockAuth.registerWithRedirect.mockRejectedValue(new Error('Registration failed'))
      
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      await user.click(ctaButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Registration failed:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('initiates registration from final CTA section', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      const finalCtaButton = screen.getByRole('button', { name: /Get Started Free/i })
      await user.click(finalCtaButton)
      
      expect(mockAuth.registerWithRedirect).toHaveBeenCalledWith('', 'landing_hero')
    })
  })

  describe('value propositions section', () => {
    it('displays section header', () => {
      renderLandingPage()
      
      expect(screen.getByRole('heading', { name: /Why 12,000\+ Professionals Choose Vana/i })).toBeInTheDocument()
      expect(screen.getByText(/Stop letting your calendar control your productivity/i)).toBeInTheDocument()
    })

    it('renders value proposition cards', () => {
      renderLandingPage()
      
      const valuePropCards = screen.getAllByTestId('value-prop-card')
      expect(valuePropCards).toHaveLength(3)
      
      // Check specific value props
      expect(screen.getByText('Save 4+ Hours Weekly')).toBeInTheDocument()
      expect(screen.getByText('Smart AI Assistant')).toBeInTheDocument()
      expect(screen.getByText('Seamless Integration')).toBeInTheDocument()
    })
  })

  describe('features showcase section', () => {
    it('displays features section header', () => {
      renderLandingPage()
      
      expect(screen.getByRole('heading', { name: /Intelligent Calendar Optimization/i })).toBeInTheDocument()
      expect(screen.getByText(/See how Vana transforms your daily schedule/i)).toBeInTheDocument()
    })

    it('renders feature showcase components', () => {
      renderLandingPage()
      
      expect(screen.getByTestId('feature-0')).toBeInTheDocument()
      expect(screen.getByTestId('feature-1')).toBeInTheDocument()
      expect(screen.getByTestId('feature-2')).toBeInTheDocument()
    })

    it('auto-cycles through features', async () => {
      renderLandingPage()
      
      const feature0 = screen.getByTestId('feature-0')
      const feature1 = screen.getByTestId('feature-1')
      
      // Initially first feature should be active
      expect(feature0).toHaveClass('active')
      expect(feature1).not.toHaveClass('active')
      
      // After 5 seconds, should cycle to next feature
      vi.advanceTimersByTime(5000)
      await waitFor(() => {
        expect(feature1).toHaveClass('active')
        expect(feature0).not.toHaveClass('active')
      })
    })

    it('handles manual feature selection', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      const feature1 = screen.getByTestId('feature-1')
      await user.click(feature1)
      
      expect(feature1).toHaveClass('active')
    })
  })

  describe('testimonials section', () => {
    it('displays testimonials section header', () => {
      renderLandingPage()
      
      expect(screen.getByRole('heading', { name: /Loved by Professionals Worldwide/i })).toBeInTheDocument()
      expect(screen.getByText(/Join thousands who've reclaimed their time/i)).toBeInTheDocument()
    })

    it('renders testimonial grid', () => {
      renderLandingPage()
      
      expect(screen.getByTestId('testimonial-grid')).toBeInTheDocument()
      
      // Check for specific testimonials
      expect(screen.getByText(/Sarah Chen - Stripe/)).toBeInTheDocument()
      expect(screen.getByText(/Marcus Johnson - Notion/)).toBeInTheDocument()
      expect(screen.getByText(/Elena Rodriguez - Airbnb/)).toBeInTheDocument()
      expect(screen.getByText(/David Kim - Figma/)).toBeInTheDocument()
    })

    it('displays statistics row', () => {
      renderLandingPage()
      
      expect(screen.getByText('4.2')).toBeInTheDocument()
      expect(screen.getByText('Hours saved weekly')).toBeInTheDocument()
      expect(screen.getByText('94%')).toBeInTheDocument()
      expect(screen.getByText('Satisfaction rate')).toBeInTheDocument()
      expect(screen.getByText('12K+')).toBeInTheDocument()
      expect(screen.getByText('Active users')).toBeInTheDocument()
      expect(screen.getByText('2M+')).toBeInTheDocument()
      expect(screen.getByText('Optimized meetings')).toBeInTheDocument()
    })
  })

  describe('final CTA section', () => {
    it('displays final CTA content', () => {
      renderLandingPage()
      
      expect(screen.getByRole('heading', { name: /Ready to Save 4\+ Hours Every Week\?/i })).toBeInTheDocument()
      expect(screen.getByText(/Join thousands of professionals who've transformed their productivity/i)).toBeInTheDocument()
    })

    it('shows both primary and secondary CTAs', () => {
      renderLandingPage()
      
      expect(screen.getByRole('button', { name: /Get Started Free/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument()
    })

    it('handles watch demo button click', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      const watchDemoBtn = screen.getByRole('button', { name: /Watch Demo/i })
      await user.click(watchDemoBtn)
      
      // Should trigger demo visibility
      // In a real implementation, this might open a modal or scroll to demo
    })

    it('displays trust signals', () => {
      renderLandingPage()
      
      expect(screen.getByText('Enterprise-grade security')).toBeInTheDocument()
      expect(screen.getByText('Setup in under 2 minutes')).toBeInTheDocument()
      expect(screen.getByText('14-day free trial')).toBeInTheDocument()
    })
  })

  describe('analytics tracking', () => {
    it('tracks registration start with correct source', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      vi.stubEnv('DEV', true)
      
      const user = userEvent.setup()
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      await user.click(ctaButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Registration started from:', 'landing_hero')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('tracks demo completion', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      vi.stubEnv('DEV', true)
      
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderLandingPage()
      
      vi.advanceTimersByTime(1500) // Start demo
      await waitFor(() => screen.getByText('Demo Animation'))
      
      const completeBtn = screen.getByTestId('demo-complete-btn')
      await user.click(completeBtn)
      
      expect(consoleSpy).toHaveBeenCalledWith('Demo completed')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('tracks demo restart', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      vi.stubEnv('DEV', true)
      
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderLandingPage()
      
      const restartBtn = screen.getByTestId('demo-restart-btn')
      await user.click(restartBtn)
      
      expect(consoleSpy).toHaveBeenCalledWith('Demo restarted')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('tracks feature views', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      vi.stubEnv('DEV', true)
      
      const user = userEvent.setup()
      renderLandingPage()
      
      const feature1 = screen.getByTestId('feature-1')
      await user.click(feature1)
      
      expect(consoleSpy).toHaveBeenCalledWith('Feature viewed:', 'Smart Meeting Optimization')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })

    it('tracks page view on mount', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation()
      vi.stubEnv('DEV', true)
      
      renderLandingPage()
      
      expect(consoleSpy).toHaveBeenCalledWith('Landing page viewed')
      
      consoleSpy.mockRestore()
      vi.unstubAllEnvs()
    })
  })

  describe('responsive behavior', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderLandingPage()
      
      // Hero content should still be present
      expect(screen.getByRole('heading', { name: /Transform Your Chaotic Calendar/i })).toBeInTheDocument()
      expect(screen.getByTestId('calendar-demo-widget')).toBeInTheDocument()
    })

    it('handles tablet breakpoints', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      
      renderLandingPage()
      
      // All content should remain accessible
      expect(screen.getAllByTestId('value-prop-card')).toHaveLength(3)
    })
  })

  describe('accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderLandingPage()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThanOrEqual(4) // Various section headings
    })

    it('provides alt text for images', () => {
      renderLandingPage()
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).toBeTruthy()
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      // Tab to primary CTA
      await user.tab()
      expect(screen.getByRole('button', { name: /Start Organizing My Calendar/i })).toHaveFocus()
      
      // Activate with Enter
      await user.keyboard('{Enter}')
      expect(mockAuth.registerWithRedirect).toHaveBeenCalled()
    })
  })

  describe('performance and lifecycle', () => {
    it('cleans up intervals on unmount', () => {
      const { unmount } = renderLandingPage()
      
      // Spy on clearInterval
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      
      unmount()
      
      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })

    it('sets proper SEO meta tags', () => {
      renderLandingPage()
      
      expect(document.title).toBe('Vana Calendar - Transform Your Chaotic Calendar Into Productive Focus Time')
    })

    it('handles rapid user interactions', async () => {
      const user = userEvent.setup()
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      
      // Rapid clicks should not cause issues
      await user.click(ctaButton)
      await user.click(ctaButton)
      await user.click(ctaButton)
      
      expect(mockAuth.registerWithRedirect).toHaveBeenCalledTimes(3)
    })
  })

  describe('error handling', () => {
    it('handles missing components gracefully', () => {
      // This tests that the page doesn't crash if components are missing
      // In a real scenario, we might mock components to return null
      expect(() => renderLandingPage()).not.toThrow()
    })

    it('handles network errors during registration', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation()
      
      mockAuth.registerWithRedirect.mockRejectedValue(new Error('Network error'))
      
      renderLandingPage()
      
      const ctaButton = screen.getByRole('button', { name: /Start Organizing My Calendar/i })
      await user.click(ctaButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Registration failed:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})