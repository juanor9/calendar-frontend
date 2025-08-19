<!--
Verification Help Component
Displays help links and troubleshooting section
-->
<template>
  <div class="verification-help">
    <div class="help-links">
      <button class="help-link" @click="toggleTroubleshooting">
        <QuestionMarkCircleIcon class="w-4 h-4" />
        Didn't receive the email?
      </button>
      <a href="/support" class="help-link">
        <ChatBubbleLeftIcon class="w-4 h-4" />
        Contact support
      </a>
    </div>
    
    <!-- Troubleshooting Tips -->
    <div v-if="showTroubleshooting" class="troubleshooting">
      <h3>Troubleshooting Tips:</h3>
      <ul>
        <li v-for="tip in troubleshootingTips" :key="tip">{{ tip }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const showTroubleshooting = ref(false)

const troubleshootingTips = [
  'Check your spam/junk folder',
  'Make sure you entered the correct email address',
  'Wait a few minutes - emails can take time to arrive',
  'Try adding no-reply@vana.ai to your contacts'
]

const toggleTroubleshooting = () => {
  showTroubleshooting.value = !showTroubleshooting.value
}
</script>

<style lang="scss" scoped>
.verification-help {

  .help-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
    
    @media (width <= 640px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  .help-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #718096;
    text-decoration: none;
    border: none;
    background: none;
    cursor: pointer;
    transition: color 0.2s ease;
    
    &:hover {
      color: #667eea;
    }
  }
  
  .troubleshooting {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 0.5rem;
    text-align: left;
    
    h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.8rem;
      color: #718096;
      
      li {
        padding: 0.25rem 0;
        position: relative;
        padding-left: 1rem;
        
        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #667eea;
        }
      }
    }
  }
}
</style>