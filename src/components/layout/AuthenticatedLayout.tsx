import React, { useMemo } from 'react';
import { AppNavShell } from './AppNavShell';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { getGovernanceMeta } from '@/lib/governance-meta';
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts';
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    path: string;
}

/**
 * AuthenticatedLayout
 * 
 * World-class wrapper for all Poseidon engine pages.
 * Ensures strict global consistency for:
 * 1. AuroraPulse (Liquid background depth)
 * 2. AppNavShell (Navigation & Command Palette)
 * 3. GovernFooter (Audit & Verification Ledger)
 */
export function AuthenticatedLayout({ children, path }: AuthenticatedLayoutProps) {
    const meta = getGovernanceMeta(path);
    const { dismissed } = useDismissedAlerts();

    const activeTopThreat = useMemo(
        () => CANONICAL_UNIVERSE.entities.protectThreats
            .filter(t => !dismissed.has(t.id) && (t.severity === 'Critical' || t.severity === 'High'))
            .sort((a, b) => b.sortOrder - a.sortOrder)[0] ?? null,
        [dismissed]
    );

    return (
        <AppNavShell path={path}>
            {/* Skip-to-content — single instance for all app routes */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
                style={{ background: meta?.auroraColor ?? 'var(--engine-dashboard)', color: 'var(--bg-oled)' }}
            >
                Skip to main content
            </a>
            <div className="relative min-h-full flex flex-col">
                {/* Layer 0: Ambient Liquid Glow */}
                {meta && (
                    <AuroraPulse
                        color={meta.auroraColor}
                        className="opacity-40"
                    />
                )}

                {/* Layer 1: Page Content */}
                <div className="relative z-10 flex-1 flex flex-col pt-10 px-6 lg:px-10 max-w-[1920px] mx-auto w-full pb-20">
                    {children}

                    {/* Layer 2: Final Verification (GovernFooter) */}
                    {meta?.showFooter && (
                        <div className="mt-4 pt-3 lg:sticky lg:bottom-0 lg:z-10 lg:backdrop-blur-sm lg:bg-black/10">
                            <GovernFooter
                                auditId={meta.auditId}
                                pageContext={meta.pageContext}
                                activeTopThreat={activeTopThreat
                                    ? { id: activeTopThreat.id, merchant: activeTopThreat.merchant, confidence: activeTopThreat.confidence }
                                    : null
                                }
                                className="opacity-70 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppNavShell>
    );
}
