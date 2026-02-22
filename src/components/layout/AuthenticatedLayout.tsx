import React from 'react';
import { AppNavShell } from './AppNavShell';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { getGovernanceMeta } from '@/lib/governance-meta';

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

    return (
        <AppNavShell path={path}>
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
                    {meta && (
                        <div className="mt-auto pt-12">
                            <GovernFooter
                                auditId={meta.auditId}
                                pageContext={meta.pageContext}
                                className="opacity-70 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppNavShell>
    );
}
