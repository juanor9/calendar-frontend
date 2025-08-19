import type { Meta, StoryObj } from '@storybook/vue3'
import ResetPasswordPage from './ResetPasswordPage.vue'

const meta = {
  title: 'Auth/Pages/ResetPasswordPage',
  component: ResetPasswordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Reset Password Page

A comprehensive password reset page that provides a secure and user-friendly experience for creating new passwords.

## Features

- **Token Validation**: Automatic validation of reset tokens from email links
- **PasswordStrengthIndicator**: Real-time password strength feedback
- **Dual Password Inputs**: Password and confirmation with visibility toggles
- **Success Animation**: Celebratory feedback upon successful reset
- **Error Handling**: Graceful handling of expired or invalid tokens
- **Mobile Optimization**: Touch-friendly design with proper input handling

## Password Requirements

The page enforces strong password policies:
- Minimum 8 characters
- Must contain uppercase letters
- Must contain lowercase letters  
- Must contain numbers
- Must contain special symbols
- Real-time strength calculation and feedback

## User Experience Flow

1. **Token Validation**: Automatically validates the reset link
2. **Password Creation**: Guided password creation with strength feedback
3. **Confirmation**: Password matching validation
4. **Success**: Clear confirmation and automatic redirect to login

## Technical Implementation

- Vue 3 Composition API with TypeScript
- Integrates PasswordStrengthIndicator component
- Uses BaseButton component for consistency
- Token extraction from URL parameters
- Form validation with accessibility support
- Loading states and error boundaries

## Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management
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
} satisfies Meta<typeof ResetPasswordPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default reset password page with form inputs and password strength indicator.',
      },
    },
  },
}

export const TokenValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state during token validation from the reset link.',
      },
    },
  },
}

export const InvalidToken: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error state when the reset token is invalid or expired.',
      },
    },
  },
}

export const PasswordFormInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of password input with real-time strength validation.',
      },
    },
  },
}

export const PasswordStrengthProgression: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the password strength indicator progression from weak to strong passwords.',
      },
    },
  },
}

export const PasswordVisibilityToggle: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates password visibility toggle functionality for both password fields.',
      },
    },
  },
}

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows validation error handling for password mismatches and weak passwords.',
      },
    },
  },
}

export const SuccessState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Success state after password reset with celebration animation and login redirect.',
      },
    },
  },
}

export const FormAccessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including ARIA labels, focus management, and keyboard navigation.',
      },
    },
  },
}

export const MobileExperience: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized experience with proper input sizing and touch-friendly controls.',
      },
    },
  },
}

export const LoadingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Various loading states during token validation and password reset submission.',
      },
    },
  },
}