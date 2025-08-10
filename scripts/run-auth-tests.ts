#!/usr/bin/env node

/**
 * Auth Testing Suite Runner
 * Comprehensive test runner for all Auth0-related tests
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import chalk from 'chalk'

interface TestSuite {
  name: string
  command: string
  description: string
  optional?: boolean
}

interface TestResult {
  name: string
  passed: boolean
  duration: number
  output: string
  error?: string
}

class AuthTestRunner {
  private results: TestResult[] = []
  private startTime = Date.now()

  private testSuites: TestSuite[] = [
    {
      name: 'Unit Tests',
      command: 'vitest run tests/unit/auth --coverage',
      description: 'Auth composables, store, and configuration tests',
    },
    {
      name: 'Component Tests',
      command: 'vitest run tests/unit/components/auth --coverage',
      description: 'Auth component unit tests',
    },
    {
      name: 'Performance Tests',
      command: 'vitest run tests/performance/auth-performance.spec.ts',
      description: 'Performance and Core Web Vitals validation',
      optional: true,
    },
    {
      name: 'Accessibility Tests',
      command: 'vitest run tests/a11y/auth-accessibility.spec.ts',
      description: 'WCAG 2.2 AA compliance testing',
      optional: true,
    },
    {
      name: 'E2E Tests',
      command: 'cypress run --spec "tests/e2e/auth/**/*.cy.ts"',
      description: 'End-to-end authentication flows',
      optional: true,
    },
    {
      name: 'Integration Tests',
      command: 'vitest run tests/integration --grep="auth"',
      description: 'Auth integration with Apollo, Router, etc.',
      optional: true,
    },
  ]

  async run(
    options: {
      suite?: string
      skipOptional?: boolean
      verbose?: boolean
      generateReport?: boolean
    } = {}
  ): Promise<void> {
    console.log(chalk.blue.bold('🔐 Running Auth0 Testing Suite\n'))

    this.ensureDirectories()

    const suitesToRun = this.testSuites.filter(suite => {
      if (options.suite && suite.name.toLowerCase() !== options.suite.toLowerCase()) {
        return false
      }
      if (options.skipOptional && suite.optional) {
        return false
      }
      return true
    })

    for (const suite of suitesToRun) {
      await this.runTestSuite(suite, options.verbose)
    }

    this.printSummary()

    if (options.generateReport) {
      this.generateReports()
    }

    process.exit(this.hasFailures() ? 1 : 0)
  }

  private ensureDirectories(): void {
    const dirs = ['coverage/auth', 'reports/auth', 'reports/auth/junit', 'reports/auth/html']

    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    })
  }

  private async runTestSuite(suite: TestSuite, verbose = false): Promise<void> {
    console.log(chalk.yellow(`\n📋 ${suite.name}`))
    console.log(chalk.gray(`   ${suite.description}`))

    const startTime = Date.now()
    let passed = false
    let output = ''
    let error = ''

    try {
      if (verbose) {
        console.log(chalk.gray(`   Command: ${suite.command}\n`))
      }

      output = execSync(suite.command, {
        encoding: 'utf-8',
        stdio: verbose ? 'inherit' : 'pipe',
        timeout: 300000, // 5 minutes timeout
        env: {
          ...process.env,
          NODE_ENV: 'test',
          CI: 'true',
        },
      })

      passed = true
      console.log(chalk.green(`   ✅ Passed`))
    } catch (err: any) {
      passed = false
      error = err.message
      output = err.stdout || err.output?.join('') || ''

      if (suite.optional) {
        console.log(chalk.yellow(`   ⚠️  Failed (optional)`))
      } else {
        console.log(chalk.red(`   ❌ Failed`))
        if (verbose && error) {
          console.log(chalk.red(`   Error: ${error}`))
        }
      }
    }

    const duration = Date.now() - startTime

    this.results.push({
      name: suite.name,
      passed,
      duration,
      output,
      error,
    })

    console.log(chalk.gray(`   Duration: ${duration}ms`))
  }

  private printSummary(): void {
    const totalDuration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    const total = this.results.length

    console.log(chalk.blue.bold('\n📊 Test Summary'))
    console.log(chalk.blue('━'.repeat(50)))

    console.log(`${chalk.green('✅ Passed:')} ${passed}/${total}`)
    console.log(`${chalk.red('❌ Failed:')} ${failed}/${total}`)
    console.log(`${chalk.blue('⏱️  Duration:')} ${totalDuration}ms`)

    if (failed > 0) {
      console.log(chalk.red.bold('\n❌ Failed Tests:'))
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(chalk.red(`   • ${result.name}`))
          if (result.error) {
            console.log(chalk.gray(`     ${result.error.split('\n')[0]}`))
          }
        })
    }

    // Coverage summary (if available)
    this.printCoverageSummary()
  }

  private printCoverageSummary(): void {
    try {
      const coveragePath = 'coverage/coverage-summary.json'
      if (existsSync(coveragePath)) {
        const coverage = JSON.parse(require('fs').readFileSync(coveragePath, 'utf-8'))
        const authCoverage = coverage.total // Simplified - would filter for auth files

        console.log(chalk.blue.bold('\n📈 Coverage Summary'))
        console.log(chalk.blue('━'.repeat(50)))
        console.log(`${chalk.green('Statements:')} ${authCoverage.statements?.pct || 0}%`)
        console.log(`${chalk.green('Branches:')} ${authCoverage.branches?.pct || 0}%`)
        console.log(`${chalk.green('Functions:')} ${authCoverage.functions?.pct || 0}%`)
        console.log(`${chalk.green('Lines:')} ${authCoverage.lines?.pct || 0}%`)
      }
    } catch (error) {
      // Coverage file might not exist
    }
  }

  private generateReports(): void {
    console.log(chalk.blue.bold('\n📄 Generating Reports'))

    // Generate JSON report
    const jsonReport = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results: this.results,
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length,
        success: !this.hasFailures(),
      },
    }

    writeFileSync('reports/auth/test-results.json', JSON.stringify(jsonReport, null, 2))

    // Generate HTML report
    this.generateHtmlReport(jsonReport)

    // Generate JUnit XML report
    this.generateJUnitReport()

    console.log(chalk.green('   ✅ Reports generated in ./reports/auth/'))
  }

  private generateHtmlReport(jsonReport: any): void {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth0 Test Results</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .total { color: #007bff; }
        .duration { color: #6c757d; }
        .results-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .results-table th, .results-table td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        .results-table th { background: #f8f9fa; font-weight: 600; }
        .status-pass { color: #28a745; }
        .status-fail { color: #dc3545; }
        .error-details { font-size: 0.875em; color: #6c757d; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Auth0 Test Results</h1>
            <p>Generated on ${new Date(jsonReport.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value total">${jsonReport.summary.total}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-value passed">${jsonReport.summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value failed">${jsonReport.summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value duration">${jsonReport.duration}ms</div>
                <div>Duration</div>
            </div>
        </div>
        
        <table class="results-table">
            <thead>
                <tr>
                    <th>Test Suite</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${jsonReport.results
                  .map(
                    (result: any) => `
                    <tr>
                        <td><strong>${result.name}</strong></td>
                        <td class="${result.passed ? 'status-pass' : 'status-fail'}">
                            ${result.passed ? '✅ Passed' : '❌ Failed'}
                        </td>
                        <td>${result.duration}ms</td>
                        <td>
                            ${result.error ? `<div class="error-details" title="${result.error}">${result.error}</div>` : ''}
                        </td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
    `

    writeFileSync('reports/auth/test-results.html', html)
  }

  private generateJUnitReport(): void {
    const testsuites = this.results
      .map(result => {
        const testcase = result.passed
          ? `<testcase name="${result.name}" time="${result.duration / 1000}" />`
          : `<testcase name="${result.name}" time="${result.duration / 1000}">
             <failure message="Test failed">${result.error || 'Unknown error'}</failure>
           </testcase>`

        return `
        <testsuite name="${result.name}" tests="1" failures="${result.passed ? 0 : 1}" time="${result.duration / 1000}">
          ${testcase}
        </testsuite>
      `
      })
      .join('')

    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Auth0 Tests" tests="${this.results.length}" failures="${this.results.filter(r => !r.passed).length}">
  ${testsuites}
</testsuites>
    `.trim()

    writeFileSync('reports/auth/junit.xml', xml)
  }

  private hasFailures(): boolean {
    return this.results.some(r => !r.passed)
  }
}

// CLI Interface
const args = process.argv.slice(2)
const options = {
  suite: args.find(arg => arg.startsWith('--suite='))?.split('=')[1],
  skipOptional: args.includes('--skip-optional'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  generateReport: args.includes('--report') || args.includes('-r'),
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Auth0 Testing Suite Runner

Usage: npm run test:auth [options]

Options:
  --suite=<name>      Run specific test suite (unit, component, e2e, etc.)
  --skip-optional     Skip optional test suites
  --verbose, -v       Verbose output
  --report, -r        Generate HTML and XML reports
  --help, -h          Show this help message

Examples:
  npm run test:auth                    # Run all tests
  npm run test:auth --suite=unit       # Run only unit tests
  npm run test:auth --skip-optional    # Skip performance and a11y tests
  npm run test:auth --verbose --report # Verbose output with reports
  `)
  process.exit(0)
}

// Run the test suite
const runner = new AuthTestRunner()
runner.run(options).catch(error => {
  console.error(chalk.red.bold('💥 Test runner error:'), error.message)
  process.exit(1)
})
