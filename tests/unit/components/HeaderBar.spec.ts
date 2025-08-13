import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import HeaderBar from '@/ui/HeaderBar/HeaderBar.vue'

// Mock the auth composable
const mockAuth = {
  isAuthenticated: ref(false),
  isPremium: vi.fn(() => false),
  isAdmin: vi.fn(() => false),
  getUserDisplayName: vi.fn(() => 'Test User'),
  getUserAvatar: vi.fn(() => '/test-avatar.png'),
  hasRole: vi.fn(() => false),
  hasPermission: vi.fn(() => false),
  login: vi.fn(),
  logout: vi.fn(),
}

vi.mock('@/auth/auth-composable', () => ({
  useAuth: () => mockAuth,
}))

// Mock RouterLink
const RouterLinkMock = {
  template: '<a :href="to" :class="$attrs.class" :activeclass="activeClass"><slot /></a>',
  props: ['to', 'activeClass'],
}

// Mock the components at module level - must be before other declarations
vi.mock('@/components/auth/UserProfile/UserProfile.vue', () => ({
  default: {
    template: '<div class="mock-user-profile">UserProfile</div>',
    props: ['showName', 'showStatus', 'size'],
  },
}))

vi.mock('@/components/auth/LoginButton/LoginButton.vue', () => ({
  default: {
    template: '<button class="mock-login-button">{{ text }}</button>',
    props: ['variant', 'size', 'text'],
  },
}))

// Mock component references for use in tests
const UserProfileMock = {
  template: '<div class="mock-user-profile">UserProfile</div>',
  props: ['showName', 'showStatus', 'size'],
}

const LoginButtonMock = {
  template: '<button class="mock-login-button">{{ text }}</button>',
  props: ['variant', 'size', 'text'],
}

describe('HeaderBar', () => {
  const createWrapper = (props = {}) => {
    return mount(HeaderBar, {
      props,
      global: {
        components: {
          RouterLink: RouterLinkMock,
          UserProfile: UserProfileMock,
          LoginButton: LoginButtonMock,
        },
        stubs: {
          RouterLink: RouterLinkMock,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.isAuthenticated.value = false
    mockAuth.isPremium.mockReturnValue(false)
    mockAuth.isAdmin.mockReturnValue(false)
    mockAuth.getUserDisplayName.mockReturnValue('Test User')
    mockAuth.getUserAvatar.mockReturnValue('/test-avatar.png')
  })

  describe('Brand Section', () => {
    it('renders logo and brand text', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.header-bar__logo').exists()).toBe(true)
      expect(wrapper.find('.header-bar__brand-text').exists()).toBe(true)
      expect(wrapper.find('.header-bar__logo').attributes('alt')).toBe('Vana Calendar')
      expect(wrapper.find('.header-bar__brand-text').text()).toBe('Vana Calendar')
    })

    it('brand text links to home page', () => {
      const wrapper = createWrapper()

      const brandLink = wrapper.find('.header-bar__brand-text')
      expect(brandLink.attributes('href')).toBe('/')
    })
  })

  describe('Navigation - Unauthenticated User', () => {
    it('shows public navigation when user is not authenticated', () => {
      mockAuth.isAuthenticated.value = false
      const wrapper = createWrapper()

      expect(wrapper.find('.header-bar__nav-links').exists()).toBe(true)

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      expect(navLinks.length).toBe(2)

      // Check for "Inicio" and "Acerca de" links
      expect(navLinks[0].text()).toBe('Inicio')
      expect(navLinks[0].attributes('href')).toBe('/')
      expect(navLinks[1].text()).toBe('Acerca de')
      expect(navLinks[1].attributes('href')).toBe('/about')
    })

    it('shows login button when user is not authenticated', () => {
      mockAuth.isAuthenticated.value = false
      const wrapper = createWrapper()

      expect(wrapper.find('.mock-login-button').exists()).toBe(true)
      expect(wrapper.find('.mock-user-profile').exists()).toBe(false)
      expect(wrapper.find('.mock-login-button').text()).toBe('Iniciar Sesión')
    })
  })

  describe('Navigation - Authenticated User', () => {
    it('shows authenticated navigation when user is logged in', () => {
      mockAuth.isAuthenticated.value = true
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      expect(navLinks.length).toBeGreaterThanOrEqual(2)

      // Check for basic authenticated links
      expect(navLinks.some(link => link.text() === 'Calendario')).toBe(true)
      expect(navLinks.some(link => link.text() === 'Tareas')).toBe(true)

      // Check links point to correct routes
      expect(navLinks.find(link => link.text() === 'Calendario')?.attributes('href')).toBe(
        '/calendar'
      )
      expect(navLinks.find(link => link.text() === 'Tareas')?.attributes('href')).toBe('/tasks')
    })

    it('shows user profile when user is authenticated', () => {
      mockAuth.isAuthenticated.value = true
      const wrapper = createWrapper()

      expect(wrapper.find('.mock-user-profile').exists()).toBe(true)
      expect(wrapper.find('.mock-login-button').exists()).toBe(false)
    })

    it('shows premium link when user is premium', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isPremium.mockReturnValue(true)
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const premiumLink = navLinks.find(link => link.text() === 'Premium')

      expect(premiumLink).toBeTruthy()
      expect(premiumLink?.attributes('href')).toBe('/premium')
    })

    it('does not show premium link when user is not premium', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isPremium.mockReturnValue(false)
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const premiumLink = navLinks.find(link => link.text() === 'Premium')

      expect(premiumLink).toBeFalsy()
    })

    it('shows admin link when user is admin', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isAdmin.mockReturnValue(true)
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const adminLink = navLinks.find(link => link.text() === 'Admin')

      expect(adminLink).toBeTruthy()
      expect(adminLink?.attributes('href')).toBe('/admin')
    })

    it('does not show admin link when user is not admin', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isAdmin.mockReturnValue(false)
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const adminLink = navLinks.find(link => link.text() === 'Admin')

      expect(adminLink).toBeFalsy()
    })

    it('shows both premium and admin links when user has both roles', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isPremium.mockReturnValue(true)
      mockAuth.isAdmin.mockReturnValue(true)
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const premiumLink = navLinks.find(link => link.text() === 'Premium')
      const adminLink = navLinks.find(link => link.text() === 'Admin')

      expect(premiumLink).toBeTruthy()
      expect(adminLink).toBeTruthy()
    })
  })

  describe('Component Structure', () => {
    it('has correct header structure', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('header.header-bar').exists()).toBe(true)
      expect(wrapper.find('nav.header-bar__nav').exists()).toBe(true)
      expect(wrapper.find('.header-bar__brand').exists()).toBe(true)
      expect(wrapper.find('.header-bar__nav-links').exists()).toBe(true)
      expect(wrapper.find('.header-bar__user').exists()).toBe(true)
    })

    it('applies correct CSS classes to navigation links', () => {
      mockAuth.isAuthenticated.value = true
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      navLinks.forEach(link => {
        expect(link.classes()).toContain('header-bar__nav-link')
        expect(link.attributes('activeclass')).toBe('header-bar__nav-link--active')
      })
    })
  })

  describe('User Profile Component Integration', () => {
    it('passes correct props to UserProfile component', () => {
      mockAuth.isAuthenticated.value = true
      const wrapper = createWrapper()

      const userProfile = wrapper.findComponent(UserProfileMock)
      expect(userProfile.exists()).toBe(true)
      expect(userProfile.classes()).toContain('header-bar__user-profile')
    })
  })

  describe('Login Button Component Integration', () => {
    it('passes correct props to LoginButton component', () => {
      mockAuth.isAuthenticated.value = false
      const wrapper = createWrapper()

      const loginButton = wrapper.findComponent(LoginButtonMock)
      expect(loginButton.exists()).toBe(true)

      // Check if the login button is in the user section
      const userSection = wrapper.find('.header-bar__user')
      expect(userSection.find('.mock-login-button').exists()).toBe(true)
    })
  })

  describe('Auth State Reactivity', () => {
    it('reacts to authentication state changes', async () => {
      const wrapper = createWrapper()

      // Initially not authenticated
      expect(wrapper.find('.mock-login-button').exists()).toBe(true)
      expect(wrapper.find('.mock-user-profile').exists()).toBe(false)

      // Change to authenticated
      mockAuth.isAuthenticated.value = true
      await wrapper.vm.$nextTick()
      // Force component re-render to reflect auth state changes
      await wrapper.vm.$forceUpdate()

      expect(wrapper.find('.mock-login-button').exists()).toBe(false)
      expect(wrapper.find('.mock-user-profile').exists()).toBe(true)
    })

    it('reacts to role changes', async () => {
      mockAuth.isAuthenticated.value = true
      const wrapper = createWrapper()

      // Initially no admin role
      let adminLink = wrapper.findAll('.header-bar__nav-link').find(link => link.text() === 'Admin')
      expect(adminLink).toBeFalsy()

      // Add admin role
      mockAuth.isAdmin.mockReturnValue(true)
      await wrapper.vm.$forceUpdate()

      adminLink = wrapper.findAll('.header-bar__nav-link').find(link => link.text() === 'Admin')
      expect(adminLink).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has semantic header structure', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('header').exists()).toBe(true)
      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('provides alt text for logo', () => {
      const wrapper = createWrapper()

      const logo = wrapper.find('.header-bar__logo')
      expect(logo.attributes('alt')).toBe('Vana Calendar')
    })

    it('uses proper link elements for navigation', () => {
      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      navLinks.forEach(link => {
        expect(link.element.tagName.toLowerCase()).toBe('a')
        expect(link.attributes('href')).toBeTruthy()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles missing auth functions gracefully', () => {
      mockAuth.isPremium.mockImplementation(() => {
        throw new Error('isPremium failed')
      })

      expect(() => {
        createWrapper()
      }).not.toThrow()
    })

    it('renders correctly with all navigation options', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isPremium.mockReturnValue(true)
      mockAuth.isAdmin.mockReturnValue(true)

      const wrapper = createWrapper()

      const navLinks = wrapper.findAll('.header-bar__nav-link')
      const linkTexts = navLinks.map(link => link.text())

      expect(linkTexts).toContain('Calendario')
      expect(linkTexts).toContain('Tareas')
      expect(linkTexts).toContain('Premium')
      expect(linkTexts).toContain('Admin')
    })

    it('handles empty navigation state', () => {
      mockAuth.isAuthenticated.value = true
      mockAuth.isPremium.mockReturnValue(false)
      mockAuth.isAdmin.mockReturnValue(false)

      const wrapper = createWrapper()

      expect(wrapper.find('.header-bar__nav-links').exists()).toBe(true)
      expect(wrapper.findAll('.header-bar__nav-link').length).toBeGreaterThanOrEqual(2)
    })
  })
})
