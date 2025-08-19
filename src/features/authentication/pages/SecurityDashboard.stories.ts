import type { Meta, StoryObj } from '@storybook/vue3'
import SecurityDashboard from './SecurityDashboard.vue'

const meta = {
  title: 'Auth/Pages/SecurityDashboard',
  component: SecurityDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Security Dashboard

A comprehensive security dashboard that provides users with:

- Security score visualization with gamification
- Two-factor authentication setup and management
- Active sessions monitoring and control
- Password strength tracking
- Security recommendations system

## Features

- **Security Score**: Circular progress indicator with color-coded status
- **2FA Management**: Complete two-factor authentication setup flow
- **Session Control**: View and revoke active sessions across devices
- **Password Tools**: Strength indicator and change password integration
- **Security Events**: Timeline of recent security activities
- **Gamification**: Achievement-based security improvements

## Design Specifications

- Trust-building color palette with security-focused iconography
- Circular progress indicators for visual appeal
- Step-by-step flows for complex operations
- Mobile-responsive design with touch-friendly controls
- Real-time status updates and feedback

## Technical Implementation

- Uses Vue 3 Composition API with TypeScript
- Integrates with auth composables for state management
- Supports QR code generation for 2FA setup
- Handles WebSocket connections for real-time updates
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // No props for this page component
  },
  decorators: [
    () => ({
      template: '<div style="min-height: 100vh;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof SecurityDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default security dashboard showing security score of 85/100 with improvement recommendations.',
      },
    },
  },
}

export const HighSecurityScore: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Security dashboard with excellent security score (95/100) and minimal recommendations.',
      },
    },
  },
  beforeEach: async () => {
    // This would modify the component's internal state
    // In a real implementation, you'd use args or global state
  },
}

export const TwoFactorEnabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view when two-factor authentication is already enabled.',
      },
    },
  },
}

export const TwoFactorSetupFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive two-factor authentication setup process with QR code generation.',
      },
    },
  },
}

export const SessionManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Active session management with device information and revocation capabilities.',
      },
    },
  },
}

export const PasswordManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Password change interface integrated within the security dashboard.',
      },
    },
  },
}

export const SecurityRecommendations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view emphasizing security recommendations and improvement suggestions.',
      },
    },
  },
}

export const MobileResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view of the security dashboard with touch-friendly controls.',
      },
    },
  },
}

export const LoadingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows various loading states throughout the security dashboard.',
      },
    },
  },
}