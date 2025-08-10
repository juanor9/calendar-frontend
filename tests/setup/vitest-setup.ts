/**
 * Configuración global de Vitest para Vana
 * Incluye utilidades de testing, mocks, y configuración de accesibilidad
 */

import { expect, beforeEach, afterEach, vi } from 'vitest'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

// 🔧 Configuración global de Vue Test Utils
config.global.plugins = []

// 🎯 Mock de módulos que requieren configuración especial
vi.mock('@vueuse/head', () => ({
  useHead: vi.fn(),
}))

// 🔐 Mock de Auth0 SDK (CRITICAL: Para tests de token handling)
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

vi.mock('@vue/apollo-composable', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useSubscription: vi.fn(),
  useApolloClient: vi.fn(),
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

// 🏪 Mock de Pinia Store
vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  storeToRefs: vi.fn(),
  createPinia: vi.fn(),
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

// 🎨 Mock de CSS y SCSS modules
vi.mock('*.scss', () => ({}))
vi.mock('*.css', () => ({}))

// 📷 Mock de archivos estáticos (CRITICAL: Para tests de asset loading)
vi.mock('*.png', () => 'mock-image.png')
vi.mock('*.svg', () => 'mock-image.svg')
vi.mock('*.jpg', () => 'mock-image.jpg')
vi.mock('*.jpeg', () => 'mock-image.jpeg')
vi.mock('*.gif', () => 'mock-image.gif')
vi.mock('*.webp', () => 'mock-image.webp')

// Mock specific assets mentioned in error patterns
vi.mock('@/assets/images/vana-logo.png', () => '/src/assets/images/vana-logo.png')
vi.mock('@/assets/images/hero-background.jpg', () => '/src/assets/images/hero-background.jpg')
vi.mock('@/assets/icons/menu.svg', () => '/src/assets/icons/menu.svg')

// 🔊 Configuración de Intersection Observer Mock
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
Object.defineProperty(window, 'IntersectionObserver', {
  value: mockIntersectionObserver,
})

// 📐 Configuración de ResizeObserver Mock
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
    constructor(parts: any[], filename: string, properties?: any) {
      return {
        name: filename,
        size: parts.reduce((acc, part) => acc + part.length, 0),
        type: properties?.type || 'text/plain',
        lastModified: Date.now(),
      }
    }
  },
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

// 🌍 Configuración de fetch mock global
global.fetch = vi.fn()

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

// 🎭 Extensión de expect con matchers personalizados para Vana
expect.extend({
  toBeAccessible: received => {
    // Custom matcher para verificar accesibilidad básica
    const element = received instanceof Element ? received : received.element
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

  toHaveValidDateTime: (received, dateTime) => {
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
export const createMockApolloClient = (mocks: any[] = []) => {
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
export const mockDragEvent = (type: string, data: any = {}) => {
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
    },
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

console.log('🧪 Vana Testing Setup loaded successfully')
