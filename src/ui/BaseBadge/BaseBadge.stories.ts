import type { Meta, StoryObj } from '@storybook/vue3'
import BaseBadge from './BaseBadge.vue'

const meta: Meta<typeof BaseBadge> = {
  title: 'UI/Data Display/Badge',
  component: BaseBadge,
  parameters: {
    docs: {
      description: {
        component:
          'A versatile badge component for displaying status, labels, or notifications. Features multiple variants, sizes, and interactive states following the Vana design system.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-ui',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'neutral' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    outline: {
      control: 'boolean',
      description: 'Use outline style instead of filled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pill: {
      control: 'boolean',
      description: 'Use pill shape (fully rounded)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    removable: {
      control: 'boolean',
      description: 'Show remove button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dot: {
      control: 'boolean',
      description: 'Display as dot indicator only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pulse: {
      control: 'boolean',
      description: 'Add pulsing animation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    default: {
      control: 'text',
      description: 'Badge content',
      table: {
        type: { summary: 'slot' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseBadge>

export const Default: Story = {
  args: {
    variant: 'neutral',
    size: 'medium',
    default: 'Default Badge',
  },
  render: args => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: `<BaseBadge v-bind="args">{{ args.default }}</BaseBadge>`,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <BaseBadge variant="primary">Primary</BaseBadge>
        <BaseBadge variant="secondary">Secondary</BaseBadge>
        <BaseBadge variant="success">Success</BaseBadge>
        <BaseBadge variant="warning">Warning</BaseBadge>
        <BaseBadge variant="error">Error</BaseBadge>
        <BaseBadge variant="info">Info</BaseBadge>
        <BaseBadge variant="neutral">Neutral</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants with semantic colors from the design system.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <BaseBadge variant="primary" size="small">Small</BaseBadge>
        <BaseBadge variant="primary" size="medium">Medium</BaseBadge>
        <BaseBadge variant="primary" size="large">Large</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Available badge sizes for different use cases.',
      },
    },
  },
}

export const Outline: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <BaseBadge variant="primary" outline>Primary</BaseBadge>
        <BaseBadge variant="success" outline>Success</BaseBadge>
        <BaseBadge variant="warning" outline>Warning</BaseBadge>
        <BaseBadge variant="error" outline>Error</BaseBadge>
        <BaseBadge variant="info" outline>Info</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Outline style variants for more subtle appearance.',
      },
    },
  },
}

export const Pill: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <BaseBadge variant="primary" pill>Primary Pill</BaseBadge>
        <BaseBadge variant="success" pill>Success Pill</BaseBadge>
        <BaseBadge variant="warning" pill>Warning Pill</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pill-shaped badges with fully rounded corners.',
      },
    },
  },
}

export const Removable: Story = {
  render: () => ({
    components: { BaseBadge },
    setup() {
      const handleRemove = (event: MouseEvent) => {
        console.log('Badge removed:', event)
      }
      return { handleRemove }
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <BaseBadge variant="info" removable @remove="handleRemove">JavaScript</BaseBadge>
        <BaseBadge variant="success" removable @remove="handleRemove">TypeScript</BaseBadge>
        <BaseBadge variant="warning" removable @remove="handleRemove">Vue.js</BaseBadge>
        <BaseBadge variant="error" removable pill @remove="handleRemove">React</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Removable badges with close button. Click the × to see console log.',
      },
    },
  },
}

export const Dots: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="success" dot size="small" />
          <span style="font-size: 12px; color: #6b7280;">Online</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="warning" dot size="medium" />
          <span style="font-size: 12px; color: #6b7280;">Away</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="error" dot size="large" />
          <span style="font-size: 12px; color: #6b7280;">Offline</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="primary" dot pulse size="medium" />
          <span style="font-size: 12px; color: #6b7280;">Live</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dot indicators for status display, often used with avatars or notifications.',
      },
    },
  },
}

export const Pulse: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <BaseBadge variant="error" pulse>Urgent</BaseBadge>
        <BaseBadge variant="warning" pulse>New</BaseBadge>
        <BaseBadge variant="primary" dot pulse />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation for attention-grabbing elements.',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <BaseBadge variant="primary" disabled>Disabled</BaseBadge>
        <BaseBadge variant="success" disabled removable>Disabled Removable</BaseBadge>
        <BaseBadge variant="warning" disabled outline>Disabled Outline</BaseBadge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for non-interactive badges.',
      },
    },
  },
}

export const InContext: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- User Status -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
            alt="User avatar" 
            style="width: 40px; height: 40px; border-radius: 50%;" 
          />
          <span style="font-weight: 500;">John Doe</span>
          <BaseBadge variant="success" dot pulse />
        </div>

        <!-- Task Tags -->
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
          <h4 style="margin: 0 0 12px 0;">Project Planning</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            <BaseBadge variant="primary" size="small" removable>Frontend</BaseBadge>
            <BaseBadge variant="info" size="small" removable>Vue.js</BaseBadge>
            <BaseBadge variant="success" size="small" removable>TypeScript</BaseBadge>
            <BaseBadge variant="warning" size="small">Urgent</BaseBadge>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px; color: #6b7280;">Status:</span>
            <BaseBadge variant="warning" size="small">In Progress</BaseBadge>
          </div>
        </div>

        <!-- Notifications -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <span>Messages</span>
          <BaseBadge variant="error" size="small" pill>3</BaseBadge>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span>Notifications</span>
          <BaseBadge variant="primary" size="small" pill>12</BaseBadge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing badges in common UI patterns.',
      },
    },
  },
}
