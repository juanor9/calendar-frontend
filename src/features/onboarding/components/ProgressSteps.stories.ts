import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import ProgressSteps from './ProgressSteps.vue'

const meta: Meta<typeof ProgressSteps> = {
  title: 'Components/Onboarding/Progress Steps',
  component: ProgressSteps,
  parameters: {
    docs: {
      description: {
        component:
          'A multi-step progress indicator that shows users their position in a sequential process. Used in onboarding flows, forms, and guided tutorials. Features smooth animations and responsive design.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-onboarding',
    },
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Current active step number (1-based)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of steps in the process',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    steps: {
      control: 'object',
      description: 'Array of step objects with id, title, and optional status',
      table: {
        type: { summary: 'Step[]' },
        defaultValue: { summary: '[]' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProgressSteps>

// Sample step data for stories
const defaultSteps = [
  { id: 1, title: 'Account Setup' },
  { id: 2, title: 'Profile Details' },
  { id: 3, title: 'Preferences' },
]

const onboardingSteps = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Connect Calendar' },
  { id: 3, title: 'Work Style' },
  { id: 4, title: 'AI Setup' },
  { id: 5, title: 'Complete' },
]

export const Default: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    steps: defaultSteps,
  },
}

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    steps: defaultSteps,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the progress indicator at the very beginning of the process.',
      },
    },
  },
}

export const LastStep: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
    steps: defaultSteps,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the progress indicator at the final step with all previous steps completed.',
      },
    },
  },
}

export const FiveStepProcess: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    steps: onboardingSteps,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a longer onboarding process with 5 steps, currently at step 3.',
      },
    },
  },
}

export const CustomStepStatus: Story = {
  args: {
    currentStep: 3,
    totalSteps: 4,
    steps: [
      { id: 1, title: 'Account Setup', status: 'completed' },
      { id: 2, title: 'Profile Details', status: 'completed' },
      { id: 3, title: 'Preferences', status: 'current' },
      { id: 4, title: 'Review', status: 'pending' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom step status override instead of using currentStep calculation.',
      },
    },
  },
}

export const MobileView: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    steps: defaultSteps,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view showing adjusted sizing and spacing.',
      },
    },
  },
}

export const TabletView: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    steps: onboardingSteps,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view demonstrating responsive behavior with more steps.',
      },
    },
  },
}

export const LongStepNames: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    steps: [
      { id: 1, title: 'Initial Account Registration' },
      { id: 2, title: 'Personal Information & Verification' },
      { id: 3, title: 'Final Setup & Preferences' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests how the component handles longer step titles while maintaining readability.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  render: () => ({
    components: { ProgressSteps },
    setup() {
      const currentStep = ref(1)
      const steps = onboardingSteps
      const totalSteps = steps.length

      const nextStep = () => {
        if (currentStep.value < totalSteps) {
          currentStep.value++
        }
      }

      const prevStep = () => {
        if (currentStep.value > 1) {
          currentStep.value--
        }
      }

      const resetSteps = () => {
        currentStep.value = 1
      }

      return {
        currentStep,
        steps,
        totalSteps,
        nextStep,
        prevStep,
        resetSteps,
      }
    },
    template: `
      <div style="padding: 24px;">
        <ProgressSteps 
          :current-step="currentStep" 
          :total-steps="totalSteps" 
          :steps="steps" 
        />
        
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 32px;">
          <button 
            @click="prevStep" 
            :disabled="currentStep === 1"
            style="
              padding: 8px 16px; 
              border: 1px solid #d1d5db; 
              border-radius: 6px; 
              background: white; 
              cursor: pointer;
              disabled:opacity: 0.5;
              disabled:cursor: not-allowed;
            "
            :style="{ 
              opacity: currentStep === 1 ? '0.5' : '1',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }"
          >
            Previous
          </button>
          
          <button 
            @click="nextStep" 
            :disabled="currentStep === totalSteps"
            style="
              padding: 8px 16px; 
              border: 1px solid #3b82f6; 
              border-radius: 6px; 
              background: #3b82f6; 
              color: white; 
              cursor: pointer;
            "
            :style="{ 
              opacity: currentStep === totalSteps ? '0.5' : '1',
              cursor: currentStep === totalSteps ? 'not-allowed' : 'pointer'
            }"
          >
            Next
          </button>
          
          <button 
            @click="resetSteps"
            style="
              padding: 8px 16px; 
              border: 1px solid #6b7280; 
              border-radius: 6px; 
              background: transparent; 
              color: #6b7280; 
              cursor: pointer;
            "
          >
            Reset
          </button>
        </div>
        
        <div style="text-align: center; margin-top: 16px; color: #6b7280; font-size: 14px;">
          Step {{ currentStep }} of {{ totalSteps }}: {{ steps[currentStep - 1]?.title }}
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo allowing you to navigate through steps to see the progress animation.',
      },
    },
  },
}
