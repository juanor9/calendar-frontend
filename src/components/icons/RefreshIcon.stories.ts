import type { Meta, StoryObj } from '@storybook/vue3'
import RefreshIcon from './RefreshIcon.vue'

const meta: Meta<typeof RefreshIcon> = {
  title: 'Icons/Refresh',
  component: RefreshIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A circular arrow icon used for refresh, reload, sync, and reset functionality. Essential for data synchronization, content updates, and user-initiated refresh actions in calendar applications. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof RefreshIcon>

export const Default: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--interactive" />`,
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
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--spinning refresh-icon--primary" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Continuous spinning animation for active loading states.',
      },
    },
  },
}

export const Syncing: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--syncing refresh-icon--info" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Syncing animation with opacity changes for data synchronization.',
      },
    },
  },
}

export const Loading: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--loading refresh-icon--warning" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation for background loading processes.',
      },
    },
  },
}

export const QuickRefresh: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon class="refresh-icon--quick refresh-icon--success" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Quick refresh animation that plays once when triggered.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--info" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--success" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--warning" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--muted" />
          <span style="font-size: 12px; color: #6b7280;">Muted</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon class="refresh-icon--large" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
          <RefreshIcon class="refresh-icon--interactive" />
          <span>Refresh Calendar</span>
        </button>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px;">
          <RefreshIcon class="refresh-icon--spinning refresh-icon--info" />
          <span style="color: #0369a1;">Syncing calendar events...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <RefreshIcon class="refresh-icon--success" />
          <span style="color: #15803d;">Calendar sync completed successfully</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <RefreshIcon class="refresh-icon--error" />
          <span style="color: #dc2626;">Sync failed. Click to retry.</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: between; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Calendar Sync Status</h4>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Last updated: 5 minutes ago</p>
          </div>
          <button style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer;">
            <RefreshIcon class="refresh-icon--small refresh-icon--interactive" />
            <span style="font-size: 14px;">Sync Now</span>
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: between;">
            <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Data Sources</h4>
            <RefreshIcon class="refresh-icon--syncing refresh-icon--primary" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <RefreshIcon class="refresh-icon--small refresh-icon--success" />
              <span style="font-size: 14px;">Google Calendar - Synced</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <RefreshIcon class="refresh-icon--small refresh-icon--loading refresh-icon--warning" />
              <span style="font-size: 14px;">Outlook Calendar - Syncing...</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: 6px;">
              <RefreshIcon class="refresh-icon--small refresh-icon--error" />
              <span style="font-size: 14px;">Apple Calendar - Error</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
          <RefreshIcon class="refresh-icon--small refresh-icon--muted" />
          <span style="color: #6b7280; font-size: 14px;">Auto-sync enabled</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of RefreshIcon usage in common sync and refresh UI patterns like action buttons, status indicators, progress states, and data source management.',
      },
    },
  },
}
