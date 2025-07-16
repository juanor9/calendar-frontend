import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'UI/Buttons/Base Button',
  component: BaseButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
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

export const Danger: Story = {
  args: { label: 'Delete', variant: 'danger' },
}

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
}
