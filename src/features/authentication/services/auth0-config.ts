import type { AuthConfig } from './types'

// Get environment variables with fallbacks for development
const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key]
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`)
    return ''
  }
  return value || fallback || ''
}

// Base URLs for different environments
const getBaseUrl = (): string => {
  const appUrl = import.meta.env.VITE_APP_URL
  if (appUrl) return appUrl

  // Fallback to window location in browser
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`
  }

  return 'http://localhost:5173'
}

// Create Auth0 configuration
export const createAuth0Config = (): AuthConfig => {
  const baseUrl = getBaseUrl()

  return {
    domain: getEnvVar('VITE_AUTH0_DOMAIN'),
    clientId: getEnvVar('VITE_AUTH0_CLIENT_ID'),
    audience: getEnvVar('VITE_AUTH0_AUDIENCE'),
    redirectUri: `${baseUrl}/auth/callback`,
    logoutUrl: `${baseUrl}/auth/logout`,
    scope:
      'openid profile email offline_access read:calendar write:calendar read:tasks write:tasks',
    useRefreshTokens: true,
    cacheLocation: 'localstorage' as const,
  }
}

// Auth0 client configuration for createAuth0Client
export const auth0ClientConfig = {
  get domain() {
    return getEnvVar('VITE_AUTH0_DOMAIN')
  },
  get clientId() {
    return getEnvVar('VITE_AUTH0_CLIENT_ID')
  },
  get authorizationParams() {
    return {
      audience: getEnvVar('VITE_AUTH0_AUDIENCE'),
      scope:
        'openid profile email offline_access read:calendar write:calendar read:tasks write:tasks',
      redirect_uri: `${getBaseUrl()}/auth/callback`,
    }
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
}

// Validate configuration
export const validateAuth0Config = (): boolean => {
  const config = createAuth0Config()

  const requiredFields = ['domain', 'clientId', 'audience'] as const
  const missingFields = requiredFields.filter(field => !config[field])

  if (missingFields.length > 0) {
    console.error('Auth0 configuration missing required fields:', missingFields)
    return false
  }

  return true
}

// Export config instance
export const auth0Config = createAuth0Config()
