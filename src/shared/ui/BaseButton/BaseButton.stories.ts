import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'UI/Buttons/Base Button',
  component: BaseButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    label: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    ariaLabel: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof BaseButton>

export const Primary: Story = {
  args: { label: 'Primary', variant: 'primary' },
}

export const Secondary: Story = {
  args: { label: 'Secondary', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { label: 'Ghost', variant: 'ghost' },
}

export const Outline: Story = {
  args: { label: 'Outline', variant: 'outline' },
}

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
}

export const Loading: Story = {
  args: { label: 'Loading...', loading: true },
}

export const FullWidth: Story = {
  args: { label: 'Full Width Button', width: 'full' },
}
