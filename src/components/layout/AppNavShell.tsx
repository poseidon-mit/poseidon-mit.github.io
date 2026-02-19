import React, { useCallback, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
  Search,
  WifiOff,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '../../router';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { usePresentationMode } from '../../hooks/usePresentationMode';
import { usePWA } from '../../hooks/usePWA';
import { CommandPalette } from './CommandPalette';
import { AuroraPulse } from '@/components/poseidon';
import { engineTokens, type EngineName } from '../../lib/engine-tokens';
import { DEMO_THREAD } from '@/lib/demo-thread';

/* ─── Engine config ──────────────────────────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  color: string;
  engine?: EngineName;
  group: 'engine' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: engineTokens.dashboard.color, engine: 'dashboard', group: 'engine' },
  { label: 'Protect', path: '/protect', icon: Shield, color: engineTokens.protect.color, engine: 'protect', group: 'engine' },
  { label: 'Grow', path: '/grow', icon: TrendingUp, color: engineTokens.grow.color, engine: 'grow', group: 'engine' },
  { label: 'Execute', path: '/execute', icon: Zap, color: engineTokens.execute.color, engine: 'execute', group: 'engine' },
  { label: 'Govern', path: '/govern', icon: Scale, color: engineTokens.govern.color, engine: 'govern', group: 'engine' },
  { label: 'Settings', path: '/settings', icon: Settings, color: '#94a3b8', group: 'system' },
  { label: 'Help', path: '/help', icon: HelpCircle, color: '#94a3b8', group: 'system' },
];

/* ─── Live status badges (mock) ─────────────────────────────── */
const NAV_BADGES: Record<string, { type: 'pulse' | 'count'; value?: number; color: string }> = {
  '/protect': { type: 'pulse', color: 'var(--state-critical)' },
  '/execute': { type: 'count', value: DEMO_THREAD.pendingActions, color: engineTokens.execute.color },
};

const ENGINE_ITEMS = NAV_ITEMS.filter((i) => i.group === 'engine');
const SYSTEM_ITEMS = NAV_ITEMS.filter((i) => i.group === 'system');

/* ─── Sub-navigation definitions ─────────────────────────── */

interface SubNavItem {
  label: string;
  path: string;
}

const SUB_NAV: Record<string, SubNavItem[]> = {
  '/dashboard': [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Alerts Hub', path: '/dashboard/alerts' },
    { label: 'Insights', path: '/dashboard/insights' },
    { label: 'Timeline', path: '/dashboard/timeline' },
    { label: 'Notifications', path: '/dashboard/notifications' },
  ],
  '/protect': [
    { label: 'Alerts', path: '/protect' },
    { label: 'Dispute', path: '/protect/dispute' },
  ],
  '/grow': [
    { label: 'Goals', path: '/grow' },
    { label: 'Scenarios', path: '/grow/scenarios' },
    { label: 'Recommendations', path: '/grow/recommendations' },
  ],
  '/execute': [
    { label: 'Queue', path: '/execute' },
    { label: 'Approval', path: '/execute/approval' },
    { label: 'History', path: '/execute/history' },
  ],
  '/govern': [
    { label: 'Overview', path: '/govern' },
    { label: 'Audit Ledger', path: '/govern/audit' },
    { label: 'Trust', path: '/govern/trust' },
    { label: 'Registry', path: '/govern/registry' },
    { label: 'Oversight', path: '/govern/oversight' },
    { label: 'Policy', path: '/govern/policy' },
  ],
  '/settings': [
    { label: 'General', path: '/settings' },
    { label: 'AI', path: '/settings/ai' },
    { label: 'Integrations', path: '/settings/integrations' },
    { label: 'Rights', path: '/settings/rights' },
  ],
};

/* ─── Breadcrumb definitions ─────────────────────────────── */

const BREADCRUMB_MAP: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/alerts': ['Dashboard', 'Alerts'],
  '/dashboard/insights': ['Dashboard', 'Insights'],
  '/dashboard/timeline': ['Dashboard', 'Timeline'],
  '/dashboard/notifications': ['Dashboard', 'Notifications'],
  '/protect': ['Protect'],
  '/protect/alert-detail': ['Protect', 'Alert Detail'],
  '/protect/dispute': ['Protect', 'Dispute'],
  '/grow': ['Grow'],
  '/grow/goal': ['Grow', 'Goal Detail'],
  '/grow/scenarios': ['Grow', 'Scenarios'],
  '/grow/recommendations': ['Grow', 'Recommendations'],
  '/execute': ['Execute'],
  '/execute/approval': ['Execute', 'Approval Queue'],
  '/execute/history': ['Execute', 'History'],
  '/govern': ['Govern'],
  '/govern/audit': ['Govern', 'Audit Ledger'],
  '/govern/audit-detail': ['Govern', 'Audit Detail'],
  '/govern/trust': ['Govern', 'Trust'],
  '/govern/registry': ['Govern', 'Registry'],
  '/govern/oversight': ['Govern', 'Oversight'],
  '/govern/policy': ['Govern', 'Policy'],
  '/settings': ['Settings'],
  '/settings/ai': ['Settings', 'AI'],
  '/settings/integrations': ['Settings', 'Integrations'],
  '/settings/rights': ['Settings', 'Rights'],
  '/help': ['Help'],
};

/* ─── Helpers ────────────────────────────────────────────── */

function getActiveSection(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => path === item.path || path.startsWith(item.path + '/'));
}

function getEngineColor(path: string): string | undefined {
  const section = getActiveSection(path);
  if (!section) return undefined;
  if (section.group === 'system') return undefined;
  return section.color;
}

function getActiveEngine(path: string): EngineName | undefined {
  const section = getActiveSection(path);
  if (!section || section.group === 'system') return undefined;
  return section.engine;
}

function getSubNav(path: string): SubNavItem[] | null {
  const sectionKey = Object.keys(SUB_NAV).find(
    (key) => path === key || path.startsWith(key + '/')
  );
  if (!sectionKey) return null;
  return SUB_NAV[sectionKey];
}

/* ─── Component ──────────────────────────────────────────── */

export function AppNavShell({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const activeSection = useMemo(() => getActiveSection(path), [path]);
  const engineColor = useMemo(() => getEngineColor(path), [path]);
  const activeEngine = useMemo(() => getActiveEngine(path), [path]);
  const breadcrumbs = useMemo(() => BREADCRUMB_MAP[path] ?? ['Unknown'], [path]);
  const subNav = useMemo(() => getSubNav(path), [path]);
  const { isOpen: isPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();
  const { isPresentation } = usePresentationMode();
  const { isOffline } = usePWA();

  useEffect(() => {
    closePalette();
  }, [path, closePalette]);

  const handleBottomNavTap = useCallback(
    (itemPath: string) => {
      if (path.startsWith(itemPath)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [path]
  );

  return (
    <div className="app-bg-depth flex min-h-screen">
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} />
      {/* ── Desktop Sidebar ── */}
      <aside
        className="glass-sidebar fixed top-0 left-0 z-40 hidden h-screen w-[240px] flex-col lg:flex"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 py-5" aria-label="Poseidon home">
          <img src="/logo.png" alt="" width="64" height="64" className="w-16 h-16 object-contain" style={{ filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.3))' }} aria-hidden="true" />
          <span className="text-xl font-light tracking-widest" style={{ color: '#f8fafc' }}>
            Poseidon
          </span>
        </Link>

        {/* Engines section */}
        <nav className="flex-1 flex flex-col px-3 gap-1" aria-label="Main navigation">
          <span
            className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#64748b' }}
          >
            Engines
          </span>
          {ENGINE_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-xl border-l-[3px] px-4 py-3 transition-colors duration-150 hover:bg-white/5 hover:text-slate-50"
                style={{
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? `${item.color}1a` : 'transparent',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: isActive ? item.color : undefined }} aria-hidden="true" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {NAV_BADGES[item.path]?.type === 'pulse' && (
                  <span
                    className="nav-badge-pulse w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: NAV_BADGES[item.path].color }}
                    aria-label="Active alerts"
                  />
                )}
                {NAV_BADGES[item.path]?.type === 'count' && (
                  <span
                    className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{
                      background: NAV_BADGES[item.path].color,
                      color: '#0a0e1a',
                    }}
                    aria-label={`${NAV_BADGES[item.path].value} pending`}
                  >
                    {NAV_BADGES[item.path].value}
                  </span>
                )}
              </Link>
            );
          })}

          {/* System section */}
          <span
            className="px-3 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#64748b' }}
          >
            System
          </span>
          {SYSTEM_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-xl border-l-[3px] px-4 py-3 transition-colors duration-150 hover:bg-white/5 hover:text-slate-50"
                style={{
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid #94a3b8' : '3px solid transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom: user */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
            }}
            aria-hidden="true"
          >
            SF
          </div>
          <span className="text-sm" style={{ color: '#94a3b8' }}>
            Shinji Fujiwara
          </span>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-[240px]">
        <AuroraPulse engine={activeEngine} intensity="subtle" />
        {/* ── Desktop top header ── */}
        <header
          className="glass-header sticky top-0 z-30 hidden h-14 items-center justify-between px-6 lg:flex"
        >
          {/* Breadcrumb — only show when 2+ segments; otherwise show page title */}
          {breadcrumbs.length > 1 ? (
            <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
              {breadcrumbs.map((segment, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <ChevronRight
                        className="w-3 h-3"
                        style={{ color: '#475569' }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`text-sm ${isLast ? 'font-medium' : ''}`}
                      style={{ color: isLast ? '#f8fafc' : '#94a3b8' }}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {isLast && engineColor && (
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                          style={{ background: engineColor }}
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
            <span className="text-sm font-medium" style={{ color: '#f8fafc' }}>
              {engineColor && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                  style={{ background: engineColor }}
                  aria-hidden="true"
                />
              )}
              {breadcrumbs[0]}
            </span>
          )}

          {/* Right side: status + search + bell + avatar */}
          <div className="flex items-center gap-3">
            {/* Offline indicator */}
            {isOffline && (
              <span
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                aria-label="Offline"
              >
                <WifiOff className="w-3 h-3" aria-hidden="true" />
                Offline
              </span>
            )}
            {/* Presentation mode badge */}
            {isPresentation && (
              <span
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: 'rgba(0,240,255,0.1)', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.25)' }}
                aria-label="Presentation mode active"
              >
                <Radio className="w-3 h-3" aria-hidden="true" />
                Presenting
              </span>
            )}
            {/* Cmd+K search trigger */}
            <button
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-500 transition-colors duration-150 hover:bg-white/[0.08] hover:text-slate-400"
              style={{
                color: '#64748b',
              }}
              onClick={openPalette}
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Search</span>
              <kbd
                className="ml-1 px-1 py-0.5 rounded text-[10px]"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#475569' }}
              >
                ⌘K
              </kbd>
            </button>
            <button
              className="relative rounded-lg p-2 text-slate-400 transition-colors duration-150 hover:bg-white/5"
              style={{ color: '#94a3b8' }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {/* Red dot badge */}
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#EF4444' }}
                aria-label="New notifications"
              />
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-150"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              aria-label="User menu"
            >
              SF
            </button>
          </div>
        </header>

        {/* ── Mobile top header ── */}
        <header
          className="glass-header sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:hidden"
        >
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-1.5" aria-label="Poseidon home">
            <img src="/logo.png" alt="" width="40" height="40" className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.3))' }} aria-hidden="true" />
            <span className="text-sm font-light tracking-widest" style={{ color: '#f8fafc' }}>
              Poseidon
            </span>
          </Link>

          {/* Center: current section + status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#f8fafc' }}>
              {activeSection?.label ?? ''}
            </span>
            {isPresentation && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(0,240,255,0.15)', color: '#00F0FF' }}
              >
                Live
              </span>
            )}
            {isOffline && (
              <WifiOff className="w-3.5 h-3.5" style={{ color: '#EF4444' }} aria-label="Offline" />
            )}
          </div>

          {/* Right: bell */}
          <button
            className="relative p-2 rounded-lg"
            style={{ color: '#94a3b8' }}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#EF4444' }}
              aria-label="New notifications"
            />
          </button>
        </header>

        {/* ── Sub-navigation strip ── */}
        {subNav && (
          <div
            className="glass-header flex items-center gap-2 overflow-x-auto border-b border-white/5 px-4 py-2.5 lg:px-6"
            style={{
              background: 'rgba(11, 18, 33, 0.6)',
            }}
            role="navigation"
            aria-label="Sub-navigation"
          >
            {subNav.map((item) => {
              const isActive = path === item.path;
              const color = engineColor ?? '#94a3b8';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-white/5 hover:text-slate-50"
                  style={{
                    color: isActive ? color : '#94a3b8',
                    background: isActive ? `${color}1a` : 'transparent',
                    border: isActive ? `1px solid ${color}40` : '1px solid transparent',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1">{children}</main>

        {/* Spacer for mobile bottom nav */}
        <div className="lg:hidden" style={{ height: 64 }} aria-hidden="true" />
      </div>

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="glass-header fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/5 lg:hidden"
        style={{
          height: 64,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Mobile navigation"
      >
        {ENGINE_ITEMS.map((item) => {
          const isActive = path === item.path || path.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors duration-150"
              style={{ color: isActive ? item.color : '#64748b', minHeight: 48 }}
              onClick={() => handleBottomNavTap(item.path)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              {/* Active dot */}
              <span
                className="w-1 h-1 rounded-full transition-opacity duration-150"
                style={{
                  background: item.color,
                  opacity: isActive ? 1 : 0,
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <Icon className="w-5 h-5" aria-hidden="true" />
                {NAV_BADGES[item.path]?.type === 'pulse' && (
                  <span
                    className="nav-badge-pulse absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ background: NAV_BADGES[item.path].color }}
                    aria-label="Active alerts"
                  />
                )}
                {NAV_BADGES[item.path]?.type === 'count' && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: NAV_BADGES[item.path].color, color: '#0a0e1a' }}
                    aria-label={`${NAV_BADGES[item.path].value} pending`}
                  >
                    {NAV_BADGES[item.path].value}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
