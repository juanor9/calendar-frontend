import type { Meta, StoryObj } from '@storybook/vue3'
import CheckCircleIcon from './CheckCircleIcon.vue'

const meta: Meta<typeof CheckCircleIcon> = {
  title: 'Icons/Check Circle',
  component: CheckCircleIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A check mark inside a circle icon used for success states, completion indicators, and validation feedback. Commonly used in forms, task lists, and confirmation messages. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof CheckCircleIcon>

export const Default: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `<CheckCircleIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `<CheckCircleIcon class="check-circle-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `<CheckCircleIcon class="check-circle-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `<CheckCircleIcon class="check-circle-icon--interactive" />`,
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
    components: { CheckCircleIcon },
    template: `<CheckCircleIcon class="check-circle-icon--success check-circle-icon--pulse" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Animated version with pulse effect, ideal for drawing attention to completion states.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--success" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--warning" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckCircleIcon class="check-circle-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { CheckCircleIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <CheckCircleIcon class="check-circle-icon--success" />
          <span style="color: #15803d;">Task completed successfully</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
          <CheckCircleIcon class="check-circle-icon--small check-circle-icon--success" />
          <span style="color: #6b7280;">Email verification completed</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
            <CheckCircleIcon class="check-circle-icon--small check-circle-icon--success" />
            <span>Setup user profile</span>
          </li>
          <li style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
            <CheckCircleIcon class="check-circle-icon--small check-circle-icon--success" />
            <span>Connect calendar integration</span>
          </li>
          <li style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
            <CheckCircleIcon class="check-circle-icon--small check-circle-icon--secondary" />
            <span style="color: #6b7280;">Configure AI preferences</span>
          </li>
        </ul>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
          <CheckCircleIcon class="check-circle-icon--warning check-circle-icon--pulse" />
          <span style="color: #c2410c;">Action required: Review calendar permissions</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of CheckCircleIcon usage in common UI patterns like success messages, task lists, notifications, and form validation.',
      },
    },
  },
}
