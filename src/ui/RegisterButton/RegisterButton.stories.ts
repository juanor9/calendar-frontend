import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue'
import RegisterButton from './RegisterButton.vue'

const meta: Meta<typeof RegisterButton> = {
  title: 'UI/Buttons/Register Button',
  component: RegisterButton,
  parameters: {
    docs: {
      description: {
        component:
          'A specialized button component optimized for registration and conversion flows. Extends BaseButton with enhanced visual effects, gradients, and call-to-action focused styling. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-register-buttons',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant optimized for conversion',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant with touch-optimized dimensions',
    },
    width: {
      control: 'select',
      options: ['auto', 'full'],
      description: 'Width behavior for layout flexibility',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner animation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state preventing interaction',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute',
    },
    floating: {
      control: 'boolean',
      description: 'Floating Action Button (FAB) positioning',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
    pressed: {
      control: 'boolean',
      description: 'ARIA pressed state for toggle buttons',
    },
    loadingText: {
      control: 'text',
      description: 'Screen reader text for loading state',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RegisterButton>

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    width: 'auto',
  },
  render: args => ({
    components: { RegisterButton },
    setup() {
      const handleClick = () => {
        console.log('Register button clicked!')
      }
      return { args, handleClick }
    },
    template: `
      <RegisterButton v-bind="args" @click="handleClick">
        Create Account
      </RegisterButton>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; align-items: flex-start;">
        <div>
          <h4>Primary (Default)</h4>
          <RegisterButton variant="primary">Get Started Free</RegisterButton>
        </div>
        
        <div>
          <h4>Secondary</h4>
          <RegisterButton variant="secondary">Create Account</RegisterButton>
        </div>
        
        <div>
          <h4>Outline</h4>
          <RegisterButton variant="outline">Sign Up Now</RegisterButton>
        </div>
        
        <div>
          <h4>Ghost</h4>
          <RegisterButton variant="ghost">Join Waitlist</RegisterButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Different visual variants optimized for conversion with enhanced gradients and hover effects.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; align-items: flex-start;">
        <div>
          <h4>Small</h4>
          <RegisterButton size="small">Sign Up</RegisterButton>
        </div>
        
        <div>
          <h4>Medium (Default)</h4>
          <RegisterButton size="medium">Create Account</RegisterButton>
        </div>
        
        <div>
          <h4>Large</h4>
          <RegisterButton size="large">Get Started Free</RegisterButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants with touch-optimized dimensions for mobile devices.',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <RegisterButton>
          <template #iconLeft>
            <span style="font-size: 14px;">🚀</span>
          </template>
          Get Started Free
        </RegisterButton>
        
        <RegisterButton>
          Sign Up
          <template #iconRight>
            <span style="font-size: 14px;">→</span>
          </template>
        </RegisterButton>
        
        <RegisterButton>
          <template #iconLeft>
            <span style="font-size: 14px;">👤</span>
          </template>
          Create Account
          <template #iconRight>
            <span style="font-size: 14px;">✨</span>
          </template>
        </RegisterButton>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Register buttons with left and/or right icon slots for enhanced visual appeal.',
      },
    },
  },
}

export const States: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <div>
          <h4>Normal State</h4>
          <RegisterButton>Create Account</RegisterButton>
        </div>
        
        <div>
          <h4>Loading State</h4>
          <RegisterButton :loading="true" loading-text="Creating your account...">
            Creating Account...
          </RegisterButton>
        </div>
        
        <div>
          <h4>Disabled State</h4>
          <RegisterButton :disabled="true">Sign Up Disabled</RegisterButton>
        </div>
        
        <div>
          <h4>With Pulse Animation</h4>
          <RegisterButton class="register-button--pulse">
            Limited Time Offer
          </RegisterButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Different states including loading, disabled, and attention-grabbing pulse animation.',
      },
    },
  },
}

export const WidthVariants: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Auto Width (Default)</h4>
          <RegisterButton width="auto">Create Account</RegisterButton>
        </div>
        
        <div style="max-width: 400px;">
          <h4>Full Width</h4>
          <RegisterButton width="full">Get Started Free</RegisterButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Width variants showing auto and full-width options.',
      },
    },
  },
}

export const FloatingActionButton: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="position: relative; height: 400px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 8px; padding: 20px;">
        <h3>Scroll down to see the floating action button</h3>
        <p>The floating button is positioned fixed at the bottom-right corner.</p>
        
        <RegisterButton 
          :floating="true" 
          aria-label="Quick sign up"
        >
          <template #iconLeft>
            <span style="font-size: 18px;">+</span>
          </template>
          Sign Up
        </RegisterButton>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Floating action button (FAB) positioned at bottom-right, perfect for mobile registration flows.',
      },
    },
  },
}

export const ConversionOptimized: Story = {
  render: () => ({
    components: { RegisterButton },
    setup() {
      const isLoading = ref(false)

      const handleSignUp = () => {
        isLoading.value = true
        setTimeout(() => {
          isLoading.value = false
        }, 2000)
      }

      return { isLoading, handleSignUp }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center;">
          <h2 style="margin: 0 0 16px 0;">Start Your Free Trial</h2>
          <p style="margin: 0 0 24px 0; opacity: 0.9;">No credit card required. Cancel anytime.</p>
          
          <RegisterButton 
            size="large" 
            class="register-button--hero"
            :loading="isLoading"
            @click="handleSignUp"
          >
            <template #iconLeft>
              <span style="font-size: 16px;">🎯</span>
            </template>
            Get Started Free
            <template #iconRight>
              <span style="font-size: 16px;">→</span>
            </template>
          </RegisterButton>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 16px 0; text-align: center;">Join 10,000+ Users</h3>
          <p style="margin: 0 0 24px 0; text-align: center; color: #6b7280;">
            Ready to transform your productivity?
          </p>
          
          <div class="register-button-group">
            <RegisterButton variant="outline" size="medium">
              Learn More
            </RegisterButton>
            <RegisterButton variant="primary" size="medium">
              <template #iconLeft>
                <span style="font-size: 14px;">⚡</span>
              </template>
              Start Free Trial
            </RegisterButton>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Conversion-optimized register buttons in real-world contexts like hero sections and signup forms.',
      },
    },
  },
}

export const FormIntegration: Story = {
  render: () => ({
    components: { RegisterButton },
    setup() {
      const formData = ref({
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      })

      const isSubmitting = ref(false)
      const errors = ref<Record<string, string>>({})

      const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.value.email) {
          newErrors.email = 'Email is required'
        }

        if (!formData.value.password) {
          newErrors.password = 'Password is required'
        }

        if (formData.value.password !== formData.value.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.value.agreeToTerms) {
          newErrors.terms = 'You must agree to the terms'
        }

        errors.value = newErrors
        return Object.keys(newErrors).length === 0
      }

      const handleSubmit = () => {
        if (!validateForm()) return

        isSubmitting.value = true

        setTimeout(() => {
          isSubmitting.value = false
          alert('Account created successfully!')
        }, 2000)
      }

      const isFormValid = computed(() => {
        return (
          formData.value.email &&
          formData.value.password &&
          formData.value.confirmPassword === formData.value.password &&
          formData.value.agreeToTerms
        )
      })

      return {
        formData,
        isSubmitting,
        errors,
        handleSubmit,
        isFormValid,
      }
    },
    template: `
      <div style="max-width: 400px; margin: 0 auto; padding: 32px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin: 0 0 24px 0; text-align: center;">Create Your Account</h2>
        
        <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
            <input 
              v-model="formData.email"
              type="email" 
              placeholder="your.email@example.com"
              style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"
              :style="errors.email ? 'border-color: #ef4444;' : ''"
            />
            <span v-if="errors.email" style="color: #ef4444; font-size: 12px;">{{ errors.email }}</span>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Password</label>
            <input 
              v-model="formData.password"
              type="password" 
              placeholder="Choose a strong password"
              style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"
              :style="errors.password ? 'border-color: #ef4444;' : ''"
            />
            <span v-if="errors.password" style="color: #ef4444; font-size: 12px;">{{ errors.password }}</span>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Confirm Password</label>
            <input 
              v-model="formData.confirmPassword"
              type="password" 
              placeholder="Confirm your password"
              style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"
              :style="errors.confirmPassword ? 'border-color: #ef4444;' : ''"
            />
            <span v-if="errors.confirmPassword" style="color: #ef4444; font-size: 12px;">{{ errors.confirmPassword }}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <input 
              v-model="formData.agreeToTerms"
              type="checkbox" 
              id="terms"
            />
            <label for="terms" style="font-size: 14px; color: #6b7280;">
              I agree to the <a href="#" style="color: #3b82f6;">Terms of Service</a> and <a href="#" style="color: #3b82f6;">Privacy Policy</a>
            </label>
          </div>
          <span v-if="errors.terms" style="color: #ef4444; font-size: 12px;">{{ errors.terms }}</span>
          
          <RegisterButton 
            type="submit" 
            width="full" 
            size="large"
            class="register-button--form"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            loading-text="Creating your account..."
          >
            <template #iconLeft>
              <span style="font-size: 16px;">🎯</span>
            </template>
            {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
          </RegisterButton>
        </form>
        
        <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #6b7280;">
          Already have an account? <a href="#" style="color: #3b82f6;">Sign in</a>
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Complete registration form demonstrating button integration with form validation and loading states.',
      },
    },
  },
}

export const AccessibilityDemo: Story = {
  render: () => ({
    components: { RegisterButton },
    setup() {
      const isPressed = ref(false)
      const togglePressed = () => {
        isPressed.value = !isPressed.value
      }

      return { isPressed, togglePressed }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Screen Reader Optimized</h4>
          <RegisterButton 
            aria-label="Create your free Vana Calendar account with no credit card required"
          >
            Sign Up Free
          </RegisterButton>
        </div>
        
        <div>
          <h4>Toggle Button with ARIA States</h4>
          <RegisterButton 
            :pressed="isPressed"
            @click="togglePressed"
            :aria-label="isPressed ? 'Remove from favorites' : 'Add to favorites'"
          >
            <template #iconLeft>
              <span style="font-size: 14px;">{{ isPressed ? '❤️' : '🤍' }}</span>
            </template>
            {{ isPressed ? 'Added to Favorites' : 'Add to Favorites' }}
          </RegisterButton>
        </div>
        
        <div>
          <h4>Loading with Custom Announcement</h4>
          <RegisterButton 
            :loading="true"
            loading-text="Please wait while we verify your email and create your secure account"
          >
            Verifying...
          </RegisterButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Accessibility features including ARIA labels, pressed states, and custom loading announcements.',
      },
    },
  },
}
