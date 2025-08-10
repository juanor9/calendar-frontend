/**
 * End-to-End tests for complete registration journey
 * Testing real user workflows from landing page to onboarding completion
 */

describe('Complete Registration Journey', () => {
  beforeEach(() => {
    // Setup test environment
    cy.task('db:seed')
    cy.clearLocalStorage()
    cy.clearCookies()

    // Setup API intercepts
    cy.intercept('POST', '/api/auth/register/initiate', {
      fixture: 'auth/registration-initiate-success.json',
    }).as('initiateRegistration')

    cy.intercept('POST', '/api/auth/register/callback', {
      fixture: 'auth/registration-callback-success.json',
    }).as('handleCallback')

    cy.intercept('GET', '/api/auth/email/verify/**', {
      fixture: 'auth/email-verification-success.json',
    }).as('verifyEmail')

    cy.intercept('POST', '/api/onboarding/complete', {
      fixture: 'onboarding/completion-success.json',
    }).as('completeOnboarding')

    // Visit landing page
    cy.visit('/')
  })

  afterEach(() => {
    cy.task('db:cleanup')
  })

  describe('successful registration flow', () => {
    it('completes full registration from landing to onboarding', () => {
      // Landing page should load
      cy.get('[data-testid="hero-title"]')
        .should('be.visible')
        .and('contain', 'Transform Your Chaotic Calendar')

      // Calendar demo should be visible
      cy.get('[data-testid="calendar-demo-widget"]').should('be.visible').and('not.be.empty')

      // Social proof should be visible
      cy.get('[data-testid="user-count"]')
        .should('contain', '12,847')
        .and('contain', 'professionals')

      // Company logos should be visible
      cy.get('[data-testid="company-logos"]').find('img').should('have.length.at.least', 4)

      // Primary CTA should be prominent
      cy.get('[data-testid="primary-register-button"]')
        .should('be.visible')
        .and('contain', 'Start Organizing My Calendar')
        .and('not.be.disabled')

      // Click registration CTA
      cy.get('[data-testid="primary-register-button"]').click()

      cy.wait('@initiateRegistration')
        .its('request.body')
        .should('include', { source: 'landing_hero' })

      // In a real E2E test, we would go through Auth0, but for this test
      // we'll simulate the callback directly
      cy.visit('/auth/callback?code=test_auth_code&state=test_state')

      cy.wait('@handleCallback').its('request.body').should('deep.include', {
        code: 'test_auth_code',
        state: 'test_state',
      })

      // Should redirect to email verification
      cy.url().should('include', '/auth/verify-email')

      // Email verification page should load
      cy.get('[data-testid="verification-title"]').should('contain', 'Check Your Email')

      cy.get('[data-testid="email-display"]').should('contain', 'test@example.com')

      // Progress steps should be visible
      cy.get('[data-testid="progress-steps"]')
        .should('be.visible')
        .within(() => {
          cy.get('.step').should('have.length', 4)
          cy.contains('Email sent').should('be.visible')
          cy.contains('Check your inbox').should('be.visible')
          cy.contains('Click verify link').should('be.visible')
          cy.contains('Account activated').should('be.visible')
        })

      // Wait for auto-verification check (simulated)
      cy.wait('@verifyEmail')

      // Should show verified state
      cy.get('[data-testid="verification-title"]', { timeout: 10000 }).should(
        'contain',
        'Email Verified!'
      )

      cy.get('[data-testid="verification-description"]').should(
        'contain',
        'Your email has been verified successfully'
      )

      // Continue to onboarding
      cy.get('[data-testid="continue-button"]')
        .should('be.visible')
        .and('contain', 'Continue to Setup')
        .click()

      // Should reach onboarding
      cy.url().should('include', '/onboarding')

      cy.get('[data-testid="onboarding-welcome"]')
        .should('be.visible')
        .and('contain', 'Welcome to Vana')

      // Complete onboarding wizard
      cy.get('[data-testid="onboarding-wizard"]').should('be.visible')

      // Step 1: Welcome
      cy.get('[data-testid="welcome-step"]').should('be.visible')

      cy.get('[data-testid="continue-button"]').should('be.visible').click()

      // Step 2: Work Style
      cy.get('[data-testid="work-style-step"]').should('be.visible')

      cy.get('[data-testid="work-style-focused"]').click()

      cy.get('[data-testid="work-hours-start"]').type('09:00')

      cy.get('[data-testid="work-hours-end"]').type('17:00')

      cy.get('[data-testid="continue-button"]').should('not.be.disabled').click()

      // Step 3: Calendar Integration (skip for test)
      cy.get('[data-testid="calendar-integration-step"]').should('be.visible')

      cy.get('[data-testid="skip-calendar-button"]').click()

      // Step 4: AI Setup (skip for test)
      cy.get('[data-testid="ai-setup-step"]').should('be.visible')

      cy.get('[data-testid="skip-ai-button"]').click()

      // Step 5: Tutorial (complete)
      cy.get('[data-testid="tutorial-step"]').should('be.visible')

      cy.get('[data-testid="complete-setup-button"]').should('be.visible').click()

      cy.wait('@completeOnboarding')

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')

      cy.get('[data-testid="onboarding-success"]')
        .should('be.visible')
        .and('contain', 'Welcome to Vana!')

      cy.get('[data-testid="dashboard-content"]').should('be.visible')

      // Success analytics should be tracked
      cy.window()
        .its('analytics')
        .should('have.property', 'events')
        .and('include', 'registration_completed')
    })

    it('handles email verification resend flow', () => {
      // Navigate directly to email verification
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      // Initial state - resend should not be available immediately
      cy.get('[data-testid="resend-button"]').should('not.exist')

      // Wait for resend timer to start (10 seconds)
      cy.wait(10000)

      // Resend button should appear with countdown
      cy.get('[data-testid="resend-button"]')
        .should('be.visible')
        .and('be.disabled')
        .and('contain', 'Resend in')

      // Wait for countdown to complete (60 seconds)
      cy.wait(60000)

      // Setup resend intercept
      cy.intercept('POST', '/api/auth/email/resend', {
        statusCode: 200,
        body: { success: true },
      }).as('resendEmail')

      // Resend button should be enabled
      cy.get('[data-testid="resend-button"]')
        .should('not.be.disabled')
        .and('contain', 'Resend Email')
        .click()

      cy.wait('@resendEmail').its('request.body').should('include', { email: 'test@example.com' })

      // Should show success feedback
      cy.get('[data-testid="toast-success"]')
        .should('be.visible')
        .and('contain', 'Verification email sent!')

      // Countdown should restart
      cy.get('[data-testid="resend-button"]').should('be.disabled').and('contain', 'Resend in')
    })

    it('handles manual email verification check', () => {
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      // Setup manual check intercept
      cy.intercept('GET', '/api/auth/email/verify/auth0|12345', {
        body: { verified: true },
      }).as('manualCheck')

      // Manual check button should be available
      cy.get('[data-testid="check-now-button"]').should('be.visible').and('contain', 'Check Now')

      // Click manual check
      cy.get('[data-testid="check-now-button"]').click()

      cy.wait('@manualCheck')

      // Should show verified state
      cy.get('[data-testid="verification-title"]').should('contain', 'Email Verified!')
    })
  })

  describe('error handling scenarios', () => {
    it('handles registration rate limiting', () => {
      // Mock rate limit error
      cy.intercept('POST', '/api/auth/register/initiate', {
        statusCode: 429,
        body: { error: 'Rate limit exceeded. Please try again in 5 minutes.' },
      }).as('rateLimitError')

      cy.visit('/')

      cy.get('[data-testid="primary-register-button"]').click()

      cy.wait('@rateLimitError')

      // Should show error toast
      cy.get('[data-testid="error-toast"]')
        .should('be.visible')
        .and('contain', 'Rate limit exceeded')

      // Should show retry button
      cy.get('[data-testid="retry-button"]').should('be.visible').and('contain', 'Try Again')

      // Analytics should track error
      cy.window()
        .its('analytics')
        .should('have.property', 'events')
        .and('include', 'registration_error')
    })

    it('handles email verification timeout', () => {
      // Mock verification timeout
      cy.intercept('GET', '/api/auth/email/verify/**', {
        statusCode: 408,
        body: { error: 'Verification timeout' },
      }).as('verificationTimeout')

      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      cy.wait('@verificationTimeout')

      // Should continue showing pending state
      cy.get('[data-testid="verification-title"]').should('contain', 'Check Your Email')

      // Should show troubleshooting options
      cy.get('[data-testid="troubleshooting-button"]').should('be.visible').click()

      cy.get('[data-testid="troubleshooting-content"]')
        .should('be.visible')
        .and('contain', 'Check your spam folder')
    })

    it('handles onboarding submission errors', () => {
      // Mock onboarding error
      cy.intercept('POST', '/api/onboarding/complete', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('onboardingError')

      // Navigate to final onboarding step
      cy.visit('/onboarding/tutorial')

      cy.get('[data-testid="complete-setup-button"]').click()

      cy.wait('@onboardingError')

      // Should show error message
      cy.get('[data-testid="error-alert"]')
        .should('be.visible')
        .and('contain', 'Unable to complete setup')

      // Should show retry option
      cy.get('[data-testid="retry-onboarding-button"]')
        .should('be.visible')
        .and('contain', 'Try Again')

      // User should be able to retry
      cy.get('[data-testid="retry-onboarding-button"]').click()

      // Should attempt submission again
      cy.wait('@onboardingError')
    })

    it('handles network connectivity issues', () => {
      cy.visit('/')

      // Simulate offline
      cy.window().then(win => {
        cy.stub(win.navigator, 'onLine').value(false)
      })

      cy.get('[data-testid="primary-register-button"]').click()

      // Should show offline message
      cy.get('[data-testid="offline-banner"]')
        .should('be.visible')
        .and('contain', 'You appear to be offline')

      // Simulate back online
      cy.window().then(win => {
        cy.stub(win.navigator, 'onLine').value(true)
        win.dispatchEvent(new Event('online'))
      })

      // Banner should disappear
      cy.get('[data-testid="offline-banner"]').should('not.exist')

      // Registration should work
      cy.get('[data-testid="primary-register-button"]').click()

      cy.wait('@initiateRegistration')
    })
  })

  describe('accessibility compliance', () => {
    it('maintains keyboard navigation throughout flow', () => {
      cy.visit('/')

      // Landing page keyboard navigation
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'primary-register-button')

      // Activate with Enter
      cy.focused().type('{enter}')

      cy.wait('@initiateRegistration')

      // Navigate to email verification
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      // Tab through verification page
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'check-now-button')

      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'troubleshooting-button')

      // All focusable elements should have proper focus indicators
      cy.get('[tabindex]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled])').each(
        $el => {
          cy.wrap($el).focus().should('have.css', 'outline-width').and('not.equal', '0px')
        }
      )
    })

    it('provides proper ARIA attributes and labels', () => {
      cy.visit('/')

      // Check heading hierarchy
      cy.get('h1').should('have.length', 1).and('contain', 'Transform Your Chaotic Calendar')

      cy.get('h2').should('have.length.at.least', 2)

      // Check button labels
      cy.get('[data-testid="primary-register-button"]')
        .should('have.attr', 'aria-label')
        .or('have.text')

      // Check form labels
      cy.visit('/onboarding/preferences')

      cy.get('input[type="time"]').should('have.attr', 'aria-label').or('have.attr', 'id')

      cy.get('label').should('have.attr', 'for')

      // Check status announcements
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      cy.get('[role="status"], [aria-live]').should('exist')
    })

    it('supports screen reader announcements', () => {
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

      // Status changes should be announced
      cy.get('[data-testid="sr-status"]').should('contain', 'Checking email verification')

      // Success should be announced
      cy.wait('@verifyEmail')

      cy.get('[data-testid="sr-status"]', { timeout: 10000 }).should(
        'contain',
        'Email verified successfully'
      )

      // Error states should be announced
      cy.get('[data-testid="resend-button"]').should('have.attr', 'aria-describedby')
    })

    it('passes automated accessibility tests', () => {
      cy.visit('/')
      cy.injectAxe()

      // Test landing page
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true },
          keyboard: { enabled: true },
          'focus-order': { enabled: true },
        },
      })

      // Test email verification page
      cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')
      cy.checkA11y()

      // Test onboarding page
      cy.visit('/onboarding/welcome')
      cy.checkA11y()
    })
  })

  describe('performance requirements', () => {
    it('meets Core Web Vitals thresholds', () => {
      cy.visit('/', {
        onBeforeLoad: win => {
          // Mock performance observer
          win.PerformanceObserver = class {
            constructor(callback) {
              this.callback = callback
            }
            observe() {
              // Mock LCP measurement
              this.callback({
                getEntries: () => [
                  {
                    name: 'largest-contentful-paint',
                    startTime: 1200, // 1.2s
                  },
                ],
              })
            }
            disconnect() {}
          }
        },
      })

      // Landing page should load quickly
      cy.get('[data-testid="hero-title"]', { timeout: 5000 }).should('be.visible')

      // Check performance metrics
      cy.window().then(win => {
        const perfData = win.performance.getEntriesByType('navigation')[0]
        const loadTime = perfData.loadEventEnd - perfData.navigationStart

        // Should load in under 3 seconds
        expect(loadTime).to.be.lessThan(3000)
      })

      // Calendar demo should be interactive quickly
      cy.get('[data-testid="calendar-demo-widget"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="demo-interaction"]').should('be.visible').click()

          // Should respond within 100ms
          cy.get('[data-testid="demo-response"]', { timeout: 100 }).should('be.visible')
        })
    })

    it('handles large datasets efficiently', () => {
      // Mock large user preference dataset
      cy.intercept('GET', '/api/user/preferences', {
        fixture: 'user/large-preferences-dataset.json',
      }).as('loadPreferences')

      cy.visit('/onboarding/preferences')

      cy.wait('@loadPreferences')

      // Page should remain responsive
      cy.get('[data-testid="preferences-form"]').should('be.visible')

      // Form interactions should be smooth
      cy.get('[data-testid="work-style-option"]').first().click()

      cy.get('[data-testid="work-style-option"].selected').should('exist')

      // No performance warnings in console
      cy.window().then(win => {
        expect(win.console.warn).to.not.have.been.called
      })
    })

    it('maintains smooth animations under load', () => {
      cy.visit('/')

      // Test hero animation performance
      cy.get('[data-testid="hero-animation"]')
        .should('be.visible')
        .and('have.css', 'animation-duration')

      // Trigger multiple animations simultaneously
      cy.get('[data-testid="value-prop-card"]')
        .should('have.length.at.least', 3)
        .each($card => {
          cy.wrap($card).trigger('mouseenter').should('have.class', 'animated')
        })

      // Check frame rate doesn't drop significantly
      cy.window().then(win => {
        let frameCount = 0
        let lastTime = performance.now()

        function countFrames() {
          frameCount++
          const currentTime = performance.now()
          const fps = 1000 / (currentTime - lastTime)

          // Should maintain >30 FPS
          expect(fps).to.be.greaterThan(30)

          lastTime = currentTime

          if (frameCount < 60) {
            win.requestAnimationFrame(countFrames)
          }
        }

        win.requestAnimationFrame(countFrames)
      })
    })
  })

  describe('responsive design validation', () => {
    const viewports = [
      { device: 'iphone-x', width: 375, height: 812 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-13', width: 1280, height: 800 },
    ]

    viewports.forEach(({ device, width, height }) => {
      it(`works correctly on ${device} (${width}x${height})`, () => {
        cy.viewport(width, height)
        cy.visit('/')

        // Hero content should be visible
        cy.get('[data-testid="hero-title"]').should('be.visible')

        // CTA button should be appropriately sized
        cy.get('[data-testid="primary-register-button"]')
          .should('be.visible')
          .and('have.css', 'min-height')
          .and('not.equal', '0px')

        // Touch target should be at least 44px
        cy.get('[data-testid="primary-register-button"]').then($btn => {
          const rect = $btn[0].getBoundingClientRect()
          expect(Math.min(rect.width, rect.height)).to.be.at.least(44)
        })

        // Mobile-specific elements should be visible
        if (width < 768) {
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible')

          cy.get('[data-testid="mobile-hero"]').should('be.visible')
        } else {
          cy.get('[data-testid="desktop-navigation"]').should('be.visible')
        }

        // Test email verification responsive design
        cy.visit('/auth/verify-email?email=test@example.com&auth0Id=auth0|12345')

        cy.get('[data-testid="verification-card"]').should('be.visible')

        // Progress steps should adapt to screen size
        cy.get('[data-testid="progress-steps"]').should('be.visible')

        if (width < 640) {
          // Steps might stack vertically on very small screens
          cy.get('[data-testid="progress-steps"]')
            .should('have.css', 'flex-direction', 'column')
            .or('have.css', 'grid-template-columns')
        }

        // Buttons should remain accessible
        cy.get('[data-testid="check-now-button"]')
          .should('be.visible')
          .and('not.have.css', 'overflow', 'hidden')
      })
    })

    it('handles orientation changes gracefully', () => {
      cy.viewport('iphone-x')
      cy.visit('/')

      // Portrait mode
      cy.get('[data-testid="hero-title"]').should('be.visible')

      // Rotate to landscape
      cy.viewport(812, 375)

      // Content should still be accessible
      cy.get('[data-testid="hero-title"]').should('be.visible')

      cy.get('[data-testid="primary-register-button"]').should('be.visible').and('not.be.covered')
    })
  })

  describe('cross-browser compatibility', () => {
    const features = [
      'CSS Grid',
      'Flexbox',
      'Custom Properties',
      'Intersection Observer',
      'Fetch API',
      'ES6 Classes',
    ]

    features.forEach(feature => {
      it(`supports ${feature}`, () => {
        cy.visit('/')

        cy.window().then(win => {
          switch (feature) {
            case 'CSS Grid':
              expect(win.CSS.supports('display', 'grid')).to.be.true
              break
            case 'Flexbox':
              expect(win.CSS.supports('display', 'flex')).to.be.true
              break
            case 'Custom Properties':
              expect(win.CSS.supports('color', 'var(--primary)')).to.be.true
              break
            case 'Intersection Observer':
              expect(win.IntersectionObserver).to.exist
              break
            case 'Fetch API':
              expect(win.fetch).to.exist
              break
            case 'ES6 Classes':
              expect(() => {
                class TestClass {}
                return new TestClass()
              }).to.not.throw()
              break
          }
        })
      })
    })

    it('provides fallbacks for unsupported features', () => {
      cy.visit('/', {
        onBeforeLoad: win => {
          // Mock unsupported Intersection Observer
          delete win.IntersectionObserver
        },
      })

      // Page should still function
      cy.get('[data-testid="hero-title"]').should('be.visible')

      // Animations should fallback gracefully
      cy.get('[data-testid="value-prop-card"]').first().should('be.visible').trigger('mouseenter')

      // Should not throw errors
      cy.window().then(win => {
        const errors = win.console.error.getCalls?.() || []
        expect(errors.length).to.equal(0)
      })
    })
  })
})
