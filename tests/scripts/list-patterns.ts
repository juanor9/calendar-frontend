/**
 * Simple Error Pattern Listing Script
 * Lists all the critical error patterns that should be tested
 */

interface TestPattern {
  name: string
  description: string
  testFiles: string[]
  criticalPatterns: string[]
}

const ERROR_PATTERNS: TestPattern[] = [
  {
    name: 'Auth0 Token Handling',
    description: 'Tests for Auth0 token type handling (string vs GetTokenSilentlyVerboseResponse)',
    testFiles: [
      'tests/unit/auth/auth0-token-handling.spec.ts',
      'tests/unit/auth/auth0-config.spec.ts',
    ],
    criticalPatterns: [
      'GetTokenSilentlyVerboseResponse',
      "typeof token === 'string'",
      'token.access_token',
    ],
  },
  {
    name: 'Vue Composition API useAttrs',
    description: 'Tests for proper useAttrs usage and clickable logic detection',
    testFiles: ['tests/unit/components/BaseBadge.spec.ts'],
    criticalPatterns: ['useAttrs', 'attrs.onClick', 'badge--clickable'],
  },
  {
    name: 'Event Handler Types',
    description: 'Tests for proper event type handling and conversion',
    testFiles: ['tests/unit/components/event-handler-types.spec.ts'],
    criticalPatterns: ['MouseEvent', 'KeyboardEvent', 'event type conversion'],
  },
  {
    name: 'Asset Loading Validation',
    description: 'Tests for proper asset path handling (@/assets/ vs absolute paths)',
    testFiles: ['tests/unit/assets/asset-loading.spec.ts'],
    criticalPatterns: ['@/assets/', 'asset path validation'],
  },
  {
    name: 'Web Vitals Integration',
    description: 'Tests for web-vitals library import and usage',
    testFiles: ['tests/performance/web-vitals-integration.spec.ts'],
    criticalPatterns: ['onLCP', 'onFCP', 'Metric interface'],
  },
  {
    name: 'TypeScript Generic Types',
    description: 'Tests for proper generic type handling',
    testFiles: ['tests/unit/types/typescript-generics.spec.ts'],
    criticalPatterns: ['RenderOptions', 'generic constraints'],
  },
  {
    name: 'Storybook Stories Validation',
    description: 'Tests for proper Storybook story variant usage',
    testFiles: ['tests/unit/storybook/stories-validation.spec.ts'],
    criticalPatterns: ['VALID_.*_VARIANTS', 'story.args.variant'],
  },
]

function listPatterns(): void {
  console.log('\n📋 Critical Error Pattern Tests for Vana Frontend:\n')

  ERROR_PATTERNS.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern.name}`)
    console.log(`   ${pattern.description}`)
    console.log(`   Test Files: ${pattern.testFiles.length}`)
    console.log(`   Key Patterns: ${pattern.criticalPatterns.slice(0, 3).join(', ')}`)
    console.log('')
  })

  console.log(`Total: ${ERROR_PATTERNS.length} critical error patterns`)
  console.log(`Total Test Files: ${ERROR_PATTERNS.reduce((sum, p) => sum + p.testFiles.length, 0)}`)
}

function showPattern(name: string): void {
  const pattern = ERROR_PATTERNS.find(p => p.name.toLowerCase().includes(name.toLowerCase()))

  if (!pattern) {
    console.log(`Pattern "${name}" not found`)
    return
  }

  console.log(`\n📋 ${pattern.name}`)
  console.log(`Description: ${pattern.description}`)
  console.log('\nTest Files:')
  pattern.testFiles.forEach(file => console.log(`  - ${file}`))
  console.log('\nCritical Patterns to Test:')
  pattern.criticalPatterns.forEach(p => console.log(`  - ${p}`))
}

// Main execution
const command = process.argv[2]
const arg = process.argv[3]

switch (command) {
  case 'list':
    listPatterns()
    break
  case 'show':
    if (!arg) {
      console.log('Please specify a pattern name')
      break
    }
    showPattern(arg)
    break
  default:
    console.log('Commands:')
    console.log('  list - List all error patterns')
    console.log('  show <name> - Show details for specific pattern')
    break
}
