import type { Meta, StoryObj } from '@storybook/vue3'
import LoadingSkeleton from './LoadingSkeleton.vue'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'UI/Loading Skeleton',
  component: LoadingSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible loading skeleton component that provides visual placeholders while content is loading. Features multiple variants including text, cards, forms, buttons, and avatars with shimmer animations. Follows accessibility best practices and supports reduced motion preferences.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-ui-components',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'card', 'form', 'button', 'avatar', 'rectangle', 'custom'],
      description: 'Type of skeleton to display',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of text lines (for text variant)',
    },
    fields: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Number of form fields (for form variant)',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Enable shimmer animation',
    },
    showAvatar: {
      control: { type: 'boolean' },
      description: 'Show avatar in card variant',
    },
    shortLastLine: {
      control: { type: 'boolean' },
      description: 'Make last line shorter (for text variant)',
    },
  },
}

export default meta
type Story = StoryObj<typeof LoadingSkeleton>

export const Default: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton />`,
  }),
}

export const Text: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="text" :lines="4" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Text skeleton for loading paragraphs and content blocks.',
      },
    },
  },
}

export const Card: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="card" :showAvatar="true" :lines="3" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card skeleton with avatar and text lines for loading user profiles, posts, or content cards.',
      },
    },
  },
}

export const Form: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="form" :fields="4" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Form skeleton with labels, inputs, and submit button for loading forms.',
      },
    },
  },
}

export const Button: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="button" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Button skeleton for loading action buttons.',
      },
    },
  },
}

export const Avatar: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="avatar" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Avatar skeleton for loading user profile pictures.',
      },
    },
  },
}

export const Rectangle: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="rectangle" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rectangle skeleton for loading images, charts, or custom content areas.',
      },
    },
  },
}

export const WithoutAnimation: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `<LoadingSkeleton variant="card" :showAvatar="true" :animated="false" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton without shimmer animation for reduced motion accessibility.',
      },
    },
  },
}

export const Custom: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `
      <LoadingSkeleton variant="custom">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <LoadingSkeleton variant="avatar" style="align-self: center;" />
          <LoadingSkeleton variant="text" :lines="2" />
          <div style="display: flex; gap: 8px;">
            <LoadingSkeleton variant="button" />
            <LoadingSkeleton variant="button" />
          </div>
        </div>
      </LoadingSkeleton>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Custom skeleton composition using the custom variant with nested skeleton components.',
      },
    },
  },
}

export const VariantShowcase: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Text Skeleton</h3>
          <LoadingSkeleton variant="text" :lines="3" />
        </div>
        
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Card Skeleton</h3>
          <LoadingSkeleton variant="card" :showAvatar="true" :lines="2" />
        </div>
        
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Form Skeleton</h3>
          <LoadingSkeleton variant="form" :fields="3" />
        </div>
        
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Avatar Skeleton</h3>
          <LoadingSkeleton variant="avatar" />
        </div>
        
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Button Skeleton</h3>
          <LoadingSkeleton variant="button" />
        </div>
        
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Rectangle Skeleton</h3>
          <LoadingSkeleton variant="rectangle" style="height: 120px;" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available skeleton variants in a grid layout.',
      },
    },
  },
}

export const InContext: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
        <!-- User Profile Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading User Profile</h3>
          <LoadingSkeleton variant="card" :showAvatar="true" :lines="3" />
        </div>

        <!-- Article List Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Articles</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <LoadingSkeleton variant="card" :showAvatar="false" :lines="2" />
            <LoadingSkeleton variant="card" :showAvatar="false" :lines="2" />
            <LoadingSkeleton variant="card" :showAvatar="false" :lines="2" />
          </div>
        </div>

        <!-- Dashboard Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Dashboard</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <LoadingSkeleton variant="text" :lines="1" style="margin-bottom: 12px;" />
              <LoadingSkeleton variant="rectangle" style="height: 80px;" />
            </div>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <LoadingSkeleton variant="text" :lines="1" style="margin-bottom: 12px;" />
              <LoadingSkeleton variant="rectangle" style="height: 80px;" />
            </div>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <LoadingSkeleton variant="text" :lines="1" style="margin-bottom: 12px;" />
              <LoadingSkeleton variant="rectangle" style="height: 80px;" />
            </div>
          </div>
        </div>

        <!-- Form Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Form</h3>
          <LoadingSkeleton variant="form" :fields="4" />
        </div>

        <!-- Chat Interface Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Chat Messages</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <LoadingSkeleton variant="avatar" style="width: 32px; height: 32px;" />
              <div style="flex: 1;">
                <LoadingSkeleton variant="text" :lines="2" :shortLastLine="true" />
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 12px; margin-left: 44px;">
              <div style="flex: 1;">
                <LoadingSkeleton variant="text" :lines="1" />
              </div>
              <LoadingSkeleton variant="avatar" style="width: 32px; height: 32px;" />
            </div>
            <div style="display: flex; align-items: start; gap: 12px;">
              <LoadingSkeleton variant="avatar" style="width: 32px; height: 32px;" />
              <div style="flex: 1;">
                <LoadingSkeleton variant="text" :lines="3" />
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Calendar</h3>
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
            <!-- Calendar header -->
            <div v-for="day in 7" :key="'header-' + day" style="padding: 8px; text-align: center; background: #f3f4f6; font-size: 12px; font-weight: 600;">
              <LoadingSkeleton variant="text" :lines="1" style="height: 12px;" />
            </div>
            <!-- Calendar days -->
            <div v-for="day in 35" :key="'day-' + day" style="aspect-ratio: 1; border: 1px solid #e5e7eb; padding: 4px;">
              <LoadingSkeleton variant="rectangle" style="height: 100%;" />
            </div>
          </div>
        </div>

        <!-- Table Loading -->
        <div style="padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Loading Table</h3>
          <div style="display: flex; flex-direction: column; gap: 1px;">
            <!-- Table header -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 4px;">
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="text" :lines="1" />
            </div>
            <!-- Table rows -->
            <div v-for="row in 5" :key="'row-' + row" style="display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 12px; padding: 12px; border-bottom: 1px solid #f3f4f6;">
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="text" :lines="1" />
              <LoadingSkeleton variant="button" style="height: 32px; width: 80px;" />
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
          'Examples of LoadingSkeleton usage in realistic application contexts like user profiles, article lists, dashboards, forms, chat interfaces, calendars, and data tables.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { LoadingSkeleton },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #6b7280 0%, #374151 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">LoadingSkeleton Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Flexible loading placeholder component with shimmer animations and multiple variants. Provides excellent user experience during content loading with accessibility features and reduced motion support.
          </p>
        </div>

        <!-- Variants Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Available Variants</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Text</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Multiple text lines</p>
              <LoadingSkeleton variant="text" :lines="3" />
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Card</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Avatar + content</p>
              <LoadingSkeleton variant="card" :showAvatar="true" :lines="2" />
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Form</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Labels + inputs</p>
              <LoadingSkeleton variant="form" :fields="2" />
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Button</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Action buttons</p>
              <LoadingSkeleton variant="button" />
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Avatar</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">User profiles</p>
              <LoadingSkeleton variant="avatar" />
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">Rectangle</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Images & charts</p>
              <LoadingSkeleton variant="rectangle" style="height: 60px;" />
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Key Features</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">✨</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Shimmer Animation</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Smooth shimmer effect provides engaging loading experience</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Multiple Variants</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Pre-built skeletons for common UI patterns</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">♿</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Accessibility</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Screen reader support and reduced motion compliance</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔧</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Customizable</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Configurable lines, fields, and animations</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">📱</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Responsive</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Adapts to different screen sizes automatically</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🎯</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Performance</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Lightweight and optimized for smooth animations</p>
            </div>
          </div>
        </div>

        <!-- Configuration Options -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Configuration Options</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Props -->
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #374151;">Available Props</h3>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">variant</code> - Skeleton type (text, card, form, button, avatar, rectangle, custom)</div>
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">lines</code> - Number of text lines (default: 3)</div>
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">fields</code> - Number of form fields (default: 3)</div>
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">animated</code> - Enable shimmer animation (default: true)</div>
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">showAvatar</code> - Show avatar in card (default: false)</div>
                <div><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">shortLastLine</code> - Shorter last text line (default: true)</div>
              </div>
            </div>

            <!-- Animation Control -->
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #374151;">Animation Control</h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 12px; background: #f0fdf4; border-radius: 6px;">
                  <div style="font-weight: 500; color: #065f46; margin-bottom: 4px;">Animated</div>
                  <LoadingSkeleton variant="text" :lines="2" :animated="true" />
                </div>
                <div style="padding: 12px; background: #fef2f2; border-radius: 6px;">
                  <div style="font-weight: 500; color: #7f1d1d; margin-bottom: 4px;">Static</div>
                  <LoadingSkeleton variant="text" :lines="2" :animated="false" />
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
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Basic Text Skeleton</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoadingSkeleton 
  variant="text" 
  :lines="4" 
/&gt;</code></pre>
            </div>

            <!-- Card with Avatar -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Card with Avatar</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoadingSkeleton 
  variant="card"
  :showAvatar="true"
  :lines="3"
/&gt;</code></pre>
            </div>

            <!-- Form Skeleton -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Form Fields</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoadingSkeleton 
  variant="form"
  :fields="5"
/&gt;</code></pre>
            </div>

            <!-- Without Animation -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Static Skeleton</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoadingSkeleton 
  variant="card"
  :animated="false"
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #1e293b;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e293b;">✅ Recommended Usage</h3>
              <ul style="margin: 0; padding-left: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
                <li>Match skeleton structure to actual content</li>
                <li>Use appropriate variants for different content types</li>
                <li>Keep loading times under 3 seconds when possible</li>
                <li>Provide aria-labels for screen readers</li>
                <li>Respect user's reduced motion preferences</li>
                <li>Use consistent skeleton patterns across your app</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e293b;">❌ Avoid</h3>
              <ul style="margin: 0; padding-left: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
                <li>Using skeletons for very fast loading content</li>
                <li>Creating skeletons that don't match final content</li>
                <li>Overusing animations (causes motion sickness)</li>
                <li>Ignoring accessibility requirements</li>
                <li>Using skeletons for error states</li>
                <li>Making skeletons too complex or detailed</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e293b;">🔍 Accessibility</h3>
              <ul style="margin: 0; padding-left: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
                <li>Include role="status" for screen readers</li>
                <li>Provide descriptive aria-labels</li>
                <li>Respect prefers-reduced-motion setting</li>
                <li>Use sufficient color contrast for visibility</li>
                <li>Announce loading state changes</li>
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
        story: 'Complete visual documentation of the LoadingSkeleton component including all variants, configuration options, implementation examples, and accessibility best practices.',
      },
    },
  },
}