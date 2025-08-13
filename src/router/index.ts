import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout.vue'
import AuthCallback from '@/components/auth/AuthCallback/AuthCallback.vue'
import { adminGuard, premiumGuard, createPermissionGuard } from '@/auth/auth-guard'
import {
  enhancedAuthGuard,
  enhancedGuestGuard,
  emailVerificationGuard,
  onboardingFlowGuard,
  securityRouteGuard,
  composeGuards,
} from '@/auth/route-guards'
import { installNavigationMiddleware } from '@/auth/navigation-middleware'

const routes: RouteRecordRaw[] = [
  // Landing page (guest only)
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/pages/LandingPage.vue'),
    beforeEnter: enhancedGuestGuard,
    meta: {
      title: 'Vana Calendar - Transform Your Chaotic Calendar Into Productive Focus Time',
      requiresAuth: false,
    },
  },

  // Auth routes (no layout)
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/AuthPages/LoginPage.vue'),
        beforeEnter: enhancedGuestGuard,
        meta: {
          title: 'Sign In - Vana Calendar',
          requiresAuth: false,
        },
      },
      {
        path: 'logout',
        name: 'Logout',
        component: () => import('@/pages/AuthPages/LogoutPage.vue'),
        meta: {
          title: 'Signed Out - Vana Calendar',
          requiresAuth: false,
        },
      },
      {
        path: 'callback',
        name: 'AuthCallback',
        component: AuthCallback,
        meta: {
          title: 'Processing authentication...',
          requiresAuth: false,
          skipAuth: true,
        },
      },
      {
        path: 'verify-email',
        name: 'EmailVerification',
        component: () => import('@/pages/AuthPages/EmailVerificationPage.vue'),
        meta: {
          title: 'Verify Your Email - Vana Calendar',
          requiresAuth: false,
          skipAuth: true,
        },
      },
      {
        path: 'demo',
        name: 'AuthDemo',
        component: () => import('@/pages/AuthPages/AuthDemoPage.vue'),
        meta: {
          title: 'Auth Demo - Vana Calendar',
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/pages/AuthPages/ForgotPasswordPage.vue'),
        beforeEnter: enhancedGuestGuard,
        meta: {
          title: 'Reset Password - Vana Calendar',
          requiresAuth: false,
        },
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/pages/AuthPages/ResetPasswordPage.vue'),
        beforeEnter: enhancedGuestGuard,
        meta: {
          title: 'Set New Password - Vana Calendar',
          requiresAuth: false,
        },
      },
      {
        path: 'settings',
        name: 'AccountSettings',
        component: () => import('@/pages/AuthPages/AccountSettingsPage.vue'),
        beforeEnter: composeGuards(enhancedAuthGuard, emailVerificationGuard, securityRouteGuard),
        meta: {
          title: 'Account Settings - Vana Calendar',
          requiresAuth: true,
          requiresCompletedOnboarding: true,
          requiresEmailVerification: true,
        },
      },
      {
        path: 'privacy',
        name: 'PrivacyControls',
        component: () => import('@/pages/AuthPages/PrivacyControlsPage.vue'),
        beforeEnter: composeGuards(enhancedAuthGuard, emailVerificationGuard, securityRouteGuard),
        meta: {
          title: 'Privacy Controls - Vana Calendar',
          requiresAuth: true,
          requiresCompletedOnboarding: true,
          requiresEmailVerification: true,
        },
      },
      {
        path: 'security',
        name: 'SecurityDashboard',
        component: () => import('@/pages/AuthPages/SecurityDashboard.vue'),
        beforeEnter: composeGuards(enhancedAuthGuard, emailVerificationGuard, securityRouteGuard),
        meta: {
          title: 'Security Dashboard - Vana Calendar',
          requiresAuth: true,
          requiresCompletedOnboarding: true,
          requiresEmailVerification: true,
        },
      },
    ],
  },

  // Onboarding routes (authenticated users only)
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/pages/OnboardingPages/OnboardingWizard.vue'),
    beforeEnter: composeGuards(enhancedAuthGuard, onboardingFlowGuard),
    meta: {
      requiresAuth: true,
      requiresIncompleteOnboarding: true,
      title: 'Setup Your Calendar - Vana',
    },
    children: [
      {
        path: '',
        redirect: '/onboarding/welcome',
      },
      {
        path: 'welcome',
        name: 'OnboardingWelcome',
        component: () => import('@/pages/OnboardingPages/steps/WelcomeStep.vue'),
        meta: {
          step: 'welcome',
          title: 'Welcome to Vana',
        },
      },
      {
        path: 'preferences',
        name: 'OnboardingPreferences',
        component: () => import('@/pages/OnboardingPages/steps/WorkStyleStep.vue'),
        meta: {
          step: 'preferences',
          title: 'Work Style Preferences - Vana',
        },
      },
      {
        path: 'calendar',
        name: 'OnboardingCalendar',
        component: () => import('@/pages/OnboardingPages/steps/CalendarIntegrationStep.vue'),
        meta: {
          step: 'calendar_sync',
          title: 'Connect Your Calendar - Vana',
        },
      },
      {
        path: 'ai-setup',
        name: 'OnboardingAiSetup',
        component: () => import('@/pages/OnboardingPages/steps/AISetupStep.vue'),
        meta: {
          step: 'ai_setup',
          title: 'AI Assistant Setup - Vana',
        },
      },
      {
        path: 'tutorial',
        name: 'OnboardingTutorial',
        component: () => import('@/pages/OnboardingPages/steps/TutorialStep.vue'),
        meta: {
          step: 'tutorial',
          title: 'Quick Tour - Vana',
        },
      },
    ],
  },

  // Main app routes (with layout and auth protection)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/HomePage/HomePage.vue'),
    beforeEnter: enhancedAuthGuard,
    meta: {
      requiresAuth: true,
      requiresCompletedOnboarding: true,
      title: 'Dashboard - Vana Calendar',
    },
  },

  {
    path: '/app',
    component: DefaultLayout,
    beforeEnter: enhancedAuthGuard,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create CalendarPage
        meta: {
          layout: 'default',
          requiresAuth: true,
          requiresCompletedOnboarding: true,
          title: 'Calendar - Vana Calendar',
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/pages/AboutPage/AboutPage.vue'),
        meta: {
          layout: 'default',
          title: 'Acerca de - Vana Calendar',
        },
      },
      // Calendar routes
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create CalendarPage
        beforeEnter: enhancedAuthGuard,
        meta: {
          layout: 'default',
          requiresAuth: true,
          title: 'Calendario - Vana Calendar',
        },
      },
      // User routes
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create ProfilePage
        beforeEnter: enhancedAuthGuard,
        meta: {
          layout: 'default',
          requiresAuth: true,
          title: 'Mi Perfil - Vana Calendar',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create SettingsPage
        beforeEnter: enhancedAuthGuard,
        meta: {
          layout: 'default',
          requiresAuth: true,
          title: 'Configuración - Vana Calendar',
        },
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create NotificationsPage
        beforeEnter: enhancedAuthGuard,
        meta: {
          layout: 'default',
          requiresAuth: true,
          title: 'Notificaciones - Vana Calendar',
        },
      },
      // Premium routes
      {
        path: 'premium',
        name: 'Premium',
        component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create PremiumPage
        beforeEnter: premiumGuard,
        meta: {
          layout: 'default',
          requiresAuth: true,
          requiresRole: ['premium', 'admin', 'super_admin'],
          title: 'Premium - Vana Calendar',
        },
      },
      // Admin routes
      {
        path: 'admin',
        beforeEnter: adminGuard,
        children: [
          {
            path: '',
            name: 'AdminDashboard',
            component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create AdminDashboard
            meta: {
              layout: 'default',
              requiresAuth: true,
              requiresRole: ['admin', 'super_admin'],
              title: 'Panel de Admin - Vana Calendar',
            },
          },
          {
            path: 'users',
            name: 'AdminUsers',
            component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create AdminUsersPage
            beforeEnter: createPermissionGuard(['admin:users']),
            meta: {
              layout: 'default',
              requiresAuth: true,
              requiresPermission: ['admin:users'],
              title: 'Gestión de Usuarios - Admin',
            },
          },
          {
            path: 'system',
            name: 'AdminSystem',
            component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create AdminSystemPage
            beforeEnter: createPermissionGuard(['admin:system']),
            meta: {
              layout: 'default',
              requiresAuth: true,
              requiresPermission: ['admin:system'],
              title: 'Sistema - Admin',
            },
          },
        ],
      },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create UnauthorizedPage
    meta: {
      title: 'Acceso Denegado - Vana Calendar',
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create ErrorPage
    meta: {
      title: 'Error - Vana Calendar',
    },
  },

  // Catch all route - 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/HomePage/HomePage.vue'), // TODO: Create 404Page
    meta: {
      title: 'Página no encontrada - Vana Calendar',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Install navigation middleware
installNavigationMiddleware(router, {
  enableTokenRefresh: true,
  enableSessionValidation: true,
  enableActivityTracking: true,
  sessionTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  tokenRefreshThresholdMs: 5 * 60 * 1000, // 5 minutes
})

// Additional router configuration (navigation middleware handles most global guards)
router.beforeEach(async (to, from, next) => {
  // Add page transition class
  const body = document.body
  body.classList.add('page-transitioning')
  next()
})

export default router
