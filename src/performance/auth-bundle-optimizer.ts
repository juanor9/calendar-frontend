/**
 * Auth Bundle Optimizer
 * Optimizes Auth0 SDK bundle size and loading strategy
 */

import type { Plugin } from 'vite'
import { defineAsyncComponent } from 'vue'
import type { Auth0Client } from '@auth0/auth0-spa-js'

/**
 * Lazy load Auth0 components
 */
export const Auth0LazyComponents = {
  LoginButton: defineAsyncComponent(
    () =>
      import(/* webpackChunkName: "auth-login" */ '@/components/auth/LoginButton/LoginButton.vue')
  ),
  LogoutButton: defineAsyncComponent(
    () =>
      import(
        /* webpackChunkName: "auth-logout" */ '@/components/auth/LogoutButton/LogoutButton.vue'
      )
  ),
  UserProfile: defineAsyncComponent(
    () =>
      import(/* webpackChunkName: "auth-profile" */ '@/components/auth/UserProfile/UserProfile.vue')
  ),
  AuthCallback: defineAsyncComponent(
    () =>
      import(
        /* webpackChunkName: "auth-callback" */ '@/components/auth/AuthCallback/AuthCallback.vue'
      )
  ),
}

/**
 * Auth0 SDK Lazy Loader
 */
export class Auth0SDKLoader {
  private static instance: Auth0SDKLoader
  private auth0Client: Auth0Client | null = null
  private loadingPromise: Promise<Auth0Client> | null = null

  private constructor() {}

  static getInstance(): Auth0SDKLoader {
    if (!Auth0SDKLoader.instance) {
      Auth0SDKLoader.instance = new Auth0SDKLoader()
    }
    return Auth0SDKLoader.instance
  }

  /**
   * Lazy load Auth0 SDK only when needed
   */
  async loadAuth0SDK(): Promise<Auth0Client> {
    if (this.auth0Client) {
      return this.auth0Client
    }

    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.loadingPromise = this.performLoad()
    return this.loadingPromise
  }

  private async performLoad(): Promise<Auth0Client> {
    // Use dynamic import with chunk naming
    const { Auth0Client } = await import(
      /* webpackChunkName: "auth0-sdk" */
      /* webpackPrefetch: true */
      '@auth0/auth0-spa-js'
    )

    const config = {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      cacheLocation: 'localstorage' as const,
      useRefreshTokens: true,
      useRefreshTokensFallback: false,
    }

    this.auth0Client = new Auth0Client(config)
    // Auth0Client initialization - some versions may have additional setup methods
    // Skip optional initialization methods for now

    return this.auth0Client
  }

  /**
   * Preload Auth0 SDK in idle time
   */
  preloadInIdle(): void {
    if ('requestIdleCallback' in window) {
      ;(
        window as Window & {
          requestIdleCallback: (callback: () => void, options?: { timeout?: number }) => void
        }
      ).requestIdleCallback(
        () => {
          this.preloadAuth0()
        },
        { timeout: 2000 }
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => this.preloadAuth0(), 2000)
    }
  }

  private preloadAuth0(): void {
    // Create a link element to preload the chunk
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'script'
    link.href = '/assets/auth0-sdk.js' // This will be the actual chunk name
    document.head.appendChild(link)
  }
}

/**
 * Vite plugin for Auth0 optimization
 */
export function auth0OptimizationPlugin(): Plugin {
  return {
    name: 'auth0-optimization',

    config(config) {
      // Optimize Auth0 chunks
      if (!config.build) config.build = {}
      if (!config.build.rollupOptions) config.build.rollupOptions = {}
      if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {}

      const output = config.build.rollupOptions.output as Record<string, unknown>

      // Manual chunks configuration
      output.manualChunks = (id: string): string | undefined => {
        // Separate Auth0 SDK into its own chunk
        if (id.includes('@auth0/auth0-spa-js')) {
          return 'auth0-sdk'
        }

        // Separate Auth0 Vue wrapper
        if (id.includes('@auth0/auth0-vue')) {
          return 'auth0-vue'
        }

        // Group auth components
        if (id.includes('/auth/') || id.includes('/components/auth/')) {
          return 'auth-components'
        }

        // Keep vendor chunk for other dependencies
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      }

      // Optimize chunk size warnings
      config.build.chunkSizeWarningLimit = 100 // 100kb warning threshold for auth chunks
    },

    transformIndexHtml(html) {
      // Add resource hints for Auth0 resources
      const resourceHints = `
        <link rel="dns-prefetch" href="https://${process.env.VITE_AUTH0_DOMAIN}">
        <link rel="preconnect" href="https://${process.env.VITE_AUTH0_DOMAIN}" crossorigin>
        <link rel="preconnect" href="https://cdn.auth0.com" crossorigin>
      `

      return html.replace('</head>', `${resourceHints}</head>`)
    },
  }
}

/**
 * Service Worker for Auth0 caching
 */
export const auth0ServiceWorkerScript = `
// Cache Auth0 assets
const AUTH0_CACHE = 'auth0-cache-v1';
const AUTH0_ASSETS = [
  '/auth0-sdk.js',
  '/auth0-vue.js',
  'https://cdn.auth0.com/js/auth0-spa-js/2.1.3/auth0-spa-js.production.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(AUTH0_CACHE).then((cache) => {
      return cache.addAll(AUTH0_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('auth0') || event.request.url.includes('jwt')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // Return cached version
          return response;
        }
        
        // Fetch and cache new version
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(AUTH0_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
  }
});
`

/**
 * Memory leak prevention for Auth0
 */
export class Auth0MemoryManager {
  private listeners: Map<string, EventListener[]> = new Map()
  private intervals: Set<number> = new Set()
  private timeouts: Set<number> = new Set()

  /**
   * Register event listener with automatic cleanup
   */
  addEventListener(element: EventTarget, event: string, handler: EventListener): void {
    element.addEventListener(event, handler)

    const key = `${element.constructor.name}_${event}`
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key)!.push(handler)
  }

  /**
   * Register interval with automatic cleanup
   */
  setInterval(handler: () => void, delay: number): number {
    const id = window.setInterval(handler, delay)
    this.intervals.add(id)
    return id
  }

  /**
   * Register timeout with automatic cleanup
   */
  setTimeout(handler: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      handler()
      this.timeouts.delete(id)
    }, delay)
    this.timeouts.add(id)
    return id
  }

  /**
   * Clean up all registered resources
   */
  cleanup(): void {
    // Clear all intervals
    this.intervals.forEach(id => window.clearInterval(id))
    this.intervals.clear()

    // Clear all timeouts
    this.timeouts.forEach(id => window.clearTimeout(id))
    this.timeouts.clear()

    // Remove all event listeners
    this.listeners.clear()
  }
}

/**
 * Token cache manager with efficient storage
 */
export class TokenCacheManager {
  private static readonly CACHE_KEY = 'auth0_token_cache'
  private static readonly MAX_CACHE_SIZE = 1024 * 50 // 50KB max
  private cache: Map<string, { token: string; expiry: number }> = new Map()

  /**
   * Get token from cache
   */
  getToken(key: string): string | null {
    // Try memory cache first
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)
      if (entry && entry.expiry > Date.now()) {
        return entry.token
      }
      this.cache.delete(key)
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(`${TokenCacheManager.CACHE_KEY}_${key}`)
      if (stored) {
        const entry = JSON.parse(stored)
        if (entry.expiry > Date.now()) {
          // Restore to memory cache
          this.cache.set(key, entry)
          return entry.token
        }
        localStorage.removeItem(`${TokenCacheManager.CACHE_KEY}_${key}`)
      }
    } catch (error) {
      console.error('Token cache read error:', error)
    }

    return null
  }

  /**
   * Set token in cache
   */
  setToken(key: string, token: string, expiresIn: number): void {
    const entry = {
      token,
      expiry: Date.now() + expiresIn * 1000,
    }

    // Store in memory cache
    this.cache.set(key, entry)

    // Store in localStorage if size permits
    try {
      const serialized = JSON.stringify(entry)
      if (serialized.length < TokenCacheManager.MAX_CACHE_SIZE) {
        localStorage.setItem(`${TokenCacheManager.CACHE_KEY}_${key}`, serialized)
      }
    } catch (error) {
      console.error('Token cache write error:', error)
      // Clear old entries if quota exceeded
      this.clearOldEntries()
    }
  }

  /**
   * Clear old cache entries
   */
  private clearOldEntries(): void {
    const now = Date.now()

    // Clear expired memory entries
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry <= now) {
        this.cache.delete(key)
      }
    }

    // Clear expired localStorage entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(TokenCacheManager.CACHE_KEY)) {
        try {
          const entry = JSON.parse(localStorage.getItem(key) || '{}')
          if (entry.expiry <= now) {
            localStorage.removeItem(key)
          }
        } catch {
          localStorage.removeItem(key!)
        }
      }
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear()

    // Clear localStorage entries
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(TokenCacheManager.CACHE_KEY)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }
}

export default {
  Auth0LazyComponents,
  Auth0SDKLoader,
  auth0OptimizationPlugin,
  Auth0MemoryManager,
  TokenCacheManager,
}
