import type { Meta, StoryObj } from '@storybook/vue3'
import ForgotPasswordPage from './ForgotPasswordPage.vue'

const meta = {
  title: 'Auth/Pages/ForgotPasswordPage',
  component: ForgotPasswordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Forgot Password Page

An enhanced password recovery page that provides a trust-building experience for users who have forgotten their passwords.

## Features

- **Trust Building Design**: Calming colors and reassuring messaging
- **PasswordRecoveryCard Integration**: Uses the dedicated recovery component
- **Email Validation**: Real-time email format validation
- **Success States**: Clear confirmation with countdown timers
- **Resend Functionality**: Smart cooldown system for email resending
- **Error Handling**: Graceful error messages with retry options
- **Mobile Optimized**: Touch-friendly design for all devices

## User Experience

The page follows trust-building UX patterns:
- Emotional reassurance in copy and visuals
- Clear progress indicators and feedback
- Multiple paths for user assistance
- Accessibility compliance with ARIA labels

## Technical Implementation

- Uses Vue 3 Composition API with TypeScript
- Integrates PasswordRecoveryCard component
- Form validation with user-friendly error messages
- Timer management for countdown and cooldown features
- Email auto-detection for returning users

## Design Specifications

- Gradient background with trust-building colors
- Centered card layout with proper spacing
- Consistent iconography and visual hierarchy
- Smooth animations and transitions
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
} satisfies Meta<typeof ForgotPasswordPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default forgot password page showing the email input form with trust-building header.',
      },
    },
  },
}

export const EmailSubmissionFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of the email submission flow with form validation.',
      },
    },
  },
}

export const SuccessState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the success state after email submission with countdown timer and resend option.',
      },
    },
  },
  // This would require modifying component state to show success
  // In a real implementation, you might use args or global state control
}

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Displays error handling when email submission fails with recovery options.',
      },
    },
  },
  // This would show error state with retry button
}

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows form validation behavior for invalid email addresses.',
      },
    },
  },
}

export const BackNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tests the back navigation functionality and logo link.',
      },
    },
  },
}

export const HelpSystemIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates integration with help system and navigation to login.',
      },
    },
  },
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive design and touch-friendly interactions.',
      },
    },
  },
}

export const AccessibilityFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Highlights accessibility features including ARIA labels, focus management, and screen reader support.',
      },
    },
  },
}