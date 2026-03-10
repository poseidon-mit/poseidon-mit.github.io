import React, { Component, Suspense, useEffect, useMemo, useState } from 'react';
import { AppNavShell } from './AppNavShell';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { PageSkeleton } from '@/components/poseidon/page-skeleton';
import { getGovernanceMeta } from '@/lib/governance-meta';
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts';
import { selectPriorityQueue } from '@/domain/poseidon-universe/selectors';
import type { ProtectThreatEntity } from '@/domain/poseidon-universe/types';
import { ROUTE_TO_DECISION, AUDIT_DECISIONS } from '@/lib/govern-audit-data';
import type { GovernTraceBinding } from '@/lib/govern-trace';

/* ── Error Boundary ── */
class PageErrorBoundary extends Component<
    { children: React.ReactNode; path: string },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode; path: string }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    componentDidUpdate(prevProps: { path: string }) {
        if (prevProps.path !== this.props.path && this.state.hasError) {
            this.setState({ hasError: false, error: null });
        }
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        {this.state.error?.message ?? 'An unexpected error occurred while rendering this page.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

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
                    <PageErrorBoundary path={path}>
                        <Suspense fallback={<PageSkeleton />}>
                            {children}
                        </Suspense>
                    </PageErrorBoundary>

                    {/* Layer 2: Final Verification (GovernFooter) */}
                    {meta?.showFooter && (() => {
                        const isDetailRoute = /\/(detail|approval|audit-detail|recommendation|alert-detail)/.test(path) || path.includes('/alert/');
                        return (
                            <div className={`mt-4 pt-3${isDetailRoute ? '' : ' lg:sticky lg:bottom-0 lg:z-10'}`}>
                                <GovernFooter
                                    auditId={meta.auditId}
                                    pageContext={meta.pageContext}
                                    activeTopThreat={activeTopThreat}
                                    latestExecuteEvent={latestExecuteEvent}
                                    traceBinding={traceBinding}
                                    compact={isDetailRoute}
                                />
                            </div>
                        );
                    })()}
                </div>
            </div>
        </AppNavShell>
    );
}
