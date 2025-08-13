import type { Meta, StoryObj } from '@storybook/vue3'
import ShieldIcon from './ShieldIcon.vue'

const meta: Meta<typeof ShieldIcon> = {
  title: 'Icons/Shield',
  component: ShieldIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A shield with checkmark icon used for security, privacy, protection, and verification features. Essential for security dashboards, privacy controls, verified badges, and protection indicators. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof ShieldIcon>

export const Default: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `<ShieldIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const Pulsing: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <ShieldIcon style="
        color: #10b981; 
        width: 24px; 
        height: 24px;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      " />
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .8; transform: scale(1.05); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pulsing animation to indicate active security protection.',
      },
    },
  },
}

export const Glowing: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <ShieldIcon style="
        color: #10b981; 
        width: 24px; 
        height: 24px;
        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
        animation: glow 2s ease-in-out infinite alternate;
      " />
      <style>
        @keyframes glow {
          from { filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3)); }
          to { filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.7)); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Glowing effect to emphasize security features and protection.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #10b981; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Secure</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #3b82f6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Protected</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #8b5cf6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Premium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #ef4444; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">At Risk</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Neutral</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="width: 16px; height: 16px; color: #10b981;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="width: 24px; height: 24px; color: #10b981;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ShieldIcon style="width: 32px; height: 32px; color: #10b981;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Security Badge --!>
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; width: fit-content;">
          <ShieldIcon style="color: #10b981; width: 16px; height: 16px;" />
          <span style="color: #065f46; font-weight: 500; font-size: 14px;">Verified Secure</span>
        </div>
        
        <!-- Security Alert --!>
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <ShieldIcon style="color: #10b981; width: 24px; height: 24px;" />
          <div>
            <div style="font-weight: 600; color: #065f46;">Your account is secure</div>
            <div style="font-size: 14px; color: #059669;">All security checks passed successfully</div>
          </div>
        </div>
        
        <!-- Privacy Protection --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #e7f3ff; border-radius: 8px;">
              <ShieldIcon style="color: #3b82f6; width: 20px; height: 20px;" />
            </div>
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600;">Privacy Protection</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Your data is encrypted and protected</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <ShieldIcon style="color: #10b981; width: 14px; height: 14px;" />
              <span style="font-size: 14px;">End-to-end encryption enabled</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <ShieldIcon style="color: #10b981; width: 14px; height: 14px;" />
              <span style="font-size: 14px;">Two-factor authentication active</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <ShieldIcon style="color: #10b981; width: 14px; height: 14px;" />
              <span style="font-size: 14px;">Regular security audits performed</span>
            </div>
          </div>
        </div>
        
        <!-- Security Settings --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <ShieldIcon style="color: #8b5cf6; width: 20px; height: 20px;" />
            Security Settings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ShieldIcon style="color: #10b981; width: 16px; height: 16px;" />
                <span style="font-weight: 500;">Password Protection</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 12px; color: #059669; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">ENABLED</span>
                <button style="padding: 4px 8px; background: #6b7280; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Edit</button>
              </div>
            </div>
            
            <div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <ShieldIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-weight: 500;">Two-Factor Authentication</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 12px; color: #92400e; background: #fef3c7; padding: 2px 6px; border-radius: 4px;">RECOMMENDED</span>
                <button style="padding: 4px 8px; background: #f59e0b; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Enable</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security Status Cards --!>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center;">
            <ShieldIcon style="color: #10b981; width: 32px; height: 32px; margin-bottom: 8px;" />
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #065f46;">Secure</h4>
            <p style="margin: 0; font-size: 14px; color: #059669;">All protections active</p>
          </div>
          
          <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; text-align: center;">
            <ShieldIcon style="color: #f59e0b; width: 32px; height: 32px; margin-bottom: 8px;" />
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #92400e;">Needs Attention</h4>
            <p style="margin: 0; font-size: 14px; color: #f59e0b;">Update security settings</p>
          </div>
          
          <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; text-align: center;">
            <ShieldIcon style="color: #ef4444; width: 32px; height: 32px; margin-bottom: 8px;" />
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #7f1d1d;">At Risk</h4>
            <p style="margin: 0; font-size: 14px; color: #ef4444;">Immediate action required</p>
          </div>
        </div>
        
        <!-- Premium Security --!>
        <div style="padding: 24px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 8px; color: white; text-align: center;">
          <ShieldIcon style="width: 40px; height: 40px; margin: 0 auto 16px; filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));" />
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Premium Security</h3>
          <p style="margin: 0 0 16px 0; opacity: 0.9;">Advanced protection for your calendar data</p>
          <button style="display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #8b5cf6; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin: 0 auto;">
            <ShieldIcon style="width: 16px; height: 16px;" />
            Upgrade Security
          </button>
        </div>
        
        <!-- Security Checklist --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Security Checklist</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f0fdf4; border-radius: 6px;">
              <ShieldIcon style="color: #10b981; width: 18px; height: 18px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #065f46;">Strong password set</div>
                <div style="font-size: 12px; color: #059669;">Password strength: Excellent</div>
              </div>
              <div style="font-size: 12px; color: #10b981; background: #dcfce7; padding: 4px 8px; border-radius: 4px; font-weight: 500;">✓ DONE</div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #fffbeb; border-radius: 6px;">
              <ShieldIcon style="color: #f59e0b; width: 18px; height: 18px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #92400e;">Enable two-factor authentication</div>
                <div style="font-size: 12px; color: #f59e0b;">Recommended for better security</div>
              </div>
              <button style="font-size: 12px; color: #f59e0b; background: #fef3c7; padding: 4px 8px; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">ENABLE</button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 6px;">
              <ShieldIcon style="color: #64748b; width: 18px; height: 18px;" />
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #1e293b;">Review account permissions</div>
                <div style="font-size: 12px; color: #64748b;">Check app access and permissions</div>
              </div>
              <button style="font-size: 12px; color: #64748b; background: #e2e8f0; padding: 4px 8px; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">REVIEW</button>
            </div>
          </div>
        </div>
        
        <!-- Verification Badge --!>
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px;">
          <div style="position: relative;">
            <ShieldIcon style="color: #0369a1; width: 24px; height: 24px;" />
            <div style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: #10b981; border: 2px solid white; border-radius: 50%;"></div>
          </div>
          <div>
            <div style="font-weight: 600; color: #0c4a6e;">Verified Account</div>
            <div style="font-size: 14px; color: #0369a1;">Your account has been verified and secured</div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ShieldIcon usage in realistic security contexts like badges, alerts, protection features, settings, status cards, premium offers, checklists, and verification indicators.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { ShieldIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header --!>
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">ShieldIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Security and protection icon component with checkmark for verified security, privacy controls, and protection indicators. Essential for security dashboards and trust signals with flexible styling options.
          </p>
        </div>

        <!-- Usage Overview --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Security Features</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Security dashboards and protection status</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ShieldIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Account protected</span>
              </div>
            </div>

            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Privacy Controls</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Privacy settings and data protection</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ShieldIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Privacy protected</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fefbff; border: 1px solid #e9d5ff; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #8b5cf6;">Verification Badges</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7c3aed;">Verified accounts and trust indicators</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ShieldIcon style="color: #8b5cf6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7c3aed;">Verified secure</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Security Warnings</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Security alerts and recommendations</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <ShieldIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Action needed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security States --!>
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Security Status Indicators</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <ShieldIcon style="color: #10b981; width: 32px; height: 32px; margin-bottom: 12px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #065f46;">Secure</h3>
              <p style="margin: 0; font-size: 14px; color: #10b981;">All protections active</p>
            </div>

            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <ShieldIcon style="color: #3b82f6; width: 32px; height: 32px; margin-bottom: 12px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e40af;">Protected</h3>
              <p style="margin: 0; font-size: 14px; color: #3b82f6;">Privacy enabled</p>
            </div>

            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <ShieldIcon style="color: #f59e0b; width: 32px; height: 32px; margin-bottom: 12px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #92400e;">Warning</h3>
              <p style="margin: 0; font-size: 14px; color: #f59e0b;">Review settings</p>
            </div>

            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <ShieldIcon style="color: #ef4444; width: 32px; height: 32px; margin-bottom: 12px;" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #7f1d1d;">At Risk</h3>
              <p style="margin: 0; font-size: 14px; color: #ef4444;">Action required</p>
            </div>

            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <ShieldIcon style="color: #8b5cf6; width: 32px; height: 32px; margin-bottom: 12px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #7c3aed;">Premium</h3>
              <p style="margin: 0; font-size: 14px; color: #8b5cf6;">Enhanced security</p>
            </div>

            <div style="text-align: center; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="position: relative; display: inline-block; margin-bottom: 12px;">
                <ShieldIcon style="color: #0369a1; width: 32px; height: 32px;" />
                <div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background: #10b981; border: 2px solid white; border-radius: 50%;"></div>
              </div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #0c4a6e;">Verified</h3>
              <p style="margin: 0; font-size: 14px; color: #0369a1;">Account verified</p>
            </div>
          </div>
        </div>

        <!-- Features Grid --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Security Features</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔒</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Data Encryption</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">End-to-end encryption for calendar data</p>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔐</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Access Control</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Fine-grained permission management</p>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🛡️</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Threat Protection</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Real-time security monitoring</p>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">✅</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Verification</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Account and identity verification</p>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Security Analytics</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Detailed security insights and reports</p>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔔</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Alert System</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Instant security notifications</p>
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ShieldIcon /&gt;</code></pre>
            </div>

            <!-- Security Badge --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Security Badge</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="security-badge"&gt;
  &lt;ShieldIcon /&gt;
  Verified Secure
&lt;/div&gt;</code></pre>
            </div>

            <!-- Status Indicator --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Status Indicator</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ShieldIcon 
  :class="securityStatusClass"
  :style="{ color: statusColor }"
/&gt;</code></pre>
            </div>

            <!-- With Animation --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Animated Protection</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;ShieldIcon 
  class="animate-pulse"
  style="color: #10b981"
/&gt;</code></pre>
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
                <li>Use green colors for secure/protected states</li>
                <li>Use consistent colors for security levels</li>
                <li>Provide clear context for security status</li>
                <li>Include descriptive text with security icons</li>
                <li>Use in security dashboards and settings</li>
                <li>Show verification badges for trusted accounts</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Using for non-security related features</li>
                <li>Overusing animations (causes distraction)</li>
                <li>Using without clear security context</li>
                <li>Misleading users about actual security level</li>
                <li>Using inconsistent color meanings</li>
                <li>Making security status unclear or ambiguous</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #065f46;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #065f46; font-size: 14px; line-height: 1.6;">
                <li>Include descriptive aria-labels</li>
                <li>Don't rely solely on color for security status</li>
                <li>Provide text alternatives for screen readers</li>
                <li>Ensure sufficient color contrast ratios</li>
                <li>Use role="img" for decorative shields</li>
                <li>Test with keyboard and screen reader navigation</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations --!>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .8; transform: scale(1.05); }
          }
          @keyframes glow {
            from { filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3)); }
            to { filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.7)); }
          }
        </style>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the ShieldIcon component including usage scenarios, security states, features, implementation examples, and accessibility best practices for security and protection interfaces.',
      },
    },
  },
}