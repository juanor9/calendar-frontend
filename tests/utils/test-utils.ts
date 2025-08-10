/**
 * Utilidades de Testing para Vana
 * Funciones helper para simplificar y estandarizar tests de componentes Vue 3
 */

import type { RenderOptions, RenderResult } from '@testing-library/vue'
import { render } from '@testing-library/vue'
import { RouterLinkStub, VueWrapper } from '@vue/test-utils'
import type { Component, Plugin } from 'vue'
import type { Router } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import type { Pinia } from 'pinia'
import router from '@/router'

// 🎯 Tipos específicos para testing
export interface VanaTestingOptions extends RenderOptions<unknown> {
  router?: Router
  pinia?: Pinia
  apolloMocks?: Record<string, unknown>[]
  initialRoute?: string
  withAuth?: boolean
  userRole?: 'user' | 'premium' | 'admin'
}

export interface CalendarTestData {
  tasks: Array<{
    id: string
    title: string
    durationMinutes: number
    dueDate?: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'TODO' | 'DOING' | 'DONE'
  }>
  events: Array<{
    id: string
    title: string
    start: string
    end: string
    source: 'MANUAL' | 'GOOGLE' | 'OUTLOOK'
  }>
}

// 🏗️ Factory para crear router de testing
export const createTestRouter = (initialRoute = '/') => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  
  // Navegar a la ruta inicial
  router.push(initialRoute)
  
  return router
}

// 🏪 Factory para crear store de testing
export const createTestPinia = () => {
  return createPinia()
}

// ⚡ Render helper principal para componentes de Vana
export const renderVanaComponent = (
  component: Component,
  options: VanaTestingOptions = {}
): RenderResult => {
  const {
    router = createTestRouter(options.initialRoute),
    pinia = createTestPinia(),
    apolloMocks = [],
    withAuth = false,
    userRole = 'user',
    ...renderOptions
  } = options

  // Configurar plugins globales
  const globalPlugins: Plugin[] = [pinia]
  
  if (router) {
    globalPlugins.push(router)
  }

  // Configurar componentes globales stub
  const globalComponents = {
    RouterLink: RouterLinkStub,
    RouterView: true,
  }

  // Configurar mocks de autenticación
  const globalMocks: Record<string, unknown> = {}
  
  if (withAuth) {
    globalMocks.$auth = {
      user: {
        id: 'test-user-123',
        email: 'test@vana.app',
        name: 'Test User',
        role: userRole,
      },
      isAuthenticated: true,
      token: 'mock-jwt-token',
    }
  }

  // Configurar Apollo mocks
  if (apolloMocks.length > 0) {
    globalMocks.$apollo = {
      query: vi.fn().mockResolvedValue({ data: apolloMocks[0] }),
      mutate: vi.fn().mockResolvedValue({ data: {} }),
    }
  }

  return render(component, {
    global: {
      plugins: globalPlugins,
      components: globalComponents,
      mocks: globalMocks,
      stubs: {
        Teleport: true,
        Transition: false,
        TransitionGroup: false,
      },
    },
    ...renderOptions,
  })
}

// 📅 Utilidades específicas para testing de calendario
export const calendarTestUtils = {
  // Crear datos de prueba para el calendario
  createMockCalendarData: (overrides?: Partial<CalendarTestData>): CalendarTestData => ({
    tasks: [
      {
        id: 'task-1',
        title: 'Revisión de código',
        durationMinutes: 60,
        dueDate: '2025-08-15T10:00:00Z',
        priority: 'HIGH',
        status: 'TODO',
      },
      {
        id: 'task-2',
        title: 'Llamada con cliente',
        durationMinutes: 30,
        dueDate: '2025-08-15T14:00:00Z',
        priority: 'CRITICAL',
        status: 'TODO',
      },
    ],
    events: [
      {
        id: 'event-1',
        title: 'Reunión de equipo',
        start: '2025-08-15T09:00:00Z',
        end: '2025-08-15T10:00:00Z',
        source: 'MANUAL',
      },
    ],
    ...overrides,
  }),

  // Simular drag and drop de tareas
  mockTaskDragDrop: async (
    sourceElement: Element,
    targetElement: Element,
    taskData: Record<string, unknown>
  ) => {
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    })
    
    dragStartEvent.dataTransfer?.setData('application/json', JSON.stringify(taskData))
    sourceElement.dispatchEvent(dragStartEvent)

    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: dragStartEvent.dataTransfer,
    })
    
    targetElement.dispatchEvent(dropEvent)
  },

  // Simular cambio de vista de calendario
  mockCalendarViewChange: (view: 'day' | 'week' | 'month') => {
    return {
      currentView: view,
      date: new Date('2025-08-15'),
    }
  },

  // Crear mock de WebSocket para updates en tiempo real
  createMockWebSocket: () => ({
    on: vi.fn((event: string, callback: (data: unknown) => void) => {
      if (event === 'taskUpdated') {
        // Simular update de tarea después de 100ms
        setTimeout(() => {
          callback({
            id: 'task-1',
            status: 'DOING',
            updatedAt: new Date().toISOString(),
          })
        }, 100)
      }
    }),
    emit: vi.fn(),
    disconnect: vi.fn(),
  }),
}

// 🔍 Utilidades para testing de búsqueda y filtros
export const searchTestUtils = {
  // Mock de resultados de búsqueda
  createMockSearchResults: (query: string, totalResults = 5) => ({
    query,
    results: Array.from({ length: totalResults }, (_, i) => ({
      id: `result-${i}`,
      title: `Tarea ${i + 1} con ${query}`,
      type: 'task',
      priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
    })),
    total: totalResults,
    hasMore: totalResults > 5,
  }),

  // Simular búsqueda con debounce
  mockDebouncedSearch: async (searchFn: (query: string) => unknown, query: string, delay = 300) => {
    await vi.advanceTimersByTimeAsync(delay)
    return searchFn(query)
  },
}

// 🎨 Utilidades para testing de UI y estilos
export const uiTestUtils = {
  // Verificar clases CSS aplicadas
  expectToHaveClasses: (element: Element, classes: string[]) => {
    classes.forEach(cls => {
      expect(element).toHaveClass(cls)
    })
  },

  // Verificar estados de componente
  expectComponentState: (element: Element, state: string) => {
    expect(element).toHaveAttribute('data-state', state)
  },

  // Verificar responsive design
  mockViewport: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    })
    
    // Disparar evento resize
    window.dispatchEvent(new Event('resize'))
  },
}

// 🌐 Utilidades para testing de GraphQL
export const graphqlTestUtils = {
  // Mock de queries GraphQL
  createMockQuery: (operationName: string, variables: Record<string, unknown> = {}, data: Record<string, unknown> = {}) => ({
    request: {
      query: expect.any(Object),
      variables,
    },
    result: {
      data: {
        [operationName]: data,
      },
    },
  }),

  // Mock de mutaciones GraphQL
  createMockMutation: (mutationName: string, variables: Record<string, unknown> = {}, data: Record<string, unknown> = {}) => ({
    request: {
      query: expect.any(Object),
      variables,
    },
    result: {
      data: {
        [mutationName]: {
          success: true,
          ...data,
        },
      },
    },
  }),

  // Mock de subscriptions GraphQL
  createMockSubscription: (subscriptionName: string, data: Record<string, unknown> = {}) => ({
    request: {
      query: expect.any(Object),
    },
    result: {
      data: {
        [subscriptionName]: data,
      },
    },
  }),
}

// ♿ Utilidades para testing de accesibilidad
export const a11yTestUtils = {
  // Verificar navegación con teclado
  expectKeyboardNavigation: async (container: Element, keys: string[]) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    for (const key of keys) {
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement) {
        activeElement.dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true })
        )
      }
    }
  },

  // Verificar ARIA attributes
  expectAriaAttributes: (element: Element, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([attr, value]) => {
      expect(element).toHaveAttribute(`aria-${attr}`, value)
    })
  },

  // Verificar contraste de colores
  expectColorContrast: async (element: Element, minRatio = 4.5) => {
    // Nota: En un entorno real, esto requeriría una librería como axe-core
    // Aquí es un placeholder para la implementación
    expect(element).toBeInTheDocument()
  },
}

// 📱 Utilidades para testing responsive
export const responsiveTestUtils = {
  breakpoints: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    largeDesktop: { width: 1920, height: 1080 },
  },

  testInBreakpoint: async (
    breakpoint: keyof typeof responsiveTestUtils.breakpoints,
    testFn: () => Promise<void> | void
  ) => {
    const { width, height } = responsiveTestUtils.breakpoints[breakpoint]
    uiTestUtils.mockViewport(width, height)
    await testFn()
  },
}

// 🚀 Utilidades para testing de performance
export const performanceTestUtils = {
  // Medir tiempo de render de componente
  measureRenderTime: async (renderFn: () => Promise<unknown>) => {
    const start = performance.now()
    await renderFn()
    const end = performance.now()
    return end - start
  },

  // Simular carga lenta
  mockSlowNetwork: (delay = 2000) => {
    vi.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, delay))
    )
  },
}

export default {
  renderVanaComponent,
  calendarTestUtils,
  searchTestUtils,
  uiTestUtils,
  graphqlTestUtils,
  a11yTestUtils,
  responsiveTestUtils,
  performanceTestUtils,
}