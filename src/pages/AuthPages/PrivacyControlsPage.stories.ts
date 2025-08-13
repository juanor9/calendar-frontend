import type { Meta, StoryObj } from '@storybook/vue3'
import PrivacyControlsPage from './PrivacyControlsPage.vue'

const meta = {
  title: 'Auth/Pages/PrivacyControlsPage',
  component: PrivacyControlsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Privacy Controls Page

A comprehensive GDPR-compliant privacy controls page that allows users to:

- View their data overview with statistics
- Manage consent preferences for analytics and marketing
- Control data sharing settings for integrations
- Export their personal data
- Delete their account permanently

## Features

- **Data Overview**: Visual cards showing personal info, calendar data, and security logs
- **Privacy Controls**: Toggle switches for different types of data processing
- **GDPR Compliance**: Data export and account deletion functionality
- **Trust Building**: Clear explanations and transparent data handling
- **Mobile Responsive**: Optimized for all device sizes

## Design Specifications

- Uses trust-building color palette (Indigo primary)
- Card-based layout for better organization
- Clear visual hierarchy with proper spacing
- Accessibility compliant with ARIA attributes
- Loading states and error handling included
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
} satisfies Meta<typeof PrivacyControlsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default privacy controls page with all sections and controls.',
      },
    },
  },
}

export const WithInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating privacy toggle functionality and save operations.',
      },
    },
  },
}

export const DataExportFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the data export workflow and help system integration.',
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
        story: 'Mobile-optimized view showing responsive layout and touch-friendly controls.',
      },
    },
  },
}

export const AccountDeletionFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the account deletion confirmation workflow with safety checks.',
      },
    },
  },
}