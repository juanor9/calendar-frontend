import type { Meta, StoryObj } from '@storybook/vue3'
import PasswordStrengthIndicator from './PasswordStrengthIndicator.vue'

const meta: Meta<typeof PasswordStrengthIndicator> = {
  title: 'Auth/Components/PasswordStrengthIndicator',
  component: PasswordStrengthIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Password strength visualization component for F001 authentication flow. Provides real-time feedback on password quality with visual progress bar and detailed criteria checklist.',
      },
    },
  },
  argTypes: {
    password: {
      control: 'text',
      description: 'Password string to analyze for strength',
    },
    showScore: {
      control: 'boolean',
      description: 'Display strength score text (Weak, Fair, Good, Strong)',
    },
    showDetails: {
      control: 'boolean',
      description: 'Show detailed criteria checklist',
    },
    compact: {
      control: 'boolean',
      description: 'Use compact layout with condensed information',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PasswordStrengthIndicator>

// Default empty state
export const Default: Story = {
  args: {
    password: '',
    showScore: true,
    showDetails: true,
    compact: false,
  },
}

// Weak password
export const WeakPassword: Story = {
  args: {
    password: '123',
    showScore: true,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Very weak password - short length, only numbers',
      },
    },
  },
}

// Fair password
export const FairPassword: Story = {
  args: {
    password: 'password123',
    showScore: true,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fair strength password - has length and multiple character types but is common',
      },
    },
  },
}

// Good password
export const GoodPassword: Story = {
  args: {
    password: 'MyPassword123',
    showScore: true,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Good strength password - meets most criteria with mixed case and numbers',
      },
    },
  },
}

// Strong password
export const StrongPassword: Story = {
  args: {
    password: 'MySecure!Password123',
    showScore: true,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Strong password - meets all security criteria with special characters',
      },
    },
  },
}

// Progress only (no score text)
export const ProgressOnly: Story = {
  args: {
    password: 'MyPassword123',
    showScore: false,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar only without strength level text',
      },
    },
  },
}

// No details (progress and score only)
export const NoDetails: Story = {
  args: {
    password: 'MyPassword123',
    showScore: true,
    showDetails: false,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal view with just progress bar and score, no criteria details',
      },
    },
  },
}

// Compact mode
export const Compact: Story = {
  args: {
    password: 'MyPassword',
    showScore: true,
    showDetails: true,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout with condensed spacing and simplified criteria display',
      },
    },
  },
}

// Compact strong password
export const CompactStrong: Story = {
  args: {
    password: 'MySecure!Password123',
    showScore: true,
    showDetails: true,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout showing a strong password with all criteria met',
      },
    },
  },
}

// Interactive demo with different password types
export const InteractiveDemo: Story = {
  args: {
    password: 'test',
    showScore: true,
    showDetails: true,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo - modify the password to see real-time strength analysis. Try different combinations to see how each criterion affects the overall score.',
      },
    },
  },
}

// All strength levels for visual comparison
export const StrengthLevels: Story = {
  render: () => ({
    components: { PasswordStrengthIndicator },
    template: `
      <div style="display: grid; gap: 24px;">
        <div>
          <h4>Empty</h4>
          <PasswordStrengthIndicator password="" :showScore="true" :showDetails="false" />
        </div>
        <div>
          <h4>Weak (Score: ~15)</h4>
          <PasswordStrengthIndicator password="123" :showScore="true" :showDetails="false" />
        </div>
        <div>
          <h4>Fair (Score: ~45)</h4>
          <PasswordStrengthIndicator password="password" :showScore="true" :showDetails="false" />
        </div>
        <div>
          <h4>Good (Score: ~70)</h4>
          <PasswordStrengthIndicator password="MyPassword123" :showScore="true" :showDetails="false" />
        </div>
        <div>
          <h4>Strong (Score: ~100)</h4>
          <PasswordStrengthIndicator password="MySecure!Password123" :showScore="true" :showDetails="false" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all password strength levels from empty to strong',
      },
    },
  },
}

// Real-world integration example
export const IntegrationExample: Story = {
  render: () => ({
    components: { PasswordStrengthIndicator },
    data() {
      return {
        password: '',
      }
    },
    template: `
      <div style="max-width: 400px;">
        <div style="margin-bottom: 16px;">
          <label for="demo-password" style="display: block; margin-bottom: 8px; font-weight: 500;">
            New Password
          </label>
          <input
            id="demo-password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            style="width: 100%; padding: 12px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px;"
          />
        </div>
        
        <PasswordStrengthIndicator 
          :password="password" 
          :showScore="true" 
          :showDetails="true" 
          :compact="false" 
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world integration example showing the component working with a password input field',
      },
    },
  },
}
