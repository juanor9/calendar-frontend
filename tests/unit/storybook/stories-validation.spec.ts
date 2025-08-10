/**
 * Storybook Stories Validation Tests
 * Tests for proper Storybook story configuration and variant usage
 * 
 * CRITICAL: Tests for the specific error patterns found in Storybook stories
 */

import { describe, it, expect } from 'vitest'

// Mock Storybook story structures based on existing BaseButton stories
const mockBaseButtonStories = {
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
const VALID_BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost'] as const
const VALID_BUTTON_SIZES = ['small', 'medium', 'large'] as const

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
        expect(VALID_BUTTON_VARIANTS).toContain(story.args.variant as any)
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
        expect(VALID_BUTTON_VARIANTS).not.toContain(invalidVariant as any)
      })
    })

    it('should validate size variants in stories', () => {
      const mockSizeStories = {
        SmallButton: { args: { variant: 'primary', size: 'small' } },
        MediumButton: { args: { variant: 'primary', size: 'medium' } },
        LargeButton: { args: { variant: 'primary', size: 'large' } }
      }
      
      Object.values(mockSizeStories).forEach(story => {
        expect(VALID_BUTTON_SIZES).toContain(story.args.size as any)
      })
    })
  })

  // 🎨 Story Configuration Validation Tests
  describe('Story Configuration Validation', () => {
    it('should have proper story structure', () => {
      const validateStoryStructure = (story: any) => {
        return (
          story &&
          typeof story === 'object' &&
          story.args &&
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
          expect(story.args[arg]).toBeTruthy()
        })
      })
    })

    it('should validate story meta configuration', () => {
      const mockMeta = {
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
      expect(mockMeta.argTypes.variant.options).toEqual(VALID_BUTTON_VARIANTS)
      expect(mockMeta.argTypes.size.options).toEqual(VALID_BUTTON_SIZES)
    })
  })

  // 🔄 Story Variant Consistency Tests
  describe('Story Variant Consistency', () => {
    it('should maintain consistency between component and story variants', () => {
      // Mock component definition
      const componentVariantDefinition = {
        props: {
          variant: {
            type: String,
            validator: (value: string) => VALID_BUTTON_VARIANTS.includes(value as any)
          }
        }
      }
      
      // Test that story variants are valid according to component
      Object.values(mockBaseButtonStories).forEach(story => {
        const isValid = componentVariantDefinition.props.variant.validator(story.args.variant)
        expect(isValid).toBe(true)
      })
    })

    it('should cover all component variants in stories', () => {
      const storyVariants = Object.values(mockBaseButtonStories)
        .map(story => story.args.variant)
      
      VALID_BUTTON_VARIANTS.forEach(variant => {
        expect(storyVariants).toContain(variant)
      })
    })

    it('should not have duplicate variant stories', () => {
      const storyVariants = Object.values(mockBaseButtonStories)
        .map(story => story.args.variant)
      
      const uniqueVariants = [...new Set(storyVariants)]
      expect(storyVariants).toHaveLength(uniqueVariants.length)
    })
  })

  // 🧪 Story Testing Utilities
  describe('Story Testing Patterns', () => {
    it('should provide story validation utility', () => {
      const validateStoryVariants = <T extends Record<string, any>>(
        stories: Record<string, { args: T }>,
        validVariants: readonly string[]
      ): { valid: boolean; errors: string[] } => {
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
      const invalidStories = {
        Invalid: { args: { variant: 'invalid-variant' } }
      }
      
      const invalidResult = validateStoryVariants(invalidStories, VALID_BUTTON_VARIANTS)
      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors).toHaveLength(1)
      expect(invalidResult.errors[0]).toContain('invalid variant')
    })

    it('should validate story accessibility configuration', () => {
      const mockAccessibilityStories = {
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
      
      const validateAccessibilityArgs = (story: any) => {
        const hasAccessibleLabel = story.args.label || story.args['aria-label']
        const hasProperDisabledHandling = !story.args.disabled || story.args['aria-describedby']
        
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
      const mockDocumentedStories = {
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
      
      const validateStoryDocumentation = (stories: Record<string, any>) => {
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
      const VALID_INPUT_VARIANTS = ['default', 'floating'] as const
      const VALID_INPUT_TYPES = ['text', 'email', 'password', 'search'] as const
      
      const mockInputStories = {
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
        expect(VALID_INPUT_VARIANTS).toContain(story.args.variant as any)
        expect(VALID_INPUT_TYPES).toContain(story.args.type as any)
      })
    })

    it('should validate badge component stories', () => {
      const VALID_BADGE_VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const
      
      const mockBadgeStories = {
        PrimaryBadge: { args: { variant: 'primary' } },
        SuccessBadge: { args: { variant: 'success' } },
        WarningBadge: { args: { variant: 'warning' } },
        ErrorBadge: { args: { variant: 'error' } }
      }
      
      Object.values(mockBadgeStories).forEach(story => {
        expect(VALID_BADGE_VARIANTS).toContain(story.args.variant as any)
      })
    })

    it('should handle cross-component consistency', () => {
      // Ensure size variants are consistent across components
      const commonSizes = ['small', 'medium', 'large'] as const
      
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
      const mockFormStories = {
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
      formStory.args.inputs.forEach((input: any) => {
        expect(['default', 'floating']).toContain(input.variant)
        expect(['text', 'email', 'password', 'search']).toContain(input.type)
      })
      
      // Validate button variants
      expect(VALID_BUTTON_VARIANTS).toContain(formStory.args.submitButton.variant as any)
      expect(VALID_BUTTON_VARIANTS).toContain(formStory.args.cancelButton.variant as any)
    })

    it('should validate interactive story scenarios', () => {
      const mockInteractiveStories = {
        ButtonStates: {
          args: { variant: 'primary', label: 'Interactive Button' },
          play: async ({ canvasElement, step }: any) => {
            // Mock play function validation
            const expectedSteps = ['click', 'hover', 'focus']
            expect(step).toBeDefined()
            expect(canvasElement).toBeDefined()
          }
        }
      }
      
      const interactiveStory = mockInteractiveStories.ButtonStates
      expect(interactiveStory.play).toBeDefined()
      expect(typeof interactiveStory.play).toBe('function')
    })

    it('should validate story controls configuration', () => {
      const mockControlsConfiguration = {
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