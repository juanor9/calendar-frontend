import type { Meta, StoryObj } from '@storybook/vue3'
import ExclamationCircleIcon from './ExclamationCircleIcon.vue'

const meta: Meta<typeof ExclamationCircleIcon> = {
  title: 'Icons/Exclamation Circle',
  component: ExclamationCircleIcon,
  parameters: {
    docs: {
      description: {
        component:
          'An exclamation mark inside a circle icon used for warnings, alerts, important notifications, and validation errors. Essential for form validation, system alerts, and drawing attention to critical information. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ExclamationCircleIcon>

export const Default: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive scaling effect.',
      },
    },
  },
}

export const WithPulse: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--warning exclamation-circle-icon--pulse" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation to draw attention to warnings or important alerts.',
      },
    },
  },
}

export const WithShake: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--error exclamation-circle-icon--shake" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Shake animation for error states or failed validations. Animation plays once.',
      },
    },
  },
}

export const Urgent: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `<ExclamationCircleIcon class="exclamation-circle-icon--error exclamation-circle-icon--urgent" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Urgent flashing animation for critical alerts that require immediate attention.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--warning" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--attention" />
          <span style="font-size: 12px; color: #6b7280;">Attention</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ExclamationCircleIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--warning" />
          <span style="color: #92400e;">Your calendar sync is paused. Please re-authenticate.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--error exclamation-circle-icon--pulse" />
          <span style="color: #dc2626;">Failed to save changes. Please try again.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px;">
          <ExclamationCircleIcon class="exclamation-circle-icon--info" />
          <span style="color: #0369a1;">New calendar events require your attention.</span>
        </div>
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-weight: 500; font-size: 14px;">Email Address</label>
            <div style="position: relative;">
              <input 
                type="email" 
                style="width: 100%; padding: 8px 12px; border: 2px solid #ef4444; border-radius: 6px; outline: none;"
                placeholder="Enter your email"
              />
              <ExclamationCircleIcon class="exclamation-circle-icon--small exclamation-circle-icon--error" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%);" />
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <ExclamationCircleIcon class="exclamation-circle-icon--small exclamation-circle-icon--error" />
              <span style="color: #dc2626; font-size: 12px;">Please enter a valid email address</span>
            </div>
          </div>
        </form>
        <div style="display: flex; align-items: start; gap: 8px; padding: 12px; background: #fffbeb; border-left: 4px solid #f59e0b;">
          <ExclamationCircleIcon class="exclamation-circle-icon--warning" style="margin-top: 2px;" />
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #92400e;">Important Notice</h4>
            <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.4;">
              Your trial period expires in 3 days. Upgrade your account to continue using advanced features.
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #fef2f2; border-radius: 8px; border: 2px solid #ef4444;">
          <ExclamationCircleIcon class="exclamation-circle-icon--error exclamation-circle-icon--urgent" />
          <span style="color: #dc2626; font-weight: 600;">Critical: System maintenance required immediately</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ExclamationCircleIcon usage in common alert patterns like system notifications, form validation errors, warning messages, and critical alerts.',
      },
    },
  },
}
