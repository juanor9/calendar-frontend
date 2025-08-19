import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/core/router'
import { createHead } from '@vueuse/head'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { auth0Plugin, isAuth0Configured } from '@/features/authentication/services'
import { useAuthStore } from '@/features/authentication/stores/auth'
import apolloClient from '@/shared/utils/apollo-client'
import { RegistrationCache } from '@/shared/utils/registration-cache'
import '@/styles/global.scss'

// Create app instance
const app = createApp(App)

// Create stores
const pinia = createPinia()
app.use(pinia)

// Create head manager
const head = createHead()
app.use(head)

// Install Auth0 plugin if configured
if (isAuth0Configured()) {
  app.use(auth0Plugin)
  console.log('✅ Auth0 plugin installed successfully')
} else {
  console.warn('⚠️ Auth0 not configured - authentication features will not work')
  console.warn('Please check your environment variables:')
  console.warn('- VITE_AUTH0_DOMAIN')
  console.warn('- VITE_AUTH0_CLIENT_ID')
  console.warn('- VITE_AUTH0_AUDIENCE')
}

// Provide Apollo Client
app.provide(DefaultApolloClient, apolloClient)

// Install router
app.use(router)

// Initialize auth store from localStorage
const authStore = useAuthStore()
authStore.initializeFromStorage()

// Initialize registration cache
RegistrationCache.initialize()

// Mount app
app.mount('#app')

// Global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)

  // In development, show detailed error
  if (import.meta.env.DEV) {
    console.error('Component instance:', instance)
  }

  // You could send this to an error reporting service
  // reportError(err, { context: info, instance })
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn('Vue warning:', msg)
    console.warn('Trace:', trace)
  }
}

// Performance monitoring in development
if (import.meta.env.DEV) {
  // Mark app initialization complete
  performance.mark('app-init-complete')

  // Log initialization time
  performance.measure('app-init-time', 'navigationStart', 'app-init-complete')
  const measure = performance.getEntriesByName('app-init-time')[0]
  console.log(`🚀 App initialized in ${measure.duration.toFixed(2)}ms`)
}
