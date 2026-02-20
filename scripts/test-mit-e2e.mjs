#!/usr/bin/env node
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173'
const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 4173
const START_SERVER = !process.env.E2E_BASE_URL
let runtimeBaseUrl = BASE_URL

function logStep(message) {
  process.stdout.write(`\n[e2e] ${message}\n`)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function appUrl(path) {
  const normalizedBase = runtimeBaseUrl.endsWith('/')
    ? runtimeBaseUrl.slice(0, -1)
    : runtimeBaseUrl
  return `${normalizedBase}${path}`
}

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // ignore and retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Dev server did not become ready at ${url} within ${timeoutMs}ms`)
}

function startDevServer() {
  let resolveReady
  let rejectReady
  let readyResolved = false
  const ready = new Promise((resolve, reject) => {
    resolveReady = resolve
    rejectReady = reject
  })

  const child = spawn(
    'npm',
    ['run', 'dev', '--', '--host', SERVER_HOST, '--port', String(SERVER_PORT)],
    { stdio: 'pipe', shell: process.platform === 'win32' },
  )

  child.stdout.on('data', (chunk) => {
    const text = String(chunk)
    process.stdout.write(`[vite] ${text}`)
    const plain = text.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '')
    const match = plain.match(/Local:\s*(http:\/\/[^\s]+)/)
    if (match && !readyResolved) {
      readyResolved = true
      resolveReady(match[1])
    }
  })
  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[vite] ${chunk}`)
  })

  child.on('exit', (code) => {
    if (!readyResolved) {
      rejectReady(new Error(`Vite dev server exited before ready (code ${code ?? 'unknown'})`))
    }
  })

  return { child, ready }
}

async function ensureDemoSession(page) {
  await page.goto(appUrl('/login'), { waitUntil: 'networkidle' })
  await clickDemoContinue(page, 'login')
  await page.waitForURL('**/dashboard', { timeout: 15_000 })
}

async function clickDemoContinue(page, scope) {
  const candidates = [
    page.getByRole('button', { name: /Continue in Demo Mode/i }),
    page.getByRole('button', { name: /Continue to onboarding/i }),
    page.getByRole('link', { name: /Continue in Demo Mode/i }),
    page.getByRole('link', { name: /Continue to onboarding/i }),
  ]

  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await candidate.first().click()
      return
    }
  }

  await page.screenshot({ path: `output/e2e-${scope}-missing-demo-cta.png`, fullPage: true })
  const headingText = await page.locator('h1').first().textContent().catch(() => null)
  throw new Error(`Demo CTA not found on ${scope}. First h1: ${headingText ?? 'n/a'}`)
}

async function runGoldenFlow(context) {
  logStep('golden flow: signup -> onboarding -> dashboard')
  const page = await context.newPage()
  await page.goto(appUrl('/signup'), { waitUntil: 'networkidle' })
  await clickDemoContinue(page, 'signup')
  await page.waitForURL('**/onboarding/connect', { timeout: 15_000 })

  await page.getByRole('link', { name: /Continue to goals/i }).click()
  await page.waitForURL('**/onboarding/goals', { timeout: 15_000 })

  await page.getByRole('link', { name: /Continue to consent/i }).click()
  await page.waitForURL('**/onboarding/consent', { timeout: 15_000 })

  await page.getByRole('link', { name: /Activate Poseidon/i }).click()
  await page.waitForURL('**/onboarding/complete', { timeout: 15_000 })

  await page.getByRole('link', { name: /Enter dashboard/i }).click()
  await page.waitForURL('**/dashboard', { timeout: 15_000 })
  await page.getByRole('heading', { name: /Welcome back/i }).waitFor({ timeout: 10_000 })
  await page.close()
}

async function runProtectExecuteGovernFlow(context) {
  logStep('flow: protect -> execute -> govern')
  const page = await context.newPage()
  await ensureDemoSession(page)

  await page.goto(appUrl('/protect/alert-detail'), { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /Signal/i }).waitFor({ timeout: 10_000 })

  await page.goto(appUrl('/execute'), { waitUntil: 'networkidle' })
  const approveButton = page.getByRole('button', { name: /^Approve$/ }).first()
  await approveButton.waitFor({ state: 'visible', timeout: 10_000 })
  await approveButton.click()
  await page.getByText(/Confirm decision/i).waitFor({ timeout: 10_000 })
  await page.getByRole('dialog').getByRole('button', { name: /^Approve$/ }).click()
  await page.getByText(/approved and logged/i).waitFor({ timeout: 10_000 })

  await page.goto(appUrl('/govern/audit'), { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /Audit Ledger/i }).waitFor({ timeout: 10_000 })
  await page.close()
}

async function runHelpTicketFlow(context) {
  logStep('flow: help faq empty + submit ticket')
  const page = await context.newPage()
  await ensureDemoSession(page)
  await page.goto(appUrl('/help'), { waitUntil: 'networkidle' })

  await page.getByPlaceholder('Search help articles...').fill('zzzz-no-match-keyword')
  await page.getByText(/No matching help articles/i).waitFor({ timeout: 10_000 })

  await page.getByLabel('Subject').fill('Need audit export support')
  await page.getByLabel('Description').fill('Please verify audit export path in demo mode.')
  await page.getByRole('button', { name: /Submit ticket/i }).click()
  await page.getByText(/Last submitted ticket:/i).waitFor({ timeout: 10_000 })

  const ticketText = await page.getByText(/Last submitted ticket:/i).textContent()
  assert(ticketText?.includes('TKT-'), 'Ticket ID was not generated.')
  await page.close()
}

async function runDeepLinkFlow(context) {
  logStep('flow: github pages deep-link query route restore')
  const page = await context.newPage()
  await ensureDemoSession(page)

  await page.goto(appUrl('/?/govern/audit-detail&decision=GV-2026-0319-847'), {
    waitUntil: 'networkidle',
  })
  await page.getByRole('heading', { name: /Decision Reconstruction/i }).first().waitFor({ timeout: 10_000 })
  await page.getByText(/GV-2026-0319-847/i).first().waitFor({ timeout: 10_000 })
  await page.close()
}

async function runMobileNavFlow(browser) {
  logStep('flow: mobile bottom nav more -> settings/help')
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  const page = await context.newPage()
  await ensureDemoSession(page)

  await page.getByRole('button', { name: /More/i }).click()
  await page.getByRole('link', { name: /^Settings$/i }).click()
  await page.waitForURL('**/settings', { timeout: 10_000 })

  await page.getByRole('button', { name: /More/i }).click()
  await page.getByRole('link', { name: /^Help$/i }).click()
  await page.waitForURL('**/help', { timeout: 10_000 })

  await context.close()
}

async function run() {
  let serverProcess = null
  let browser = null
  try {
    if (START_SERVER) {
      logStep('starting Vite dev server')
      const server = startDevServer()
      serverProcess = server.child
      runtimeBaseUrl = await server.ready
      logStep(`using base URL ${runtimeBaseUrl}`)
      await waitForServer(runtimeBaseUrl)
    }

    logStep('launching Chromium')
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()

    await runGoldenFlow(context)
    await runProtectExecuteGovernFlow(context)
    await runHelpTicketFlow(context)
    await runDeepLinkFlow(context)
    await context.close()
    await runMobileNavFlow(browser)

    logStep('all E2E flows passed')
  } finally {
    await browser?.close()
    if (serverProcess) {
      serverProcess.kill('SIGTERM')
    }
  }
}

run().catch((error) => {
  console.error(`\n[e2e] FAILED: ${error.message}`)
  process.exitCode = 1
})
