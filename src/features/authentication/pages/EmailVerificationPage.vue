<!--
Email Verification Page - Refactored
Container component following architectural patterns
-->
<template>
  <div class="email-verification-page">
    <div class="verification-container">
      <div ref="verificationCard" class="verification-card">
        
        <!-- Status Display -->
        <VerificationStatus 
          :status="verificationState.status"
          :email="email"
        />
        
        <!-- Progress Steps -->
        <VerificationProgress
          v-if="verificationState.status === 'pending'"
          :current-step-index="verificationState.currentStepIndex"
          :steps="verificationSteps"
        />
        
        <!-- Action Buttons -->
        <VerificationActions
          :status="verificationState.status"
          :is-resending="verificationState.isResending"
          :is-checking="verificationState.isChecking"
          :can-resend="verificationState.canResend"
          :time-until-resend="verificationState.timeUntilResend"
          @resend="resendVerification"
          @primary-action="handlePrimaryAction"
          @check-now="checkNow"
        />
        
        <!-- Help Section -->
        <VerificationHelp />
        
      </div>
    </div>
    
    <!-- Background Animation -->
    <BackgroundAnimation />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEmailVerification } from '../composables/useEmailVerification'
import VerificationStatus from '../components/email-verification/VerificationStatus.vue'
import VerificationProgress from '../components/email-verification/VerificationProgress.vue'
import VerificationActions from '../components/email-verification/VerificationActions.vue'
import VerificationHelp from '../components/email-verification/VerificationHelp.vue'
import BackgroundAnimation from '../components/email-verification/BackgroundAnimation.vue'

// Use main composable
const {
  verificationState,
  verificationSteps,
  email,
  resendVerification,
  checkNow,
  handlePrimaryAction
} = useEmailVerification()

const route = useRoute()

// Watch for successful authentication (if user verifies in another tab)
watch(() => route.query, (newQuery) => {
  if (newQuery.verified === 'true') {
    // Handle external verification
    handlePrimaryAction('continue')
  }
})
</script>

<style lang="scss" scoped>
.email-verification-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.verification-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 2;
}

.verification-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 25%);
  transition: all 0.3s ease;
  
  &.success-animation {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(102, 126, 234, 30%);
  }
  
  @media (width <= 640px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
}
</style>