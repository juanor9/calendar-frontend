import type { Meta, StoryObj } from '@storybook/vue3'
import SecurityDashboardCard from './SecurityDashboardCard.vue'

const meta: Meta<typeof SecurityDashboardCard> = {
  title: 'Auth/Components/SecurityDashboardCard',
  component: SecurityDashboardCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Security dashboard visualization component for F001 authentication flow. Displays security score, metrics, and actionable recommendations to help users improve their account security.',
      },
    },
  },
  argTypes: {
    passwordLastChanged: {
      control: 'date',
      description: 'Date when password was last changed',
    },
    twoFactorEnabled: {
      control: 'boolean',
      description: 'Whether two-factor authentication is enabled',
    },
    lastLoginDate: {
      control: 'date',
      description: 'Date of last successful login',
    },
    loginAttempts: {
      control: 'number',
      description: 'Number of recent failed login attempts',
    },
    suspiciousActivity: {
      control: 'boolean',
      description: 'Whether suspicious activity has been detected',
    },
    sessionCount: {
      control: 'number',
      description: 'Number of active sessions',
    },
    dataDownloads: {
      control: 'number',
      description: 'Number of recent data downloads',
    },
    accountAge: {
      control: 'number',
      description: 'Account age in days',
    },
    emailVerified: {
      control: 'boolean',
      description: 'Whether email is verified',
    },
    phoneVerified: {
      control: 'boolean',
      description: 'Whether phone number is verified',
    },
    showActions: {
      control: 'boolean',
      description: 'Show recommended actions section',
    },
    compact: {
      control: 'boolean',
      description: 'Use compact layout with minimal details',
    },
    'onEnable-2fa': {
      action: 'enable-2fa',
      description: 'Emitted when user wants to enable 2FA',
    },
    'onChange-password': {
      action: 'change-password',
      description: 'Emitted when user wants to change password',
    },
    'onReview-sessions': {
      action: 'review-sessions',
      description: 'Emitted when user wants to review active sessions',
    },
    'onView-activity': {
      action: 'view-activity',
      description: 'Emitted when user wants to view security activity',
    },
    'onUpdate-recovery': {
      action: 'update-recovery',
      description: 'Emitted when user wants to update recovery options',
    },
    'onExport-data': {
      action: 'export-data',
      description: 'Emitted when user wants to export their data',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SecurityDashboardCard>

// Excellent security (high score)
export const ExcellentSecurity: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    twoFactorEnabled: true,
    lastLoginDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    loginAttempts: 0,
    suspiciousActivity: false,
    sessionCount: 2,
    dataDownloads: 0,
    accountAge: 365,
    emailVerified: true,
    phoneVerified: true,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Excellent security status - all security measures enabled and up to date',
      },
    },
  },
}

// Good security (needs minor improvements)
export const GoodSecurity: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    twoFactorEnabled: true,
    lastLoginDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    loginAttempts: 1,
    suspiciousActivity: false,
    sessionCount: 3,
    dataDownloads: 1,
    accountAge: 180,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Good security status - mostly secure but with some recommendations',
      },
    },
  },
}

// Fair security (needs attention)
export const FairSecurity: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    twoFactorEnabled: false,
    lastLoginDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    loginAttempts: 2,
    suspiciousActivity: false,
    sessionCount: 1,
    dataDownloads: 0,
    accountAge: 90,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fair security status - several areas need improvement',
      },
    },
  },
}

// Poor security (critical issues)
export const PoorSecurity: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 300 days ago
    twoFactorEnabled: false,
    lastLoginDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    loginAttempts: 5,
    suspiciousActivity: true,
    sessionCount: 4,
    dataDownloads: 3,
    accountAge: 30,
    emailVerified: false,
    phoneVerified: false,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Poor security status - multiple critical issues requiring immediate attention',
      },
    },
  },
}

// New account (minimal data)
export const NewAccount: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    twoFactorEnabled: false,
    lastLoginDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    loginAttempts: 0,
    suspiciousActivity: false,
    sessionCount: 1,
    dataDownloads: 0,
    accountAge: 1,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'New account with basic security setup - shows onboarding recommendations',
      },
    },
  },
}

// Compact mode
export const CompactMode: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    twoFactorEnabled: true,
    lastLoginDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    loginAttempts: 1,
    suspiciousActivity: false,
    sessionCount: 2,
    dataDownloads: 0,
    accountAge: 120,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout with condensed information and stats summary',
      },
    },
  },
}

// No actions shown
export const WithoutActions: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    twoFactorEnabled: false,
    lastLoginDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    loginAttempts: 0,
    suspiciousActivity: false,
    sessionCount: 1,
    dataDownloads: 0,
    accountAge: 60,
    emailVerified: true,
    phoneVerified: false,
    showActions: false,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard without recommended actions section - view-only mode',
      },
    },
  },
}

// Security alert scenario
export const SecurityAlert: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    twoFactorEnabled: true,
    lastLoginDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    loginAttempts: 8,
    suspiciousActivity: true,
    sessionCount: 5,
    dataDownloads: 2,
    accountAge: 200,
    emailVerified: true,
    phoneVerified: true,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Security alert scenario with suspicious activity and multiple failed login attempts',
      },
    },
  },
}

// Interactive demo with all actions
export const InteractiveDemo: Story = {
  args: {
    passwordLastChanged: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    twoFactorEnabled: false,
    lastLoginDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    loginAttempts: 2,
    suspiciousActivity: false,
    sessionCount: 2,
    dataDownloads: 1,
    accountAge: 150,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - click on action buttons to see event handling',
      },
    },
  },
}

// Security score progression
export const SecurityScoreComparison: Story = {
  render: () => ({
    components: { SecurityDashboardCard },
    template: `
      <div style="display: grid; gap: 24px; max-width: 1200px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Poor Security (Score: ~25)</h4>
            <SecurityDashboardCard
              :passwordLastChanged="new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)"
              :twoFactorEnabled="false"
              :lastLoginDate="new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)"
              :loginAttempts="5"
              :suspiciousActivity="true"
              :emailVerified="false"
              :phoneVerified="false"
              :showActions="false"
              :compact="true"
            />
          </div>
          
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Fair Security (Score: ~55)</h4>
            <SecurityDashboardCard
              :passwordLastChanged="new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)"
              :twoFactorEnabled="false"
              :lastLoginDate="new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)"
              :loginAttempts="1"
              :suspiciousActivity="false"
              :emailVerified="true"
              :phoneVerified="false"
              :showActions="false"
              :compact="true"
            />
          </div>
          
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Good Security (Score: ~75)</h4>
            <SecurityDashboardCard
              :passwordLastChanged="new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)"
              :twoFactorEnabled="true"
              :lastLoginDate="new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)"
              :loginAttempts="0"
              :suspiciousActivity="false"
              :emailVerified="true"
              :phoneVerified="false"
              :showActions="false"
              :compact="true"
            />
          </div>
          
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Excellent Security (Score: ~95)</h4>
            <SecurityDashboardCard
              :passwordLastChanged="new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)"
              :twoFactorEnabled="true"
              :lastLoginDate="new Date(Date.now() - 2 * 60 * 60 * 1000)"
              :loginAttempts="0"
              :suspiciousActivity="false"
              :emailVerified="true"
              :phoneVerified="true"
              :showActions="false"
              :compact="true"
            />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of security scores across different security postures',
      },
    },
  },
}
