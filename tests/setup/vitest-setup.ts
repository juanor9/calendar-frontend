/**
 * Configuración global de Vitest para Tanuki Planner
 * Incluye utilidades de testing, mocks, y configuración de accesibilidad
 */

import { expect, beforeEach, afterEach, vi } from 'vitest'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom'

// ⚙️ Configuración global de Vue Test Utils
config.global.plugins = []

// Skip complex asset path transformation for now - focus on other patterns first

// Global provide for Auth0
config.global.provide = {
  // Mock Auth0 client injection key - Complete Auth0VueClient interface implementation
  Auth0ClientKey: {
    // Computed refs (these need to be reactive-like objects)
    isAuthenticated: { value: false },
    isLoading: { value: false },
    user: { value: null },
    error: { value: null },
    idTokenClaims: { value: null },

    // Auth methods
    loginWithRedirect: vi.fn().mockResolvedValue(undefined),
    loginWithPopup: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
    getAccessTokenWithPopup: vi.fn().mockResolvedValue('mock-token'),
    getIdTokenClaims: vi.fn().mockResolvedValue(null),
    handleRedirectCallback: vi.fn().mockResolvedValue(undefined),
    checkSession: vi.fn().mockResolvedValue(undefined),
  },
}

// 🎯 Mock de módulos que requieren configuración especial
vi.mock('@vueuse/head', () => ({
  useHead: vi.fn(),
}))

// ⚙️ Mock vitest functions to fix vi.mocked issues (CRITICAL: Fixes vi.mocked(...).mockReturnValue errors)
Object.assign(vi, {
  mocked: (fn: unknown) => {
    // If it's already a mock function, return it as-is
    if (fn && typeof fn === 'function' && (fn as Record<string, unknown>)._isMockFunction) {
      return fn
    }

    // Create a new mock function with all vitest mock methods
    const mockFn = vi.fn()

    // Preserve any existing implementation if it's a function
    if (typeof fn === 'function') {
      mockFn.mockImplementation(fn)
    }

    return mockFn
  },
})

// 🔍 Mock auth composable (CRITICAL: Para tests de componentes que usan auth)
vi.mock('@/auth/auth-composable', () => ({
  useAuth: vi.fn(() => ({
    // Auth state (computed refs) - CRITICAL: Return primitive values for text content to avoid ref rendering issues
    isAuthenticated: { value: false },
    isLoading: { value: false },
    user: { value: null },
    error: { value: null },

    // Auth actions
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    checkSession: vi.fn().mockResolvedValue(false),
    checkAuth: vi.fn().mockResolvedValue(false),
    handleRedirectCallback: vi.fn().mockResolvedValue(undefined),

    // Role/permission checks (return primitive values, not refs)
    isPremium: vi.fn().mockReturnValue(false),
    isAdmin: vi.fn().mockReturnValue(false),
    hasRole: vi.fn().mockReturnValue(false),
    hasPermission: vi.fn().mockReturnValue(false),
    hasAnyRole: vi.fn().mockReturnValue(false),
    hasAnyPermission: vi.fn().mockReturnValue(false),

    // Token management
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
    refreshToken: vi.fn().mockResolvedValue('mock-refreshed-token'),

    // User info functions (required by UserProfile component) - Return primitive strings
    getUserDisplayName: vi.fn().mockReturnValue('Test User'),
    getUserAvatar: vi.fn().mockReturnValue('https://example.com/avatar.jpg'),
    getUserRoles: vi.fn().mockReturnValue(['user']),

    // Text content getters for button states - CRITICAL: These should return strings, not refs
    getLogoutButtonText: vi.fn().mockReturnValue('Cerrar Sesión'),
    getLogoutLoadingText: vi.fn().mockReturnValue('Cerrando sesión...'),
    getLogoutErrorText: vi.fn().mockReturnValue('Error al cerrar sesión'),
  })),
  Auth0ClientKey: Symbol('Auth0Client'),
}))

// 🔍 Mock de Auth0 SDK (CRITICAL: Para tests de token handling)
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn(),
}))

vi.mock('@auth0/auth0-vue', () => ({
  createAuth0: vi.fn(),
  useAuth0: vi.fn(),
}))

// 📊 Mock de web-vitals (CRITICAL: Para tests de performance)
vi.mock('web-vitals', () => ({
  onLCP: vi.fn(),
  onFCP: vi.fn(),
  onCLS: vi.fn(),
  onTTFB: vi.fn(),
  onINP: vi.fn(),
}))

// 🌐 Mock de GraphQL Apollo Client
vi.mock('@apollo/client', () => ({
  ApolloClient: vi.fn(),
  InMemoryCache: vi.fn(),
  createHttpLink: vi.fn(),
  ApolloProvider: vi.fn(),
}))

// Define default Apollo mock functions (CRITICAL: These need to be proper mocks that can be reassigned by vi.mocked)
const defaultUseQuery = vi.fn(() => ({
  result: { value: null },
  loading: { value: false },
  error: { value: null },
  refetch: vi.fn().mockResolvedValue({ data: {} }),
}))

const defaultUseMutation = vi.fn(() => ({
  mutate: vi.fn().mockResolvedValue({ data: {} }),
  loading: { value: false },
  error: { value: null },
}))

const defaultUseSubscription = vi.fn(() => ({
  result: { value: null },
  loading: { value: false },
  error: { value: null },
  restart: vi.fn(),
}))

vi.mock('@vue/apollo-composable', () => ({
  useQuery: defaultUseQuery,
  useMutation: defaultUseMutation,
  useSubscription: defaultUseSubscription,
  useApolloClient: vi.fn(() => ({
    query: vi.fn(),
    mutate: vi.fn(),
    resetStore: vi.fn(),
  })),
}))

// 🧭 Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    path: '/',
    meta: {},
  })),
  createRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: { value: { params: {}, query: {}, path: '/' } },
  })),
  createWebHistory: vi.fn(),
  createWebHashHistory: vi.fn(),
  createMemoryHistory: vi.fn(),
  RouterView: {
    name: 'RouterView',
    render: () => null,
  },
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    render: () => null,
  },
}))

// 🪄 Mock de Pinia Store
vi.mock('pinia', () => ({
  defineStore: vi.fn((id: string, _setup: unknown) => {
    // Return a mock store function
    return vi.fn(() => ({
      // Auth Store mock
      ...(id === 'auth' && {
        user: vi.fn().mockReturnValue(null),
        isAuthenticated: vi.fn().mockReturnValue(false),
        isLoading: vi.fn().mockReturnValue(false),
        error: vi.fn().mockReturnValue(null),
        login: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
        setUser: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
      }),
      // Onboarding Store mock
      ...(id === 'onboarding' && {
        currentStep: vi.fn().mockReturnValue('welcome'),
        completedSteps: vi.fn().mockReturnValue([]),
        progress: vi.fn().mockReturnValue(0),
        nextStep: vi.fn(),
        previousStep: vi.fn(),
        completeStep: vi.fn(),
        resetOnboarding: vi.fn(),
      }),
      // Generic store properties
      $id: id,
      $state: {},
      $reset: vi.fn(),
      $dispose: vi.fn(),
    }))
  }),
  storeToRefs: vi.fn((store: Record<string, unknown>) => {
    // Convert store values to refs
    const refs: Record<string, unknown> = {}
    for (const key in store) {
      if (typeof store[key] !== 'function') {
        refs[key] = { value: store[key] }
      }
    }
    return refs
  }),
  createPinia: vi.fn(() => ({})),
  setActivePinia: vi.fn(),
}))

// Mock specific auth store
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(() => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,

    // Profile management state
    isUpdatingProfile: false,
    profileError: null,

    // GDPR state
    isExportingData: false,
    isDeletingAccount: false,
    gdprError: null,

    // Security events state
    securityEvents: [],
    isLoadingSecurityEvents: false,

    // Computed getters
    userRoles: [],
    userPermissions: [],
    userMetadata: null,
    userDisplayName: 'Test User',
    userAvatar: 'https://example.com/avatar.jpg',
    isAdmin: false,
    isPremium: false,

    // Actions
    setUser: vi.fn(),
    setToken: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    initializeFromStorage: vi.fn(),
    clearAuth: vi.fn(),

    // Permission/role checking methods
    hasRole: vi.fn().mockReturnValue(false),
    hasPermission: vi.fn().mockReturnValue(false),
    hasAnyRole: vi.fn().mockReturnValue(false),
    hasAnyPermission: vi.fn().mockReturnValue(false),
    hasAllRoles: vi.fn().mockReturnValue(false),
    hasAllPermissions: vi.fn().mockReturnValue(false),

    // Profile management
    updateUserProfile: vi.fn(),
    updateUserMetadata: vi.fn(),
    updateProfile: vi.fn().mockResolvedValue(undefined),
    clearProfileError: vi.fn(),

    // GDPR methods
    requestDataExport: vi.fn().mockResolvedValue(undefined),
    requestAccountDeletion: vi.fn().mockResolvedValue(undefined),
    clearGdprError: vi.fn(),

    // Security events methods
    loadSecurityEvents: vi.fn().mockResolvedValue(undefined),

    // Utility methods
    getAuthState: vi.fn().mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
    }),

    // Legacy methods for compatibility
    login: vi.fn(),
    logout: vi.fn(),
    $reset: vi.fn(),
    $dispose: vi.fn(),
  })),
}))

// Mock specific onboarding store
vi.mock('@/store/onboarding', () => ({
  useOnboardingStore: vi.fn(() => ({
    currentStep: 'welcome',
    completedSteps: [],
    progress: 0,
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    completeStep: vi.fn(),
    resetOnboarding: vi.fn(),
  })),
}))

// Mock specific registration store (CRITICAL: For useAuth composable tests)
vi.mock('@/store/registration', () => ({
  useRegistrationStore: vi.fn(() => ({
    registrationState: {
      status: 'idle',
      email: '',
      source: '',
      step: null,
      error: null,
      retryCount: 0,
      retryable: true,
    },
    startRegistration: vi.fn(),
    updateRegistrationState: vi.fn(),
    handleRegistrationError: vi.fn(),
    resetRegistration: vi.fn(),
    retryRegistration: vi.fn(),
    sendVerificationEmail: vi.fn(),
    markEmailVerified: vi.fn(),
    $patch: vi.fn(),
  })),
}))

// Mock composables used in tests
vi.mock('@/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: { value: false },
    isLoading: { value: false },
    user: { value: null },
    error: { value: null },
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    registerWithRedirect: vi.fn().mockResolvedValue(undefined),
    checkAuth: vi.fn().mockResolvedValue(false),
    // Email verification methods (required by EmailVerificationPage)
    resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    checkEmailVerification: vi.fn().mockResolvedValue(false),
    // Token methods
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
    refreshToken: vi.fn().mockResolvedValue('mock-refreshed-token'),
  })),
}))

vi.mock('@/composables/useOnboarding', () => ({
  useOnboarding: vi.fn(() => ({
    currentStep: { value: 'welcome' },
    completedSteps: { value: [] },
    progress: { value: 0 },
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    completeStep: vi.fn(),
    resetOnboarding: vi.fn(),
  })),
}))

// Mock API services (CRITICAL: For composable tests that use services)
vi.mock('@/services/api/registration', () => ({
  RegistrationAPI: {
    startRegistration: vi.fn(),
    updateRegistration: vi.fn(),
    sendVerificationEmail: vi.fn(),
    validateEmail: vi.fn(),
  },
}))

vi.mock('@/utils/registration-cache', () => ({
  RegistrationCache: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    has: vi.fn(),
  },
}))

// 🖱️ Mock de drag and drop
vi.mock('vue-draggable-plus', () => ({
  VueDraggableNext: {
    name: 'VueDraggableNext',
    props: ['list', 'group', 'sort'],
    render: () => null,
  },
}))

// 📱 Mock de WebSocket para notificaciones en tiempo real
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
  })),
}))

// 🎨 Mock de Heroicons (CRITICAL: Dynamic proxy for all icons)
vi.mock('@heroicons/vue/24/outline', () => {
  const mockIcon = {
    name: 'MockIcon',
    render: () => null,
  }

  // Create a proxy that returns mockIcon for any property access
  return new Proxy(
    {
      // Define common icons explicitly for better debugging
      CalendarIcon: mockIcon,
      RocketLaunchIcon: mockIcon,
      PlayIcon: mockIcon,
      ShieldCheckIcon: mockIcon,
      ClockIcon: mockIcon,
      CurrencyDollarIcon: mockIcon,
      QuestionMarkCircleIcon: mockIcon,
      CheckIcon: mockIcon,
      CheckCircleIcon: mockIcon,
      SparklesIcon: mockIcon,
      PuzzlePieceIcon: mockIcon,
      ExclamationCircleIcon: mockIcon,
      InformationCircleIcon: mockIcon,
      ExclamationTriangleIcon: mockIcon,
      ArrowPathIcon: mockIcon,
      ChatBubbleLeftIcon: mockIcon,
      XMarkIcon: mockIcon,
      ChevronDownIcon: mockIcon,
      ChevronUpIcon: mockIcon,
      ChevronLeftIcon: mockIcon,
      ChevronRightIcon: mockIcon,
      PlusIcon: mockIcon,
      MinusIcon: mockIcon,
      EyeIcon: mockIcon,
      EyeSlashIcon: mockIcon,
      ArrowRightIcon: mockIcon,
      ArrowLeftIcon: mockIcon,
      HomeIcon: mockIcon,
      Cog6ToothIcon: mockIcon,
      UserIcon: mockIcon,
      BellIcon: mockIcon,
      EnvelopeIcon: mockIcon,
      default: mockIcon,
    },
    {
      get(target, prop) {
        // Return defined property or fallback to mockIcon
        return target[prop as keyof typeof target] || mockIcon
      },
    }
  )
})

// 🎨 Mock de CSS y SCSS modules
vi.mock('*.scss', () => ({}))
vi.mock('*.css', () => ({}))

// 📷 Mock de archivos estáticos (CRITICAL: Para tests de asset loading)
// Use more realistic paths that match Vite's resolution
vi.mock('*.png', () => ({ default: '/src/assets/images/mock-image.png' }))
vi.mock('*.svg', () => ({ default: '/src/assets/icons/mock-image.svg' }))
vi.mock('*.jpg', () => ({ default: '/src/assets/images/mock-image.jpg' }))
vi.mock('*.jpeg', () => ({ default: '/src/assets/images/mock-image.jpeg' }))
vi.mock('*.gif', () => ({ default: '/src/assets/images/mock-image.gif' }))
vi.mock('*.webp', () => ({ default: '/src/assets/images/mock-image.webp' }))

// Mock specific assets mentioned in error patterns (CRITICAL: Match exact paths expected in tests)
vi.mock('@/assets/images/vana-logo.png', () => ({
  default: '/src/assets/images/vana-logo.png',
}))
vi.mock('@/assets/images/hero-background.jpg', () => ({
  default: '/src/assets/images/hero-background.jpg',
}))
vi.mock('@/assets/icons/menu.svg', () => ({
  default: '/src/assets/icons/menu.svg',
}))
vi.mock('@/assets/images/icon-calendar.svg', () => ({
  default: '/src/assets/images/icon-calendar.svg',
}))
vi.mock('@/assets/images/icon-task.svg', () => ({
  default: '/src/assets/images/icon-task.svg',
}))
vi.mock('@/assets/icons/chevron-down.svg', () => ({
  default: '/src/assets/icons/chevron-down.svg',
}))

// Mock additional assets for dynamic loading tests
vi.mock('@/assets/icons/arrow-right.svg', () => ({
  default: '/src/assets/icons/arrow-right.svg',
}))
vi.mock('@/assets/icons/dark/large/icon.svg', () => ({
  default: '/src/assets/icons/dark/large/icon.svg',
}))
vi.mock('@/assets/images/ui/buttons/primary-bg.jpg', () => ({
  default: '/src/assets/images/ui/buttons/primary-bg.jpg',
}))

// 📊 Configuración de Intersection Observer Mock
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
Object.defineProperty(window, 'IntersectionObserver', {
  value: mockIntersectionObserver,
})

// 📏 Configuración de ResizeObserver Mock
const mockResizeObserver = vi.fn()
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
Object.defineProperty(window, 'ResizeObserver', {
  value: mockResizeObserver,
})

// ⏰ Mock de APIs de tiempo y fecha
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 🗂️ Mock de File API para drag and drop de archivos
Object.defineProperty(window, 'File', {
  value: class MockFile {
    name: string
    size: number
    type: string
    lastModified: number

    constructor(parts: ArrayLike<BlobPart>, filename: string, properties?: FilePropertyBag) {
      this.name = filename
      this.size = Array.from(parts).reduce((acc, part) => acc + (part as string).length, 0)
      this.type = properties?.type || 'text/plain'
      this.lastModified = Date.now()
    }
  },
})

// 🎨 Mock de HTMLCanvasElement para axe-core accessibility testing
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((contextType: string) => {
    if (contextType === '2d') {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Array(4).fill(0),
        })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Array(4).fill(0) })),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),
      }
    }
    return null
  }),
})

// 🎨 Mock getComputedStyle for axe-core (CRITICAL: Prevents JSDOM getComputedStyle errors)
Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn((_element: Element, _pseudoElement?: string | null) => {
    return {
      getPropertyValue: vi.fn(() => ''),
      color: '#000000',
      backgroundColor: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      display: 'block',
      visibility: 'visible',
      opacity: '1',
      width: '100px',
      height: '20px',
      // Add more common CSS properties as needed
      getPropertyPriority: vi.fn(() => ''),
      item: vi.fn(),
      length: 0,
      parentRule: null,
      cssText: '',
      cssFloat: 'none',
    }
  }),
  writable: true,
  configurable: true,
})

Object.defineProperty(window, 'FileList', {
  value: class MockFileList extends Array {
    item(index: number) {
      return this[index] || null
    }
  },
})

// 🎯 Configuración de localStorage y sessionStorage
const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', { value: mockStorage })
Object.defineProperty(window, 'sessionStorage', { value: mockStorage })

// 🌐 Configuración de fetch mock global
global.fetch = vi.fn()

// 🆔 Mock Vue useId and ref to generate unique IDs in tests (CRITICAL: Fixes ID uniqueness issues)
let idCounter = 0
const resetIdCounter = () => {
  idCounter = 0
}
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    useId: vi.fn(() => {
      idCounter += 1
      return `v-${idCounter}`
    }),
    // REMOVED: Don't override Vue's core reactivity functions, let them work normally
    // The original Vue implementation should handle computed, ref, reactive properly
  }
})

// CRITICAL: Make vi.ref available for integration tests
Object.assign(vi, {
  ref: vi.fn((initialValue: unknown) => ({
    value: initialValue,
    _isRef: true,
  })),
})

// Make resetIdCounter available globally for cleanup
declare global {
  const resetIdCounter: (() => void) | undefined
}
globalThis.resetIdCounter = resetIdCounter

// 🧹 Limpieza después de cada test
afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()

  // Limpiar DOM
  document.body.innerHTML = ''

  // Limpiar storage mocks
  mockStorage.getItem.mockClear()
  mockStorage.setItem.mockClear()
  mockStorage.removeItem.mockClear()
  mockStorage.clear.mockClear()

  // Reset unique ID counter for consistent testing
  globalThis.resetIdCounter?.()
})

// 📊 Configuración de console warnings/errors en tests
beforeEach(() => {
  // Suprimir warnings específicos de Vue en testing
  const originalWarn = console.warn
  const originalError = console.error

  console.warn = (...args) => {
    if (args[0]?.includes?.('Vue received a Component') || args[0]?.includes?.('[Vue warn]')) {
      return
    }
    originalWarn(...args)
  }

  console.error = (...args) => {
    if (args[0]?.includes?.('Vue received a Component') || args[0]?.includes?.('[Vue error]')) {
      return
    }
    originalError(...args)
  }
})

// 🎭 Extensión de expect con matchers personalizados para Tanuki Planner
expect.extend({
  // Add toHaveNoViolations matcher - custom implementation for vitest-axe compatibility
  toHaveNoViolations(received: { violations?: Array<{ id: string; description: string }> }) {
    const violations = received?.violations || []
    const pass = violations.length === 0

    if (pass) {
      return {
        message: () => `Expected accessibility violations, but found none`,
        pass: true,
      }
    } else {
      const violationMessages = violations
        .map(violation => `${violation.id}: ${violation.description}`)
        .join('\n')

      return {
        message: () => `Expected no accessibility violations, but found:\n${violationMessages}`,
        pass: false,
      }
    }
  },
  toBeAccessible: (received: { element?: Element } | Element) => {
    // Custom matcher para verificar accesibilidad básica
    const element =
      received instanceof Element ? received : (received as { element?: Element }).element
    if (!element) {
      return {
        pass: false,
        message: () => 'Expected element to exist',
      }
    }

    // Verificaciones básicas de accesibilidad
    const hasProperRole = element.getAttribute('role') || element.tagName
    const hasAccessibleName =
      element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent

    const pass = hasProperRole && hasAccessibleName

    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to be accessible`
          : `Expected element to be accessible. Missing: ${!hasProperRole ? 'role' : 'accessible name'}`,
    }
  },

  toHaveValidDateTime: (_received: unknown, dateTime: string) => {
    // Custom matcher para validar formatos de fecha/hora del calendario
    const isValidISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(dateTime)
    const isValidDate = !isNaN(Date.parse(dateTime))

    return {
      pass: isValidISO && isValidDate,
      message: () =>
        isValidISO && isValidDate
          ? `Expected ${dateTime} not to be a valid datetime`
          : `Expected ${dateTime} to be a valid ISO datetime`,
    }
  },
})

// 🚨 Configuración específica para tests de GraphQL
export const createMockApolloClient = (mocks: Array<Record<string, unknown>> = []) => {
  return {
    query: vi.fn().mockResolvedValue({ data: {} }),
    mutate: vi.fn().mockResolvedValue({ data: {} }),
    subscribe: vi.fn().mockReturnValue({
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    }),
    cache: {
      writeQuery: vi.fn(),
      readQuery: vi.fn(),
      evict: vi.fn(),
    },
    ...mocks.reduce((acc, mock) => ({ ...acc, ...mock }), {}),
  }
}

// 📱 Utilidades para simulación de drag and drop
export const mockDragEvent = (type: string, data: Record<string, unknown> = {}) => {
  return new DragEvent(type, {
    bubbles: true,
    cancelable: true,
    dataTransfer: {
      getData: vi.fn().mockReturnValue(JSON.stringify(data)),
      setData: vi.fn(),
      dropEffect: 'move',
      effectAllowed: 'move',
      files: [],
      items: [],
      types: [],
    } as unknown as DataTransfer,
  })
}

// 🕐 Utilidades para testing de componentes con tiempo
export const mockDateNow = (timestamp: number) => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(timestamp))
}

export const restoreRealTime = () => {
  vi.useRealTimers()
}

console.log('🧪 Tanuki Planner Testing Setup loaded successfully')
