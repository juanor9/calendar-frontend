import type { Meta, StoryObj } from '@storybook/vue3'
import ArrowRightIcon from './ArrowRightIcon.vue'

const meta: Meta<typeof ArrowRightIcon> = {
  title: 'Icons/Arrow Right',
  component: ArrowRightIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A right-pointing arrow icon used for navigation, indicating direction or next steps. Styling variants are applied via CSS classes following the BEM methodology and Vana design system.',
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
    template: `<ArrowRightIcon class="arrow-right-icon--small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon class="arrow-right-icon--large" />`,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { ArrowRightIcon },
    template: `<ArrowRightIcon class="arrow-right-icon--interactive" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hover over the icon to see the interactive animation effect.',
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
          <ArrowRightIcon class="arrow-right-icon--primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon class="arrow-right-icon--secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon class="arrow-right-icon--success" />
          <span style="font-size: 12px; color: #6b7280;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon class="arrow-right-icon--warning" />
          <span style="font-size: 12px; color: #6b7280;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon class="arrow-right-icon--error" />
          <span style="font-size: 12px; color: #6b7280;">Error</span>
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
          <ArrowRightIcon class="arrow-right-icon--small" />
          <span style="font-size: 12px; color: #6b7280;">Small (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon />
          <span style="font-size: 12px; color: #6b7280;">Medium (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ArrowRightIcon class="arrow-right-icon--large" />
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
        <button style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: white; cursor: pointer;">
          <span>Next Step</span>
          <ArrowRightIcon class="arrow-right-icon--interactive" />
        </button>
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
          <span style="color: #6b7280;">Continue to payment</span>
          <ArrowRightIcon class="arrow-right-icon--small arrow-right-icon--secondary" />
        </div>
        <nav style="display: flex; align-items: center; gap: 4px; font-size: 14px;">
          <a href="#" style="color: #3b82f6; text-decoration: none;">Home</a>
          <ArrowRightIcon class="arrow-right-icon--small arrow-right-icon--secondary" />
          <a href="#" style="color: #3b82f6; text-decoration: none;">Products</a>
          <ArrowRightIcon class="arrow-right-icon--small arrow-right-icon--secondary" />
          <span style="color: #6b7280;">Current Page</span>
        </nav>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of ArrowRightIcon usage in common UI patterns like buttons, links, and breadcrumbs.',
      },
    },
  },
}
