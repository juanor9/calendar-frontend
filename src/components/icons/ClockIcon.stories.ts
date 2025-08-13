import type { Meta, StoryObj } from '@storybook/vue3'
import ClockIcon from './ClockIcon.vue'

const meta: Meta<typeof ClockIcon> = {
  title: 'Icons/Clock',
  component: ClockIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A clock icon used for time-related features, scheduling, deadlines, and temporal information. Essential for calendar applications, time pickers, appointment scheduling, and duration indicators. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
    template: `<ClockIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `<ClockIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Animated: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <ClockIcon style="
        color: #6366f1; 
        width: 24px; 
        height: 24px;
        animation: spin 2s linear infinite;
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
        story: 'Rotating animation to indicate active timers or ongoing time-related processes.',
      },
    },
  },
}

export const Pulsing: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <ClockIcon style="
        color: #f59e0b; 
        width: 24px; 
        height: 24px;
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      " />
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.05); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation to draw attention to time-sensitive information or deadlines.',
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
          <ClockIcon style="color: #6366f1; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="color: #059669; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="color: #ef4444; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Urgent</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Neutral</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="color: #8b5cf6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Purple</span>
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
          <ClockIcon style="width: 16px; height: 16px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="width: 24px; height: 24px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ClockIcon style="width: 32px; height: 32px; color: #6366f1;" />
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
        <!-- Meeting Time Display -->
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <ClockIcon style="color: #3b82f6; width: 20px; height: 20px;" />
          <div>
            <div style="font-weight: 500; color: #1e40af;">Team Meeting</div>
            <div style="font-size: 14px; color: #3b82f6;">10:00 AM - 11:00 AM</div>
          </div>
        </div>
        
        <!-- Time Remaining Alert -->
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <ClockIcon style="color: #f59e0b; width: 20px; height: 20px; animation: pulse 2s infinite;" />
          <span style="color: #92400e;">Meeting starts in 15 minutes</span>
        </div>
        
        <!-- Overdue Task -->
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <ClockIcon style="color: #ef4444; width: 20px; height: 20px;" />
          <span style="color: #dc2626;">Task overdue by 2 hours</span>
        </div>
        
        <!-- Calendar Event Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; items-center; gap: 8px; margin-bottom: 12px;">
              <ClockIcon style="color: #059669; width: 18px; height: 18px;" />
              <span style="font-size: 14px; color: #6b7280;">09:00 - 09:30</span>
            </div>
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #111827;">Daily Standup</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Team sync and planning</p>
          </div>
          
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; items-center; gap: 8px; margin-bottom: 12px;">
              <ClockIcon style="color: #8b5cf6; width: 18px; height: 18px;" />
              <span style="font-size: 14px; color: #6b7280;">14:00 - 15:30</span>
            </div>
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #111827;">Client Review</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Project presentation</p>
          </div>
        </div>
        
        <!-- Time Picker Interface -->
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <ClockIcon style="color: #6366f1; width: 20px; height: 20px;" />
            Select Time
          </h3>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white;">
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select>
            <span style="color: #6b7280;">:</span>
            <select style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white;">
              <option>00</option>
              <option>15</option>
              <option>30</option>
              <option>45</option>
            </select>
            <select style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white;">
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
        
        <!-- Duration Display -->
        <div style="display: flex; justify-content: between; align-items: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <ClockIcon style="color: #64748b; width: 18px; height: 18px;" />
            <span style="font-weight: 500; color: #334155;">Total Duration</span>
          </div>
          <span style="font-weight: 600; color: #0f172a;">2h 30m</span>
        </div>
        
        <!-- Time Tracking Widget -->
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Time Tracking</h3>
            <button style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
              <ClockIcon style="width: 16px; height: 16px;" />
              Start Timer
            </button>
          </div>
          <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <ClockIcon style="color: #6366f1; width: 16px; height: 16px; animation: spin 2s linear infinite;" />
              <span style="font-weight: 500; color: #374151;">Working on: Feature Development</span>
            </div>
            <div style="font-family: monospace; font-size: 18px; font-weight: 600; color: #1f2937;">01:23:45</div>
          </div>
        </div>
        
        <!-- Schedule Overview -->
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Today's Schedule</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ClockIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-weight: 500; color: #065f46;">Morning Review</span>
              </div>
              <span style="font-size: 14px; color: #059669;">09:00 AM</span>
            </div>
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #fffbeb; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ClockIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-weight: 500; color: #92400e;">Project Meeting</span>
              </div>
              <span style="font-size: 14px; color: #f59e0b;">02:00 PM</span>
            </div>
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #fef2f2; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ClockIcon style="color: #ef4444; width: 16px; height: 16px;" />
                <span style="font-weight: 500; color: #7f1d1d;">Deadline: Report</span>
              </div>
              <span style="font-size: 14px; color: #ef4444;">06:00 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.05); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ClockIcon usage in realistic time and scheduling contexts like meetings, deadlines, time pickers, tracking widgets, and calendar interfaces.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { ClockIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">ClockIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Time and scheduling icon component for calendar applications, time pickers, deadlines, and temporal information. Essential for productivity and scheduling interfaces with flexible styling options.
          </p>
        </div>

        <!-- Usage Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Calendar Events</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Display event times and scheduling information</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ClockIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Meeting at 2:00 PM</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Deadlines & Reminders</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Show time-sensitive tasks and deadlines</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ClockIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Due in 2 hours</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Time Tracking</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Track work hours and duration</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ClockIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Timer active: 1h 30m</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Time Selection</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Time pickers and scheduling interfaces</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ClockIcon style="color: #8b5cf6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Select meeting time</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation Examples -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Animation Effects</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ClockIcon style="color: #6366f1; width: 32px; height: 32px; animation: spin 2s linear infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Rotate</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For active timers</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ClockIcon style="color: #f59e0b; width: 32px; height: 32px; animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Pulse</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For urgent deadlines</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ClockIcon style="color: #ef4444; width: 32px; height: 32px; animation: shake 0.5s ease-in-out infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Shake</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For overdue items</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ClockIcon style="color: #059669; width: 32px; height: 32px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Interactive</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Hover to scale</p>
            </div>
          </div>
        </div>

        <!-- Implementation Examples -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Implementation Examples</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Basic Usage -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Basic Usage</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ClockIcon /&gt;</code></pre>
            </div>

            <!-- With Animation -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Animated Timer</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ClockIcon 
  style="animation: spin 2s linear infinite"
/&gt;</code></pre>
            </div>

            <!-- In Event Display -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Event Time</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="event-time"&gt;
  &lt;ClockIcon /&gt;
  &lt;span&gt;2:00 PM - 3:00 PM&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>

            <!-- Deadline Warning -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Deadline Alert</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="deadline-warning"&gt;
  &lt;ClockIcon class="pulse" /&gt;
  &lt;span&gt;Due in 1 hour&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div style="padding: 24px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #1e40af;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Use consistent colors for time urgency levels</li>
                <li>Pair with clear time format and labels</li>
                <li>Use animations sparingly for important timing</li>
                <li>Consider user's timezone and locale</li>
                <li>Provide accessible time representations</li>
                <li>Use in calendar and scheduling contexts</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Using for non-time related content</li>
                <li>Overusing animations (causes distraction)</li>
                <li>Inconsistent time format displays</li>
                <li>Using without accompanying time text</li>
                <li>Making clock icons too small to recognize</li>
                <li>Using in contexts where time isn't relevant</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Include time information in accessible text</li>
                <li>Provide timezone context where needed</li>
                <li>Use aria-labels for screen readers</li>
                <li>Don't rely solely on color for urgency</li>
                <li>Respect user's reduced motion preferences</li>
                <li>Test with keyboard and screen reader navigation</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations -->
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .7; transform: scale(1.05); }
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
        story: 'Complete visual documentation of the ClockIcon component including usage scenarios, animation effects, implementation examples, and accessibility best practices for time-related interfaces.',
      },
    },
  },
}