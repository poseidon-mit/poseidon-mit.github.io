import React from 'react';
import { ChevronRight, Bell, WifiOff, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type AccentTone, TONE_CLASSES } from './Sidebar';
import { type EngineName } from '@/lib/engine-tokens';
import { useDemoState } from '@/lib/demo-state/provider';
import { useRouter } from '@/router';

interface TopBarProps {
    breadcrumbs: string[];
    activeToneClasses?: { indicator: string };
    activeEngine?: EngineName;
    isOffline: boolean;
    isPresentation: boolean;
    onOpenPalette: () => void;
}

export function TopBar({
    breadcrumbs,
    activeToneClasses,
    activeEngine,
    isOffline,
    isPresentation,
    onOpenPalette,
}: TopBarProps) {
    const { state } = useDemoState();
    const { navigate } = useRouter();

    return (
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between px-8 lg:px-10 bg-[#08080D]/80 border-b border-white/5 backdrop-blur-xl lg:flex">
            {/* Breadcrumb / Title */}
            {breadcrumbs.length > 1 ? (
                <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
                    {breadcrumbs.map((segment, idx) => {
                        const isLast = idx === breadcrumbs.length - 1;
                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
                                <span
                                    className={cn(
                                        'text-sm transition-colors duration-300',
                                        isLast ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                                    )}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {isLast && activeToneClasses && (
                                        <span
                                            className={cn('mr-1.5 inline-block h-2 w-2 align-middle rounded-full', activeToneClasses.indicator)}
                                            aria-hidden="true"
                                        />
                                    )}
                                    {segment}
                                </span>
                            </React.Fragment>
                        );
                    })}
                </nav>
            ) : (
                <span className="text-sm font-medium text-foreground">
                    {activeToneClasses && (
                        <span
                            className={cn('mr-1.5 inline-block h-2 w-2 align-middle rounded-full', activeToneClasses.indicator)}
                            aria-hidden="true"
                        />
                    )}
                    {breadcrumbs[0]}
                </span>
            )}

            {/* Utilities */}
            <div className="flex items-center gap-3">
                {isOffline && (
                    <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-400" aria-label="Offline">
                        <WifiOff className="h-3 w-3" aria-hidden="true" />
                        Offline
                    </span>
                )}
                {isPresentation && (
                    <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400" aria-label="Presentation mode active">
                        <Radio className="h-3 w-3" aria-hidden="true" />
                        Presenting
                    </span>
                )}

                <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-colors duration-300 hover:bg-white/5 hover:text-white/60"
                    aria-label="Notifications (new)"
                >
                    <Bell className="h-4.5 w-4.5" aria-hidden="true" />
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-400 ring-2 ring-[#08080D]" aria-hidden="true" />
                </button>

                <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/60 transition-colors duration-300 hover:bg-white/10"
                    aria-label="User menu"
                >
                    {state.user.initials}
                </button>
            </div>
        </header>
    );
}
