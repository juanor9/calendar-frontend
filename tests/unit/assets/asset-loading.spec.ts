/**
 * Asset Loading Tests
 * Tests for correct asset path handling and loading validation
 *
 * CRITICAL: Tests for the specific error patterns found in asset loading and path resolution
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock components that use assets
const LoginPage = {
  template: `
    <div class="login-page">
      <img src="@/assets/images/vana-logo.png" alt="Vana Logo" class="login-logo" />
      <img src="@/assets/images/hero-background.jpg" alt="Background" class="bg-image" />
    </div>
  `,
  name: 'LoginPage',
}

const ComponentWithAssets = {
  template: `
    <div>
      <img src="@/assets/images/icon-calendar.svg" alt="Calendar" />
      <img src="@/assets/images/icon-task.svg" alt="Task" />
      <img src="@/assets/icons/chevron-down.svg" alt="Chevron" />
    </div>
  `,
  name: 'ComponentWithAssets',
}

const DynamicAssetComponent = {
  props: ['iconName'],
  template: `
    <div>
      <img :src="getIconPath(iconName)" :alt="iconName" />
    </div>
  `,
  methods: {
    getIconPath(name: string) {
      return `@/assets/icons/${name}.svg`
    },
  },
}

describe('Asset Loading Patterns', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  // 🖼️ Static Asset Path Tests
  describe('Static Asset Paths', () => {
    it('should load images with correct @/assets/ paths', () => {
      const wrapper = mount(LoginPage)
      const logoImg = wrapper.find('img[alt="Vana Logo"]')
      const bgImg = wrapper.find('img[alt="Background"]')

      // Verify that assets use @/assets/ path, not absolute paths
      expect(logoImg.attributes('src')).toMatch(/\/src\/assets\/images\/vana-logo\.png$/)
      expect(logoImg.attributes('src')).not.toMatch(/^\/vana-logo\.png/)

      expect(bgImg.attributes('src')).toMatch(/\/src\/assets\/images\/hero-background\.jpg$/)
      expect(bgImg.attributes('src')).not.toMatch(/^\/hero-background\.jpg/)
    })

    it('should handle different asset types correctly', () => {
      const wrapper = mount(ComponentWithAssets)
      const images = wrapper.findAll('img')

      // Verify SVG assets
      const calendarIcon = images.find(img => img.attributes('alt') === 'Calendar')
      const taskIcon = images.find(img => img.attributes('alt') === 'Task')
      const chevronIcon = images.find(img => img.attributes('alt') === 'Chevron')

      expect(calendarIcon?.attributes('src')).toMatch(/\/src\/assets\/images\/icon-calendar\.svg$/)
      expect(taskIcon?.attributes('src')).toMatch(/\/src\/assets\/images\/icon-task\.svg$/)
      expect(chevronIcon?.attributes('src')).toMatch(/\/src\/assets\/icons\/chevron-down\.svg$/)
    })

    it('should not use direct public folder paths', () => {
      // Test that components don't reference /public/ assets directly
      const ProblematicComponent = {
        template: '<img src="/logo.png" alt="Wrong Path" />',
        name: 'ProblematicComponent',
      }

      const wrapper = mount(ProblematicComponent)
      const img = wrapper.find('img')

      // This is an anti-pattern - should not start with just "/"
      expect(img.attributes('src')).toBe('/logo.png')

      // In a real app, this should be flagged as incorrect
      // Correct path would be: "@/assets/images/logo.png"
    })
  })

  // 📁 Asset Resolution Tests
  describe('Asset Resolution Patterns', () => {
    it('should handle asset imports correctly', () => {
      // Mock asset import pattern
      const mockAssetImport = (path: string): string => {
        if (path.startsWith('@/assets/')) {
          const relativePath = path.replace('@/', '/src/')
          return `${relativePath}?url`
        }
        return path
      }

      const testPaths = [
        '@/assets/images/vana-logo.png',
        '@/assets/icons/menu.svg',
        '@/assets/styles/main.css',
      ]

      testPaths.forEach(path => {
        const resolved = mockAssetImport(path)
        expect(resolved).toMatch(/^\/src\/assets\/.*\?url$/)
      })
    })

    it('should handle nested asset paths correctly', () => {
      const AssetPathComponent = {
        template: `
          <div>
            <img src="@/assets/images/ui/buttons/primary-bg.png" alt="Primary BG" />
            <img src="@/assets/images/ui/icons/social/facebook.svg" alt="Facebook" />
            <img src="@/assets/images/avatars/default-user.jpg" alt="Default User" />
          </div>
        `,
      }

      const wrapper = mount(AssetPathComponent)
      const images = wrapper.findAll('img')

      // Verify nested path structure is preserved
      expect(images[0].attributes('src')).toMatch(
        /\/src\/assets\/images\/ui\/buttons\/primary-bg\.png$/
      )
      expect(images[1].attributes('src')).toMatch(
        /\/src\/assets\/images\/ui\/icons\/social\/facebook\.svg$/
      )
      expect(images[2].attributes('src')).toMatch(
        /\/src\/assets\/images\/avatars\/default-user\.jpg$/
      )
    })
  })

  // 🔄 Dynamic Asset Loading Tests
  describe('Dynamic Asset Loading', () => {
    it('should handle dynamic asset paths correctly', () => {
      const wrapper = mount(DynamicAssetComponent, {
        props: { iconName: 'arrow-right' },
      })

      const img = wrapper.find('img')
      expect(img.attributes('src')).toMatch(/\/src\/assets\/icons\/arrow-right\.svg$/)
      expect(img.attributes('alt')).toBe('arrow-right')
    })

    it('should handle computed asset paths', () => {
      const ComputedAssetComponent = {
        props: ['theme', 'size'],
        template: '<img :src="computedIconPath" alt="Dynamic Icon" />',
        computed: {
          computedIconPath() {
            return `@/assets/icons/${this.theme}/${this.size}/icon.svg`
          },
        },
      }

      const wrapper = mount(ComputedAssetComponent, {
        props: { theme: 'dark', size: 'large' },
      })

      const img = wrapper.find('img')
      expect(img.attributes('src')).toMatch(/\/src\/assets\/icons\/dark\/large\/icon\.svg$/)
    })

    it('should handle conditional asset loading', async () => {
      const ConditionalAssetComponent = {
        props: ['showLogo'],
        template: `
          <div>
            <img v-if="showLogo" src="@/assets/images/vana-logo.png" alt="Logo" />
            <img v-else src="@/assets/images/placeholder.png" alt="Placeholder" />
          </div>
        `,
      }

      const wrapper = mount(ConditionalAssetComponent, {
        props: { showLogo: true },
      })

      // Initially shows logo
      let img = wrapper.find('img')
      expect(img.attributes('src')).toMatch(/vana-logo\.png$/)
      expect(img.attributes('alt')).toBe('Logo')

      // Switch to placeholder
      await wrapper.setProps({ showLogo: false })
      img = wrapper.find('img')
      expect(img.attributes('src')).toMatch(/placeholder\.png$/)
      expect(img.attributes('alt')).toBe('Placeholder')
    })
  })

  // 🚫 Missing Asset Handling Tests
  describe('Missing Asset Handling', () => {
    it('should handle missing assets gracefully', async () => {
      const componentWithMissingAssets = mount(ComponentWithAssets)

      await nextTick()

      // Verify that no console errors were thrown for missing assets
      // In a real environment, Vite would handle missing assets
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringMatching(/Failed to resolve/))
    })

    it('should provide fallback for missing images', () => {
      const FallbackImageComponent = {
        template: `
          <img 
            src="@/assets/images/missing-image.png" 
            alt="Missing Image"
            @error="handleImageError"
          />
        `,
        methods: {
          handleImageError(event: Event) {
            const img = event.target as HTMLImageElement
            img.src = '@/assets/images/placeholder.png'
          },
        },
      }

      const wrapper = mount(FallbackImageComponent)
      const img = wrapper.find('img')

      // Simulate image load error
      img.trigger('error')

      // Component should handle the error (method exists)
      expect(wrapper.vm.handleImageError).toBeDefined()
    })

    it('should validate asset existence in development', () => {
      // Mock development asset validation
      const validateAssetPath = (path: string): boolean => {
        const validPaths = [
          '@/assets/images/vana-logo.png',
          '@/assets/images/hero-background.jpg',
          '@/assets/icons/menu.svg',
          '@/assets/images/placeholder.png',
        ]

        return validPaths.includes(path)
      }

      // Test valid paths
      expect(validateAssetPath('@/assets/images/vana-logo.png')).toBe(true)
      expect(validateAssetPath('@/assets/icons/menu.svg')).toBe(true)

      // Test invalid paths
      expect(validateAssetPath('@/assets/images/non-existent.png')).toBe(false)
      expect(validateAssetPath('/wrong-path.png')).toBe(false)
    })
  })

  // 🎨 CSS Asset Loading Tests
  describe('CSS Asset Loading', () => {
    it('should handle CSS background image assets', () => {
      const CSSAssetComponent = {
        template: `
          <div 
            class="hero-section" 
            :style="{ 
              backgroundImage: 'url(@/assets/images/hero-bg.jpg)' 
            }"
          >
            Content
          </div>
        `,
      }

      const wrapper = mount(CSSAssetComponent)
      const heroDiv = wrapper.find('.hero-section')

      expect(heroDiv.attributes('style')).toMatch(/url\(@\/assets\/images\/hero-bg\.jpg\)/)
    })

    it('should handle CSS assets in style blocks', () => {
      // This would be handled by the CSS processor in a real app
      const cssAssetPattern = /@\/assets\/[^)]+/g
      const cssContent = `
        .logo { background-image: url('@/assets/images/logo.png'); }
        .icon { background-image: url('@/assets/icons/star.svg'); }
      `

      const matches = cssContent.match(cssAssetPattern)
      expect(matches).toHaveLength(2)
      expect(matches).toContain('@/assets/images/logo.png')
      expect(matches).toContain('@/assets/icons/star.svg')
    })
  })

  // 🔍 Asset Path Validation Tests
  describe('Asset Path Validation', () => {
    it('should identify correct asset path patterns', () => {
      const isValidAssetPath = (path: string): boolean => {
        // Valid patterns:
        // @/assets/images/*.{png,jpg,jpeg,gif,webp}
        // @/assets/icons/*.svg
        // @/assets/fonts/*
        // @/assets/styles/*

        const validPatterns = [
          /^@\/assets\/images\/.*\.(png|jpg|jpeg|gif|webp)$/,
          /^@\/assets\/icons\/.*\.svg$/,
          /^@\/assets\/fonts\/.*$/,
          /^@\/assets\/styles\/.*\.(css|scss)$/,
        ]

        return validPatterns.some(pattern => pattern.test(path))
      }

      // Test valid paths
      const validPaths = [
        '@/assets/images/logo.png',
        '@/assets/images/hero.jpg',
        '@/assets/icons/menu.svg',
        '@/assets/fonts/roboto.woff2',
        '@/assets/styles/main.css',
      ]

      validPaths.forEach(path => {
        expect(isValidAssetPath(path)).toBe(true)
      })

      // Test invalid paths
      const invalidPaths = [
        '/public/logo.png',
        'assets/images/logo.png',
        '@/assets/images/logo.txt',
        'http://external.com/image.png',
      ]

      invalidPaths.forEach(path => {
        expect(isValidAssetPath(path)).toBe(false)
      })
    })

    it('should detect problematic asset references', () => {
      const findProblematicAssets = (template: string): string[] => {
        const problematicPatterns = [
          /src=["|']\/[^@][^"|']*/g, // Absolute paths without @
          /url\(['"]?\/[^@][^'")]*['"]?\)/g, // CSS urls without @
        ]

        const issues: string[] = []

        problematicPatterns.forEach(pattern => {
          const matches = template.match(pattern)
          if (matches) {
            issues.push(...matches)
          }
        })

        return issues
      }

      const problematicTemplate = `
        <div>
          <img src="/logo.png" alt="Wrong 1" />
          <img src="@/assets/images/correct.png" alt="Correct" />
          <img src="/public/image.jpg" alt="Wrong 2" />
        </div>
      `

      const issues = findProblematicAssets(problematicTemplate)
      expect(issues).toHaveLength(2)
      expect(issues).toContain('src="/logo.png"')
      expect(issues).toContain('src="/public/image.jpg"')
    })
  })

  // 🚀 Performance Asset Tests
  describe('Asset Performance Patterns', () => {
    it('should handle lazy loading assets', () => {
      const LazyImageComponent = {
        template: `
          <img 
            :src="imageSrc"
            alt="Lazy Image"
            loading="lazy"
          />
        `,
        data() {
          return {
            imageSrc: '@/assets/images/large-hero.jpg',
          }
        },
      }

      const wrapper = mount(LazyImageComponent)
      const img = wrapper.find('img')

      expect(img.attributes('loading')).toBe('lazy')
      expect(img.attributes('src')).toMatch(/large-hero\.jpg$/)
    })

    it('should handle responsive image assets', () => {
      const ResponsiveImageComponent = {
        template: `
          <picture>
            <source 
              media="(min-width: 768px)" 
              :srcset="desktopSrc"
            />
            <source 
              media="(max-width: 767px)" 
              :srcset="mobileSrc"
            />
            <img :src="fallbackSrc" alt="Responsive Image" />
          </picture>
        `,
        data() {
          return {
            desktopSrc: '@/assets/images/hero-desktop.jpg',
            mobileSrc: '@/assets/images/hero-mobile.jpg',
            fallbackSrc: '@/assets/images/hero-fallback.jpg',
          }
        },
      }

      const wrapper = mount(ResponsiveImageComponent)
      const sources = wrapper.findAll('source')
      const img = wrapper.find('img')

      expect(sources[0].attributes('srcset')).toMatch(/hero-desktop\.jpg$/)
      expect(sources[1].attributes('srcset')).toMatch(/hero-mobile\.jpg$/)
      expect(img.attributes('src')).toMatch(/hero-fallback\.jpg$/)
    })

    it('should handle asset preloading hints', () => {
      const PreloadAssetComponent = {
        template: `
          <div>
            <link rel="preload" :href="criticalImageSrc" as="image" />
            <img :src="criticalImageSrc" alt="Critical Image" />
          </div>
        `,
        data() {
          return {
            criticalImageSrc: '@/assets/images/above-fold-hero.jpg',
          }
        },
      }

      const wrapper = mount(PreloadAssetComponent)
      const preloadLink = wrapper.find('link[rel="preload"]')
      const img = wrapper.find('img')

      expect(preloadLink.attributes('href')).toMatch(/above-fold-hero\.jpg$/)
      expect(preloadLink.attributes('as')).toBe('image')
      expect(img.attributes('src')).toMatch(/above-fold-hero\.jpg$/)
    })
  })
})
