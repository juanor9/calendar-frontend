import type { Meta, StoryObj } from '@storybook/vue3'
import CheckIcon from './CheckIcon.vue'

const meta: Meta<typeof CheckIcon> = {
  title: 'Icons/Check',
  component: CheckIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A checkmark icon used for success states, completed tasks, confirmations, and validation. Essential for form validation, task completion, success notifications, and positive user feedback. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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

export const Small: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `<CheckIcon style="cursor: pointer; transition: transform 0.2s; width: 24px; height: 24px; color: #059669;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive scaling effect.',
      },
    },
  },
}

export const WithBounce: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <CheckIcon style="
        color: #059669; 
        width: 24px; 
        height: 24px;
        animation: bounce 1s infinite;
      " />
      <style>
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Bounce animation for celebrating successful actions or completion.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #059669; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #6366f1; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #10b981; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Emerald</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #3b82f6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Blue</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Gray</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="color: #ffffff; width: 24px; height: 24px; background: #059669; border-radius: 50%; padding: 4px;" />
          <span style="font-size: 12px; color: #6b7280;">Inverted</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="width: 16px; height: 16px; color: #059669;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="width: 24px; height: 24px; color: #059669;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <CheckIcon style="width: 32px; height: 32px; color: #059669;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Success Alert -->
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <CheckIcon style="color: #059669; width: 20px; height: 20px;" />
          <span style="color: #065f46;">Your profile has been updated successfully!</span>
        </div>
        
        <!-- Form Validation Success -->
        <form style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-weight: 500; font-size: 14px;">Email Address</label>
            <div style="position: relative;">
              <input 
                type="email" 
                value="user@example.com"
                style="width: 100%; padding: 8px 12px; border: 2px solid #10b981; border-radius: 6px; outline: none;"
                readonly
              />
              <CheckIcon style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #10b981; width: 16px; height: 16px;" />
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <CheckIcon style="color: #10b981; width: 14px; height: 14px;" />
              <span style="color: #065f46; font-size: 12px;">Valid email format</span>
            </div>
          </div>
        </form>
        
        <!-- Task Completion -->
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Task Progress</h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <CheckIcon style="color: white; width: 14px; height: 14px;" />
            </div>
            <span style="text-decoration: line-through; color: #6b7280;">Complete user registration</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <CheckIcon style="color: white; width: 14px; height: 14px;" />
            </div>
            <span style="text-decoration: line-through; color: #6b7280;">Set up authentication</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; border: 2px solid #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            </div>
            <span style="color: #374151;">Configure calendar sync</span>
          </div>
        </div>
        
        <!-- Success Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
            <div style="width: 48px; height: 48px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <CheckIcon style="color: white; width: 24px; height: 24px;" />
            </div>
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">Setup Complete</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your calendar is now synchronized and ready to use.</p>
          </div>
          
          <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
            <div style="width: 48px; height: 48px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <CheckIcon style="color: white; width: 24px; height: 24px;" />
            </div>
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">Payment Confirmed</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your subscription has been activated successfully.</p>
          </div>
        </div>
        
        <!-- Toast Notification -->
        <div style="position: fixed; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 300px;">
          <div style="width: 32px; height: 32px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <CheckIcon style="color: white; width: 18px; height: 18px;" />
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #111827;">Success!</div>
            <div style="font-size: 14px; color: #6b7280;">Changes saved automatically</div>
          </div>
        </div>
        
        <!-- Checklist -->
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Onboarding Checklist</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div style="width: 20px; height: 20px; background: #10b981; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <CheckIcon style="color: white; width: 12px; height: 12px;" />
              </div>
              <span style="color: #374151; text-decoration: line-through;">Create your account</span>
            </label>
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div style="width: 20px; height: 20px; background: #10b981; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <CheckIcon style="color: white; width: 12px; height: 12px;" />
              </div>
              <span style="color: #374151; text-decoration: line-through;">Verify your email</span>
            </label>
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div style="width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
              </div>
              <span style="color: #374151;">Connect your calendar</span>
            </label>
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div style="width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
              </div>
              <span style="color: #374151;">Set your preferences</span>
            </label>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of CheckIcon usage in common success patterns like alerts, form validation, task completion, progress indicators, and user notifications.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { CheckIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">CheckIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Success and confirmation icon component for completed actions, positive feedback, and validation states. Based on Heroicons design with flexible sizing and styling options.
          </p>
        </div>

        <!-- Usage Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #10b981;">Success Feedback</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Confirm successful operations and positive user actions</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <CheckIcon style="color: #10b981; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Changes saved successfully</span>
              </div>
            </div>

            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Form Validation</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Indicate valid input and successful validation</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <CheckIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Email format is valid</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Task Completion</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Show completed tasks and progress indicators</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <CheckIcon style="color: #8b5cf6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Task completed</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #64748b;">Selection States</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Indicate selected items in lists and checkboxes</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <CheckIcon style="color: #64748b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #475569;">Item selected</span>
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
                  <CheckIcon style="color: #10b981; width: 16px; height: 16px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">16px</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #10b981; width: 20px; height: 20px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">20px</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #10b981; width: 24px; height: 24px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">24px</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #10b981; width: 32px; height: 32px;" />
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">32px</div>
                </div>
              </div>
            </div>

            <!-- Colors -->
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #374151;">Semantic Colors</h3>
              <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <CheckIcon style="color: #10b981; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Success</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #6366f1; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Primary</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #3b82f6; width: 24px; height: 24px;" />
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Info</div>
                </div>
                <div style="text-align: center;">
                  <CheckIcon style="color: #6b7280; width: 24px; height: 24px;" />
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;CheckIcon /&gt;</code></pre>
            </div>

            <!-- With Custom Styling -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Custom Styling</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;CheckIcon 
  style="color: #10b981; width: 20px; height: 20px;"
/&gt;</code></pre>
            </div>

            <!-- In Button -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">In Button</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;button&gt;
  &lt;CheckIcon /&gt;
  &lt;span&gt;Confirm&lt;/span&gt;
&lt;/button&gt;</code></pre>
            </div>

            <!-- Success Alert -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Success Alert</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="alert-success"&gt;
  &lt;CheckIcon /&gt;
  &lt;span&gt;Success message&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div style="padding: 24px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #065f46;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Use green colors for success states</li>
                <li>Pair with confirmatory text messages</li>
                <li>Use in form validation for valid inputs</li>
                <li>Indicate completed tasks and progress</li>
                <li>Provide immediate feedback for user actions</li>
                <li>Use consistent sizing within components</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Using for error or warning states</li>
                <li>Overusing in interfaces (causes noise)</li>
                <li>Using without accompanying text</li>
                <li>Using inconsistent colors for success</li>
                <li>Making icons too small to be visible</li>
                <li>Using in contexts that aren't positive</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Include aria-label when used alone</li>
                <li>Provide text alternative for screen readers</li>
                <li>Ensure sufficient color contrast</li>
                <li>Don't rely solely on color for meaning</li>
                <li>Use semantic HTML where appropriate</li>
                <li>Test with keyboard navigation</li>
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
        story: 'Complete visual documentation of the CheckIcon component including usage scenarios, styling options, implementation examples, and accessibility best practices.',
      },
    },
  },
}