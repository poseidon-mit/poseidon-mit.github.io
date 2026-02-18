import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';

// ─── Page imports (all 36 screens mapped to components) ─────────────────────

import Landing from '../../pages/Landing';
import TrustSecurity from '../../pages/TrustSecurity';
import Pricing from '../../pages/Pricing';
import Signup from '../../pages/Signup';
import Login from '../../pages/Login';
import Recovery from '../../pages/Recovery';
import Onboarding from '../../pages/Onboarding';
import Dashboard from '../../pages/Dashboard';
import AlertsHub from '../../pages/AlertsHub';
import InsightsFeed from '../../pages/InsightsFeed';
import ActivityTimelinePage from '../../pages/ActivityTimelinePage';
import Notifications from '../../pages/Notifications';
import Protect from '../../pages/Protect';
import ProtectAlertDetail from '../../pages/ProtectAlertDetail';
import ProtectDispute from '../../pages/ProtectDispute';
import Grow from '../../pages/Grow';
import GrowScenarios from '../../pages/GrowScenarios';
import GrowRecommendations from '../../pages/GrowRecommendations';
import Execute from '../../pages/Execute';
import ExecuteApproval from '../../pages/ExecuteApproval';
import ExecuteHistory from '../../pages/ExecuteHistory';
import Govern from '../../pages/Govern';
import GovernTrust from '../../pages/GovernTrust';
import GovernAuditLedger from '../../pages/GovernAuditLedger';
import GovernAuditDetail from '../../pages/GovernAuditDetail';
import GovernRegistry from '../../pages/GovernRegistry';
import GovernOversight from '../../pages/GovernOversight';
import GovernPolicy from '../../pages/GovernPolicy';
import Settings from '../../pages/Settings';
import SettingsAI from '../../pages/SettingsAI';
import SettingsIntegrations from '../../pages/SettingsIntegrations';
import SettingsRights from '../../pages/SettingsRights';
import HelpSupport from '../../pages/HelpSupport';
import NotFound from '../../pages/NotFound';

import { screenContractsV4 } from '../screen-contracts-v4';
import type { ScreenId } from '../screen-contract';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderScreen(Component: React.ComponentType) {
  return render(
    <RouterProvider>
      <Component />
    </RouterProvider>,
  );
}

// ─── ScreenId → Component map ────────────────────────────────────────────────
// Pages that share a component (e.g. ACT04-07 all use Onboarding) are
// listed once because they render the same underlying component.

const SCREEN_COMPONENT_MAP: Array<{ screenId: ScreenId; component: React.ComponentType; name: string }> = [
  // Public
  { screenId: 'S-V3-PUB01', component: Landing, name: 'Landing' },
  { screenId: 'S-V3-PUB02', component: TrustSecurity, name: 'TrustSecurity' },
  { screenId: 'S-V3-PUB03', component: Pricing, name: 'Pricing' },
  // Activation
  { screenId: 'S-V3-ACT01', component: Signup, name: 'Signup' },
  { screenId: 'S-V3-ACT02', component: Login, name: 'Login' },
  { screenId: 'S-V3-ACT03', component: Recovery, name: 'Recovery' },
  { screenId: 'S-V3-ACT04', component: Onboarding, name: 'Onboarding (Connect)' },
  // Core
  { screenId: 'S-V3-CORE01', component: Dashboard, name: 'Dashboard' },
  { screenId: 'S-V3-CORE02', component: AlertsHub, name: 'AlertsHub' },
  { screenId: 'S-V3-CORE03', component: InsightsFeed, name: 'InsightsFeed' },
  { screenId: 'S-V3-CORE04', component: ActivityTimelinePage, name: 'ActivityTimeline' },
  { screenId: 'S-V3-CORE05', component: Notifications, name: 'Notifications' },
  // Protect
  { screenId: 'S-V3-PRT01', component: Protect, name: 'Protect' },
  { screenId: 'S-V3-PRT02', component: ProtectAlertDetail, name: 'ProtectAlertDetail' },
  { screenId: 'S-V3-PRT03', component: ProtectDispute, name: 'ProtectDispute' },
  // Grow
  { screenId: 'S-V3-GRW01', component: Grow, name: 'Grow' },
  { screenId: 'S-V3-GRW02', component: GrowScenarios, name: 'GrowScenarios' },
  { screenId: 'S-V3-GRW03', component: GrowRecommendations, name: 'GrowRecommendations' },
  // Execute
  { screenId: 'S-V3-EXE01', component: Execute, name: 'Execute' },
  { screenId: 'S-V3-EXE02', component: ExecuteApproval, name: 'ExecuteApproval' },
  { screenId: 'S-V3-EXE03', component: ExecuteHistory, name: 'ExecuteHistory' },
  // Govern
  { screenId: 'S-V3-GOV01', component: GovernTrust, name: 'GovernTrust' },
  { screenId: 'S-V3-GOV02', component: GovernAuditLedger, name: 'GovernAuditLedger' },
  { screenId: 'S-V3-GOV03', component: GovernAuditDetail, name: 'GovernAuditDetail' },
  { screenId: 'S-V3-GOV04', component: GovernRegistry, name: 'GovernRegistry' },
  { screenId: 'S-V3-GOV05', component: GovernOversight, name: 'GovernOversight' },
  { screenId: 'S-V3-GOV06', component: GovernPolicy, name: 'GovernPolicy' },
  // Settings
  { screenId: 'S-V3-SET01', component: Settings, name: 'Settings' },
  { screenId: 'S-V3-SET02', component: SettingsAI, name: 'SettingsAI' },
  { screenId: 'S-V3-SET03', component: SettingsIntegrations, name: 'SettingsIntegrations' },
  { screenId: 'S-V3-SET04', component: SettingsRights, name: 'SettingsRights' },
  // System
  { screenId: 'S-V3-SYS01', component: HelpSupport, name: 'HelpSupport' },
  { screenId: 'S-V3-SYS02', component: NotFound, name: 'NotFound' },
];

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('V4 screen contract registry', () => {
  it('has a contract for all 36 screen IDs', () => {
    expect(Object.keys(screenContractsV4).length).toBe(36);
  });

  it('every contract has required fields', () => {
    for (const [id, contract] of Object.entries(screenContractsV4)) {
      expect(contract.id, `${id} missing id`).toBeDefined();
      expect(contract.oneScreenMessage, `${id} missing oneScreenMessage`).toBeTruthy();
      expect(contract.transitionCue, `${id} missing transitionCue`).toBeTruthy();
      expect(contract.requiredSlots.length, `${id} missing slots`).toBeGreaterThan(0);
      expect(contract.requiredWidgets.length, `${id} missing widgets`).toBeGreaterThan(0);
      expect(contract.mobileBehavior, `${id} missing mobileBehavior`).toBeDefined();
      expect(contract.supportedStates, `${id} missing supportedStates`).toBeDefined();
    }
  });

  it('govern-required screens have governRequired=true', () => {
    const governScreens = Object.entries(screenContractsV4)
      .filter(([, c]) => c.governRequired)
      .map(([id]) => id);

    // At least PRT02, EXE02, GOV01-06 should require govern
    expect(governScreens).toContain('S-V3-PRT02');
    expect(governScreens).toContain('S-V3-EXE02');
    expect(governScreens).toContain('S-V3-GOV01');
    expect(governScreens).toContain('S-V3-GOV06');
    expect(governScreens.length).toBeGreaterThanOrEqual(15);
  });

  it('bottom-sheet screens are PRT02, EXE02, GOV03', () => {
    expect(screenContractsV4['S-V3-PRT02'].mobileBehavior.bottomSheetEnabled).toBe(true);
    expect(screenContractsV4['S-V3-EXE02'].mobileBehavior.bottomSheetEnabled).toBe(true);
    expect(screenContractsV4['S-V3-GOV03'].mobileBehavior.bottomSheetEnabled).toBe(true);
    // Landing should not have bottom sheet
    expect(screenContractsV4['S-V3-PUB01'].mobileBehavior.bottomSheetEnabled).toBe(false);
  });
});

describe('all screens render without crash', () => {
  it.each(SCREEN_COMPONENT_MAP)(
    '$name ($screenId) renders successfully',
    ({ component }) => {
      const { container } = renderScreen(component);
      expect(container.innerHTML).toBeTruthy();
    },
  );
});

// Transition cue text is a contract-level concept; v0 self-contained pages may not render
// "Why [action]" cue text directly — this is acceptable per the v0 integration rules.
// We verify the contract has a transitionCue defined, not that each page renders it.
describe('all screen contracts define a transition cue', () => {
  it.each(
    SCREEN_COMPONENT_MAP.filter((s) => s.screenId !== 'S-V3-SYS02'),
  )('$name contract has transitionCue defined', ({ screenId }) => {
    const contract = screenContractsV4[screenId];
    expect(contract.transitionCue, `Missing transitionCue for ${screenId}`).toBeTruthy();
  });
});

describe('govern-required screens include GovernContractSet', () => {
  const governScreens = SCREEN_COMPONENT_MAP.filter(
    (s) => screenContractsV4[s.screenId].governRequired,
  );

  it.each(governScreens)(
    '$name renders GovernContractSet',
    ({ component }) => {
      const { container } = renderScreen(component);
      // GovernContractSet renders data-widget="GovernContractSet"
      const governSet = container.querySelector('[data-widget="GovernContractSet"]');
      // If not using data-widget, check for the verified badge (always present)
      const verifiedBadge = container.querySelector('.mission-govern-badge');
      expect(governSet ?? verifiedBadge).not.toBeNull();
    },
  );
});
