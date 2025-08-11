import type { Meta, StoryObj } from '@storybook/vue3'
import ShieldIcon from './ShieldIcon.vue'

const meta: Meta<typeof ShieldIcon> = {
  title: 'Icons/Shield',
  component: ShieldIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A shield with checkmark icon used for security, privacy, protection, and verification features. Essential for security badges, privacy settings, data protection indicators, and trusted status displays. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ShieldIcon>

export const Default: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive scaling effect.',
      },
    },
  },
}

export const Protected: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--secure shield-icon--protected" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Glowing animation to indicate secure/protected status.',
      },
    },
  },
}

export const Scanning: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--checking shield-icon--scanning" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Scanning animation for security checks in progress.',
      },
    },
  },
}

export const Pulse: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--warning shield-icon--pulse" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation for security alerts or notifications.',
      },
    },
  },
}

export const Verified: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon class="shield-icon--success shield-icon--verified" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Verification animation that plays once when security is confirmed.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--secure" />
          <span style="font-size: 12px; color: #6b7280;">Secure</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--checking" />
          <span style="font-size: 12px; color: #6b7280;">Checking</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--vulnerable" />
          <span style="font-size: 12px; color: #6b7280;">Vulnerable</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
      </div>
    `,
  }),
}

export const SecurityStates: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #22c55e; border-radius: 8px; background: #f0fdf4;">
          <ShieldIcon class="shield-icon--secure shield-icon--large" />
          <span style="font-size: 14px; font-weight: 600; color: #15803d;">Protected</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #f59e0b; border-radius: 8px; background: #fffbeb;">
          <ShieldIcon class="shield-icon--checking shield-icon--large shield-icon--scanning" />
          <span style="font-size: 14px; font-weight: 600; color: #92400e;">Checking</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #ef4444; border-radius: 8px; background: #fef2f2;">
          <ShieldIcon class="shield-icon--vulnerable shield-icon--large shield-icon--pulse" />
          <span style="font-size: 14px; font-weight: 600; color: #dc2626;">At Risk</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different security states with appropriate colors and animations.',
      },
    },
  },
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon class="shield-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <ShieldIcon class="shield-icon--secure" />
          <span style="color: #15803d;">Your data is encrypted and secure</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <ShieldIcon class="shield-icon--checking shield-icon--scanning" />
          <span style="color: #92400e;">Running security check...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <ShieldIcon class="shield-icon--vulnerable shield-icon--pulse" />
          <span style="color: #dc2626;">Security issue detected. Please update your password.</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: between; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <ShieldIcon class="shield-icon--info" />
            <div>
              <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Privacy & Security</h4>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Manage your data protection settings</p>
            </div>
          </div>
          <button style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Configure
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <ShieldIcon class="shield-icon--secure" />
            Security Features
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <ShieldIcon class="shield-icon--small shield-icon--secure" />
              <span style="font-size: 14px;">End-to-end encryption enabled</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <ShieldIcon class="shield-icon--small shield-icon--secure" />
              <span style="font-size: 14px;">Two-factor authentication active</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <ShieldIcon class="shield-icon--small shield-icon--checking" />
              <span style="font-size: 14px;">Regular security audits</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #ffffff; border: 2px solid #22c55e; border-radius: 8px;">
          <ShieldIcon class="shield-icon--secure shield-icon--protected" />
          <div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #15803d;">Vana Verified</h4>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #16a34a;">This calendar meets our highest security standards</p>
          </div>
        </div>
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="secure" style="margin: 0;" />
            <label for="secure" style="display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer;">
              <ShieldIcon class="shield-icon--small shield-icon--info" />
              Enable enhanced security features
            </label>
          </div>
        </form>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ShieldIcon usage in common security and privacy UI patterns like status indicators, feature lists, settings panels, and verification badges.',
      },
    },
  },
}
