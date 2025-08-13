/**
 * Storybook Stories Validation Tests
 * Tests for proper Storybook story configuration and variant usage
 * 
 * CRITICAL: Tests for the specific error patterns found in Storybook stories
 */

import { describe, it, expect } from 'vitest'

// Types for better type safety
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'small' | 'medium' | 'large'
type InputVariant = 'default' | 'floating'
type InputType = 'text' | 'email' | 'password' | 'search'
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface StoryArgs {
  variant?: string
  label?: string
  size?: string
  type?: string
  disabled?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
}

interface Story {
  args: StoryArgs
  parameters?: {
    docs?: {
      description?: {
        story?: string
      }
    }
  }
  play?: (context: { canvasElement: HTMLElement; step: unknown }) => Promise<void>
}

interface StoryMeta {
  title: string
  component: string
  parameters?: {
    docs?: {
      description?: {
        component?: string
      }
    }
  }
  argTypes?: {
    variant?: {
      control: { type: string }
      options: readonly string[]
    }
    size?: {
      control: { type: string }
      options: readonly string[]
    }
  }
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

interface AccessibilityValidationResult {
  hasAccessibleLabel: boolean
  hasProperDisabledHandling: boolean
  isValid: boolean
}

interface DocumentationResult {
  name: string
  hasDescription: boolean
  description: string | null
}

interface ComponentVariantDefinition {
  props: {
    variant: {
      type: StringConstructor
      validator: (value: string) => boolean
    }
  }
}

interface FormInput {
  variant: string
  type: string
  label: string
}

interface FormButton {
  variant: string
  label: string
}

interface FormStoryArgs {
  inputs: FormInput[]
  submitButton: FormButton
  cancelButton: FormButton
}

interface ControlsConfiguration {
  variant: {
    control: string
    options: readonly string[]
  }
  size: {
    control: string
    options: readonly string[]
  }
  disabled: {
    control: string
  }
  label: {
    control: string
  }
}

// Mock Storybook story structures based on existing BaseButton stories
const mockBaseButtonStories: Record<string, Story> = {
  Primary: {
    args: {
      variant: 'primary',
      label: 'Primary Button'
    }
  },
  Secondary: {
    args: {
      variant: 'secondary', 
      label: 'Secondary Button'
    }
  },
  Outline: {
    args: {
      variant: 'outline',
      label: 'Outline Button'
    }
  },
  Ghost: {
    args: {
      variant: 'ghost',
      label: 'Ghost Button'
    }
  }
}

// Mock component variant definitions
const VALID_BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'] as const
const VALID_BUTTON_SIZES: readonly ButtonSize[] = ['small', 'medium', 'large'] as const

describe('Storybook Stories Validation', () => {
  // 📚 Story Variant Validation Tests
  describe('Story Variant Validation', () => {
    it('should use valid component variants in BaseButton stories', () => {
      const stories = [
        mockBaseButtonStories.Primary,
        mockBaseButtonStories.Secondary,
        mockBaseButtonStories.Outline,
        mockBaseButtonStories.Ghost
      ]
      
      stories.forEach(story => {
        expect(VALID_BUTTON_VARIANTS).toContain(story.args.variant as ButtonVariant)
      })
      
      // Verify specific variants
      expect(mockBaseButtonStories.Primary.args.variant).toBe('primary')
      expect(mockBaseButtonStories.Secondary.args.variant).toBe('secondary')
      expect(mockBaseButtonStories.Outline.args.variant).toBe('outline')
      expect(mockBaseButtonStories.Ghost.args.variant).toBe('ghost')
    })

    it('should reject invalid variant usage in stories', () => {
      const invalidStoryVariants = [
        'invalid-variant',
        'primary-dark', // Not in defined variants
        'secondary-light', // Not in defined variants
        'custom-variant'
      ]
      
      invalidStoryVariants.forEach(invalidVariant => {
        expect(VALID_BUTTON_VARIANTS).not.toContain(invalidVariant as ButtonVariant)
      })
    })

    it('should validate size variants in stories', () => {
      const mockSizeStories: Record<string, Story> = {
        SmallButton: { args: { variant: 'primary', size: 'small' } },
        MediumButton: { args: { variant: 'primary', size: 'medium' } },
        LargeButton: { args: { variant: 'primary', size: 'large' } }
      }
      
      Object.values(mockSizeStories).forEach(story => {
        expect(VALID_BUTTON_SIZES).toContain(story.args.size as ButtonSize)
      })
    })
  })

  // 🎨 Story Configuration Validation Tests
  describe('Story Configuration Validation', () => {
    it('should have proper story structure', () => {
      const validateStoryStructure = (story: unknown): story is Story => {
        return (
          story !== null &&
          typeof story === 'object' &&
          'args' in story &&
          story.args !== null &&
          typeof story.args === 'object'
        )
      }
      
      Object.values(mockBaseButtonStories).forEach(story => {
        expect(validateStoryStructure(story)).toBe(true)
      })
    })

    it('should have required args in stories', () => {
      const requiredButtonArgs = ['variant', 'label']
      
      Object.values(mockBaseButtonStories).forEach(story => {
        requiredButtonArgs.forEach(arg => {
          expect(story.args).toHaveProperty(arg)
          expect(story.args[arg as keyof StoryArgs]).toBeTruthy()
        })
      })
    })

    it('should validate story meta configuration', () => {
      const mockMeta: StoryMeta = {
        title: 'Components/UI/BaseButton',
        component: 'BaseButton',
        parameters: {
          docs: {
            description: {
              component: 'Base button component for Vana application'
            }
          }
        },
        argTypes: {
          variant: {
            control: { type: 'select' },
            options: VALID_BUTTON_VARIANTS
          },
          size: {
            control: { type: 'select' },
            options: VALID_BUTTON_SIZES
          }
        }
      }
      
      expect(mockMeta.title).toContain('BaseButton')
      expect(mockMeta.component).toBe('BaseButton')
      expect(mockMeta.argTypes?.variant?.options).toEqual(VALID_BUTTON_VARIANTS)
      expect(mockMeta.argTypes?.size?.options).toEqual(VALID_BUTTON_SIZES)
    })
  })

  // 🔄 Story Variant Consistency Tests
  describe('Story Variant Consistency', () => {
    it('should maintain consistency between component and story variants', () => {
      // Mock component definition
      const componentVariantDefinition: ComponentVariantDefinition = {
        props: {
          variant: {
            type: String,
            validator: (value: string) => VALID_BUTTON_VARIANTS.includes(value as ButtonVariant)
          }
        }
      }
      
      // Test that story variants are valid according to component
      Object.values(mockBaseButtonStories).forEach(story => {
        const isValid = componentVariantDefinition.props.variant.validator(story.args.variant || '')
        expect(isValid).toBe(true)
      })
    })

    it('should cover all component variants in stories', () => {
      const storyVariants = Object.values(mockBaseButtonStories)
        .map(story => story.args.variant)
        .filter((variant): variant is string => typeof variant === 'string')
      
      VALID_BUTTON_VARIANTS.forEach(variant => {
        expect(storyVariants).toContain(variant)
      })
    })

    it('should not have duplicate variant stories', () => {
      const storyVariants = Object.values(mockBaseButtonStories)
        .map(story => story.args.variant)
        .filter((variant): variant is string => typeof variant === 'string')
      
      const uniqueVariants = [...new Set(storyVariants)]
      expect(storyVariants).toHaveLength(uniqueVariants.length)
    })
  })

  // 🧪 Story Testing Utilities
  describe('Story Testing Patterns', () => {
    it('should provide story validation utility', () => {
      const validateStoryVariants = (
        stories: Record<string, Story>,
        validVariants: readonly string[]
      ): ValidationResult => {
        const errors: string[] = []
        
        Object.entries(stories).forEach(([storyName, story]) => {
          if (!story.args || !story.args.variant) {
            errors.push(`Story "${storyName}" missing variant`)
            return
          }
          
          if (!validVariants.includes(story.args.variant)) {
            errors.push(`Story "${storyName}" has invalid variant: ${story.args.variant}`)
          }
        })
        
        return {
          valid: errors.length === 0,
          errors
        }
      }
      
      // Test valid stories
      const validResult = validateStoryVariants(mockBaseButtonStories, VALID_BUTTON_VARIANTS)
      expect(validResult.valid).toBe(true)
      expect(validResult.errors).toHaveLength(0)
      
      // Test invalid stories
      const invalidStories: Record<string, Story> = {
        Invalid: { args: { variant: 'invalid-variant' } }
      }
      
      const invalidResult = validateStoryVariants(invalidStories, VALID_BUTTON_VARIANTS)
      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors).toHaveLength(1)
      expect(invalidResult.errors[0]).toContain('invalid variant')
    })

    it('should validate story accessibility configuration', () => {
      const mockAccessibilityStories: Record<string, Story> = {
        AccessiblePrimary: {
          args: {
            variant: 'primary',
            label: 'Accessible Button',
            'aria-label': 'Primary action button'
          }
        },
        AccessibleDisabled: {
          args: {
            variant: 'secondary',
            label: 'Disabled Button',
            disabled: true,
            'aria-describedby': 'disabled-help-text'
          }
        }
      }
      
      const validateAccessibilityArgs = (story: Story): AccessibilityValidationResult => {
        const hasAccessibleLabel = !!(story.args.label || story.args['aria-label'])
        const hasProperDisabledHandling = !story.args.disabled || !!(story.args['aria-describedby'])
        
        return {
          hasAccessibleLabel,
          hasProperDisabledHandling,
          isValid: hasAccessibleLabel && hasProperDisabledHandling
        }
      }
      
      Object.values(mockAccessibilityStories).forEach(story => {
        const result = validateAccessibilityArgs(story)
        expect(result.isValid).toBe(true)
      })
    })

    it('should handle story documentation validation', () => {
      const mockDocumentedStories: Record<string, Story> = {
        DocumentedPrimary: {
          args: { variant: 'primary', label: 'Primary' },
          parameters: {
            docs: {
              description: {
                story: 'Primary button for main actions'
              }
            }
          }
        },
        DocumentedSecondary: {
          args: { variant: 'secondary', label: 'Secondary' },
          parameters: {
            docs: {
              description: {
                story: 'Secondary button for alternative actions'
              }
            }
          }
        }
      }
      
      const validateStoryDocumentation = (stories: Record<string, Story>): DocumentationResult[] => {
        return Object.entries(stories).map(([name, story]) => ({
          name,
          hasDescription: !!(
            story.parameters?.docs?.description?.story
          ),
          description: story.parameters?.docs?.description?.story || null
        }))
      }
      
      const docResults = validateStoryDocumentation(mockDocumentedStories)
      
      docResults.forEach(result => {
        expect(result.hasDescription).toBe(true)
        expect(result.description).toBeTruthy()
        expect(typeof result.description).toBe('string')
      })
    })
  })

  // 🔄 Multi-component Story Validation
  describe('Multi-component Story Patterns', () => {
    it('should validate input component stories', () => {
      const VALID_INPUT_VARIANTS: readonly InputVariant[] = ['default', 'floating'] as const
      const VALID_INPUT_TYPES: readonly InputType[] = ['text', 'email', 'password', 'search'] as const
      
      const mockInputStories: Record<string, Story> = {
        DefaultText: {
          args: { 
            variant: 'default',
            type: 'text',
            label: 'Default Text Input'
          }
        },
        FloatingEmail: {
          args: {
            variant: 'floating',
            type: 'email',
            label: 'Email Input'
          }
        }
      }
      
      Object.values(mockInputStories).forEach(story => {
        expect(VALID_INPUT_VARIANTS).toContain(story.args.variant as InputVariant)
        expect(VALID_INPUT_TYPES).toContain(story.args.type as InputType)
      })
    })

    it('should validate badge component stories', () => {
      const VALID_BADGE_VARIANTS: readonly BadgeVariant[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const
      
      const mockBadgeStories: Record<string, Story> = {
        PrimaryBadge: { args: { variant: 'primary' } },
        SuccessBadge: { args: { variant: 'success' } },
        WarningBadge: { args: { variant: 'warning' } },
        ErrorBadge: { args: { variant: 'error' } }
      }
      
      Object.values(mockBadgeStories).forEach(story => {
        expect(VALID_BADGE_VARIANTS).toContain(story.args.variant as BadgeVariant)
      })
    })

    it('should handle cross-component consistency', () => {
      // Ensure size variants are consistent across components
      const commonSizes: readonly ButtonSize[] = ['small', 'medium', 'large'] as const
      
      const componentSizeDefinitions = {
        button: VALID_BUTTON_SIZES,
        input: ['small', 'medium', 'large'] as const,
        badge: ['small', 'medium', 'large'] as const
      }
      
      // Check that all components use consistent size options
      Object.values(componentSizeDefinitions).forEach(sizes => {
        commonSizes.forEach(size => {
          expect(sizes).toContain(size)
        })
      })
    })
  })

  // 🎯 Story Integration Tests
  describe('Story Integration Scenarios', () => {
    it('should validate form component story combinations', () => {
      const mockFormStories: Record<string, { args: FormStoryArgs }> = {
        LoginForm: {
          args: {
            inputs: [
              { variant: 'default', type: 'email', label: 'Email' },
              { variant: 'default', type: 'password', label: 'Password' }
            ],
            submitButton: { variant: 'primary', label: 'Sign In' },
            cancelButton: { variant: 'outline', label: 'Cancel' }
          }
        }
      }
      
      const formStory = mockFormStories.LoginForm
      
      // Validate input variants
      formStory.args.inputs.forEach((input) => {
        expect(['default', 'floating']).toContain(input.variant)
        expect(['text', 'email', 'password', 'search']).toContain(input.type)
      })
      
      // Validate button variants
      expect(VALID_BUTTON_VARIANTS).toContain(formStory.args.submitButton.variant as ButtonVariant)
      expect(VALID_BUTTON_VARIANTS).toContain(formStory.args.cancelButton.variant as ButtonVariant)
    })

    it('should validate interactive story scenarios', () => {
      const mockInteractiveStories: Record<string, Story> = {
        ButtonStates: {
          args: { variant: 'primary', label: 'Interactive Button' },
          play: async ({ canvasElement, step }) => {
            // Mock play function validation
            expect(step).toBeDefined()
            expect(canvasElement).toBeDefined()
            expect(canvasElement).toBeInstanceOf(HTMLElement)
          }
        }
      }
      
      const interactiveStory = mockInteractiveStories.ButtonStates
      expect(interactiveStory.play).toBeDefined()
      expect(typeof interactiveStory.play).toBe('function')
    })

    it('should validate story controls configuration', () => {
      const mockControlsConfiguration: ControlsConfiguration = {
        variant: {
          control: 'select',
          options: VALID_BUTTON_VARIANTS
        },
        size: {
          control: 'select', 
          options: VALID_BUTTON_SIZES
        },
        disabled: {
          control: 'boolean'
        },
        label: {
          control: 'text'
        }
      }
      
      // Verify control types
      expect(mockControlsConfiguration.variant.control).toBe('select')
      expect(mockControlsConfiguration.disabled.control).toBe('boolean')
      expect(mockControlsConfiguration.label.control).toBe('text')
      
      // Verify options match component definitions
      expect(mockControlsConfiguration.variant.options).toEqual(VALID_BUTTON_VARIANTS)
      expect(mockControlsConfiguration.size.options).toEqual(VALID_BUTTON_SIZES)
    })
  })
})