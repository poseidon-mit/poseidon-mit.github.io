import React, { useCallback, useMemo } from 'react';
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
} from 'lucide-react';
import { Link } from '../../router';

/* ─── Engine config ──────────────────────────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  color: string;
  group: 'engine' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '#00F0FF', group: 'engine' },
  { label: 'Protect', path: '/protect', icon: Shield, color: '#22C55E', group: 'engine' },
  { label: 'Grow', path: '/grow', icon: TrendingUp, color: '#8B5CF6', group: 'engine' },
  { label: 'Execute', path: '/execute', icon: Zap, color: '#EAB308', group: 'engine' },
  { label: 'Govern', path: '/govern', icon: Scale, color: '#3B82F6', group: 'engine' },
  { label: 'Settings', path: '/settings', icon: Settings, color: '#94a3b8', group: 'system' },
  { label: 'Help', path: '/help', icon: HelpCircle, color: '#94a3b8', group: 'system' },
];

/* ─── Live status badges (mock) ─────────────────────────────── */
const NAV_BADGES: Record<string, { type: 'pulse' | 'count'; value?: number; color: string }> = {
  '/protect': { type: 'pulse', color: '#EF4444' },
  '/execute': { type: 'count', value: 3, color: '#EAB308' },
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
    { label: 'Alert Detail', path: '/protect/alert-detail' },
    { label: 'Dispute', path: '/protect/dispute' },
  ],
  '/grow': [
    { label: 'Goals', path: '/grow' },
    { label: 'Goal Detail', path: '/grow/goal' },
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
    { label: 'Audit Detail', path: '/govern/audit-detail' },
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

function getSubNav(path: string): SubNavItem[] | null {
  const sectionKey = Object.keys(SUB_NAV).find(
    (key) => path === key || path.startsWith(key + '/')
  );
  if (!sectionKey) return null;
  const items = SUB_NAV[sectionKey];
  // Only show sub-nav if we're on a sub-page (not root of section)
  const isSubPage = path !== sectionKey;
  return isSubPage ? items : null;
}

/* ─── Pulse animation (injected once) ───────────────────────── */
const PULSE_STYLE = `
@keyframes nav-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
  100% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
}
.nav-badge-pulse { animation: nav-pulse 1.8s ease-out infinite; }
`;

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
  const breadcrumbs = useMemo(() => BREADCRUMB_MAP[path] ?? ['Unknown'], [path]);
  const subNav = useMemo(() => getSubNav(path), [path]);

  const handleBottomNavTap = useCallback(
    (itemPath: string) => {
      if (path.startsWith(itemPath)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [path]
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#070d1a' }}>
      <style>{PULSE_STYLE}</style>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40"
        style={{
          width: 240,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src="/logo.png" alt="" className="w-11 h-11 object-contain" style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }} aria-hidden="true" />
          <span className="text-base font-bold tracking-tight" style={{ color: '#f8fafc' }}>
            Poseidon.AI
          </span>
        </div>

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
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150"
                style={{
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? `${item.color}1a` : 'transparent',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#f8fafc';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150"
                style={{
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid #94a3b8' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#f8fafc';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }
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
            DU
          </div>
          <span className="text-sm" style={{ color: '#94a3b8' }}>
            Demo User
          </span>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">
        {/* ── Desktop top header ── */}
        <header
          className="hidden lg:flex items-center justify-between sticky top-0 z-30 px-6"
          style={{
            height: 56,
            background: 'rgba(7, 13, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Breadcrumb */}
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

          {/* Right side: bell + avatar */}
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-lg transition-colors duration-150"
              style={{ color: '#94a3b8' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
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
              DU
            </button>
          </div>
        </header>

        {/* ── Mobile top header ── */}
        <header
          className="flex lg:hidden items-center justify-between sticky top-0 z-30 px-4"
          style={{
            height: 56,
            background: 'rgba(7, 13, 26, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }} aria-hidden="true" />
            <span className="text-sm font-bold" style={{ color: '#f8fafc' }}>
              Poseidon.AI
            </span>
          </div>

          {/* Center: current section */}
          <span className="text-sm font-medium" style={{ color: '#f8fafc' }}>
            {activeSection?.label ?? ''}
          </span>

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
            className="flex items-center gap-2 px-4 lg:px-6 py-2.5 overflow-x-auto"
            style={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(7, 13, 26, 0.6)',
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
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? color : '#94a3b8',
                    background: isActive ? `${color}1a` : 'transparent',
                    border: isActive ? `1px solid ${color}40` : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#f8fafc';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }
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
        className="fixed bottom-0 left-0 right-0 lg:hidden z-40 flex items-center justify-around"
        style={{
          height: 64,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'rgba(7, 13, 26, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
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
              className="flex flex-col items-center justify-center gap-1 flex-1 pt-2 pb-1 transition-colors duration-150"
              style={{ color: isActive ? item.color : '#64748b' }}
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
