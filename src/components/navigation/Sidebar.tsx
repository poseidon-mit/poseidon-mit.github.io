import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    Shield,
    TrendingUp,
    Zap,
    Scale,
    Settings,
    MessageCircle,
    type LucideIcon,
} from 'lucide-react';
import { Link } from '@/router';
import { type EngineName } from '@/lib/engine-tokens';
import { useDemoState } from '@/lib/demo-state/provider';
import { getPendingExecuteCount } from '@/lib/demo-state/selectors';
import { cn } from '@/lib/utils';
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts';
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical';

export type AccentTone = EngineName | 'system';

interface ToneClasses {
    activeLink: string;
    activeIcon: string;
    indicator: string;
    activeSubNav: string;
}

export const TONE_CLASSES: Record<AccentTone, ToneClasses> = {
    dashboard: {
        activeLink: 'text-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-500/20 engine-text-dashboard engine-bg-dashboard engine-ring-dashboard',
        activeIcon: 'text-cyan-400 engine-text-dashboard',
        indicator: 'bg-cyan-500 engine-indicator-dashboard',
        activeSubNav: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 engine-text-dashboard engine-bg-dashboard engine-border-dashboard',
    },
    protect: {
        activeLink: 'text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 engine-text-protect engine-bg-protect engine-ring-protect',
        activeIcon: 'text-emerald-400 engine-text-protect',
        indicator: 'bg-emerald-500 engine-indicator-protect',
        activeSubNav: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 engine-text-protect engine-bg-protect engine-border-protect',
    },
    grow: {
        activeLink: 'text-violet-400 bg-violet-500/10 ring-1 ring-violet-500/20 engine-text-grow engine-bg-grow engine-ring-grow',
        activeIcon: 'text-violet-400 engine-text-grow',
        indicator: 'bg-violet-500 engine-indicator-grow',
        activeSubNav: 'text-violet-400 bg-violet-500/10 border-violet-500/20 engine-text-grow engine-bg-grow engine-border-grow',
    },
    execute: {
        activeLink: 'text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/20 engine-text-execute engine-bg-execute engine-ring-execute',
        activeIcon: 'text-amber-400 engine-text-execute',
        indicator: 'bg-amber-500 engine-indicator-execute',
        activeSubNav: 'text-amber-400 bg-amber-500/10 border-amber-500/20 engine-text-execute engine-bg-execute engine-border-execute',
    },
    govern: {
        activeLink: 'text-blue-400 bg-blue-500/10 ring-1 ring-blue-500/20 engine-text-govern engine-bg-govern engine-ring-govern',
        activeIcon: 'text-blue-400 engine-text-govern',
        indicator: 'bg-blue-500 engine-indicator-govern',
        activeSubNav: 'text-blue-400 bg-blue-500/10 border-blue-500/20 engine-text-govern engine-bg-govern engine-border-govern',
    },
    system: {
        activeLink: 'text-foreground bg-white/5 ring-1 ring-white/10',
        activeIcon: 'text-foreground',
        indicator: 'bg-muted-foreground',
        activeSubNav: 'text-foreground bg-white/5 border-white/10',
    },
};

export interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
    engine?: EngineName;
    group: 'engine' | 'system';
    tone: AccentTone;
}

export const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, engine: 'dashboard', group: 'engine', tone: 'dashboard' },
    { label: 'Protect', path: '/protect', icon: Shield, engine: 'protect', group: 'engine', tone: 'protect' },
    { label: 'Grow', path: '/grow', icon: TrendingUp, engine: 'grow', group: 'engine', tone: 'grow' },
    { label: 'Execute', path: '/execute', icon: Zap, engine: 'execute', group: 'engine', tone: 'execute' },
    { label: 'Govern', path: '/govern', icon: Scale, engine: 'govern', group: 'engine', tone: 'govern' },
    { label: 'Talk', path: '/chat', icon: MessageCircle, group: 'system', tone: 'system' },
    { label: 'Settings', path: '/settings', icon: Settings, group: 'system', tone: 'system' },
];

export const ENGINE_ITEMS = NAV_ITEMS.filter((i) => i.group === 'engine');
export const SYSTEM_ITEMS = NAV_ITEMS.filter((i) => i.group === 'system');

function buildNavBadges(pendingExecuteCount: number, activeProtectCount: number): Record<string, { type: 'count'; value: number; tone: AccentTone }> {
    return {
        '/protect': { type: 'count', value: activeProtectCount, tone: 'protect' },
        '/execute': { type: 'count', value: pendingExecuteCount, tone: 'execute' },
    };
}

export function Sidebar({ path }: { path: string }) {
    const { state } = useDemoState();
    const { dismissed } = useDismissedAlerts();
    const pendingExecuteCount = useMemo(() => getPendingExecuteCount(state), [state]);
    const activeProtectCount = useMemo(
        () => CANONICAL_UNIVERSE.entities.protectThreats.filter(
            t => (t.severity === 'Critical' || t.severity === 'High') && !dismissed.has(t.id)
        ).length,
        [dismissed]
    );
    const navBadges = useMemo(() => buildNavBadges(pendingExecuteCount, activeProtectCount), [pendingExecuteCount, activeProtectCount]);

    return (
        <aside className="fixed top-0 left-0 z-40 hidden h-screen w-[280px] flex-col bg-[#08080D] border-r border-white/5 lg:flex">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-8 py-8" aria-label="Poseidon home">
                <img
                    src="/logo.png"
                    alt=""
                    width="64"
                    height="64"
                    className="h-16 w-16 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                    aria-hidden="true"
                />
                <span className="text-2xl font-semibold tracking-widest text-foreground">Poseidon</span>
            </Link>

            {/* Nav groups */}
            <nav className="flex flex-1 flex-col gap-1.5 px-4" aria-label="Main navigation">
                {ENGINE_ITEMS.map((item) => {
                    const isActive = path === item.path || path.startsWith(item.path + '/');
                    const Icon = item.icon;
                    const tone = TONE_CLASSES[item.tone];
                    const badge = navBadges[item.path];
                    const isProtectAlert = !isActive && item.path === '/protect' && activeProtectCount > 0;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'group relative flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300',
                                isActive
                                    ? tone.activeLink
                                    : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60 border border-transparent'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn('h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110', isActive && tone.activeIcon)} aria-hidden="true" />
                            <span className="flex-1 text-sm font-medium tracking-wide">
                                {item.label}
                                {isProtectAlert && (
                                    <span className="block text-[9px] font-semibold text-emerald-400 engine-text-protect tracking-widest uppercase leading-none mt-0.5">
                                        Action Required
                                    </span>
                                )}
                            </span>
                            {badge && badge.value > 0 && (
                                <span className={cn('flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white', TONE_CLASSES[badge.tone].indicator)} aria-hidden="true">
                                    {badge.value}
                                </span>
                            )}
                        </Link>
                    );
                })}

                <div className="pt-6" />
                {SYSTEM_ITEMS.map((item) => {
                    const isActive = path === item.path || path.startsWith(item.path + '/');
                    const Icon = item.icon;
                    const tone = TONE_CLASSES[item.tone];
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'group flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300',
                                isActive ? tone.activeLink : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60 border border-transparent'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn('h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110', isActive && tone.activeIcon)} aria-hidden="true" />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-4 border-t border-white/5 px-8 py-6 transition-colors duration-300 hover:bg-white/[0.03] cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-white/60 border border-white/10" aria-hidden="true">
                    {state.user.initials}
                </div>
                <span className="text-sm font-medium tracking-wide text-foreground">{state.user.name}</span>
            </div>
        </aside>
    );
}
