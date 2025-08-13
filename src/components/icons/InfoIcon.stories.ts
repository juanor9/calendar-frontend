import type { Meta, StoryObj } from '@storybook/vue3'
import InfoIcon from './InfoIcon.vue'

const meta: Meta<typeof InfoIcon> = {
  title: 'Icons/Info',
  component: InfoIcon,
  parameters: {
    docs: {
      description: {
        component:
          'An information icon (currently displays as a circle with arrow) used for informational messages, help tooltips, and neutral notifications. Essential for providing contextual information and user guidance. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof InfoIcon>

export const Default: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `<InfoIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `<InfoIcon style="font-size: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `<InfoIcon style="font-size: 32px;" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `<InfoIcon style="cursor: pointer; transition: transform 0.2s; font-size: 24px; color: #3b82f6;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />`,
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
    components: { InfoIcon },
    template: `
      <InfoIcon style="
        color: #3b82f6; 
        font-size: 24px;
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
        story: 'Pulsing animation to draw attention to important information.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #3b82f6; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Info</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #6366f1; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #8b5cf6; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Purple</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #06b6d4; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Cyan</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #6b7280; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Gray</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="color: #f59e0b; font-size: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Amber</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="font-size: 16px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="font-size: 24px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <InfoIcon style="font-size: 32px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Info Alert -->
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <InfoIcon style="color: #3b82f6; font-size: 20px;" />
          <span style="color: #1e40af;">Your calendar sync will update in a few minutes.</span>
        </div>
        
        <!-- Help Tooltip -->
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; max-width: fit-content;">
          <span style="font-size: 14px; color: #374151;">Need help?</span>
          <InfoIcon style="color: #64748b; font-size: 16px; cursor: pointer;" />
        </div>
        
        <!-- Form Field Helper -->
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <label style="font-weight: 500; font-size: 14px;">Password</label>
              <InfoIcon style="color: #6b7280; font-size: 14px; cursor: help;" title="Password must be at least 8 characters long" />
            </div>
            <input 
              type="password" 
              style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;"
              placeholder="Enter your password"
            />
            <div style="display: flex; align-items: center; gap: 4px;">
              <InfoIcon style="color: #6b7280; font-size: 12px;" />
              <span style="color: #6b7280; font-size: 12px;">Must contain at least 8 characters</span>
            </div>
          </div>
        </form>
        
        <!-- Information Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <InfoIcon style="color: #3b82f6; font-size: 20px;" />
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">Pro Tip</h3>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              Use keyboard shortcuts to navigate faster through your calendar.
            </p>
          </div>
          
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <InfoIcon style="color: #8b5cf6; font-size: 20px;" />
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">Did You Know?</h3>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              You can sync multiple calendar accounts in your settings.
            </p>
          </div>
        </div>
        
        <!-- Notification Bar -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fefce8; border: 1px solid #fef3c7; border-radius: 8px;">
          <InfoIcon style="color: #f59e0b; font-size: 20px;" />
          <div style="flex: 1;">
            <div style="font-weight: 500; color: #92400e; margin-bottom: 2px;">System Maintenance</div>
            <div style="font-size: 14px; color: #a16207;">Scheduled maintenance will occur tonight from 2-4 AM EST.</div>
          </div>
          <button style="padding: 4px 12px; background: transparent; border: 1px solid #f59e0b; color: #f59e0b; border-radius: 4px; font-size: 14px; cursor: pointer;">
            Learn More
          </button>
        </div>
        
        <!-- Toast Notification -->
        <div style="position: fixed; top: 20px; right: 20px; display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 300px;">
          <InfoIcon style="color: #3b82f6; font-size: 24px;" />
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #111827;">New Feature Available</div>
            <div style="font-size: 14px; color: #6b7280;">Check out the new calendar view options</div>
          </div>
        </div>
        
        <!-- FAQ Section -->
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Frequently Asked Questions</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: start; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <InfoIcon style="color: #6366f1; font-size: 18px; margin-top: 2px;" />
              <div>
                <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">How do I sync my Google Calendar?</div>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
                  Go to Settings > Integrations and click "Connect Google Calendar" to link your account.
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <InfoIcon style="color: #6366f1; font-size: 18px; margin-top: 2px;" />
              <div>
                <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">Can I share my calendar with team members?</div>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
                  Yes, use the sharing options in your calendar settings to invite team members.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of InfoIcon usage in common informational contexts like alerts, tooltips, help sections, notifications, and educational content.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { InfoIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">InfoIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Information and help icon component for providing contextual information, tooltips, and user guidance. Flexible styling options for various informational contexts.
          </p>
        </div>

        <!-- Usage Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Help & Tooltips</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Provide contextual help and explanations</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <InfoIcon style="color: #3b82f6; font-size: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Click for more info</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #0369a1;">Informational Alerts</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #0c4a6e;">Display neutral informational messages</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <InfoIcon style="color: #0369a1; font-size: 16px;" />
                <span style="font-size: 12px; color: #0c4a6e;">System update available</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Educational Content</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Tips, tricks, and learning materials</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <InfoIcon style="color: #8b5cf6; font-size: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Pro tip available</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #64748b;">Form Assistance</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Field explanations and input guidance</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <InfoIcon style="color: #64748b; font-size: 16px;" />
                <span style="font-size: 12px; color: #475569;">Field requirements</span>
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
                  <InfoIcon style="color: #3b82f6; font-size: 16px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">16px</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #3b82f6; font-size: 20px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">20px</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #3b82f6; font-size: 24px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">24px</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #3b82f6; font-size: 32px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">32px</div>
                </div>
              </div>
            </div>

            <!-- Colors -->
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #374151;">Semantic Colors</h3>
              <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <InfoIcon style="color: #3b82f6; font-size: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Info</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #6366f1; font-size: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Primary</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #8b5cf6; font-size: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Purple</div>
                </div>
                <div style="text-align: center;">
                  <InfoIcon style="color: #6b7280; font-size: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Neutral</div>
                </div>
              </div>
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;InfoIcon /&gt;</code></pre>
            </div>

            <!-- With Custom Styling -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Custom Styling</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;InfoIcon 
  style="color: #3b82f6; font-size: 20px;"
/&gt;</code></pre>
            </div>

            <!-- As Help Button -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">As Help Button</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;button @click="showHelp"&gt;
  &lt;InfoIcon /&gt;
&lt;/button&gt;</code></pre>
            </div>

            <!-- Info Alert -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Info Alert</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="alert-info"&gt;
  &lt;InfoIcon /&gt;
  &lt;span&gt;Information message&lt;/span&gt;
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
                <li>Use blue colors for informational content</li>
                <li>Provide clear, helpful tooltips on hover</li>
                <li>Place near form fields that need explanation</li>
                <li>Use in FAQ sections and help documentation</li>
                <li>Provide additional context without cluttering</li>
                <li>Make clickable when additional info is available</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Using for error or success states</li>
                <li>Overloading interfaces with too many info icons</li>
                <li>Using without providing actual information</li>
                <li>Making non-interactive icons look clickable</li>
                <li>Using inconsistent colors for information</li>
                <li>Placing in contexts that already have labels</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Include proper aria-label for screen readers</li>
                <li>Ensure tooltips are keyboard accessible</li>
                <li>Provide text alternatives for icon-only buttons</li>
                <li>Use sufficient color contrast ratios</li>
                <li>Don't rely solely on color to convey meaning</li>
                <li>Test with keyboard and screen reader navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the InfoIcon component including usage scenarios, styling options, implementation examples, and accessibility best practices.',
      },
    },
  },
}