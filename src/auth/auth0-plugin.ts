import { createAuth0 } from '@auth0/auth0-vue'
import type { App } from 'vue'
import { auth0ClientConfig, validateAuth0Config } from './auth0-config'
import { Auth0ClientKey } from './auth-composable'

// Custom Auth0 plugin that extends the official plugin
export const createAuth0Plugin = () => {
  return {
    install(app: App) {
      // Validate configuration before creating client
      if (!validateAuth0Config()) {
        console.error('Auth0 configuration is invalid. Authentication will not work properly.')

        // In development, show more helpful error
        if (import.meta.env.DEV) {
          console.error(`
Auth0 Configuration Error:
Please check your .env file and ensure these variables are set:
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID  
- VITE_AUTH0_AUDIENCE

Example .env file:
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api.com
          `)
        }

        return
      }

      // Create and install Auth0 plugin
      const auth0Plugin = createAuth0(auth0ClientConfig)
      app.use(auth0Plugin)

      // Get the Auth0 client instance and provide it
      const auth0Instance =
        typeof auth0Plugin.install === 'function' ? auth0Plugin : { client: auth0Plugin }
      const auth0Client = 'client' in auth0Instance ? auth0Instance.client : auth0Plugin
      app.config.globalProperties.$auth0 = auth0Client
      app.provide(Auth0ClientKey, auth0Client)

      // Add error handling for Auth0 initialization
      if (import.meta.env.DEV) {
        console.log('Auth0 plugin initialized successfully')
        console.log('Auth0 config:', {
          domain: auth0ClientConfig.domain,
          clientId: auth0ClientConfig.clientId,
          audience: auth0ClientConfig.authorizationParams.audience,
          redirectUri: auth0ClientConfig.authorizationParams.redirect_uri,
        })
      }
    },
  }
}

// Helper to check if Auth0 is properly configured
export const isAuth0Configured = (): boolean => {
  return validateAuth0Config()
}

// Export configured plugin instance
export const auth0Plugin = createAuth0Plugin()
