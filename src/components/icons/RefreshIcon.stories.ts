import type { Meta, StoryObj } from '@storybook/vue3'
import RefreshIcon from './RefreshIcon.vue'

const meta: Meta<typeof RefreshIcon> = {
  title: 'Icons/Refresh',
  component: RefreshIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A refresh/reload icon used for updating content, syncing data, and reloading interfaces. Essential for calendar syncing, data refresh, and reload functionality. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
    template: `<RefreshIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `<RefreshIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Spinning: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <RefreshIcon style="
        color: #6366f1; 
        width: 24px; 
        height: 24px;
        animation: spin 1s linear infinite;
      " />
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinning animation to indicate active refresh or loading state.',
      },
    },
  },
}

export const Pulsing: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <RefreshIcon style="
        color: #10b981; 
        width: 24px; 
        height: 24px;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      " />
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.1); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation to draw attention to refresh capability.',
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
          <RefreshIcon style="color: #6366f1; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="color: #10b981; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="color: #ef4444; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Neutral</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="color: #8b5cf6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Purple</span>
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
          <RefreshIcon style="width: 16px; height: 16px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="width: 24px; height: 24px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RefreshIcon style="width: 32px; height: 32px; color: #6366f1;" />
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
        <!-- Refresh Button --!>
        <button style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
          <RefreshIcon style="width: 18px; height: 18px;" />
          Refresh Calendar
        </button>
        
        <!-- Sync Status --!>
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <RefreshIcon style="color: #10b981; width: 20px; height: 20px; animation: spin 2s linear infinite;" />
          <div>
            <div style="font-weight: 500; color: #065f46;">Syncing Calendar</div>
            <div style="font-size: 14px; color: #16a34a;">Last updated: 2 minutes ago</div>
          </div>
        </div>
        
        <!-- Manual Sync Card --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Google Calendar Sync</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Keep your calendars in sync</p>
            </div>
            <button style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 14px;">
              <RefreshIcon style="width: 14px; height: 14px; color: #6b7280;" />
              Sync Now
            </button>
          </div>
          <div style="font-size: 12px; color: #9ca3af;">Last sync: Today at 2:30 PM</div>
        </div>
        
        <!-- Pull to Refresh --!>
        <div style="text-align: center; padding: 20px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
          <RefreshIcon style="color: #64748b; width: 24px; height: 24px; margin-bottom: 8px;" />
          <div style="font-weight: 500; color: #1e293b; margin-bottom: 4px;">Pull to Refresh</div>
          <div style="font-size: 14px; color: #64748b;">Drag down to update your calendar</div>
        </div>
        
        <!-- Data Loading States --!>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
            <RefreshIcon style="color: #6b7280; width: 20px; height: 20px; margin-bottom: 8px;" />
            <div style="font-size: 14px; font-weight: 500; color: #374151;">Ready to Sync</div>
          </div>
          
          <div style="padding: 16px; background: #fefce8; border: 1px solid #fef3c7; border-radius: 8px; text-align: center;">
            <RefreshIcon style="color: #f59e0b; width: 20px; height: 20px; margin-bottom: 8px; animation: spin 1s linear infinite;" />
            <div style="font-size: 14px; font-weight: 500; color: #92400e;">Syncing...</div>
          </div>
          
          <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center;">
            <RefreshIcon style="color: #10b981; width: 20px; height: 20px; margin-bottom: 8px;" />
            <div style="font-size: 14px; font-weight: 500; color: #065f46;">Sync Complete</div>
          </div>
          
          <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; text-align: center;">
            <RefreshIcon style="color: #ef4444; width: 20px; height: 20px; margin-bottom: 8px;" />
            <div style="font-size: 14px; font-weight: 500; color: #7f1d1d;">Sync Failed</div>
          </div>
        </div>
        
        <!-- Settings Panel --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <RefreshIcon style="color: #6366f1; width: 20px; height: 20px;" />
            Sync Settings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; justify-content: between; align-items: center;">
              <span>Auto-sync calendar events</span>
              <input type="checkbox" checked />
            </label>
            <label style="display: flex; justify-content: between; align-items: center;">
              <span>Sync frequency</span>
              <select style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option>Every 15 minutes</option>
                <option>Every hour</option>
                <option>Manual only</option>
              </select>
            </label>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
              <button style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                <RefreshIcon style="width: 14px; height: 14px;" />
                Sync Now
              </button>
              <span style="font-size: 12px; color: #6b7280;">Last sync: 5 minutes ago</span>
            </div>
          </div>
        </div>
        
        <!-- Refresh Timeline --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Sync Activity</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <RefreshIcon style="color: #10b981; width: 16px; height: 16px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #111827;">Calendar sync completed</div>
                <div style="font-size: 12px; color: #6b7280;">3 events updated • 2 minutes ago</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <RefreshIcon style="color: #6366f1; width: 16px; height: 16px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #111827;">Manual refresh triggered</div>
                <div style="font-size: 12px; color: #6b7280;">No new changes • 1 hour ago</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <RefreshIcon style="color: #f59e0b; width: 16px; height: 16px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #111827;">Sync retry</div>
                <div style="font-size: 12px; color: #6b7280;">Connection timeout • 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions --!>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.borderColor='#6366f1'; this.style.color='#6366f1'" onmouseout="this.style.borderColor='#d1d5db'; this.style.color='inherit'">
            <RefreshIcon style="width: 14px; height: 14px;" />
            Refresh All
          </button>
          <button style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.borderColor='#10b981'; this.style.color='#10b981'" onmouseout="this.style.borderColor='#d1d5db'; this.style.color='inherit'">
            <RefreshIcon style="width: 14px; height: 14px;" />
            Sync Calendar
          </button>
          <button style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.borderColor='#8b5cf6'; this.style.color='#8b5cf6'" onmouseout="this.style.borderColor='#d1d5db'; this.style.color='inherit'">
            <RefreshIcon style="width: 14px; height: 14px;" />
            Reset Cache
          </button>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of RefreshIcon usage in realistic refresh and sync contexts like refresh buttons, sync status, data loading states, settings panels, activity timelines, and quick actions.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { RefreshIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header --!>
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">RefreshIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Refresh and reload icon component for data syncing, content updates, and reload functionality. Essential for calendar sync, data refresh, and update interfaces with flexible animation options.
          </p>
        </div>

        <!-- Usage Overview --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Data Synchronization</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Calendar sync and data updates</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <RefreshIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Sync calendar events</span>
              </div>
            </div>

            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Content Refresh</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Reload pages and update content</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <RefreshIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Refresh page content</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Loading States</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Active loading and processing indicators</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <RefreshIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Processing request</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Cache Management</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Clear cache and reset data</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <RefreshIcon style="color: #8b5cf6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Clear and refresh</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation States --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Animation States</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <RefreshIcon style="color: #6b7280; width: 32px; height: 32px;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Static</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Ready state</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <RefreshIcon style="color: #6366f1; width: 32px; height: 32px; animation: spin 1s linear infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Spinning</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Active refresh</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <RefreshIcon style="color: #10b981; width: 32px; height: 32px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Pulsing</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Available update</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <RefreshIcon style="color: #ef4444; width: 32px; height: 32px; animation: shake 0.5s ease-in-out infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Shake</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Error state</p>
            </div>
          </div>
        </div>

        <!-- Status Colors --!>
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Status Indicators</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <RefreshIcon style="color: #6b7280; width: 24px; height: 24px; margin-bottom: 8px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Ready</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Available for refresh</p>
            </div>

            <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <RefreshIcon style="color: #3b82f6; width: 24px; height: 24px; margin-bottom: 8px; animation: spin 1s linear infinite;" />
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Loading</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Refresh in progress</p>
            </div>

            <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <RefreshIcon style="color: #10b981; width: 24px; height: 24px; margin-bottom: 8px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Success</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Refresh completed</p>
            </div>

            <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <RefreshIcon style="color: #ef4444; width: 24px; height: 24px; margin-bottom: 8px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Error</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Refresh failed</p>
            </div>
          </div>
        </div>

        <!-- Implementation Examples --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Implementation Examples</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Basic Usage --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Basic Usage</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;RefreshIcon /&gt;</code></pre>
            </div>

            <!-- Refresh Button --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Refresh Button</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;button @click="refresh"&gt;
  &lt;RefreshIcon /&gt;
  Refresh
&lt;/button&gt;</code></pre>
            </div>

            <!-- Loading State --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Loading State</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;RefreshIcon 
  :class="{ 'animate-spin': isLoading }"
/&gt;</code></pre>
            </div>

            <!-- Sync Status --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Sync Indicator</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="sync-status"&gt;
  &lt;RefreshIcon :class="syncClass" /&gt;
  {{ syncMessage }}
&lt;/div&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices --!>
        <div style="padding: 24px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #065f46;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Use spinning animation during active refresh</li>
                <li>Provide clear feedback on refresh status</li>
                <li>Use consistent colors for different states</li>
                <li>Include keyboard accessibility for buttons</li>
                <li>Show last refresh timestamp when relevant</li>
                <li>Use appropriate size for context</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Overusing spinning animations (causes dizziness)</li>
                <li>Using for non-refresh related actions</li>
                <li>Making refresh buttons too small to click</li>
                <li>Not providing feedback during refresh</li>
                <li>Using without clear refresh context</li>
                <li>Ignoring error states and failures</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Include aria-label for screen readers</li>
                <li>Provide text alternatives for icon-only buttons</li>
                <li>Announce refresh status changes</li>
                <li>Support keyboard navigation and Enter key</li>
                <li>Respect user's reduced motion preferences</li>
                <li>Ensure sufficient color contrast ratios</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations --!>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .7; transform: scale(1.1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
        </style>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the RefreshIcon component including usage scenarios, animation states, status indicators, implementation examples, and accessibility best practices for refresh and sync interfaces.',
      },
    },
  },
}