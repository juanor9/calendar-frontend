import type { Meta, StoryObj } from '@storybook/vue3'
import BaseCard from './BaseCard.vue'
import BaseButton from '../BaseButton/BaseButton.vue'

const meta: Meta<typeof BaseCard> = {
  title: 'UI/Layout/Base Card',
  component: BaseCard,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible card component that serves as a container for content. Supports different variants, padding options, loading states, and interactive behavior. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-cards',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'Visual style variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Internal padding size',
    },
    clickable: {
      control: 'boolean',
      description: 'Makes the card interactive with hover effects and keyboard navigation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled styling',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and dims content',
    },
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
      description: 'HTML element to render as',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseCard>

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'medium',
  },
  render: args => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <h3>Card Title</h3>
        <p>This is a basic card with default styling. It provides a clean container for content with subtle shadows and rounded corners following the Vana design system.</p>
      </BaseCard>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        <BaseCard variant="default">
          <h4>Default Card</h4>
          <p>Standard card with basic shadow and border.</p>
        </BaseCard>
        <BaseCard variant="elevated">
          <h4>Elevated Card</h4>
          <p>Card with enhanced shadow for emphasis.</p>
        </BaseCard>
        <BaseCard variant="outlined">
          <h4>Outlined Card</h4>
          <p>Card with border and no shadow for subtle styling.</p>
        </BaseCard>
        <BaseCard variant="ghost">
          <h4>Ghost Card</h4>
          <p>Transparent card that reveals background on hover.</p>
        </BaseCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants available for the card component.',
      },
    },
  },
}

export const PaddingSizes: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <BaseCard padding="none" variant="outlined">
          <div style="background: #f3f4f6; padding: 8px; text-align: center; font-size: 12px;">No Padding</div>
        </BaseCard>
        <BaseCard padding="small" variant="outlined">
          <p style="margin: 0; font-size: 12px;">Small Padding</p>
        </BaseCard>
        <BaseCard padding="medium" variant="outlined">
          <p style="margin: 0; font-size: 12px;">Medium Padding</p>
        </BaseCard>
        <BaseCard padding="large" variant="outlined">
          <p style="margin: 0; font-size: 12px;">Large Padding</p>
        </BaseCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different padding options available for controlling internal spacing.',
      },
    },
  },
}

export const WithSlots: Story = {
  render: () => ({
    components: { BaseCard, BaseButton },
    template: `
      <BaseCard variant="elevated" padding="large">
        <template #header>
          <h3 style="margin: 0; color: #1f2937;">Upcoming Meetings</h3>
        </template>
        
        <p>You have 3 meetings scheduled for today. Review your agenda and prepare for productive discussions.</p>
        
        <template #footer>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Last updated: 2 minutes ago</p>
        </template>
        
        <template #actions>
          <BaseButton label="View All" variant="ghost" size="small" />
          <BaseButton label="Schedule New" variant="primary" size="small" />
        </template>
      </BaseCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card with header, footer, and actions slots for structured content.',
      },
    },
  },
}

export const Clickable: Story = {
  args: {
    clickable: true,
    variant: 'default',
  },
  render: args => ({
    components: { BaseCard },
    setup() {
      const handleClick = (event: MouseEvent) => {
        alert('Card clicked!')
        console.log('Card clicked:', event)
      }
      return { args, handleClick }
    },
    template: `
      <BaseCard v-bind="args" @click="handleClick">
        <h4>Interactive Card</h4>
        <p>Click me or press Enter/Space when focused. Notice the hover effects and keyboard accessibility.</p>
        <p style="font-size: 14px; color: #6b7280;">💡 This card has proper ARIA attributes and keyboard navigation support.</p>
      </BaseCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive card with click handling, hover effects, and keyboard accessibility.',
      },
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: args => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <h4>Loading Content</h4>
        <p>This content is currently loading. The spinner overlay is shown with proper accessibility attributes.</p>
      </BaseCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card in loading state with spinner overlay and aria-busy attribute.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    clickable: true,
  },
  render: args => ({
    components: { BaseCard },
    setup() {
      const handleClick = () => {
        alert('This should not fire when disabled')
      }
      return { args, handleClick }
    },
    template: `
      <BaseCard v-bind="args" @click="handleClick">
        <h4>Disabled Card</h4>
        <p>This card is disabled and cannot be interacted with. Notice the reduced opacity and disabled cursor.</p>
      </BaseCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled card with reduced opacity and no interaction.',
      },
    },
  },
}

export const TaskCards: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <BaseCard variant="outlined" clickable class="task-card task-card--high-priority">
          <div class="task-card__body">
            <input type="checkbox" class="task-card__checkbox" />
            <div class="task-card__content">
              <h4 class="task-card__title">Review design proposal</h4>
              <p class="task-card__subtitle">Design System Updates</p>
            </div>
            <div class="task-card__time">2:00 PM</div>
          </div>
        </BaseCard>
        
        <BaseCard variant="outlined" clickable class="task-card task-card--medium-priority">
          <div class="task-card__body">
            <input type="checkbox" class="task-card__checkbox" />
            <div class="task-card__content">
              <h4 class="task-card__title">Team standup meeting</h4>
              <p class="task-card__subtitle">Weekly sync</p>
            </div>
            <div class="task-card__time">3:30 PM</div>
          </div>
        </BaseCard>
        
        <BaseCard variant="outlined" clickable class="task-card task-card--completed">
          <div class="task-card__body">
            <input type="checkbox" class="task-card__checkbox" checked />
            <div class="task-card__content">
              <h4 class="task-card__title">Update project documentation</h4>
              <p class="task-card__subtitle">Completed</p>
            </div>
            <div class="task-card__time">1:00 PM</div>
          </div>
        </BaseCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Specialized task cards with priority indicators and completion states.',
      },
    },
  },
}

export const StatCards: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <BaseCard variant="elevated" class="stat-card">
          <h3 class="stat-card__number">24</h3>
          <p class="stat-card__label">Tasks Today</p>
          <p class="stat-card__trend stat-card__trend--positive">+3 from yesterday</p>
        </BaseCard>
        
        <BaseCard variant="elevated" class="stat-card">
          <h3 class="stat-card__number">8h 30m</h3>
          <p class="stat-card__label">Focus Time</p>
          <p class="stat-card__trend stat-card__trend--positive">+1h 15m</p>
        </BaseCard>
        
        <BaseCard variant="elevated" class="stat-card">
          <h3 class="stat-card__number">92%</h3>
          <p class="stat-card__label">Completion Rate</p>
          <p class="stat-card__trend stat-card__trend--negative">-3% this week</p>
        </BaseCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Statistical cards for displaying metrics and trends.',
      },
    },
  },
}

export const ResponsiveGrid: Story = {
  render: () => ({
    components: { BaseCard, BaseButton },
    template: `
      <div class="card-grid card-grid--auto-fit">
        <BaseCard variant="default">
          <template #header>
            <h4>Calendar Integration</h4>
          </template>
          <p>Connect your calendar to automatically sync meetings and events.</p>
          <template #actions>
            <BaseButton label="Connect" variant="primary" size="small" />
          </template>
        </BaseCard>
        
        <BaseCard variant="default">
          <template #header>
            <h4>AI Scheduling</h4>
          </template>
          <p>Let AI find the best time slots for your meetings based on preferences.</p>
          <template #actions>
            <BaseButton label="Enable" variant="primary" size="small" />
          </template>
        </BaseCard>
        
        <BaseCard variant="default">
          <template #header>
            <h4>Focus Time</h4>
          </template>
          <p>Block time for deep work with automatic notification management.</p>
          <template #actions>
            <BaseButton label="Set Up" variant="primary" size="small" />
          </template>
        </BaseCard>
        
        <BaseCard variant="default">
          <template #header>
            <h4>Team Collaboration</h4>
          </template>
          <p>Share calendars and coordinate schedules with your team members.</p>
          <template #actions>
            <BaseButton label="Invite Team" variant="primary" size="small" />
          </template>
        </BaseCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Responsive grid layout with cards that automatically adjust to available space.',
      },
    },
  },
}
