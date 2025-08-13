import type { Meta, StoryObj } from '@storybook/vue3'
import ProfileEditCard from './ProfileEditCard.vue'

// Sample user profile data
const sampleProfile = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@example.com',
  phoneNumber: '+1 (555) 123-4567',
  timezone: 'America/Los_Angeles',
  language: 'en',
  jobTitle: 'Product Manager',
  company: 'Acme Inc.',
}

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  timezone: '',
  language: '',
  jobTitle: '',
  company: '',
}

const meta: Meta<typeof ProfileEditCard> = {
  title: 'Auth/Components/ProfileEditCard',
  component: ProfileEditCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Profile editing interface component for F001 authentication flow. Provides comprehensive user profile management with validation, real-time feedback, and responsive design.',
      },
    },
  },
  argTypes: {
    profile: {
      control: 'object',
      description: 'User profile data to edit',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state during save operation',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes all fields read-only for viewing only',
    },
    showAdvanced: {
      control: 'boolean',
      description: 'Shows advanced fields like timezone, language, job info',
    },
    title: {
      control: 'text',
      description: 'Card title text',
    },
    onSave: {
      action: 'save',
      description: 'Emitted when save button is clicked with valid data',
    },
    onCancel: {
      action: 'cancel',
      description: 'Emitted when cancel button is clicked',
    },
    'onUpdate:profile': {
      action: 'update:profile',
      description: 'Emitted when profile data changes (for v-model)',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProfileEditCard>

// Default editing state
export const Default: Story = {
  args: {
    profile: sampleProfile,
    loading: false,
    readonly: false,
    showAdvanced: false,
    title: 'Edit Profile',
  },
}

// With advanced fields
export const WithAdvancedFields: Story = {
  args: {
    profile: sampleProfile,
    loading: false,
    readonly: false,
    showAdvanced: true,
    title: 'Edit Profile',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Profile editor with advanced fields including timezone, language, job title, and company',
      },
    },
  },
}

// Loading state
export const Loading: Story = {
  args: {
    profile: sampleProfile,
    loading: true,
    readonly: false,
    showAdvanced: true,
    title: 'Edit Profile',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while saving profile changes',
      },
    },
  },
}

// Read-only mode
export const ReadOnly: Story = {
  args: {
    profile: sampleProfile,
    loading: false,
    readonly: true,
    showAdvanced: true,
    title: 'View Profile',
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode for viewing profile information without editing capabilities',
      },
    },
  },
}

// Empty profile (new user)
export const EmptyProfile: Story = {
  args: {
    profile: emptyProfile,
    loading: false,
    readonly: false,
    showAdvanced: false,
    title: 'Complete Your Profile',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty profile for new user setup - shows validation errors when required fields are empty',
      },
    },
  },
}

// Validation errors demo
export const ValidationDemo: Story = {
  args: {
    profile: {
      firstName: '',
      lastName: 'D',
      email: 'invalid-email',
      phoneNumber: '123',
      timezone: 'America/New_York',
      language: 'en',
      jobTitle: 'Developer',
      company: 'Tech Corp',
    },
    loading: false,
    readonly: false,
    showAdvanced: true,
    title: 'Edit Profile - Validation Demo',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates validation behavior with invalid data. Try modifying fields to see real-time validation feedback.',
      },
    },
  },
}

// Compact basic profile
export const BasicProfile: Story = {
  args: {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '',
      timezone: '',
      language: '',
      jobTitle: '',
      company: '',
    },
    loading: false,
    readonly: false,
    showAdvanced: false,
    title: 'Basic Profile',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic profile editor with only essential fields (name, email, phone)',
      },
    },
  },
}

// Custom title
export const CustomTitle: Story = {
  args: {
    profile: sampleProfile,
    loading: false,
    readonly: false,
    showAdvanced: true,
    title: '👤 Update Your Information',
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile editor with custom title styling',
      },
    },
  },
}

// Mobile responsive demo
export const MobileView: Story = {
  args: {
    profile: sampleProfile,
    loading: false,
    readonly: false,
    showAdvanced: true,
    title: 'Edit Profile',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile-responsive view of the profile editor - fields stack vertically and buttons go full-width',
      },
    },
  },
}

// Interactive demo
export const InteractiveDemo: Story = {
  render: () => ({
    components: { ProfileEditCard },
    data() {
      return {
        profile: { ...sampleProfile },
        loading: false,
        showAdvanced: false,
      }
    },
    methods: {
      handleSave(updatedProfile: typeof sampleProfile) {
        this.loading = true
        console.log('Saving profile:', updatedProfile)

        // Simulate API call
        setTimeout(() => {
          this.profile = { ...updatedProfile }
          this.loading = false
          alert('Profile saved successfully!')
        }, 2000)
      },

      handleCancel() {
        console.log('Profile edit cancelled')
        alert('Changes cancelled')
      },

      handleProfileUpdate(updatedProfile: typeof sampleProfile) {
        this.profile = { ...updatedProfile }
      },
    },
    template: `
      <div style="max-width: 600px;">
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input 
              type="checkbox" 
              v-model="showAdvanced"
            />
            Show advanced fields
          </label>
        </div>
        
        <ProfileEditCard
          :profile="profile"
          :loading="loading"
          :showAdvanced="showAdvanced"
          @save="handleSave"
          @cancel="handleCancel"
          @update:profile="handleProfileUpdate"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with real form behavior, validation, and simulated save operation',
      },
    },
  },
}
