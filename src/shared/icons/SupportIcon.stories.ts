import type { Meta, StoryObj } from '@storybook/vue3'
import SupportIcon from './SupportIcon.vue'

const meta: Meta<typeof SupportIcon> = {
  title: 'Icons/Support',
  component: SupportIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A signal/wave icon used for support, help, communication, and assistance features. Essential for help centers, live chat, customer support, and technical assistance interfaces. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof SupportIcon>

export const Default: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive scaling and rotation effect.',
      },
    },
  },
}

export const Available: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--active support-icon--available" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation to indicate support is available or online.',
      },
    },
  },
}

export const Pinging: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--urgent support-icon--pinging" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Ping animation for urgent support requests or notifications.',
      },
    },
  },
}

export const Connecting: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--info support-icon--connecting" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rotating animation when connecting to support or loading help resources.',
      },
    },
  },
}

export const Bounce: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `<SupportIcon class="support-icon--help support-icon--bounce" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Bounce animation for attention-grabbing support prompts. Animation plays once.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--help" />
          <span style="font-size: 12px; color: #6b7280;">Help</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--active" />
          <span style="font-size: 12px; color: #6b7280;">Active</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--urgent" />
          <span style="font-size: 12px; color: #6b7280;">Urgent</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--critical" />
          <span style="font-size: 12px; color: #6b7280;">Critical</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--muted" />
          <span style="font-size: 12px; color: #6b7280;">Muted</span>
        </div>
      </div>
    `,
  }),
}

export const SupportStates: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `
      <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #22c55e; border-radius: 8px; background: #f0fdf4;">
          <SupportIcon class="support-icon--active support-icon--large support-icon--available" />
          <span style="font-size: 14px; font-weight: 600; color: #15803d;">Online</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #3b82f6; border-radius: 8px; background: #eff6ff;">
          <SupportIcon class="support-icon--info support-icon--large support-icon--connecting" />
          <span style="font-size: 14px; font-weight: 600; color: #1d4ed8;">Connecting</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #f59e0b; border-radius: 8px; background: #fffbeb;">
          <SupportIcon class="support-icon--urgent support-icon--large support-icon--pinging" />
          <span style="font-size: 14px; font-weight: 600; color: #92400e;">Busy</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #6b7280; border-radius: 8px; background: #f9fafb;">
          <SupportIcon class="support-icon--muted support-icon--large" />
          <span style="font-size: 14px; font-weight: 600; color: #374151;">Offline</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different support availability states with appropriate colors and animations.',
      },
    },
  },
}

export const SizeComparison: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <SupportIcon class="support-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { SupportIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
          <SupportIcon class="support-icon--interactive" />
          <span>Get Help</span>
        </button>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <SupportIcon class="support-icon--active support-icon--available" />
          <span style="color: #15803d;">Support team is online and ready to help</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #eff6ff; border: 1px solid #7dd3fc; border-radius: 8px;">
          <SupportIcon class="support-icon--info support-icon--connecting" />
          <span style="color: #0369a1;">Connecting you with a support agent...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <SupportIcon class="support-icon--urgent support-icon--pinging" />
          <span style="color: #92400e;">All agents are busy. Estimated wait time: 5 minutes</span>
        </div>
        <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
          <button style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #22c55e; color: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            <SupportIcon class="support-icon--active support-icon--available" />
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <SupportIcon class="support-icon--help" />
            Need Help?
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; text-align: left; background: white; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
              <SupportIcon class="support-icon--small support-icon--help" />
              <span style="font-size: 14px;">Browse Help Center</span>
            </button>
            <button style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; text-align: left; background: white; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
              <SupportIcon class="support-icon--small support-icon--active" />
              <span style="font-size: 14px;">Start Live Chat</span>
            </button>
            <button style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; text-align: left; background: white; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
              <SupportIcon class="support-icon--small support-icon--primary" />
              <span style="font-size: 14px;">Contact Support Team</span>
            </button>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: between; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <SupportIcon class="support-icon--critical" />
            <div>
              <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #dc2626;">Critical Issue?</h4>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Get immediate assistance from our support team</p>
            </div>
          </div>
          <button style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Emergency Help
          </button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 6px;">
          <SupportIcon class="support-icon--small support-icon--muted" />
          <span style="color: #6b7280; font-size: 14px;">Support hours: Mon-Fri 9AM-6PM EST</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of SupportIcon usage in common help and support UI patterns like help buttons, chat widgets, status indicators, help centers, and emergency support.',
      },
    },
  },
}
