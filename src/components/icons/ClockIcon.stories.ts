import type { Meta, StoryObj } from '@storybook/vue3'
import ClockIcon from './ClockIcon.vue'

const meta: Meta<typeof ClockIcon> = {
  title: 'Icons/Clock',
  component: ClockIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A clock icon used for time-related features, scheduling, deadlines, and temporal information. Essential for calendar applications, task management, and time tracking features. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ClockIcon>

export const Default: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon class="clock-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon class="clock-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon class="clock-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive rotation effect.',
      },
    },
  },
}

export const Spinning: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon class="clock-icon--spinning clock-icon--primary" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinning animation for loading states or processing time-based operations.',
      },
    },
  },
}

export const Ticking: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon class="clock-icon--ticking clock-icon--warning" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Ticking animation to indicate active schedules or countdown timers.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--warning" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--muted" />
          <span style="font-size: 12px; color: #6b7280;">Muted</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon class="clock-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
          <ClockIcon class="clock-icon--primary" />
          <span>Meeting starts in 15 minutes</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
          <ClockIcon class="clock-icon--small clock-icon--muted" />
          <span style="color: #6b7280; font-size: 14px;">Last updated: 2 hours ago</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
          <ClockIcon class="clock-icon--warning clock-icon--ticking" />
          <span style="color: #92400e;">Deadline approaching: 2 days remaining</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <ClockIcon class="clock-icon--error" />
          <span style="color: #dc2626;">Task overdue by 3 days</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid #d1d5db; border-radius: 8px;">
          <ClockIcon class="clock-icon--spinning clock-icon--info" />
          <span>Syncing calendar events...</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Today's Schedule</h4>
          <div style="display: flex; align-items: center; gap: 8px;">
            <ClockIcon class="clock-icon--small clock-icon--secondary" />
            <span style="font-size: 14px;">9:00 AM - Team standup</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <ClockIcon class="clock-icon--small clock-icon--secondary" />
            <span style="font-size: 14px;">2:00 PM - Client presentation</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <ClockIcon class="clock-icon--small clock-icon--secondary" />
            <span style="font-size: 14px;">4:30 PM - Code review</span>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ClockIcon usage in common calendar and scheduling UI patterns like notifications, time displays, deadline warnings, and schedule lists.',
      },
    },
  },
}
