import { describe, test, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('Stale B2B components and structures have been physically eradicated', () => {
    const rootDir = resolve(__dirname, '..')

    test('GuidedSetupDrawer.tsx is deleted', () => {
        expect(existsSync(resolve(rootDir, 'components/dashboard/GuidedSetupDrawer.tsx'))).toBe(false)
    })

    test('OnboardingArrivalSheet.tsx is deleted', () => {
        expect(existsSync(resolve(rootDir, 'components/dashboard/OnboardingArrivalSheet.tsx'))).toBe(false)
    })

    test('GovernImmutableLedger.tsx is deleted', () => {
        expect(existsSync(resolve(rootDir, 'components/govern/GovernImmutableLedger.tsx'))).toBe(false)
    })

    test('/protect/dispute removed from TARGET_SCOPE_READY_ROUTES', () => {
        const source = readFileSync(resolve(rootDir, 'contracts/rebuild-contracts.ts'), 'utf-8')
        // Must not appear in the TARGET_SCOPE array
        expect(source).not.toMatch(/['"]\/protect\/dispute['"]/)
    })

    test('Dashboard no longer imports deleted components', () => {
        const source = readFileSync(resolve(rootDir, 'pages/Dashboard.tsx'), 'utf-8')
        expect(source).not.toContain('GuidedSetupDrawer')
        expect(source).not.toContain('OnboardingArrivalSheet')
    })

    test('TalkToMoneyFab has no "Coming Soon" disabled state', () => {
        const source = readFileSync(resolve(rootDir, 'components/ui/TalkToMoneyFab.tsx'), 'utf-8')
        expect(source.toLowerCase()).not.toContain('coming soon')
        expect(source).not.toContain('cursor-not-allowed')
        // Must not have a permanently disabled button
        expect(source).not.toMatch(/disabled\s*\n/)
        expect(source).not.toMatch(/<button[^>]*disabled[^>]*>/)
    })

    test('OnboardingConsent does not contain B2B Auto-Approve copy', () => {
        const source = readFileSync(resolve(rootDir, 'pages/OnboardingConsent.tsx'), 'utf-8')
        expect(source).not.toContain('Auto-Approve')
        expect(source).not.toMatch(/under \$50/)
    })

    test('SettingsAI does not use "Engine" section headers', () => {
        const source = readFileSync(resolve(rootDir, 'pages/SettingsAI.tsx'), 'utf-8')
        expect(source).not.toContain('Protect Engine')
        expect(source).not.toContain('Grow Engine')
    })
})
