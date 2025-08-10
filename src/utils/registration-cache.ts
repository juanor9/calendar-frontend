/**
 * Registration Cache Utility
 * Manages localStorage persistence for registration flow state
 */

import type { RegistrationState } from '@/types/registration.types'

export interface CachedRegistrationState extends RegistrationState {
  timestamp: number
  version: string
}

export class RegistrationCache {
  private static readonly STORAGE_KEY = 'vana_registration_state'
  private static readonly VERSION = '1.0'
  private static readonly CACHE_EXPIRY_MS = 60 * 60 * 1000 // 1 hour
  private static readonly MAX_CACHE_SIZE = 5 * 1024 * 1024 // 5MB limit

  /**
   * Save registration state to localStorage
   */
  static save(state: RegistrationState): void {
    try {
      // Don't cache completed or idle states
      if (state.status === 'completed' || state.status === 'idle') {
        this.clear()
        return
      }

      const cachedState: CachedRegistrationState = {
        ...state,
        timestamp: Date.now(),
        version: this.VERSION,
      }

      const serialized = JSON.stringify(cachedState)

      // Check cache size limit
      if (serialized.length > this.MAX_CACHE_SIZE) {
        console.warn('Registration state too large to cache')
        return
      }

      localStorage.setItem(this.STORAGE_KEY, serialized)

      if (import.meta.env.DEV) {
        console.log('Registration state cached:', {
          status: state.status,
          step: state.step,
          size: serialized.length,
        })
      }
    } catch (error) {
      console.warn('Failed to cache registration state:', error)

      // Handle quota exceeded error by clearing old data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clear()
        console.warn('LocalStorage quota exceeded, cleared registration cache')
      }
    }
  }

  /**
   * Load registration state from localStorage
   */
  static load(): RegistrationState | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      if (!cached) {
        return null
      }

      const parsed: CachedRegistrationState = JSON.parse(cached)

      // Version check
      if (parsed.version !== this.VERSION) {
        console.log('Registration cache version mismatch, clearing cache')
        this.clear()
        return null
      }

      // Expiry check
      const age = Date.now() - parsed.timestamp
      if (age > this.CACHE_EXPIRY_MS) {
        console.log('Registration cache expired, clearing cache')
        this.clear()
        return null
      }

      // Data integrity check
      if (!this.isValidCachedState(parsed)) {
        console.warn('Invalid cached registration state, clearing cache')
        this.clear()
        return null
      }

      // Convert dates back from ISO strings
      const state: RegistrationState = {
        status: parsed.status,
        step: parsed.step,
        startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
        completedAt: parsed.completedAt ? new Date(parsed.completedAt) : null,
        error: parsed.error,
        retryCount: parsed.retryCount,
        sessionId: parsed.sessionId,
      }

      if (import.meta.env.DEV) {
        console.log('Registration state loaded from cache:', {
          status: state.status,
          step: state.step,
          age: Math.round(age / 1000) + 's',
        })
      }

      return state
    } catch (error) {
      console.warn('Failed to load cached registration state:', error)
      this.clear() // Clear corrupted cache
      return null
    }
  }

  /**
   * Clear registration state from localStorage
   */
  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)

      if (import.meta.env.DEV) {
        console.log('Registration cache cleared')
      }
    } catch (error) {
      console.warn('Failed to clear registration cache:', error)
    }
  }

  /**
   * Check if cached state exists
   */
  static exists(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEY) !== null
    } catch (error) {
      console.warn('Failed to check registration cache existence:', error)
      return false
    }
  }

  /**
   * Get cache metadata without loading full state
   */
  static getMetadata(): { age: number; version: string; status: string } | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      if (!cached) return null

      const parsed: CachedRegistrationState = JSON.parse(cached)
      const age = Date.now() - parsed.timestamp

      return {
        age,
        version: parsed.version,
        status: parsed.status,
      }
    } catch (error) {
      console.warn('Failed to get registration cache metadata:', error)
      return null
    }
  }

  /**
   * Update only specific fields in cached state (partial update)
   */
  static update(updates: Partial<RegistrationState>): void {
    const current = this.load()
    if (!current) {
      console.warn('Cannot update cache: no existing state found')
      return
    }

    const updated: RegistrationState = {
      ...current,
      ...updates,
    }

    this.save(updated)
  }

  /**
   * Check if cache is stale (older than threshold)
   */
  static isStale(thresholdMs: number = 15 * 60 * 1000): boolean {
    // 15 minutes default
    const metadata = this.getMetadata()
    return metadata ? metadata.age > thresholdMs : false
  }

  /**
   * Clean up expired or invalid cache entries
   */
  static cleanup(): void {
    const metadata = this.getMetadata()
    if (!metadata) return

    // Clear if expired
    if (metadata.age > this.CACHE_EXPIRY_MS) {
      this.clear()
      console.log('Cleaned up expired registration cache')
      return
    }

    // Clear if version mismatch
    if (metadata.version !== this.VERSION) {
      this.clear()
      console.log('Cleaned up outdated registration cache version')
      return
    }
  }

  /**
   * Validate cached state structure
   */
  private static isValidCachedState(state: unknown): state is CachedRegistrationState {
    if (!state || typeof state !== 'object') return false

    const requiredFields = ['status', 'step', 'timestamp', 'version']
    for (const field of requiredFields) {
      if (!(field in state)) return false
    }

    // Validate status values
    const validStatuses = ['idle', 'redirecting', 'processing', 'verifying', 'completed', 'error']
    if (!validStatuses.includes(state.status)) return false

    // Validate step values
    const validSteps = [
      'initial',
      'auth0_redirect',
      'auth0_form',
      'email_verification',
      'profile_creation',
      'onboarding',
      'completed',
    ]
    if (!validSteps.includes(state.step)) return false

    // Validate timestamp
    if (typeof state.timestamp !== 'number' || state.timestamp <= 0) return false

    // Validate retry count
    if (typeof state.retryCount !== 'number' || state.retryCount < 0) return false

    return true
  }

  /**
   * Import state from external source (for testing/debugging)
   */
  static import(state: RegistrationState): void {
    if (!this.isValidCachedState({ ...state, timestamp: Date.now(), version: this.VERSION })) {
      throw new Error('Invalid state structure for import')
    }
    this.save(state)
  }

  /**
   * Export current cached state (for debugging)
   */
  static export(): CachedRegistrationState | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.warn('Failed to export registration cache:', error)
      return null
    }
  }

  /**
   * Get cache size in bytes
   */
  static getSize(): number {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      return cached ? new Blob([cached]).size : 0
    } catch (error) {
      console.warn('Failed to get registration cache size:', error)
      return 0
    }
  }

  /**
   * Initialize cache (run on app startup)
   */
  static initialize(): void {
    // Clean up any expired or invalid cache
    this.cleanup()

    // Log cache status in development
    if (import.meta.env.DEV) {
      const metadata = this.getMetadata()
      if (metadata) {
        console.log('Registration cache initialized:', {
          status: metadata.status,
          age: Math.round(metadata.age / 1000) + 's',
          size: this.getSize() + ' bytes',
        })
      }
    }
  }
}
