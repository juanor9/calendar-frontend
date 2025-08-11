import type { Meta, StoryObj } from '@storybook/vue3'
import CheckIcon from './CheckIcon.vue'

const meta: Meta<typeof CheckIcon> = {
  title: 'Icons/Check',
  component: CheckIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A checkmark icon used to indicate success, completion, or selection. Styling variants are applied via CSS classes following the BEM methodology and Vana design system with semantic colors.',
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
type Story = StoryObj<typeof CheckIcon>

export const Default: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon />`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (8px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--medium" />
          <span style="font-size: 12px; color: #6b7280;">Medium (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--extra-large" />
          <span style="font-size: 12px; color: #6b7280;">Extra Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large check-icon--success" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large check-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large check-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px; background: #1f2937; border-radius: 8px;">
          <CheckIcon class="check-icon--large check-icon--white" />
          <span style="font-size: 12px; color: #d1d5db;">White</span>
        </div>
      </div>
    `,
  }),
}

export const Styles: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Default</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large check-icon--in-circle" />
          <span style="font-size: 12px; color: #6b7280;">In Circle</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon class="check-icon--large check-icon--in-badge" />
          <span style="font-size: 12px; color: #6b7280;">In Badge</span>
        </div>
      </div>
    `,
  }),
}

export const Animated: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon class="check-icon--large check-icon--animated" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'The check icon appears with a bouncy animation effect.',
      },
    },
  },
}

export const Interactive: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon class="check-icon--large check-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive scale effect.',
      },
    },
  },
}

export const InContext: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Success Message -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <CheckIcon class="check-icon--large check-icon--in-circle" />
          <div>
            <h4 style="margin: 0 0 4px 0; color: #166534; font-weight: 600;">Payment successful</h4>
            <p style="margin: 0; color: #15803d; font-size: 14px;">Your order has been confirmed and is being processed.</p>
          </div>
        </div>

        <!-- Checklist -->
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <h4 style="margin: 0 0 16px 0; color: #1f2937;">Setup Progress</h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <CheckIcon class="check-icon--medium" />
              <span style="color: #374151;">Create account</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <CheckIcon class="check-icon--medium" />
              <span style="color: #374151;">Verify email</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <CheckIcon class="check-icon--medium" />
              <span style="color: #374151;">Connect calendar</span>
            </div>
          </div>
        </div>

        <!-- Form validation -->
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #374151; font-weight: 500;">Email address</label>
          <div style="position: relative;">
            <input 
              type="email" 
              value="user@example.com" 
              style="width: 100%; padding: 12px 40px 12px 12px; border: 1px solid #10b981; border-radius: 6px; outline: none;"
              readonly
            />
            <CheckIcon class="check-icon--medium" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%);" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world usage examples showing CheckIcon in common UI patterns like success messages, checklists, and form validation.',
      },
    },
  },
}
