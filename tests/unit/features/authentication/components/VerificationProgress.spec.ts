/**
 * COMPONENT ANALYSIS TEMPLATE - VerificationProgress.vue
 * 
 * COMPONENT: VerificationProgress.vue
 * DEPENDENCIES FOUND:
 * - Props: currentStepIndex (number), steps (VerificationStep[] optional)
 * - Icons: CheckCircleIcon
 * - Default steps provided via withDefaults
 * - Computed: getStepClass function
 * - No lifecycle hooks
 * - No composables used
 * - Pure presentation component with step progression logic
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import VerificationProgress from '@/features/authentication/components/email-verification/VerificationProgress.vue'
import type { VerificationStep } from '@/features/authentication/components/email-verification/VerificationProgress.vue'

describe('VerificationProgress Component', () => {
  const defaultSteps: VerificationStep[] = [
    { id: 1, label: 'Email sent' },
    { id: 2, label: 'Check your inbox' },
    { id: 3, label: 'Click verify link' },
    { id: 4, label: 'Account activated' }
  ]

  const renderComponent = (props = {}) => {
    return render(VerificationProgress, {
      props: {
        currentStepIndex: 0,
        ...props
      }
    })
  }

  describe('Rendering and Props', () => {
    it('renders with default steps when no steps provided', () => {
      renderComponent({ currentStepIndex: 0 })

      expect(screen.getByText('Email sent')).toBeInTheDocument()
      expect(screen.getByText('Check your inbox')).toBeInTheDocument()
      expect(screen.getByText('Click verify link')).toBeInTheDocument()
      expect(screen.getByText('Account activated')).toBeInTheDocument()
    })

    it('renders with custom steps when provided', () => {
      const customSteps = [
        { id: 1, label: 'Step 1' },
        { id: 2, label: 'Step 2' },
        { id: 3, label: 'Step 3' }
      ]
      
      renderComponent({ 
        currentStepIndex: 0, 
        steps: customSteps 
      })

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
      expect(screen.queryByText('Account activated')).not.toBeInTheDocument()
    })

    it('displays correct number of steps', () => {
      renderComponent()

      const steps = document.querySelectorAll('.step')
      expect(steps).toHaveLength(4)
    })
  })

  describe('Step States', () => {
    it('shows first step as current when currentStepIndex is 0', () => {
      renderComponent({ currentStepIndex: 0 })

      const steps = document.querySelectorAll('.step')
      expect(steps[0]).toHaveClass('current')
      expect(steps[1]).toHaveClass('pending')
      expect(steps[2]).toHaveClass('pending')
      expect(steps[3]).toHaveClass('pending')
    })

    it('shows correct completed, current, and pending states', () => {
      renderComponent({ currentStepIndex: 2 })

      const steps = document.querySelectorAll('.step')
      expect(steps[0]).toHaveClass('completed')
      expect(steps[1]).toHaveClass('completed')
      expect(steps[2]).toHaveClass('current')
      expect(steps[3]).toHaveClass('pending')
    })

    it('handles all steps completed', () => {
      renderComponent({ currentStepIndex: 4 })

      const steps = document.querySelectorAll('.step')
      expect(steps[0]).toHaveClass('completed')
      expect(steps[1]).toHaveClass('completed')
      expect(steps[2]).toHaveClass('completed')
      expect(steps[3]).toHaveClass('completed')
    })
  })

  describe('Step Visual Elements', () => {
    it('shows check icons for completed steps', () => {
      renderComponent({ currentStepIndex: 2 })

      // First two steps should show check icons (completed)
      const checkIcons = document.querySelectorAll('svg[data-testid*="check"], .w-4.h-4.text-green-500')
      expect(checkIcons.length).toBeGreaterThanOrEqual(2)
    })

    it('shows loading spinner for current step', () => {
      renderComponent({ currentStepIndex: 1 })

      const loadingSpinner = document.querySelector('.loading-spinner')
      expect(loadingSpinner).toBeInTheDocument()
    })

    it('shows step numbers for pending steps', () => {
      renderComponent({ currentStepIndex: 0 })

      // Steps 1, 2, 3 should show numbers (pending)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('maintains grid layout structure', () => {
      renderComponent()

      const progressSteps = document.querySelector('.progress-steps')
      expect(progressSteps).toHaveStyle('display: grid')
      expect(progressSteps).toHaveStyle('grid-template-columns: repeat(4, 1fr)')
    })

    it('handles different number of steps in grid', () => {
      const threeSteps = [
        { id: 1, label: 'Step 1' },
        { id: 2, label: 'Step 2' },
        { id: 3, label: 'Step 3' }
      ]
      
      renderComponent({ steps: threeSteps })

      const steps = document.querySelectorAll('.step')
      expect(steps).toHaveLength(3)
      
      // Grid should still work with different number of items
      const progressSteps = document.querySelector('.progress-steps')
      expect(progressSteps).toHaveStyle('display: grid')
    })
  })

  describe('Animation Classes', () => {
    it('applies correct CSS classes for completed steps', () => {
      renderComponent({ currentStepIndex: 2 })

      const completedSteps = document.querySelectorAll('.step.completed')
      expect(completedSteps).toHaveLength(2)
      
      completedSteps.forEach(step => {
        expect(step).toHaveClass('completed')
      })
    })

    it('applies correct CSS classes for current step', () => {
      renderComponent({ currentStepIndex: 1 })

      const currentStep = document.querySelector('.step.current')
      expect(currentStep).toBeInTheDocument()
      expect(currentStep).toHaveClass('current')
    })

    it('applies correct CSS classes for pending steps', () => {
      renderComponent({ currentStepIndex: 1 })

      const pendingSteps = document.querySelectorAll('.step.pending')
      expect(pendingSteps.length).toBeGreaterThan(0)
      
      pendingSteps.forEach(step => {
        expect(step).toHaveClass('pending')
      })
    })
  })

  describe('Accessibility', () => {
    it('provides meaningful step labels', () => {
      renderComponent()

      defaultSteps.forEach(step => {
        expect(screen.getByText(step.label)).toBeInTheDocument()
      })
    })

    it('maintains semantic structure', () => {
      renderComponent()

      const progressContainer = document.querySelector('.verification-progress')
      expect(progressContainer).toBeInTheDocument()
      
      const stepsContainer = document.querySelector('.progress-steps')
      expect(stepsContainer).toBeInTheDocument()
    })

    it('each step has proper structure', () => {
      renderComponent()

      const steps = document.querySelectorAll('.step')
      steps.forEach(step => {
        expect(step.querySelector('.step-circle')).toBeInTheDocument()
        expect(step.querySelector('.step-label')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles negative currentStepIndex', () => {
      renderComponent({ currentStepIndex: -1 })

      const steps = document.querySelectorAll('.step')
      steps.forEach(step => {
        expect(step).toHaveClass('pending')
      })
    })

    it('handles currentStepIndex beyond step count', () => {
      renderComponent({ currentStepIndex: 10 })

      const steps = document.querySelectorAll('.step')
      steps.forEach(step => {
        expect(step).toHaveClass('completed')
      })
    })

    it('handles empty steps array', () => {
      renderComponent({ steps: [] })

      const steps = document.querySelectorAll('.step')
      expect(steps).toHaveLength(0)
    })

    it('handles single step', () => {
      const singleStep = [{ id: 1, label: 'Only step' }]
      renderComponent({ steps: singleStep, currentStepIndex: 0 })

      expect(screen.getByText('Only step')).toBeInTheDocument()
      expect(document.querySelectorAll('.step')).toHaveLength(1)
    })
  })

  describe('Loading Animation', () => {
    it('shows spinning animation on current step', () => {
      renderComponent({ currentStepIndex: 1 })

      const spinner = document.querySelector('.loading-spinner')
      expect(spinner).toBeInTheDocument()
      
      // Check for animation class (defined in CSS)
      const computedStyle = window.getComputedStyle(spinner as Element)
      expect(computedStyle.animation).toContain('spin')
    })

    it('does not show spinner on completed steps', () => {
      renderComponent({ currentStepIndex: 2 })

      // Current step (index 2) should have spinner, but not completed steps
      const completedSteps = document.querySelectorAll('.step.completed')
      completedSteps.forEach(step => {
        expect(step.querySelector('.loading-spinner')).not.toBeInTheDocument()
      })
    })
  })
})