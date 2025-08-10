import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { createCombinedAuthLink } from './apollo-auth'

// Get GraphQL endpoint from environment
const getGraphQLEndpoint = (): string => {
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT
  if (endpoint) return endpoint

  // Fallback based on API URL
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) return `${apiUrl}/graphql`

  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/graphql'
  }

  // Production fallback (should not happen)
  console.warn('GraphQL endpoint not configured, using default')
  return '/graphql'
}

// Create HTTP link
const httpLink = createHttpLink({
  uri: getGraphQLEndpoint(),
  credentials: 'include', // Include cookies for CORS
})

// Create auth link with error handling
const authLink = createCombinedAuthLink()

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    // Cache configuration
    typePolicies: {
      User: {
        fields: {
          // Merge user metadata fields
          'https://vana.app/user_metadata': {
            merge: true,
          },
          'https://vana.app/roles': {
            merge: false, // Replace array completely
          },
          'https://vana.app/permissions': {
            merge: false, // Replace array completely
          },
        },
      },
      Calendar: {
        fields: {
          events: {
            merge: false, // Replace events array
          },
        },
      },
      Task: {
        fields: {
          subtasks: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Return partial data with errors
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache when possible
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: import.meta.env.DEV,
})

// Export client instance and helper functions
export default apolloClient

// Helper to check if Apollo client is ready
export const isApolloReady = (): boolean => {
  return !!apolloClient
}

// Helper to clear Apollo cache (useful for logout)
export const clearApolloCache = async (): Promise<void> => {
  try {
    await apolloClient.clearStore()
    console.log('Apollo cache cleared')
  } catch (error) {
    console.error('Error clearing Apollo cache:', error)
  }
}

// Helper to reset Apollo cache (keeps queries but refetches)
export const resetApolloCache = async (): Promise<void> => {
  try {
    await apolloClient.resetStore()
    console.log('Apollo cache reset')
  } catch (error) {
    console.error('Error resetting Apollo cache:', error)
  }
}

// Helper to refetch all active queries
export const refetchAllQueries = async (): Promise<void> => {
  try {
    await apolloClient.reFetchObservableQueries()
    console.log('All queries refetched')
  } catch (error) {
    console.error('Error refetching queries:', error)
  }
}

// Log client configuration in development
if (import.meta.env.DEV) {
  console.log('🔗 Apollo Client configured:', {
    endpoint: getGraphQLEndpoint(),
    devtools: true,
    cache: 'InMemoryCache with custom policies',
  })
}
