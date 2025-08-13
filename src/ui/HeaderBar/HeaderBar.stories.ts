import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HeaderBar from './HeaderBar.vue'

const meta: Meta<typeof HeaderBar> = {
  title: 'UI/Navigation/Header Bar',
  component: HeaderBar,
  parameters: {
    docs: {
      description: {
        component:
          'Main navigation header component with responsive design, authentication states, and mobile menu support. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-navigation',
    },
  },
  argTypes: {
    sticky: {
      control: 'boolean',
      description: 'Makes the header sticky at the top of the viewport',
    },
    showMobileMenu: {
      control: 'boolean',
      description: 'Shows mobile menu toggle on smaller screens',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HeaderBar>

// Mock auth composable for Storybook (unused in current stories but available for future use)
// const mockUseAuth = () => ({
//   isAuthenticated: ref(false),
//   isPremium: () => false,
//   isAdmin: () => false,
//   user: ref(null),
// })

export const Unauthenticated: Story = {
  args: {
    sticky: true,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      // Mock the auth composable to show unauthenticated state
      return { args }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="height: 200vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Page Content</h1>
          <p>Scroll down to see the sticky header behavior (if enabled).</p>
          <p>This header shows the unauthenticated state with login button.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar in unauthenticated state showing public navigation and login button.',
      },
    },
  },
}

export const Authenticated: Story = {
  args: {
    sticky: true,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      // Mock authenticated state
      const mockAuth = {
        isAuthenticated: ref(true),
        isPremium: () => false,
        isAdmin: () => false,
        user: ref({
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: null,
        }),
      }

      return { args, mockAuth }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="height: 200vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Dashboard</h1>
          <p>This header shows the authenticated state with user profile dropdown.</p>
          <p>Navigation includes Calendar, Tasks, and other authenticated sections.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar in authenticated state showing user navigation and profile dropdown.',
      },
    },
  },
}

export const AuthenticatedPremium: Story = {
  args: {
    sticky: true,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      // Mock premium user state
      const mockAuth = {
        isAuthenticated: ref(true),
        isPremium: () => true,
        isAdmin: () => false,
        user: ref({
          name: 'Sarah Premium',
          email: 'sarah@company.com',
          avatar: null,
          plan: 'premium',
        }),
      }

      return { args, mockAuth }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="height: 200vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Premium Dashboard</h1>
          <p>This header shows the premium user state with additional Premium navigation item.</p>
          <p>Premium users have access to additional features and sections.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar for premium users showing additional Premium navigation item.',
      },
    },
  },
}

export const AuthenticatedAdmin: Story = {
  args: {
    sticky: true,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      // Mock admin user state
      const mockAuth = {
        isAuthenticated: ref(true),
        isPremium: () => true,
        isAdmin: () => true,
        user: ref({
          name: 'Admin User',
          email: 'admin@vana.com',
          avatar: null,
          role: 'admin',
        }),
      }

      return { args, mockAuth }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="height: 200vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Admin Dashboard</h1>
          <p>This header shows the admin user state with all navigation items including Admin section.</p>
          <p>Admin users have access to system administration features.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar for admin users showing all navigation items including Admin section.',
      },
    },
  },
}

export const NonSticky: Story = {
  args: {
    sticky: false,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      return { args }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="height: 200vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Non-Sticky Header</h1>
          <p>This header is not sticky and will scroll away with the page content.</p>
          <p>Scroll down to see it disappear from view.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar without sticky positioning that scrolls with page content.',
      },
    },
  },
}

export const MobileResponsive: Story = {
  args: {
    sticky: true,
    showMobileMenu: true,
  },
  render: args => ({
    components: { HeaderBar },
    setup() {
      return { args }
    },
    template: `
      <div>
        <HeaderBar v-bind="args" />
        <div style="padding: 20px;">
          <h1>Mobile View</h1>
          <p>On mobile devices, navigation items are hidden and replaced with a hamburger menu.</p>
          <p>Click the menu button to see the mobile navigation overlay.</p>
          <p>The brand text may also be hidden on very small screens to save space.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header bar optimized for mobile devices with collapsible navigation menu.',
      },
    },
  },
}

export const BrandingVariations: Story = {
  render: () => ({
    components: { HeaderBar },
    template: `
      <div style="display: flex; flex-direction: column; gap: 0;">
        <!-- Default Header -->
        <HeaderBar />
        
        <!-- Spacer -->
        <div style="height: 80px; background: #f9fafb; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0; color: #6b7280;">Example with different content below</h3>
        </div>
        
        <!-- Different context -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center; color: white;">
            <h2 style="margin: 0 0 8px 0;">Vana Calendar</h2>
            <p style="margin: 0; opacity: 0.9;">Smart scheduling for productive teams</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header bar with different background contexts to show branding consistency.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  render: () => ({
    components: { HeaderBar },
    setup() {
      const authState = ref('unauthenticated')
      const isSticky = ref(true)

      const toggleAuthState = () => {
        const states = ['unauthenticated', 'authenticated', 'premium', 'admin']
        const currentIndex = states.indexOf(authState.value)
        const nextIndex = (currentIndex + 1) % states.length
        authState.value = states[nextIndex]
      }

      const getAuthStateDisplay = () => {
        switch (authState.value) {
          case 'unauthenticated':
            return 'Unauthenticated User'
          case 'authenticated':
            return 'Basic User'
          case 'premium':
            return 'Premium User'
          case 'admin':
            return 'Admin User'
          default:
            return 'Unknown State'
        }
      }

      return {
        authState,
        isSticky,
        toggleAuthState,
        getAuthStateDisplay,
      }
    },
    template: `
      <div>
        <HeaderBar :sticky="isSticky" />
        
        <div style="padding: 20px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
          <h2>Interactive Header Demo</h2>
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <button 
              @click="toggleAuthState" 
              style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
            >
              Toggle Auth State: {{ getAuthStateDisplay() }}
            </button>
            
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" v-model="isSticky" />
              Sticky Header
            </label>
          </div>
        </div>
        
        <div style="height: 150vh; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
          <h1>Interactive Content</h1>
          <p>Use the controls above to test different header states and behaviors.</p>
          <p>Current state: <strong>{{ getAuthStateDisplay() }}</strong></p>
          <p>Sticky: <strong>{{ isSticky ? 'Enabled' : 'Disabled' }}</strong></p>
          <p>Scroll down to test sticky behavior when enabled.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo allowing you to test different authentication states and sticky behavior.',
      },
    },
  },
}
