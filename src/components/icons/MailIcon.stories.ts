import type { Meta, StoryObj } from '@storybook/vue3'
import MailIcon from './MailIcon.vue'

const meta: Meta<typeof MailIcon> = {
  title: 'Icons/Mail',
  component: MailIcon,
  parameters: {
    docs: {
      description: {
        component:
          'An envelope icon used for email-related features, contact information, notifications, and communication. Essential for user profiles, contact forms, notification systems, and messaging features. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-icons',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MailIcon>

export const Default: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive floating effect.',
      },
    },
  },
}

export const NewMail: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--new" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Bouncing animation to indicate new mail or messages.',
      },
    },
  },
}

export const Sending: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--sending" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sending animation for when emails are being sent.',
      },
    },
  },
}

export const WithBounce: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon class="mail-icon--unread mail-icon--bounce" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Bounce animation for notifications. Animation plays once.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--success" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--unread" />
          <span style="font-size: 12px; color: #6b7280;">Unread</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--muted" />
          <span style="font-size: 12px; color: #6b7280;">Muted</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon class="mail-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <MailIcon class="mail-icon--success" />
          <span style="color: #15803d;">Email verification sent successfully</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
          <MailIcon class="mail-icon--new" />
          <span style="color: #92400e;">You have 3 new messages</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <MailIcon class="mail-icon--error" />
          <span style="color: #dc2626;">Failed to send email. Please try again.</span>
        </div>
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
          <MailIcon class="mail-icon--interactive" />
          <span>Send Email</span>
        </button>
        <div style="display: flex; align-items: center; gap: 8px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <MailIcon class="mail-icon--sending" />
          <span>Sending invitation...</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Contact Information</h4>
          <div style="display: flex; align-items: center; gap: 8px;">
            <MailIcon class="mail-icon--small mail-icon--primary" />
            <span style="font-size: 14px;">support@vana-calendar.com</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <MailIcon class="mail-icon--small mail-icon--secondary" />
            <span style="font-size: 14px;">marketing@vana-calendar.com</span>
          </div>
        </div>
        <div style="position: relative; display: inline-block; width: fit-content;">
          <button style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer;">
            <MailIcon class="mail-icon--secondary" />
            <span>Inbox</span>
          </button>
          <span style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 12px; min-width: 16px; text-align: center;">5</span>
        </div>
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Contact Us</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-weight: 500; font-size: 14px;">Email Address</label>
            <div style="position: relative;">
              <MailIcon class="mail-icon--small mail-icon--muted" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%);" />
              <input 
                type="email" 
                style="width: 100%; padding: 8px 8px 8px 32px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </form>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of MailIcon usage in common email and communication UI patterns like notifications, contact forms, inbox indicators, and status messages.',
      },
    },
  },
}
