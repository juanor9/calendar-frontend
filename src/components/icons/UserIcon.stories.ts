import type { Meta, StoryObj } from '@storybook/vue3'
import UserIcon from './UserIcon.vue'

const meta = {
  title: 'Icons/UserIcon',
  component: UserIcon,
  parameters: {
    docs: {
      description: {
        component: `
# User Icon

A user profile icon representing individual users, accounts, or personal information.

## Usage

This icon is commonly used for:
- Profile sections and user account areas
- User avatar placeholders
- Account settings and preferences
- Personal information forms
- User-related navigation items

## Design

Based on Heroicons user design featuring:
- Simple human silhouette with head and shoulders
- Consistent stroke weight (1.5px)
- Round line caps for friendly appearance
- Scalable SVG format for all sizes

## Accessibility

- Uses currentColor for automatic color inheritance
- Scales with font size
- Screen reader friendly when properly labeled
- Works well in high contrast modes
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // No props - icon inherits size and color from parent
  },
} satisfies Meta<typeof UserIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default user icon at standard size.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div style="font-size: 14px; color: #6b7280; text-align: center;">
          <UserIcon />
          <div style="margin-top: 0.25rem; font-size: 10px;">Small</div>
        </div>
        <div style="font-size: 20px; color: #374151; text-align: center;">
          <UserIcon />
          <div style="margin-top: 0.25rem; font-size: 10px;">Medium</div>
        </div>
        <div style="font-size: 28px; color: #111827; text-align: center;">
          <UserIcon />
          <div style="margin-top: 0.25rem; font-size: 10px;">Large</div>
        </div>
        <div style="font-size: 40px; color: #000; text-align: center;">
          <UserIcon />
          <div style="margin-top: 0.25rem; font-size: 10px;">XL</div>
        </div>
      </div>
    `,
    components: { UserIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'User icon in various sizes, inheriting size from parent font-size.',
      },
    },
  },
}

export const ProfileContexts: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 500px;">
        <!-- Profile Header -->
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: #f9fafb;">
          <div style="width: 60px; height: 60px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">
            <UserIcon />
          </div>
          <div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">John Doe</h3>
            <p style="margin: 0.25rem 0 0; color: #6b7280; font-size: 14px;">john.doe@example.com</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
          <button style="display: flex; align-items: center; gap: 0.5rem; padding: 1rem; border: none; background: none; color: #6366f1; border-bottom: 2px solid #6366f1; cursor: pointer;">
            <UserIcon style="font-size: 16px;" />
            Profile
          </button>
          <button style="display: flex; align-items: center; gap: 0.5rem; padding: 1rem; border: none; background: none; color: #6b7280; border-bottom: 2px solid transparent; cursor: pointer;">
            Security
          </button>
          <button style="display: flex; align-items: center; gap: 0.5rem; padding: 1rem; border: none; background: none; color: #6b7280; border-bottom: 2px solid transparent; cursor: pointer;">
            Privacy
          </button>
        </div>

        <!-- User List Item -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.375rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
              <UserIcon />
            </div>
            <div>
              <div style="font-weight: 500; color: #111827;">Sarah Chen</div>
              <div style="font-size: 14px; color: #6b7280;">Administrator</div>
            </div>
          </div>
          <span style="padding: 0.25rem 0.75rem; background: #10b981; color: white; border-radius: 9999px; font-size: 12px; font-weight: 500;">Active</span>
        </div>
      </div>
    `,
    components: { UserIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'User icon in realistic profile and user interface contexts.',
      },
    },
  },
}

export const AvatarPlaceholders: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem;">
        <div style="width: 32px; height: 32px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
          <UserIcon />
        </div>
        <div style="width: 48px; height: 48px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
          <UserIcon />
        </div>
        <div style="width: 64px; height: 64px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">
          <UserIcon />
        </div>
        <div style="width: 80px; height: 80px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px;">
          <UserIcon />
        </div>
      </div>
    `,
    components: { UserIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'User icon used as avatar placeholders in different sizes and colors.',
      },
    },
  },
}

export const FormLabels: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            <UserIcon style="font-size: 14px;" />
            Full Name
          </label>
          <input type="text" placeholder="Enter your full name" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 14px;" />
        </div>
        
        <div>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            <UserIcon style="font-size: 14px;" />
            Username
          </label>
          <input type="text" placeholder="Choose a username" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 14px;" />
        </div>

        <div>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            <UserIcon style="font-size: 14px;" />
            Display Name
          </label>
          <input type="text" placeholder="How should we display your name?" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 14px;" />
        </div>
      </div>
    `,
    components: { UserIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'User icon used in form labels for user-related input fields.',
      },
    },
  },
}