import type { Meta, StoryObj } from '@storybook/vue3'
import ExclamationTriangleIcon from './ExclamationTriangleIcon.vue'

const meta: Meta<typeof ExclamationTriangleIcon> = {
  title: 'Icons/Exclamation Triangle',
  component: ExclamationTriangleIcon,
  parameters: {
    docs: {
      description: {
        component:
          'An exclamation mark inside a triangle icon used for warnings, caution alerts, important notifications, and validation errors. Essential for form validation, system warnings, and drawing attention to critical information that requires user action. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ExclamationTriangleIcon>

export const Default: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `<ExclamationTriangleIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `<ExclamationTriangleIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `<ExclamationTriangleIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `<ExclamationTriangleIcon style="cursor: pointer; transition: transform 0.2s; width: 24px; height: 24px;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />`,
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
    components: { ExclamationTriangleIcon },
    template: `
      <ExclamationTriangleIcon style="
        color: #f59e0b; 
        width: 24px; 
        height: 24px;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      " />
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      </style>
    `,
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
    components: { ExclamationTriangleIcon },
    template: `
      <ExclamationTriangleIcon style="
        color: #ef4444; 
        width: 24px; 
        height: 24px;
        animation: shake 0.5s ease-in-out;
      " />
      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      </style>
    `,
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
    components: { ExclamationTriangleIcon },
    template: `
      <ExclamationTriangleIcon style="
        color: #dc2626; 
        width: 24px; 
        height: 24px;
        animation: flash 1s linear infinite;
      " />
      <style>
        @keyframes flash {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
        }
      </style>
    `,
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
    components: { ExclamationTriangleIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #6366f1; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #ef4444; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #3b82f6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="color: #d97706; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Attention</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="width: 16px; height: 16px;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ExclamationTriangleIcon style="width: 32px; height: 32px;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <ExclamationTriangleIcon style="color: #f59e0b; width: 20px; height: 20px;" />
          <span style="color: #92400e;">Your calendar sync will expire in 3 days. Please renew your subscription.</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <ExclamationTriangleIcon style="color: #ef4444; width: 20px; height: 20px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;" />
          <span style="color: #dc2626;">Critical: Multiple failed login attempts detected on your account.</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 8px;">
          <ExclamationTriangleIcon style="color: #ec4899; width: 20px; height: 20px;" />
          <span style="color: #be185d;">Storage limit reached. Some features may be limited.</span>
        </div>
        
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-weight: 500; font-size: 14px;">Password</label>
            <div style="position: relative;">
              <input 
                type="password" 
                style="width: 100%; padding: 8px 12px; border: 2px solid #ef4444; border-radius: 6px; outline: none;"
                placeholder="Enter your password"
              />
              <ExclamationTriangleIcon style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #ef4444; width: 16px; height: 16px;" />
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <ExclamationTriangleIcon style="color: #ef4444; width: 14px; height: 14px;" />
              <span style="color: #dc2626; font-size: 12px;">Password must contain at least 8 characters</span>
            </div>
          </div>
        </form>
        
        <div style="display: flex; align-items: start; gap: 8px; padding: 16px; background: #fffbeb; border-left: 4px solid #f59e0b;">
          <ExclamationTriangleIcon style="color: #f59e0b; width: 20px; height: 20px; margin-top: 2px;" />
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #92400e;">Security Notice</h4>
            <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.4;">
              We've detected unusual activity on your account. Please review your recent login history and update your password if necessary.
            </p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px; padding: 16px; background: #fef2f2; border-radius: 8px; border: 2px solid #ef4444;">
          <ExclamationTriangleIcon style="color: #dc2626; width: 24px; height: 24px; animation: flash 1s linear infinite;" />
          <div style="flex-grow: 1;">
            <div style="color: #dc2626; font-weight: 600; margin-bottom: 4px;">System Alert: Maintenance Required</div>
            <div style="color: #7f1d1d; font-size: 14px;">Critical system maintenance will begin in 15 minutes. Please save your work.</div>
          </div>
        </div>
        
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; font-size: 14px; color: #92400e; max-width: fit-content;">
          <ExclamationTriangleIcon style="width: 16px; height: 16px;" />
          <span>Beta Feature - Use with caution</span>
        </div>
      </div>
      
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes flash {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ExclamationTriangleIcon usage in common warning patterns like system alerts, form validation errors, security notifications, and critical system messages.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { ExclamationTriangleIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">ExclamationTriangleIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Warning and caution icon component for alerts, validation errors, and important notifications. Based on Heroicons design with flexible sizing and styling options.
          </p>
        </div>

        <!-- Usage Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Form Validation</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Display validation errors and warnings in forms</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ExclamationTriangleIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Password too weak</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #ef4444;">System Alerts</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #dc2626;">Critical system warnings and error states</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ExclamationTriangleIcon style="color: #ef4444; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #dc2626;">Service unavailable</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Status Indicators</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Show warning status in dashboards and lists</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ExclamationTriangleIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #059669;">Maintenance mode</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #ec4899;">User Notifications</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #be185d;">Important user-facing notifications</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ExclamationTriangleIcon style="color: #ec4899; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #be185d;">Account expires soon</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Size and Color Variants -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Size & Color Variations</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Sizes -->
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #374151;">Available Sizes</h3>
              <div style="display: flex; align-items: center; gap: 24px;">
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">16px</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #f59e0b; width: 20px; height: 20px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">20px</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #f59e0b; width: 24px; height: 24px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">24px</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #f59e0b; width: 32px; height: 32px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">32px</div>
                </div>
              </div>
            </div>

            <!-- Colors -->
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #374151;">Semantic Colors</h3>
              <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #f59e0b; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Warning</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #ef4444; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Error</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #6366f1; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Info</div>
                </div>
                <div style="text-align: center;">
                  <ExclamationTriangleIcon style="color: #6b7280; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Neutral</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation Examples -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Animation Effects</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ExclamationTriangleIcon style="color: #f59e0b; width: 32px; height: 32px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Pulse</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For ongoing warnings</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ExclamationTriangleIcon style="color: #ef4444; width: 32px; height: 32px; animation: shake 0.5s ease-in-out infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Shake</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For validation errors</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ExclamationTriangleIcon style="color: #dc2626; width: 32px; height: 32px; animation: flash 1s linear infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Flash</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For urgent alerts</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ExclamationTriangleIcon style="color: #6366f1; width: 32px; height: 32px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" />
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ExclamationTriangleIcon /&gt;</code></pre>
            </div>

            <!-- With Custom Styling -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Custom Styling</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ExclamationTriangleIcon 
  style="color: #ef4444; width: 20px; height: 20px;"
/&gt;</code></pre>
            </div>

            <!-- With Animation -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">With Animation</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ExclamationTriangleIcon 
  class="pulse-animation"
  style="color: #f59e0b;"
/&gt;</code></pre>
            </div>

            <!-- In Alert Component -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">In Alert Component</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="alert-warning"&gt;
  &lt;ExclamationTriangleIcon /&gt;
  &lt;span&gt;Warning message&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div style="padding: 24px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #92400e;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Use consistent colors for semantic meaning</li>
                <li>Pair with descriptive text for accessibility</li>
                <li>Use appropriate sizes for the context</li>
                <li>Animate sparingly for important alerts only</li>
                <li>Ensure sufficient color contrast</li>
                <li>Use in validation messages and system alerts</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Using for decorative purposes only</li>
                <li>Inconsistent color meanings across the app</li>
                <li>Overusing animations (causes fatigue)</li>
                <li>Using without accompanying text</li>
                <li>Making icons too small to be recognizable</li>
                <li>Using in success or positive contexts</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Include aria-hidden="true" for decorative icons</li>
                <li>Provide alt text when used as content</li>
                <li>Ensure minimum 3:1 color contrast</li>
                <li>Don't rely solely on color for meaning</li>
                <li>Test with screen readers</li>
                <li>Consider motion-sensitive users</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations -->
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          @keyframes flash {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.3; }
          }
        </style>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the ExclamationTriangleIcon component including usage scenarios, styling options, animations, implementation examples, and accessibility best practices.',
      },
    },
  },
}