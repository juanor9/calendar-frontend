import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import LogoutButton from './LogoutButton.vue'

const meta: Meta<typeof LogoutButton> = {
  title: 'Auth/Logout Button',
  component: LogoutButton,
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive logout button component with Auth0 integration, confirmation modal, loading states, error handling, and multiple visual variants. Features smooth animations, accessibility support, and optional confirmation dialog following the Vana design system.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-auth-components',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    text: {
      control: { type: 'text' },
      description: 'Custom button text',
    },
    returnToUrl: {
      control: { type: 'text' },
      description: 'URL to redirect to after logout',
    },
    showConfirmation: {
      control: { type: 'boolean' },
      description: 'Whether to show confirmation modal before logout',
    },
    showError: {
      control: { type: 'boolean' },
      description: 'Whether to show error messages',
    },
  },
}

export default meta
type Story = StoryObj<typeof LogoutButton>

export const Default: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton />`,
  }),
}

export const Primary: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton variant="primary" />`,
  }),
}

export const Secondary: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton variant="secondary" />`,
  }),
}

export const Outline: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton variant="outline" />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton size="small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton size="large" />`,
  }),
}

export const CustomText: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton text="Sign Out" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Logout button with custom text instead of default Spanish text.',
      },
    },
  },
}

export const WithConfirmation: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `<LogoutButton :show-confirmation="true" text="Logout with Confirmation" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Logout button that shows a confirmation modal before logging out. Click to see the modal.',
      },
    },
  },
}

export const LoadingState: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <LogoutButton text="Signing Out..." style="pointer-events: none; opacity: 0.8;" />
        <p style="font-size: 14px; color: #6b7280;">Simulated loading state with spinner animation</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Logout button in loading state with spinner animation and disabled interaction.',
      },
    },
  },
}

export const ErrorState: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <LogoutButton />
        <div class="logout-button__error" role="alert" aria-live="polite" style="margin-top: 16px; padding: 16px 20px; background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; border-radius: 8px; color: #dc2626; font-size: 14px; font-weight: 500; line-height: 1.4; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 16px; flex-shrink: 0; margin-top: 1px;">⚠️</span>
          Error al cerrar sesión. Por favor, inténtalo de nuevo.
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Logout button with error message display showing session termination errors.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton variant="primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton variant="secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton variant="outline" />
          <span style="font-size: 12px; color: #6b7280;">Outline</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton variant="ghost" />
          <span style="font-size: 12px; color: #6b7280;">Ghost (Default)</span>
        </div>
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton size="small" />
          <span style="font-size: 12px; color: #6b7280;">Small</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton size="medium" />
          <span style="font-size: 12px; color: #6b7280;">Medium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LogoutButton size="large" />
          <span style="font-size: 12px; color: #6b7280;">Large</span>
        </div>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { LogoutButton },
    setup() {
      const clickCount = ref(0)

      const handleLogout = () => {
        clickCount.value++
      }

      return { clickCount, handleLogout }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: start;">
        <LogoutButton @logoutStart="handleLogout" />
        <p style="font-size: 14px; color: #6b7280;">
          Click count: {{ clickCount }}
        </p>
        <p style="font-size: 12px; color: #9ca3af; max-width: 300px;">
          Click to test logout interaction events. Hover to see button effects.
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive logout button demonstrating hover effects, click handling, and event emission.',
      },
    },
  },
}

export const ConfirmationFlow: Story = {
  render: () => ({
    components: { LogoutButton },
    setup() {
      const showingConfirmation = ref(false)
      const logoutAttempts = ref(0)

      const handleLogoutStart = () => {
        showingConfirmation.value = true
        logoutAttempts.value++
      }

      const handleLogoutSuccess = () => {
        showingConfirmation.value = false
      }

      return { showingConfirmation, logoutAttempts, handleLogoutStart, handleLogoutSuccess }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: start;">
        <LogoutButton 
          :show-confirmation="true" 
          variant="outline"
          @logoutStart="handleLogoutStart"
          @logoutSuccess="handleLogoutSuccess"
        />
        <div style="font-size: 14px; color: #6b7280;">
          <div>Logout attempts: {{ logoutAttempts }}</div>
          <div>Showing confirmation: {{ showingConfirmation ? 'Yes' : 'No' }}</div>
        </div>
        <p style="font-size: 12px; color: #9ca3af; max-width: 300px;">
          Click the button to see the confirmation modal in action. The modal will appear before logout.
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Logout button with confirmation dialog showing the full interaction flow.',
      },
    },
  },
}

export const InNavigation: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Top Navigation Bar -->
        <nav style="display: flex; justify-content: between; align-items: center; padding: 12px 20px; background: white; border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
            <div style="font-size: 20px; font-weight: 700; color: #6366f1;">Vana</div>
            <div style="display: flex; gap: 16px;">
              <a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">Dashboard</a>
              <a href="#" style="color: #374151; text-decoration: none; font-weight: 500;">Calendar</a>
              <a href="#" style="color: #6b7280; text-decoration: none; font-weight: 500;">Settings</a>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
              <div style="width: 32px; height: 32px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">U</div>
              <span style="font-weight: 500; color: #374151;">Usuario</span>
            </div>
            <LogoutButton size="small" />
          </div>
        </nav>

        <!-- Sidebar Navigation -->
        <div style="display: flex; max-width: 800px; height: 400px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <aside style="width: 250px; background: #f9fafb; padding: 20px; border-right: 1px solid #e5e7eb;">
            <div style="margin-bottom: 24px;">
              <div style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 8px;">Vana Dashboard</div>
              <div style="font-size: 14px; color: #6b7280;">usuario@ejemplo.com</div>
            </div>
            
            <nav style="margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px;">Main</div>
              <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px;">
                <li><a href="#" style="display: block; padding: 8px 12px; color: #6366f1; background: #ede9fe; border-radius: 6px; text-decoration: none; font-weight: 500;">📊 Dashboard</a></li>
                <li><a href="#" style="display: block; padding: 8px 12px; color: #374151; hover:background: #f3f4f6; border-radius: 6px; text-decoration: none;">📅 Calendar</a></li>
                <li><a href="#" style="display: block; padding: 8px 12px; color: #374151; hover:background: #f3f4f6; border-radius: 6px; text-decoration: none;">📈 Analytics</a></li>
              </ul>
            </nav>
            
            <div style="margin-top: auto; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <div style="margin-bottom: 12px;">
                <a href="#" style="display: block; padding: 8px 12px; color: #374151; hover:background: #f3f4f6; border-radius: 6px; text-decoration: none;">⚙️ Settings</a>
              </div>
              <LogoutButton size="small" variant="outline" style="width: 100%;" />
            </div>
          </aside>
          
          <main style="flex: 1; padding: 20px; background: white;">
            <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">Welcome to Dashboard</h1>
            <p style="margin: 0; color: #6b7280;">Your calendar and productivity tools are ready to use.</p>
          </main>
        </div>

        <!-- User Profile Dropdown -->
        <div style="position: relative; max-width: 300px;">
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6;">
              <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 16px;">U</div>
              <div>
                <div style="font-weight: 600; color: #111827;">Usuario Demo</div>
                <div style="font-size: 14px; color: #6b7280;">usuario@ejemplo.com</div>
              </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="#" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #374151; hover:background: #f9fafb; border-radius: 6px; text-decoration: none;">
                👤 Profile Settings
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #374151; hover:background: #f9fafb; border-radius: 6px; text-decoration: none;">
                🔐 Privacy & Security
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #374151; hover:background: #f9fafb; border-radius: 6px; text-decoration: none;">
                💳 Billing
              </a>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #f3f4f6;">
              <LogoutButton variant="ghost" size="small" style="width: 100%; justify-content: flex-start;" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of LogoutButton usage in common navigation contexts like top navigation bars, sidebar navigation, and user profile dropdowns.',
      },
    },
  },
}

export const InContext: Story = {
  render: () => ({
    components: { LogoutButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;">
        <!-- Settings Page Context -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827;">Account Settings</h2>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Profile Information</h3>
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Update your account details and preferences</p>
              <button style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Edit Profile</button>
            </div>
            
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Security Settings</h3>
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Manage your password and security preferences</p>
              <button style="padding: 8px 16px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; font-weight: 500; cursor: pointer;">Change Password</button>
            </div>
            
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 8px 0;">
            
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #dc2626;">Danger Zone</h3>
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">These actions are irreversible. Please proceed with caution.</p>
              <div style="display: flex; gap: 12px; align-items: center;">
                <LogoutButton :show-confirmation="true" variant="outline" />
                <button style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Delete Account</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Management Context -->
        <div style="padding: 20px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <span style="font-size: 20px;">⏰</span>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #92400e;">Session Timeout Warning</h3>
              <p style="margin: 0 0 16px 0; color: #92400e; font-size: 14px; line-height: 1.4;">
                Your session will expire in 5 minutes due to inactivity. You can extend your session or logout now.
              </p>
              <div style="display: flex; gap: 12px;">
                <button style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Extend Session</button>
                <LogoutButton variant="outline" size="small" />
              </div>
            </div>
          </div>
        </div>

        <!-- Multi-device Session Context -->
        <div style="padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 8px;">
            <span>🔒</span>
            Active Sessions
          </h3>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: white; border: 1px solid #d1fae5; border-radius: 6px;">
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #065f46;">Current Session - Chrome on Windows</div>
                <div style="font-size: 14px; color: #047857;">Last active: Now • IP: 192.168.1.100</div>
              </div>
              <span style="padding: 4px 8px; background: #059669; color: white; border-radius: 4px; font-size: 12px; font-weight: 500;">Active</span>
            </div>
            
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;">
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #374151;">Safari on iPhone</div>
                <div style="font-size: 14px; color: #6b7280;">Last active: 2 hours ago • IP: 192.168.1.101</div>
              </div>
              <button style="padding: 4px 8px; background: #dc2626; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer;">Revoke</button>
            </div>
          </div>
          
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #d1fae5; display: flex; justify-content: between; align-items: center;">
            <span style="font-size: 14px; color: #065f46;">Sign out of all devices</span>
            <LogoutButton :show-confirmation="true" text="Logout All Sessions" variant="outline" size="small" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of LogoutButton usage in realistic application contexts like account settings, session warnings, security management, and multi-device session controls.',
      },
    },
  },
}
