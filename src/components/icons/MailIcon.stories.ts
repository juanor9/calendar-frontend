import type { Meta, StoryObj } from '@storybook/vue3'
import MailIcon from './MailIcon.vue'

const meta: Meta<typeof MailIcon> = {
  title: 'Icons/Mail',
  component: MailIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A mail/email icon used for communication features, contact forms, notifications, and email-related actions. Essential for user communication, invitations, and messaging interfaces. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
type Story = StoryObj<typeof MailIcon>

export const Default: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon style="width: 16px; height: 16px;" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { MailIcon },
    template: `<MailIcon style="width: 32px; height: 32px;" />`,
  }),
}

export const WithNotification: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="position: relative; display: inline-block;">
        <MailIcon style="color: #6366f1; width: 24px; height: 24px;" />
        <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 8px; font-weight: bold;">3</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Mail icon with notification badge showing unread message count.',
      },
    },
  },
}

export const Animated: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <MailIcon style="
        color: #3b82f6; 
        width: 24px; 
        height: 24px;
        animation: mailBounce 2s ease-in-out infinite;
      " />
      <style>
        @keyframes mailBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-1deg); }
          75% { transform: translateY(2px) rotate(1deg); }
        }
      </style>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Animated mail icon with subtle bounce to indicate new messages.',
      },
    },
  },
}

export const ColorVariants: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #3b82f6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #059669; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #dc2626; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Important</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #f59e0b; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #6b7280; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Neutral</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="color: #8b5cf6; width: 24px; height: 24px;" />
          <span style="font-size: 12px; color: #6b7280;">Purple</span>
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="width: 16px; height: 16px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="width: 24px; height: 24px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <MailIcon style="width: 32px; height: 32px; color: #3b82f6;" />
          <span style="font-size: 12px; color: #6b7280;">Large (32px)</span>
        </div>
      </div>
    `,
  }),
}

export const InContext: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Contact Button --!>
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
          <MailIcon style="width: 18px; height: 18px;" />
          Send Email
        </button>
        
        <!-- Notification Alert --!>
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <div style="position: relative;">
            <MailIcon style="color: #3b82f6; width: 20px; height: 20px;" />
            <div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></div>
          </div>
          <span style="color: #1e40af;">You have 3 new messages from your calendar invites.</span>
        </div>
        
        <!-- Email Verification --!>
        <div style="padding: 20px; background: #fefce8; border: 1px solid #fef3c7; border-radius: 8px; text-align: center;">
          <MailIcon style="color: #f59e0b; width: 32px; height: 32px; margin: 0 auto 12px;" />
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #92400e;">Verify Your Email</h3>
          <p style="margin: 0 0 16px 0; color: #a16207;">We've sent a verification link to your email address.</p>
          <button style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Resend Email
          </button>
        </div>
        
        <!-- Contact Form --!>
        <form style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <MailIcon style="color: #6366f1; width: 20px; height: 20px;" />
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Contact Us</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <input 
              type="email" 
              placeholder="Your email address"
              style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;"
            />
            <textarea 
              placeholder="Your message"
              rows="4"
              style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; resize: vertical;"
            ></textarea>
            <button 
              type="submit"
              style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
            >
              <MailIcon style="width: 16px; height: 16px;" />
              Send Message
            </button>
          </div>
        </form>
        
        <!-- Message Cards --!>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; align-items: center; justify-content: between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <MailIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 14px; color: #6b7280;">john@example.com</span>
              </div>
              <span style="font-size: 12px; color: #9ca3af;">2m ago</span>
            </div>
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">Meeting Invitation</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              You've been invited to join the weekly team standup meeting.
            </p>
          </div>
          
          <div style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: flex; align-items: center; justify-content: between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <MailIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 14px; color: #6b7280;">calendar@vana.com</span>
              </div>
              <span style="font-size: 12px; color: #9ca3af;">1h ago</span>
            </div>
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">Event Reminder</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              Don't forget about your appointment at 3:00 PM today.
            </p>
          </div>
        </div>
        
        <!-- Email Settings --!>
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <MailIcon style="color: #6366f1; width: 20px; height: 20px;" />
            Email Preferences
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <input type="checkbox" checked style="margin: 0;" />
              <span>Send me calendar event reminders</span>
            </label>
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <input type="checkbox" checked style="margin: 0;" />
              <span>Notify me of meeting invitations</span>
            </label>
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <input type="checkbox" style="margin: 0;" />
              <span>Weekly calendar digest</span>
            </label>
          </div>
        </div>
        
        <!-- Newsletter Signup --!>
        <div style="padding: 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; color: white; text-align: center;">
          <MailIcon style="width: 32px; height: 32px; margin: 0 auto 16px;" />
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Stay Updated</h3>
          <p style="margin: 0 0 16px 0; opacity: 0.9;">Get the latest calendar tips and productivity insights.</p>
          <div style="display: flex; gap: 8px; max-width: 300px; margin: 0 auto;">
            <input 
              type="email" 
              placeholder="Enter your email"
              style="flex: 1; padding: 12px; border: none; border-radius: 6px; outline: none;"
            />
            <button style="display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: white; color: #6366f1; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              <MailIcon style="width: 16px; height: 16px;" />
              Subscribe
            </button>
          </div>
        </div>
        
        <!-- Support Contact --!>
        <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #e2e8f0; border-radius: 50%;">
            <MailIcon style="color: #64748b; width: 24px; height: 24px;" />
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">Need Help?</h4>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Our support team is here to assist you.</p>
          </div>
          <button style="margin-left: auto; display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer;">
            <MailIcon style="width: 14px; height: 14px;" />
            Contact Support
          </button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of MailIcon usage in realistic communication contexts like contact buttons, notifications, verification, forms, message cards, preferences, newsletters, and support.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { MailIcon },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header --!>
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">MailIcon Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Email and communication icon component for messaging, notifications, and contact features. Flexible styling options for various communication contexts and states.
          </p>
        </div>

        <!-- Usage Overview --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Scenarios</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">Contact & Communication</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">Send emails, contact forms, and messaging</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <MailIcon style="color: #3b82f6; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #1e40af;">Send message button</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #dc2626;">Notifications</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #7f1d1d;">Email alerts and message indicators</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <MailIcon style="color: #dc2626; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #7f1d1d;">3 new messages</span>
              </div>
            </div>

            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">Invitations</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #065f46;">Calendar invites and event sharing</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <MailIcon style="color: #059669; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #065f46;">Meeting invitation sent</span>
              </div>
            </div>

            <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">Verification</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e;">Email verification and confirmation</p>
              <div style="display: flex; align-items: center; gap: 6px;">
                <MailIcon style="color: #f59e0b; width: 16px; height: 16px;" />
                <span style="font-size: 12px; color: #92400e;">Verify email address</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Grid --!>
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Key Features</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">📧</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Communication</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Email sending and messaging interfaces</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔔</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Notifications</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Message alerts with badge support</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">✉️</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Invitations</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Calendar event and meeting invites</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">⚙️</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Preferences</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Email settings and notification controls</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Customizable</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Multiple colors and sizes available</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">♿</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Accessible</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Screen reader support and keyboard navigation</p>
            </div>
          </div>
        </div>

        <!-- State Examples --!>
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">State Variations</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <MailIcon style="color: #6b7280; width: 32px; height: 32px;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Default</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Standard mail icon</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <div style="position: relative; display: inline-block;">
                <MailIcon style="color: #3b82f6; width: 32px; height: 32px;" />
                <div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; font-size: 8px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">5</div>
              </div>
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">With Badge</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Unread messages</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <MailIcon style="color: #10b981; width: 32px; height: 32px;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Success</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Message sent</p>
            </div>

            <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <MailIcon style="color: #f59e0b; width: 32px; height: 32px; animation: mailBounce 2s ease-in-out infinite;" />
              <h3 style="margin: 8px 0 4px 0; font-size: 14px; font-weight: 600;">Animated</h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">New message alert</p>
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
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;MailIcon /&gt;</code></pre>
            </div>

            <!-- In Button --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">In Button</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;button&gt;
  &lt;MailIcon /&gt;
  Send Email
&lt;/button&gt;</code></pre>
            </div>

            <!-- With Notification --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">With Badge</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;div class="relative"&gt;
  &lt;MailIcon /&gt;
  &lt;span class="badge"&gt;3&lt;/span&gt;
&lt;/div&gt;</code></pre>
            </div>

            <!-- Contact Form --!>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Contact Form</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;form&gt;
  &lt;h3&gt;
    &lt;MailIcon /&gt; Contact Us
  &lt;/h3&gt;
  &lt;!-- form fields --&gt;
&lt;/form&gt;</code></pre>
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
                <li>Use blue colors for primary email actions</li>
                <li>Add notification badges for unread counts</li>
                <li>Use in contact forms and messaging interfaces</li>
                <li>Include in email preference settings</li>
                <li>Provide clear action context (send, receive, etc.)</li>
                <li>Use consistent sizing within the same interface</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Using for non-email related actions</li>
                <li>Overusing notification animations</li>
                <li>Using without clear email context</li>
                <li>Making non-clickable icons look interactive</li>
                <li>Using inconsistent badge positioning</li>
                <li>Confusing with other communication icons</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <li>Include aria-label for screen readers</li>
                <li>Provide text alternatives for icon-only buttons</li>
                <li>Ensure sufficient color contrast ratios</li>
                <li>Make clickable areas at least 44x44 pixels</li>
                <li>Support keyboard navigation and focus states</li>
                <li>Announce notification count changes</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CSS Animations --!>
        <style>
          @keyframes mailBounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(-1deg); }
            75% { transform: translateY(2px) rotate(1deg); }
          }
        </style>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete visual documentation of the MailIcon component including usage scenarios, state variations, implementation examples, and accessibility best practices for email and communication interfaces.',
      },
    },
  },
}
