import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { AppNavShell } from './AppNavShell';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { PageSkeleton } from '@/components/poseidon/page-skeleton';
import { getGovernanceMeta } from '@/lib/governance-meta';
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts';
import { selectPriorityQueue } from '@/domain/poseidon-universe/selectors';
import type { ProtectThreatEntity } from '@/domain/poseidon-universe/types';
import { ROUTE_TO_DECISION, AUDIT_DECISIONS } from '@/lib/govern-audit-data';
import type { GovernTraceBinding } from '@/lib/govern-trace';

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

    const traceBinding = useMemo<GovernTraceBinding | undefined>(() => {
        const decisionId = ROUTE_TO_DECISION[path];
        if (!decisionId) return undefined;
        const decision = AUDIT_DECISIONS[decisionId];
        if (!decision) return undefined;
        return {
            route: path,
            eventId: decision.id,
            auditDecisionId: decision.id,
            summary: decision.explanation.summary,
            nextAction: decision.action,
        };
    }, [path]);
    const { dismissed } = useDismissedAlerts();

    const [latestExecuteEvent, setLatestExecuteEvent] = useState<{
        govId: string;
        actionId: string;
        actionTitle: string;
    } | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as {
                govId: string;
                actionId: string;
                actionTitle: string;
            };
            setLatestExecuteEvent(detail);
        };
        window.addEventListener('poseidon:execute-approved', handler);
        return () => window.removeEventListener('poseidon:execute-approved', handler);
    }, []);

    useEffect(() => {
        if (!latestExecuteEvent) return;
        const timer = setTimeout(() => setLatestExecuteEvent(null), 8000);
        return () => clearTimeout(timer);
    }, [latestExecuteEvent]);

    const activeTopThreat = useMemo(() => {
        const topThreat = selectPriorityQueue()
            .filter((p) => p.kind === 'threat' && !dismissed.has(p.item.id))
            .at(0);
        if (!topThreat) return null;
        const threat = topThreat.item as ProtectThreatEntity;
        return { id: threat.id, counterparty: threat.counterparty, confidence: threat.confidence };
    }, [dismissed]);

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
                    />
                )}

                {/* Layer 1: Page Content */}
                <div className="relative z-10 flex-1 flex flex-col pt-10 px-6 lg:px-10 max-w-[1920px] mx-auto w-full pb-20">
                    <Suspense fallback={<PageSkeleton />}>
                    {children}
                    </Suspense>

                    {/* Layer 2: Final Verification (GovernFooter) */}
                    {meta?.showFooter && (
                        <div className="mt-4 pt-3 lg:sticky lg:bottom-0 lg:z-10">
                            <GovernFooter
                                auditId={meta.auditId}
                                pageContext={meta.pageContext}
                                activeTopThreat={activeTopThreat}
                                latestExecuteEvent={latestExecuteEvent}
                                traceBinding={traceBinding}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppNavShell>
    );
}
