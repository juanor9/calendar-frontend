/**
 * Verification Animation Composable
 * Handles animation effects for verification flow
 */

export interface FloatingShape {
  key: number
  style: {
    animationDelay: string
    left: string
    animationDuration: string
  }
}

export function useVerificationAnimation() {
  
  const showVerificationSuccess = () => {
    // Add success animation class
    const card = document.querySelector('.verification-card')
    card?.classList.add('success-animation')
    
    setTimeout(() => {
      card?.classList.remove('success-animation')
    }, 1000)
  }
  
  const createFloatingShapes = (): FloatingShape[] => {
    // Create floating shapes for background animation
    const shapes: FloatingShape[] = []
    for (let i = 0; i < 6; i++) {
      shapes.push({
        key: i,
        style: {
          animationDelay: `${i * 0.5}s`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 2}s`
        }
      })
    }
    return shapes
  }
  
  const addSuccessClass = (element: HTMLElement) => {
    element.classList.add('success-animation')
    setTimeout(() => {
      element.classList.remove('success-animation')
    }, 1000)
  }
  
  return {
    showVerificationSuccess,
    createFloatingShapes,
    addSuccessClass
  }
}