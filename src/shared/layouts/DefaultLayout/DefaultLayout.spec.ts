import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import DefaultLayout from '@/shared/layouts/DefaultLayout/DefaultLayout.vue'
import { Auth0ClientKey } from '@/features/authentication/composables/useAuth'
import { vi } from 'vitest'

// Mock the auth composable to avoid Auth0 injection issues
vi.mock('@/features/authentication/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: { value: false },
    isPremium: vi.fn().mockReturnValue(false),
    isAdmin: vi.fn().mockReturnValue(false),
    getUserDisplayName: vi.fn().mockReturnValue('Test User'),
    getUserAvatar: vi.fn().mockReturnValue(null),
    getUserRoles: vi.fn().mockReturnValue([]),
    getUserPermissions: vi.fn().mockReturnValue([]),
    getUserMetadata: vi.fn().mockReturnValue({}),
    hasRole: vi.fn().mockReturnValue(false),
    hasPermission: vi.fn().mockReturnValue(false),
    hasAnyRole: vi.fn().mockReturnValue(false),
    hasAnyPermission: vi.fn().mockReturnValue(false),
    logout: vi.fn(),
    user: { value: null },
    isLoading: { value: false },
    error: { value: null },
  })),
  Auth0ClientKey: Symbol('Auth0Client'),
}))

describe('DefaultLayout.vue', () => {
  it('renders layout with header and sidebar', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/about', component: { template: '<div>About</div>' } }
      ],
    })

    const mockAuth0Client = {
      isAuthenticated: { value: false },
      isLoading: { value: false },
      user: { value: null },
      error: { value: null },
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
      getAccessTokenSilently: vi.fn(),
    }

    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [router],
        provide: {
          [Auth0ClientKey]: mockAuth0Client,
        },
        stubs: {
          'router-view': true,
          'router-link': true,
        },
      },
    })

    expect(wrapper.find('.header-bar').exists()).toBe(true)
    expect(wrapper.find('.sidebar-menu').exists()).toBe(true)
    expect(wrapper.find('.default-layout__main').exists()).toBe(true)
  })
})
