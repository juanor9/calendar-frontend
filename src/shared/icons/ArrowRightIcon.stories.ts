import type { Meta, StoryObj } from '@storybook/vue3'
import ArrowRightIcon from './ArrowRightIcon.vue'

const meta: Meta<typeof ArrowRightIcon> = {
  title: 'Icons/Arrow Right',
  component: ArrowRightIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A right-pointing arrow icon used for navigation, progression, and directional guidance. Essential for wizards, next buttons, carousel navigation, and flow indicators. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ArrowRightIcon>

export const Default: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon style="cursor: pointer; transition: transform 0.2s; width: 24px; height: 24px; color: #6366f1;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive arrow that slides right on hover to show directional movement.',
      },
    },
  },
}

export const Animated: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `
      <ArrowRightIcon style="
        color: #6366f1; 
        width: 24px; 
        height: 24px;
        animation: slideRight 1.5s ease-in-out infinite;
      " />
      <style>
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Animated arrow with sliding motion to indicate progression or next action.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #6366f1; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #059669; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #dc2626; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Danger</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Neutral</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="color: #8b5cf6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Purple</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="width: 16px; height: 16px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="width: 24px; height: 24px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon style="width: 32px; height: 32px; color: #6366f1;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Next Button --!>
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
          Next Step
          <ArrowRightIcon style="width: 18px; height: 18px;" />
        </button>
        
        <!-- Navigation Breadcrumb --!>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border-radius: 6px;">
          <span style="color: #6b7280;">Home</span>
          <ArrowRightIcon style="width: 14px; height: 14px; color: #9ca3af;" />
          <span style="color: #6b7280;">Calendar</span>
          <ArrowRightIcon style="width: 14px; height: 14px; color: #9ca3af;" />
          <span style="color: #111827; font-weight: 500;">Settings</span>
        </div>
        
        <!-- Process Flow --!>
        <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 32px; height: 32px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">1</div>
            <span style="font-size: 12px; color: #6b7280;">Account</span>
          </div>
          <ArrowRightIcon style="color: #10b981; width: 20px; height: 20px;" />
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 32px; height: 32px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">2</div>
            <span style="font-size: 12px; color: #6b7280;">Profile</span>
          </div>
          <ArrowRightIcon style="color: #d1d5db; width: 20px; height: 20px;" />
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 32px; height: 32px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: 600; font-size: 14px;">3</div>
            <span style="font-size: 12px; color: #6b7280;">Complete</span>
          </div>
        </div>
        
        <!-- Link with Arrow --!>
        <a href="#" style="display: inline-flex; align-items: center; gap: 6px; color: #6366f1; text-decoration: none; font-weight: 500; width: fit-content;">
          Learn more about calendar integration
          <ArrowRightIcon style="width: 16px; height: 16px; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(2px)'" onmouseout="this.style.transform='translateX(0)'" />
        </a>
        
        <!-- Card Navigation --!>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#6366f1'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
            <div style="display: flex; justify-content: between; align-items: center;">
              <div>
                <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">Calendar Settings</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Manage your calendar preferences</p>
              </div>
              <ArrowRightIcon style="color: #6b7280; width: 20px; height: 20px;" />
            </div>
          </div>
          
          <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#6366f1'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
            <div style="display: flex; justify-content: between; align-items: center;">
              <div>
                <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">Privacy Controls</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Control your data and privacy</p>
              </div>
              <ArrowRightIcon style="color: #6b7280; width: 20px; height: 20px;" />
            </div>
          </div>
        </div>
        
        <!-- Carousel Navigation --!>
        <div style="display: flex; align-items: center; gap: 12px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <button style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <ArrowRightIcon style="width: 16px; height: 16px; color: #6b7280; transform: rotate(180deg);" />
          </button>
          
          <div style="flex: 1; text-align: center; padding: 20px;">
            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Feature Showcase</h3>
            <p style="margin: 0; color: #6b7280;">Discover powerful calendar features</p>
          </div>
          
          <button style="padding: 8px; background: #6366f1; border: 1px solid #6366f1; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <ArrowRightIcon style="width: 16px; height: 16px; color: white;" />
          </button>
        </div>
        
        <!-- Menu Item --!>
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; display: flex; justify-content: between; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='white'">
            <span style="font-weight: 500;">Account Settings</span>
            <ArrowRightIcon style="width: 16px; height: 16px; color: #6b7280;" />
          </div>
          <div style="padding: 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; display: flex; justify-content: between; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='white'">
            <span style="font-weight: 500;">Notification Preferences</span>
            <ArrowRightIcon style="width: 16px; height: 16px; color: #6b7280;" />
          </div>
          <div style="padding: 16px; cursor: pointer; display: flex; justify-content: between; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='white'">
            <span style="font-weight: 500;">Integrations</span>
            <ArrowRightIcon style="width: 16px; height: 16px; color: #6b7280;" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ArrowRightIcon usage in realistic navigation contexts like next buttons, breadcrumbs, process flows, links, cards, carousels, and menu items.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header --!>
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">ArrowRightIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Right-pointing arrow icon for navigation, progression, and directional guidance. Essential for user flows, wizards, and navigation elements with flexible styling options.
          </p>
        </div>

        <!-- Usage Overview --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Navigation Buttons</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Next steps, continue actions, and progression</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ArrowRightIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Continue to next step</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Process Flows</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Wizard steps and multi-step processes</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ArrowRightIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Step progression indicator</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Breadcrumbs</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Navigation path indicators</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ArrowRightIcon style="color: #8b5cf6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Path separator</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Call-to-Actions</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Links and action prompts</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ArrowRightIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Learn more link</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation Examples --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Animation Effects</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ArrowRightIcon style="color: #6366f1; width: 32px; height: 32px; animation: slideRight 1.5s ease-in-out infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Slide</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">For progression</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ArrowRightIcon style="color: #10b981; width: 32px; height: 32px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Hover</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Interactive feedback</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ArrowRightIcon style="color: #f59e0b; width: 32px; height: 32px; animation: bounce 1s infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Bounce</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Call attention</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <ArrowRightIcon style="color: #ef4444; width: 32px; height: 32px; animation: pulse 2s infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Pulse</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Urgent actions</p>
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ArrowRightIcon /&gt;</code></pre>
            </div>

            <!-- In Button --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">In Button</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;button&gt;
  Next Step
  &lt;ArrowRightIcon /&gt;
&lt;/button&gt;</code></pre>
            </div>

            <!-- Breadcrumb --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Breadcrumb</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div&gt;
  &lt;span&gt;Home&lt;/span&gt;
  &lt;ArrowRightIcon /&gt;
  &lt;span&gt;Settings&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>

            <!-- Animated --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">With Animation</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ArrowRightIcon 
  class="animate-slide-right"
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices --!>
        <div style="padding: 24px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #1e40af;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Use for forward navigation and progression</li>
                <li>Place after text in buttons for natural flow</li>
                <li>Use consistent colors for similar actions</li>
                <li>Add hover effects for interactive elements</li>
                <li>Use in breadcrumbs between navigation items</li>
                <li>Include in multi-step processes and wizards</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Using for backward navigation (use left arrow)</li>
                <li>Overusing animations (causes distraction)</li>
                <li>Using without clear directional context</li>
                <li>Making non-interactive icons look clickable</li>
                <li>Using inconsistent sizes in the same context</li>
                <li>Placing before text in buttons (breaks natural flow)</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Include aria-label for screen readers</li>
                <li>Ensure sufficient color contrast ratios</li>
                <li>Make clickable areas at least 44x44 pixels</li>
                <li>Provide text alternatives for icon-only buttons</li>
                <li>Support keyboard navigation and focus states</li>
                <li>Test with screen reader navigation</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations --!>
        <style>
          @keyframes slideRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(8px); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
        </style>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the ArrowRightIcon component including usage scenarios, animation effects, implementation examples, and accessibility best practices for directional navigation.',
      },
    },
  },
}
