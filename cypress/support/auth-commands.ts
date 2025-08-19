/**
 * Cypress Auth Commands
 * Custom commands for testing authentication flows
 */

import {
  mockAppUser,
  mockAdminUser,
  mockPremiumUser,
  mockAccessToken,
} from '../../tests/mocks/auth0'

// Login command with role-based user data
Cypress.Commands.add('login', (role: 'user' | 'admin' | 'premium' = 'user') => {
  let userData

  switch (role) {
    case 'admin':
      userData = mockAdminUser
      break
    case 'premium':
      userData = mockPremiumUser
      break
    default:
      userData = mockAppUser
  }

  // Set user data in localStorage
  cy.window().then(win => {
    win.localStorage.setItem('vana_user', JSON.stringify(userData))
    win.localStorage.setItem('vana_token', mockAccessToken)
    win.localStorage.setItem(
      'vana_auth_state',
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        token: mockAccessToken,
        isLoading: false,
        error: null,
      })
    )
  })

  // Mock Auth0 client state
  cy.intercept('GET', '**/userinfo', {
    statusCode: 200,
    body: userData,
  }).as('getUserInfo')

  // Mock token validation
  cy.intercept('POST', '**/oauth/token', {
    statusCode: 200,
    body: {
      access_token: mockAccessToken,
      token_type: 'Bearer',
      expires_in: 3600,
    },
  }).as('tokenValidation')
})

// Login with incomplete profile data
Cypress.Commands.add('loginWithIncompleteProfile', () => {
  const incompleteUser = {
    sub: 'auth0|incomplete123',
    email_verified: true,
    // Missing name, nickname, picture, etc.
  }

  cy.window().then(win => {
    win.localStorage.setItem('vana_user', JSON.stringify(incompleteUser))
    win.localStorage.setItem('vana_token', mockAccessToken)
  })

  cy.intercept('GET', '**/userinfo', {
    statusCode: 200,
    body: incompleteUser,
  }).as('getIncompleteUserInfo')
})

// Login with custom metadata
Cypress.Commands.add('loginWithMetadata', (metadata: Record<string, unknown>) => {
  const userWithMetadata = {
    ...mockAppUser,
    'https://vana.app/user_metadata': {
      ...mockAppUser['https://vana.app/user_metadata'],
      ...metadata,
    },
  }

  cy.window().then(win => {
    win.localStorage.setItem('vana_user', JSON.stringify(userWithMetadata))
    win.localStorage.setItem('vana_token', mockAccessToken)
  })

  cy.intercept('GET', '**/userinfo', {
    statusCode: 200,
    body: userWithMetadata,
  }).as('getUserWithMetadata')
})

// Handle Auth0 callback simulation
Cypress.Commands.add('handleAuth0Callback', () => {
  // Mock successful callback
  cy.intercept('POST', '**/oauth/token', {
    statusCode: 200,
    body: {
      access_token: mockAccessToken,
      id_token: 'mock-id-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'openid profile email',
    },
  }).as('callbackToken')

  // Simulate Auth0 redirect
  cy.visit('/auth/callback?code=mock-auth-code&state=mock-state')
})

// Logout command
Cypress.Commands.add('logout', () => {
  cy.window().then(win => {
    win.localStorage.removeItem('vana_user')
    win.localStorage.removeItem('vana_token')
    win.localStorage.removeItem('vana_auth_state')
  })

  // Mock logout endpoint
  cy.intercept('POST', '**/v2/logout', {
    statusCode: 200,
  }).as('logout')
})

// Wait for authentication state
Cypress.Commands.add(
  'waitForAuth',
  (expectedState: 'authenticated' | 'unauthenticated' = 'authenticated') => {
    if (expectedState === 'authenticated') {
      cy.get('[data-testid="user-profile"]', { timeout: 10000 }).should('be.visible')
    } else {
      cy.get('[data-testid="login-button"]', { timeout: 10000 }).should('be.visible')
    }
  }
)

// Mock Auth0 errors
Cypress.Commands.add('mockAuth0Error', (errorType: string, statusCode: number = 400) => {
  const errorResponses = {
    invalid_request: {
      error: 'invalid_request',
      error_description: 'Invalid request parameters',
    },
    unauthorized_client: {
      error: 'unauthorized_client',
      error_description: 'Unauthorized client',
    },
    access_denied: {
      error: 'access_denied',
      error_description: 'Access denied',
    },
    server_error: {
      error: 'server_error',
      error_description: 'Internal server error',
    },
    service_unavailable: {
      error: 'service_unavailable',
      error_description: 'Service temporarily unavailable',
    },
  }

  cy.intercept('POST', '**/oauth/token', {
    statusCode,
    body: errorResponses[errorType] || errorResponses['server_error'],
  }).as('auth0Error')

  cy.intercept('GET', '**/authorize', {
    statusCode,
    body: errorResponses[errorType] || errorResponses['server_error'],
  }).as('auth0AuthorizeError')
})

// Clear all auth-related data
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage()
  cy.clearSessionStorage()
  cy.clearCookies()
})

// Check user permissions
Cypress.Commands.add('hasPermission', (permission: string) => {
  cy.window().then(win => {
    const userStr = win.localStorage.getItem('vana_user')
    if (!userStr) {
      return false
    }

    const user = JSON.parse(userStr)
    const permissions = user['https://vana.app/permissions'] || []
    return permissions.includes(permission)
  })
})

// Check user roles
Cypress.Commands.add('hasRole', (role: string) => {
  cy.window().then(win => {
    const userStr = win.localStorage.getItem('vana_user')
    if (!userStr) {
      return false
    }

    const user = JSON.parse(userStr)
    const roles = user['https://vana.app/roles'] || []
    return roles.includes(role)
  })
})

// Simulate token expiration
Cypress.Commands.add('expireToken', () => {
  cy.window().then(win => {
    // Create an expired JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: 'test123',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200,
        aud: 'https://api.vana.app',
      })
    )
    const signature = 'expired-signature'
    const expiredToken = `${header}.${payload}.${signature}`

    win.localStorage.setItem('vana_token', expiredToken)
  })
})

// Mock network failure
Cypress.Commands.add('mockNetworkFailure', (endpoint: string = '**/oauth/token') => {
  cy.intercept('POST', endpoint, { forceNetworkError: true }).as('networkFailure')
})

// Simulate slow network
Cypress.Commands.add(
  'mockSlowNetwork',
  (delay: number = 5000, endpoint: string = '**/oauth/token') => {
    cy.intercept('POST', endpoint, {
      statusCode: 200,
      body: { access_token: mockAccessToken },
      delay,
    }).as('slowNetwork')
  }
)

// Test accessibility
Cypress.Commands.add('checkA11y', (context?: string) => {
  cy.injectAxe()
  cy.checkA11y(context, {
    rules: {
      // Configure axe-core rules for auth components
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true },
    },
  })
})

// Tab navigation testing
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject?: unknown) => {
  // const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  if (subject) {
    cy.wrap(subject).trigger('keydown', { key: 'Tab' })
  } else {
    cy.get('body').trigger('keydown', { key: 'Tab' })
  }

  return cy.focused()
})

// Performance monitoring
Cypress.Commands.add('measurePerformance', (actionCallback: () => void) => {
  cy.window().then(win => {
    // Start performance measurement
    const startTime = win.performance.now()

    actionCallback()

    // Measure after action
    cy.then(() => {
      const endTime = win.performance.now()
      const duration = endTime - startTime

      cy.log(`Performance: ${duration.toFixed(2)}ms`)

      // Assert reasonable performance (adjust threshold as needed)
      expect(duration).to.be.lessThan(3000, 'Action took too long')
    })
  })
})

// Memory leak detection (basic)
Cypress.Commands.add('checkMemoryLeaks', () => {
  cy.window().then(win => {
    // Check for common memory leak indicators
    const eventListeners = (win as Record<string, unknown>)._eventListeners || []
    const timers = (win as Record<string, unknown>)._timers || []

    expect(eventListeners.length).to.be.lessThan(100, 'Too many event listeners')
    expect(timers.length).to.be.lessThan(10, 'Too many active timers')
  })
})

// Mock Auth0 Lock (if used)
Cypress.Commands.add('mockAuth0Lock', () => {
  cy.window().then(win => {
    ;(win as Record<string, unknown>).Auth0Lock = class MockAuth0Lock {
      constructor(clientId: string, domain: string, options: Record<string, unknown>) {
        this.clientId = clientId
        this.domain = domain
        this.options = options
      }

      show() {
        // Simulate successful authentication
        setTimeout(() => {
          if (this.options.auth?.responseType === 'code') {
            this.emit('authorization_error', new Error('Mock login'))
          } else {
            this.emit('authenticated', { accessToken: mockAccessToken })
          }
        }, 100)
      }

      hide() {
        // Mock hide
      }

      on(event: string, callback: (...args: unknown[]) => unknown) {
        ;(this as Record<string, unknown>)[`_${event}`] = callback
      }

      emit(event: string, data: unknown) {
        const callback = (this as Record<string, unknown>)[`_${event}`] as ((...args: unknown[]) => unknown) | undefined
        if (callback) callback(data)
      }
    }
  })
})

// Extend Cypress types using module augmentation
export {}

declare global {
  namespace Cypress {
    interface Chainable {
      login(role?: 'user' | 'admin' | 'premium'): Chainable<void>
      loginWithIncompleteProfile(): Chainable<void>
      loginWithMetadata(metadata: Record<string, unknown>): Chainable<void>
      handleAuth0Callback(): Chainable<void>
      logout(): Chainable<void>
      waitForAuth(expectedState?: 'authenticated' | 'unauthenticated'): Chainable<void>
      mockAuth0Error(errorType: string, statusCode?: number): Chainable<void>
      clearAuth(): Chainable<void>
      hasPermission(permission: string): Chainable<boolean>
      hasRole(role: string): Chainable<boolean>
      expireToken(): Chainable<void>
      mockNetworkFailure(endpoint?: string): Chainable<void>
      mockSlowNetwork(delay?: number, endpoint?: string): Chainable<void>
      checkA11y(context?: string): Chainable<void>
      tab(): Chainable<JQuery<HTMLElement>>
      measurePerformance(actionCallback: () => void): Chainable<void>
      checkMemoryLeaks(): Chainable<void>
      mockAuth0Lock(): Chainable<void>
    }
  }
}
