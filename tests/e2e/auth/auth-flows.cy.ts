/**
 * Auth Flows E2E Tests
 * End-to-end testing for complete authentication workflows
 */

describe('Authentication Flows', () => {
  beforeEach(() => {
    // Clear all auth-related storage
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.clearAllCookies()

    // Setup environment
    cy.intercept('GET', '**/api/auth/**').as('authApi')

    // Mock Auth0 domain for testing
    Cypress.env('auth0Domain', 'test.auth0.com')
    Cypress.env('auth0ClientId', 'test-client-id')
    Cypress.env('auth0Audience', 'https://api.vana.app')
  })

  describe('Login Flow', () => {
    it('should redirect to Auth0 when clicking login button', () => {
      cy.visit('/')

      // Find and click login button
      cy.get('[data-testid="login-button"]')
        .should('be.visible')
        .and('contain', 'Iniciar Sesión')
        .click()

      // Should redirect to Auth0 (in real test, this would go to auth0.com)
      // For testing, we'll mock this behavior
      cy.url().should('include', '/auth/callback')
    })

    it('should handle successful login callback', () => {
      // Simulate coming back from Auth0 with success
      cy.visit('/auth/callback?code=test-code&state=test-state')

      // Should redirect to home page after successful auth
      cy.url().should('not.include', '/auth/callback')
      cy.url().should('include', '/')

      // Should show user info
      cy.get('[data-testid="user-profile"]').should('be.visible')
      cy.get('[data-testid="logout-button"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('not.exist')
    })

    it('should handle login with custom redirect', () => {
      // Visit a protected page that requires auth
      cy.visit('/dashboard')

      // Should be redirected to login
      cy.url().should('include', '/login')

      // Login and should be redirected back to dashboard
      cy.get('[data-testid="login-button"]').click()
      cy.handleAuth0Callback()

      cy.url().should('include', '/dashboard')
    })

    it('should handle login errors gracefully', () => {
      cy.visit('/')

      // Mock Auth0 error
      cy.intercept('POST', '**/oauth/token', {
        statusCode: 400,
        body: { error: 'invalid_request', error_description: 'Invalid request' },
      }).as('authError')

      cy.get('[data-testid="login-button"]').click()

      // Should show error message
      cy.get('[role="alert"]').should('be.visible').and('contain', 'Error al iniciar sesión')

      // Login button should be enabled again
      cy.get('[data-testid="login-button"]').should('not.be.disabled')
    })

    it('should persist authentication state across page reloads', () => {
      cy.login() // Custom command for login

      cy.visit('/')
      cy.get('[data-testid="user-profile"]').should('be.visible')

      // Reload page
      cy.reload()

      // Should still be authenticated
      cy.get('[data-testid="user-profile"]').should('be.visible')
      cy.get('[data-testid="logout-button"]').should('be.visible')
    })

    it('should handle concurrent login attempts', () => {
      cy.visit('/')

      // Click login button multiple times rapidly
      cy.get('[data-testid="login-button"]').as('loginBtn')
      cy.get('@loginBtn').click()
      cy.get('@loginBtn').click()
      cy.get('@loginBtn').click()

      // Should only process one login attempt
      cy.get('@loginBtn').should('be.disabled')
    })
  })

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.login() // Login before each logout test
    })

    it('should logout successfully without confirmation', () => {
      cy.visit('/')

      // Should be logged in
      cy.get('[data-testid="user-profile"]').should('be.visible')

      // Click logout
      cy.get('[data-testid="logout-button"]').click()

      // Should be redirected to logout page or home
      cy.url().should('not.include', '/dashboard')

      // Should show login button again
      cy.get('[data-testid="login-button"]').should('be.visible')
      cy.get('[data-testid="user-profile"]').should('not.exist')

      // Local storage should be cleared
      cy.window().then(win => {
        expect(win.localStorage.getItem('vana_user')).to.be.null
        expect(win.localStorage.getItem('vana_token')).to.be.null
      })
    })

    it('should show confirmation modal when enabled', () => {
      cy.visit('/settings') // Page that might have confirmation enabled

      cy.get('[data-testid="logout-button-with-confirmation"]').click()

      // Should show confirmation modal
      cy.get('[data-testid="logout-confirmation-modal"]')
        .should('be.visible')
        .and('contain', 'Confirmar Cierre de Sesión')

      // Should have cancel and confirm buttons
      cy.get('[data-testid="logout-cancel"]').should('be.visible')
      cy.get('[data-testid="logout-confirm"]').should('be.visible')
    })

    it('should cancel logout when clicking cancel in modal', () => {
      cy.visit('/settings')

      cy.get('[data-testid="logout-button-with-confirmation"]').click()
      cy.get('[data-testid="logout-cancel"]').click()

      // Modal should be closed
      cy.get('[data-testid="logout-confirmation-modal"]').should('not.exist')

      // Should still be logged in
      cy.get('[data-testid="user-profile"]').should('be.visible')
    })

    it('should proceed with logout when confirming in modal', () => {
      cy.visit('/settings')

      cy.get('[data-testid="logout-button-with-confirmation"]').click()
      cy.get('[data-testid="logout-confirm"]').click()

      // Should be logged out
      cy.get('[data-testid="login-button"]').should('be.visible')
      cy.get('[data-testid="user-profile"]').should('not.exist')
    })

    it('should handle logout errors', () => {
      cy.intercept('POST', '**/v2/logout', {
        statusCode: 500,
        body: { error: 'server_error' },
      }).as('logoutError')

      cy.visit('/')
      cy.get('[data-testid="logout-button"]').click()

      // Should show error message
      cy.get('[role="alert"]').should('be.visible').and('contain', 'Error al cerrar sesión')
    })
  })

  describe('Authentication State Management', () => {
    it('should handle token expiration gracefully', () => {
      cy.login()

      // Mock expired token
      cy.window().then(win => {
        const expiredToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.expired'
        win.localStorage.setItem('vana_token', expiredToken)
      })

      // Visit a page that requires authentication
      cy.visit('/dashboard')

      // Should automatically attempt token refresh or redirect to login
      cy.get('[data-testid="login-button"]', { timeout: 10000 }).should('be.visible')
    })

    it('should handle network failures during auth check', () => {
      cy.intercept('GET', '**/userinfo', { forceNetworkError: true }).as('networkError')

      cy.visit('/')

      // Should handle network error gracefully
      cy.get('body').should('be.visible') // Page should still load
    })

    it('should sync auth state across multiple tabs', () => {
      cy.login()
      cy.visit('/')

      // Open second tab (simulated)
      cy.window().then(win => {
        // Simulate another tab logging out
        win.localStorage.removeItem('vana_user')
        win.localStorage.removeItem('vana_token')

        // Dispatch storage event to simulate cross-tab communication
        win.dispatchEvent(
          new StorageEvent('storage', {
            key: 'vana_user',
            newValue: null,
            oldValue: JSON.stringify({ name: 'Test User' }),
          })
        )
      })

      // Should update auth state
      cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible')
      cy.get('[data-testid="user-profile"]').should('not.exist')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visit('/dashboard')

      cy.url().should('include', '/login')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should allow authenticated users to access protected routes', () => {
      cy.login()
      cy.visit('/dashboard')

      cy.url().should('include', '/dashboard')
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
    })

    it('should enforce role-based access control', () => {
      cy.login('user') // Login as regular user

      // Try to access admin page
      cy.visit('/admin')

      // Should be redirected or show access denied
      cy.url().should('not.include', '/admin')
      cy.get('[data-testid="access-denied"]').should('be.visible')
    })

    it('should allow admin users to access admin routes', () => {
      cy.login('admin') // Login as admin

      cy.visit('/admin')

      cy.url().should('include', '/admin')
      cy.get('[data-testid="admin-dashboard"]').should('be.visible')
    })
  })

  describe('User Profile Management', () => {
    beforeEach(() => {
      cy.login()
    })

    it('should display user information correctly', () => {
      cy.visit('/')

      cy.get('[data-testid="user-profile"]').should('be.visible').and('contain', 'Test User')

      cy.get('[data-testid="user-avatar"]').should('be.visible')
    })

    it('should handle missing user information gracefully', () => {
      // Login with incomplete user data
      cy.loginWithIncompleteProfile()

      cy.visit('/')

      cy.get('[data-testid="user-profile"]').should('be.visible')
      cy.get('[data-testid="user-display-name"]').should('contain', 'Usuario')
    })

    it('should update user preferences', () => {
      cy.visit('/profile')

      // Update timezone
      cy.get('[data-testid="timezone-select"]').select('America/New_York')
      cy.get('[data-testid="save-profile"]').click()

      // Should show success message
      cy.get('[data-testid="success-message"]')
        .should('be.visible')
        .and('contain', 'Perfil actualizado')
    })
  })

  describe('Error Scenarios', () => {
    it('should handle Auth0 service unavailable', () => {
      cy.intercept('GET', '**/authorize', {
        statusCode: 503,
        body: { error: 'service_unavailable' },
      }).as('auth0Down')

      cy.visit('/')
      cy.get('[data-testid="login-button"]').click()

      // Should show appropriate error message
      cy.get('[role="alert"]').should('be.visible').and('contain', 'Servicio no disponible')
    })

    it('should handle malformed callback responses', () => {
      cy.visit('/auth/callback?error=invalid_request&error_description=Invalid%20request')

      // Should show error message
      cy.get('[role="alert"]').should('be.visible').and('contain', 'Error de autenticación')

      // Should redirect to login
      cy.url().should('include', '/login')
    })

    it('should handle CORS errors', () => {
      cy.intercept('POST', '**/oauth/token', {
        statusCode: 0, // Simulates CORS error
      }).as('corsError')

      cy.visit('/')
      cy.get('[data-testid="login-button"]').click()

      // Should handle gracefully
      cy.get('[role="alert"]').should('be.visible')
    })
  })

  describe('Performance and Load Testing', () => {
    it('should handle rapid authentication state changes', () => {
      cy.visit('/')

      // Rapidly trigger auth state changes
      for (let i = 0; i < 10; i++) {
        cy.window().then(win => {
          win.localStorage.setItem('vana_user', JSON.stringify({ name: `User ${i}` }))
          win.localStorage.removeItem('vana_user')
        })
      }

      // UI should remain stable
      cy.get('body').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should perform well with large user metadata', () => {
      const largeMetadata = {
        preferences: new Array(1000)
          .fill(0)
          .map((_, i) => ({ key: `pref_${i}`, value: `value_${i}` })),
        history: new Array(500)
          .fill(0)
          .map((_, i) => ({ action: `action_${i}`, timestamp: Date.now() - i * 1000 })),
      }

      cy.loginWithMetadata(largeMetadata)
      cy.visit('/')

      // Should load within reasonable time
      cy.get('[data-testid="user-profile"]', { timeout: 5000 }).should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      cy.visit('/')

      // Check for proper ARIA labels
      cy.get('[data-testid="login-button"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-describedby')
    })

    it('should support keyboard navigation', () => {
      cy.visit('/')

      // Tab navigation should work
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'login-button')

      // Enter key should trigger login
      cy.focused().type('{enter}')
      cy.url().should('include', '/auth/callback')
    })

    it('should have proper focus management in modals', () => {
      cy.login()
      cy.visit('/settings')

      cy.get('[data-testid="logout-button-with-confirmation"]').click()

      // Focus should move to modal
      cy.get('[data-testid="logout-confirmation-modal"]').should('be.focused').or('contain.focus')
    })
  })
})

// Custom Cypress Commands for Auth Testing
declare global {
  namespace Cypress {
    interface Chainable {
      login(role?: 'user' | 'admin' | 'premium'): Chainable<void>
      loginWithIncompleteProfile(): Chainable<void>
      loginWithMetadata(metadata: any): Chainable<void>
      handleAuth0Callback(): Chainable<void>
    }
  }
}
