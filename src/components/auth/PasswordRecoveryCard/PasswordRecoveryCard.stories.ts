import type { Meta, StoryObj } from '@storybook/vue3'
import PasswordRecoveryCard from './PasswordRecoveryCard.vue'

const meta: Meta<typeof PasswordRecoveryCard> = {
  title: 'Auth/Components/PasswordRecoveryCard',
  component: PasswordRecoveryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password recovery form component for F001 authentication flow. Provides email-based password reset functionality with validation and loading states.',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables form',
    },
    title: {
      control: 'text',
      description: 'Main heading text',
    },
    subtitle: {
      control: 'text',
      description: 'Descriptive text below title',
    },
    emailPlaceholder: {
      control: 'text',
      description: 'Email input placeholder text',
    },
    buttonText: {
      control: 'text',
      description: 'Submit button label',
    },
    backText: {
      control: 'text',
      description: 'Back button label',
    },
    showBackButton: {
      control: 'boolean',
      description: 'Show/hide the back to login button',
    },
    onSubmit: {
      action: 'submit',
      description: 'Emitted when form is submitted with valid email',
    },
    onBack: {
      action: 'back',
      description: 'Emitted when back button is clicked',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PasswordRecoveryCard>

// Default state
export const Default: Story = {
  args: {
    loading: false,
    title: 'Reset your password',
    subtitle: "Enter your email address and we'll send you a link to reset your password.",
    emailPlaceholder: 'Enter your email address',
    buttonText: 'Send reset link',
    backText: 'Back to login',
    showBackButton: true,
  },
}

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while processing password reset request',
      },
    },
  },
}

// Custom content
export const CustomContent: Story = {
  args: {
    loading: false,
    title: 'Forgot your password?',
    subtitle: "No worries! Just enter your email and we'll help you get back into your account.",
    emailPlaceholder: 'Your email address',
    buttonText: 'Get reset link',
    backText: '← Return to sign in',
    showBackButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom messaging and labels for different use cases',
      },
    },
  },
}

// Without back button
export const WithoutBackButton: Story = {
  args: {
    ...Default.args,
    showBackButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Recovery card without back navigation button',
      },
    },
  },
}

// Minimal content
export const Minimal: Story = {
  args: {
    loading: false,
    title: 'Reset Password',
    subtitle: 'Enter your email to continue.',
    emailPlaceholder: 'Email',
    buttonText: 'Send',
    backText: 'Back',
    showBackButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal version with shorter text content',
      },
    },
  },
}

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - try entering different email formats to see validation',
      },
    },
  },
  play: async () => {
    // Demo can be interacted with in Storybook
  },
}

// Error state simulation (for documentation)
export const ValidationDemo: Story = {
  args: {
    ...Default.args,
    title: 'Password Recovery - Validation Demo',
    subtitle:
      'This story demonstrates the email validation. Try entering invalid emails to see error states.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates email validation behavior. The component will show error messages for invalid email formats.',
      },
    },
  },
}
