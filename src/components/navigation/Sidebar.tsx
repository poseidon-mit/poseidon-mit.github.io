import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    Shield,
    TrendingUp,
    Zap,
    Scale,
    Settings,
    type LucideIcon,
} from 'lucide-react';
import { Link } from '@/router';
import { type EngineName } from '@/lib/engine-tokens';
import { useDemoState } from '@/lib/demo-state/provider';
import { getPendingExecuteCount } from '@/lib/demo-state/selectors';
import { cn } from '@/lib/utils';

export type AccentTone = EngineName | 'system';

interface ToneClasses {
    activeLink: string;
    activeIcon: string;
    indicator: string;
    activeSubNav: string;
}

export const TONE_CLASSES: Record<AccentTone, ToneClasses> = {
    dashboard: {
        activeLink: 'text-cyan-50 bg-cyan-500/10 ring-1 ring-cyan-500/30 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]',
        activeIcon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]',
        indicator: 'bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]',
        activeSubNav: 'text-cyan-100 bg-cyan-500/20 border-cyan-400/30 glow',
    },
    protect: {
        activeLink: 'text-emerald-50 bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]',
        activeIcon: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        indicator: 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]',
        activeSubNav: 'text-emerald-100 bg-emerald-500/20 border-emerald-400/30 glow',
    },
    grow: {
        activeLink: 'text-violet-50 bg-violet-500/10 ring-1 ring-violet-500/30 shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]',
        activeIcon: 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]',
        indicator: 'bg-violet-400 shadow-[0_0_5px_rgba(139,92,246,0.5)]',
        activeSubNav: 'text-violet-100 bg-violet-500/20 border-violet-400/30 glow',
    },
    execute: {
        activeLink: 'text-amber-50 bg-amber-500/10 ring-1 ring-amber-500/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)]',
        activeIcon: 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
        indicator: 'bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]',
        activeSubNav: 'text-amber-100 bg-amber-500/20 border-amber-400/30 glow',
    },
    govern: {
        activeLink: 'text-blue-50 bg-blue-500/10 ring-1 ring-blue-500/30 shadow-[inset_0_0_12px_rgba(59,130,246,0.15)]',
        activeIcon: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
        indicator: 'bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)]',
        activeSubNav: 'text-blue-100 bg-blue-500/20 border-blue-400/30 glow',
    },
    system: {
        activeLink: 'text-slate-50 bg-white/10 ring-1 ring-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]',
        activeIcon: 'text-slate-200',
        indicator: 'bg-slate-300 shadow-[0_0_5px_rgba(255,255,255,0.5)]',
        activeSubNav: 'text-slate-200 bg-white/10 border-white/20 glow',
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
    { label: 'Settings', path: '/settings', icon: Settings, group: 'system', tone: 'system' },
];

export const ENGINE_ITEMS = NAV_ITEMS.filter((i) => i.group === 'engine');
export const SYSTEM_ITEMS = NAV_ITEMS.filter((i) => i.group === 'system');

function buildNavBadges(pendingExecuteCount: number): Record<string, { type: 'pulse' | 'count'; value?: number; tone: AccentTone }> {
    return {
        '/protect': { type: 'pulse', tone: 'protect' },
        '/execute': { type: 'count', value: pendingExecuteCount, tone: 'execute' },
    };
}

export function Sidebar({ path }: { path: string }) {
    const { state } = useDemoState();
    const pendingExecuteCount = useMemo(() => getPendingExecuteCount(state), [state]);
    const navBadges = useMemo(() => buildNavBadges(pendingExecuteCount), [pendingExecuteCount]);

    return (
        <aside className="fixed top-0 left-0 z-40 hidden h-screen w-[280px] flex-col bg-black/40 backdrop-blur-3xl border-r border-white/[0.04] lg:flex">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-8 py-8" aria-label="Poseidon home">
                <img
                    src="/logo.png"
                    alt=""
                    width="64"
                    height="64"
                    className="h-16 w-16 object-contain drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]"
                    aria-hidden="true"
                />
                <span className="text-2xl font-light tracking-widest text-slate-50">Poseidon</span>
            </Link>

            {/* Nav groups */}
            <nav className="flex flex-1 flex-col gap-1.5 px-4" aria-label="Main navigation">
                <span className="px-4 pt-4 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Engines
                </span>
                {ENGINE_ITEMS.map((item) => {
                    const isActive = path === item.path || path.startsWith(item.path + '/');
                    const Icon = item.icon;
                    const tone = TONE_CLASSES[item.tone];
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'group relative flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300',
                                isActive ? tone.activeLink : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/5'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn('h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110', isActive && tone.activeIcon)} aria-hidden="true" />
                            <span className="flex-1 text-sm font-medium tracking-wide">{item.label}</span>
                            {navBadges[item.path]?.type === 'pulse' && (
                                <span className={cn('nav-badge-pulse h-2 w-2 flex-shrink-0 rounded-full', TONE_CLASSES[navBadges[item.path]!.tone].indicator)} aria-hidden="true" />
                            )}
                            {navBadges[item.path]?.type === 'count' && (
                                <span className={cn('flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-slate-950', TONE_CLASSES[navBadges[item.path]!.tone].indicator)} aria-hidden="true">
                                    {navBadges[item.path]!.value}
                                </span>
                            )}
                        </Link>
                    );
                })}

                <span className="px-4 pt-8 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    System
                </span>
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
                                isActive ? tone.activeLink : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/5'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={cn('h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110', isActive && tone.activeIcon)} aria-hidden="true" />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-4 border-t border-white/[0.06] px-8 py-6 transition-colors duration-300 hover:bg-white/[0.02] cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-300 shadow-inner border border-white/5" aria-hidden="true">
                    {state.user.initials}
                </div>
                <span className="text-sm font-medium tracking-wide text-slate-300">{state.user.name}</span>
            </div>
        </aside>
    );
}
