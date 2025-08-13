import type { Meta, StoryObj } from '@storybook/vue3'
// Removed storybook/test import - not available
import { ref } from 'vue'
import RegisterButton from './RegisterButton.vue'

const meta = {
  title: 'UI/Components/Register Button',
  component: RegisterButton,
  parameters: {
    docs: {
      description: {
        component: `
# Register Button Component

A specialized button component designed for registration flows and call-to-action scenarios, optimized for trust, accessibility, and conversion in the Vana intelligent calendar application.

## Purpose

The RegisterButton component serves as the primary conversion element for:
- User registration and signup flows
- Primary call-to-action buttons on landing pages
- Account creation and onboarding processes
- Mobile floating action buttons for quick access
- Form submissions and confirmations
- Trust-building interface elements for new users

## Usage Context

This component is strategically used in:
- Registration pages and signup forms
- Landing page hero sections and conversion areas
- Mobile app interfaces as floating action buttons
- Onboarding flows and welcome screens
- Marketing pages and lead generation forms
- Authentication workflows and account creation

## Styling Methodology

Built using BEM methodology with SCSS variables from Vana's design system:
- Consistent spacing using \`$spacing-*\` tokens for balanced visual hierarchy
- Brand colors from \`$vana-registration-*\` palette optimized for trust and conversion
- Typography using \`$font-family-primary\` with \`$font-weight-semibold\` for confidence
- Border radius with \`$auth-radius-*\` tokens for professional appearance
- Smooth transitions with \`$transition-all\` for polished interactions
- Loading animations with professional spinner and accessibility support

## Design System Integration

Fully integrated with Vana's registration-focused design tokens:
- **Variants**: Primary (brand), secondary (alternative), outline (subtle), ghost (minimal)
- **Sizes**: Small (32px), medium (40px), large (48px) heights optimized for touch targets
- **States**: Default, loading, disabled, hover, focus, active with proper visual feedback
- **Width**: Auto-width and full-width options for flexible layouts
- **Floating**: Mobile-first floating action button with elevated shadow
- **Icons**: Left and right icon slots with proper spacing and alignment

## Accessibility Notes

- Full ARIA support with \`aria-label\`, \`aria-pressed\`, and \`aria-disabled\` attributes
- Loading state announcements with customizable \`loadingText\` for screen readers
- Keyboard navigation with proper focus management and visual focus indicators
- High contrast support with sufficient color contrast ratios (WCAG 2.1 AA)
- Touch target optimization with minimum 44px interactive areas
- Semantic button element with proper \`type\` attribute support
- Disabled state handling with prevented interactions and visual feedback
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-design-system-register-button'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Button visual variant optimized for different contexts and emphasis levels'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size affecting height, padding, and touch target area'
    },
    width: {
      control: 'select',
      options: ['auto', 'full'],
      description: 'Button width behavior - auto-width or full container width'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner and disable interactions during async operations'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interactions and apply disabled visual state'
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute for form handling'
    },
    floating: {
      control: 'boolean',
      description: 'Apply floating action button styling for mobile interfaces'
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for enhanced accessibility and screen reader support'
    },
    pressed: {
      control: 'boolean',
      description: 'ARIA pressed state for toggle button behaviors'
    },
    loadingText: {
      control: 'text',
      description: 'Screen reader announcement text during loading state'
    }
  },
  args: {
    onClick: () => {}
  }
} satisfies Meta<typeof RegisterButton>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default Story
export const Default: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Create Account</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default register button with primary variant and medium size. This is the standard configuration for most registration flows.'
      }
    }
  }
}

// 2. Variant Stories
export const Primary: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Sign Up Free</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Primary variant using Vana brand colors for maximum conversion impact and trust-building.'
      }
    }
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Get Started</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Secondary variant for alternative actions and supporting call-to-action elements.'
      }
    }
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Try Demo</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Outline variant with transparent background for subtle call-to-action and secondary flows.'
      }
    }
  }
}

export const Ghost: Story = {
  args: {
    variant: 'ghost'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Learn More</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Ghost variant with minimal styling for subtle actions and tertiary navigation.'
      }
    }
  }
}

// 3. Size Stories
export const Small: Story = {
  args: {
    size: 'small',
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Join Now</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Small size (32px height) for compact interfaces and secondary placement areas.'
      }
    }
  }
}

export const Medium: Story = {
  args: {
    size: 'medium',
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Create Account</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Medium size (40px height) - the default size optimized for most registration contexts.'
      }
    }
  }
}

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Start Your Free Trial</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Large size (48px height) for prominent hero sections and high-conversion landing pages.'
      }
    }
  }
}

// 4. State Stories
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingText: 'Creating your account...'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Sign Up</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner animation and accessibility-friendly screen reader announcements.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: '<RegisterButton v-bind="args">Create Account</RegisterButton>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and prevented interactions for form validation scenarios.'
      }
    }
  }
}

// 5. Icon Stories
export const WithIconLeft: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: `
      <RegisterButton v-bind="args">
        <template #iconLeft>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 2-5 10-4-3z"/>
          </svg>
        </template>
        Join Community
      </RegisterButton>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Register button with left-positioned icon for enhanced visual communication and engagement.'
      }
    }
  }
}

export const WithIconRight: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: `
      <RegisterButton v-bind="args">
        Get Started
        <template #iconRight>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </template>
      </RegisterButton>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Register button with right-positioned arrow icon indicating forward progression and next steps.'
      }
    }
  }
}

// 6. Floating Action Button
export const FloatingMobile: Story = {
  args: {
    variant: 'primary',
    floating: true,
    ariaLabel: 'Create new account'
  },
  render: (args) => ({
    components: { RegisterButton },
    setup() {
      return { args }
    },
    template: `
      <div style="position: relative; height: 300px; background: #f3f4f6; border-radius: 8px; padding: 16px;">
        <p style="margin: 0; color: #6b7280; text-align: center;">Mobile interface simulation</p>
        <RegisterButton v-bind="args" style="position: absolute; bottom: 16px; right: 16px;">
          <template #iconLeft>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </template>
          Sign Up
        </RegisterButton>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Floating action button variant for mobile interfaces with elevated shadow and fixed positioning.'
      }
    }
  }
}

// 7. Color Variants Showcase
export const ColorVariants: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <RegisterButton variant="primary">Primary</RegisterButton>
            <span style="font-size: 12px; color: #6b7280;">Brand Trust</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <RegisterButton variant="secondary">Secondary</RegisterButton>
            <span style="font-size: 12px; color: #6b7280;">Alternative</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <RegisterButton variant="outline">Outline</RegisterButton>
            <span style="font-size: 12px; color: #6b7280;">Subtle CTA</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <RegisterButton variant="ghost">Ghost</RegisterButton>
            <span style="font-size: 12px; color: #6b7280;">Minimal</span>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all color variants available, each optimized for different conversion contexts.'
      }
    }
  }
}

// 8. Size Comparison
export const SizeComparison: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RegisterButton size="small" variant="primary">Small</RegisterButton>
          <span style="font-size: 12px; color: #6b7280;">32px height</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RegisterButton size="medium" variant="primary">Medium</RegisterButton>
          <span style="font-size: 12px; color: #6b7280;">40px height</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <RegisterButton size="large" variant="primary">Large</RegisterButton>
          <span style="font-size: 12px; color: #6b7280;">48px height</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison showing all three available sizes with their respective heights and use cases.'
      }
    }
  }
}

// 9. Loading States with Different Texts
export const LoadingStates: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <RegisterButton variant="primary" loading loadingText="Creating account...">Sign Up</RegisterButton>
          <RegisterButton variant="secondary" loading loadingText="Validating email...">Verify Email</RegisterButton>
          <RegisterButton variant="outline" loading loadingText="Processing...">Continue</RegisterButton>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <RegisterButton variant="primary" size="small" loading loadingText="Saving...">Save</RegisterButton>
          <RegisterButton variant="primary" size="large" loading loadingText="Starting trial...">Start Free Trial</RegisterButton>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loading state variations with different loading texts for various registration and onboarding scenarios.'
      }
    }
  }
}

// 10. Interactive Demo with Click Behaviors
export const InteractiveDemo: Story = {
  render: () => ({
    components: { RegisterButton },
    setup() {
      const isLoading = ref(false)
      const isDisabled = ref(false)
      
      const handleSignUp = async () => {
        isLoading.value = true
        // Simulate async operation
        setTimeout(() => {
          isLoading.value = false
          alert('Account created successfully!')
        }, 2000)
      }
      
      const handleDemo = () => {
        alert('Demo started!')
      }
      
      const toggleDisabled = () => {
        isDisabled.value = !isDisabled.value
      }
      
      return { isLoading, isDisabled, handleSignUp, handleDemo, toggleDisabled }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <RegisterButton 
            variant="primary" 
            :loading="isLoading"
            loadingText="Creating your account..."
            @click="handleSignUp"
          >
            Create Account
          </RegisterButton>
          <RegisterButton 
            variant="outline" 
            @click="handleDemo"
          >
            Try Demo
          </RegisterButton>
          <RegisterButton 
            variant="secondary" 
            :disabled="isDisabled"
            @click="toggleDisabled"
          >
            {{ isDisabled ? 'Disabled' : 'Toggle Disabled' }}
          </RegisterButton>
        </div>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Click buttons to see interactive behaviors: loading simulation, demo launch, and disabled state toggle.
        </p>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of button behaviors including async operations, click handling, and state management.'
      }
    }
  }
}

// 11. Responsive Demo (Mobile/Desktop)
export const ResponsiveDemo: Story = {
  render: () => ({
    components: { RegisterButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Desktop Layout -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Desktop Layout</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <RegisterButton variant="outline" size="medium">Learn More</RegisterButton>
            <RegisterButton variant="primary" size="medium">
              Start Free Trial
              <template #iconRight>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </template>
            </RegisterButton>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 375px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Mobile Layout</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <RegisterButton variant="primary" size="large" width="full">Sign Up Free</RegisterButton>
            <RegisterButton variant="outline" size="medium" width="full">Already have an account?</RegisterButton>
          </div>
          <!-- Mobile FAB -->
          <div style="position: relative; height: 80px; margin-top: 16px;">
            <RegisterButton 
              variant="primary" 
              floating 
              style="position: absolute; bottom: 0; right: 0;"
            >
              <template #iconLeft>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </template>
            </RegisterButton>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Responsive design patterns showing desktop and mobile layouts with appropriate button sizing and positioning.'
      }
    }
  }
}

// 12. InContext - Real Usage Examples
export const InContext: Story = {
  render: () => ({
    components: { RegisterButton },
    setup() {
      const handleSignUp = () => {
        console.log('Sign up clicked')
      }
      const handleTrial = () => {
        console.log('Start trial clicked')
      }
      const handleDemo = () => {
        console.log('Demo clicked')
      }
      const handleJoin = () => {
        console.log('Join waitlist clicked')
      }
      
      return { handleSignUp, handleTrial, handleDemo, handleJoin }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
        
        <!-- Landing Page Hero Section -->
        <div style="padding: 32px 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; border-radius: 12px; text-align: center;">
          <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700;">Transform Your Calendar Experience</h2>
          <p style="margin: 0 0 24px 0; font-size: 18px; opacity: 0.9;">Join thousands of professionals who trust Vana for intelligent scheduling</p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <RegisterButton 
              variant="primary" 
              size="large"
              style="background: white; color: #6366f1;"
              @click="handleTrial"
            >
              Start Free Trial
              <template #iconRight>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </template>
            </RegisterButton>
            <RegisterButton 
              variant="outline" 
              size="large"
              style="border-color: white; color: white;"
              @click="handleDemo"
            >
              Watch Demo
            </RegisterButton>
          </div>
        </div>

        <!-- Registration Form -->
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 400px;">
          <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">Create Your Account</h3>
          <form style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Full Name</label>
              <input type="text" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Enter your full name" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Email Address</label>
              <input type="email" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="you@company.com" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Password</label>
              <input type="password" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Create a strong password" />
            </div>
            <RegisterButton 
              variant="primary" 
              size="large" 
              width="full"
              type="submit"
              @click="handleSignUp"
            >
              <template #iconLeft>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 2-5 10-4-3z"/>
                </svg>
              </template>
              Create Account
            </RegisterButton>
            <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 8px;">
              By signing up, you agree to our <a href="#" style="color: #6366f1;">Terms of Service</a> and <a href="#" style="color: #6366f1;">Privacy Policy</a>
            </div>
          </form>
        </div>

        <!-- Mobile App Interface -->
        <div style="max-width: 375px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="padding: 16px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 600;">
            Mobile App Preview
          </div>
          <div style="padding: 24px; text-align: center; position: relative; height: 300px;">
            <div style="margin-bottom: 24px;">
              <div style="width: 80px; height: 80px; background: #6366f1; border-radius: 20px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700;">V</div>
              <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Welcome to Vana</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Your intelligent calendar awaits</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <RegisterButton variant="primary" size="large" width="full">Get Started</RegisterButton>
              <RegisterButton variant="outline" size="medium" width="full">I already have an account</RegisterButton>
            </div>
            <!-- Floating Action Button -->
            <RegisterButton 
              variant="primary" 
              floating 
              ariaLabel="Quick registration"
              style="position: absolute; bottom: 16px; right: 16px;"
              @click="handleJoin"
            >
              <template #iconLeft>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </template>
            </RegisterButton>
          </div>
        </div>

        <!-- Call-to-Action Section -->
        <div style="padding: 24px; background: #f8fafc; border-radius: 12px; text-align: center;">
          <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">Ready to Get Started?</h3>
          <p style="margin: 0 0 20px 0; color: #6b7280;">Join over 10,000 professionals using Vana for smarter scheduling</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <RegisterButton variant="primary" size="medium">
              Start Free Trial
              <template #iconRight>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </template>
            </RegisterButton>
            <RegisterButton variant="secondary" size="medium">Contact Sales</RegisterButton>
          </div>
          <div style="margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 16px; font-size: 12px; color: #9ca3af;">
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        <!-- Waitlist/Coming Soon -->
        <div style="padding: 24px; border: 2px dashed #d1d5db; border-radius: 12px; text-align: center;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">New Feature Coming Soon</h3>
          <p style="margin: 0 0 20px 0; color: #6b7280;">AI-powered scheduling assistant launching next month</p>
          <RegisterButton 
            variant="outline" 
            size="medium"
            @click="handleJoin"
          >
            <template #iconLeft>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </template>
            Join Waitlist
          </RegisterButton>
        </div>

        <!-- Form Submission States -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Form Submission Examples</h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <RegisterButton variant="primary" loading loadingText="Creating account...">Creating Account...</RegisterButton>
            <RegisterButton variant="success" disabled>✓ Account Created</RegisterButton>
            <RegisterButton variant="outline" disabled>Terms Required</RegisterButton>
          </div>
        </div>

      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing RegisterButton in authentic contexts: landing page heroes, registration forms, mobile app interfaces, call-to-action sections, waitlist signups, and form submission states.'
      }
    }
  }
}
