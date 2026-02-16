import React, { useState } from 'react';
import { Link } from '../router';
import { PageShell } from '../components/PageShell';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionDataRows } from '../components/MissionDataRows';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionToggle } from '../components/MissionToggle';
import { ProofLine } from '../components/ProofLine';
import { SettingsPanel } from '../components/SettingsPanel';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

// ── Component ────────────────────────────────────────────────

export const Settings: React.FC = () => {
  const contract = getRouteScreenContract('settings');
  const [notifications, setNotifications] = useState({
    protect: true,
    grow: true,
    execute: true,
    govern: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
  });

  const primaryFeed = (
    <>
      {/* Profile */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Profile"
          message="Your account details and identity."
        />
        <MissionDataRows
          items={[
            { id: 'P-1', title: 'Name', value: 'Sarah Chen', tone: 'primary' },
            { id: 'P-2', title: 'Email', value: 'sarah@poseidon.ai', tone: 'primary' },
            { id: 'P-3', title: 'Role', value: 'Owner', tone: 'healthy' },
          ]}
        />
        <button type="button" className="entry-btn entry-btn--ghost mt-3">Edit profile</button>
      </article>

      {/* Notification preferences */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Notification preferences"
          message="Per-engine alert controls."
        />
        <MissionToggle
          checked={notifications.protect}
          onChange={(v) => setNotifications((p) => ({ ...p, protect: v }))}
          label="Protect alerts"
          description="Threat detection and fraud warnings."
        />
        <MissionToggle
          checked={notifications.grow}
          onChange={(v) => setNotifications((p) => ({ ...p, grow: v }))}
          label="Grow insights"
          description="Forecast updates and goal progress."
        />
        <MissionToggle
          checked={notifications.execute}
          onChange={(v) => setNotifications((p) => ({ ...p, execute: v }))}
          label="Execute actions"
          description="New actions ready for approval."
        />
        <MissionToggle
          checked={notifications.govern}
          onChange={(v) => setNotifications((p) => ({ ...p, govern: v }))}
          label="Govern reviews"
          description="Compliance alerts and audit updates."
        />
      </article>

      {/* Security */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Security"
          message="Authentication and access controls."
        />
        <MissionToggle
          checked={security.twoFactor}
          onChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
          label="Two-factor authentication"
          description="Adds an extra layer of security. Recommended."
        />
        <MissionToggle
          checked={security.biometric}
          onChange={(v) => setSecurity((p) => ({ ...p, biometric: v }))}
          label="Biometric login"
          description="Use fingerprint or face recognition to sign in."
        />
        <MissionDataRows
          items={[
            { id: 'S-1', title: 'Active sessions', value: '2 devices', tone: 'primary' },
            { id: 'S-2', title: 'Last login', value: '2h ago', tone: 'primary' },
          ]}
        />
      </article>

      {/* Quick links */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Quick links"
          message="Jump to specialized settings."
        />
        <div className="flex flex-col gap-2">
          <Link className="entry-btn entry-btn--ghost" to="/settings/ai">
            AI Configuration
          </Link>
          <Link className="entry-btn entry-btn--ghost" to="/settings/rights">
            Data Rights
          </Link>
        </div>
      </article>

      {/* Preferences panel */}
      <article className="engine-card">
        <MissionSectionHeader title="General preferences" />
        <SettingsPanel />
      </article>

      <ProofLine
        claim="Account created Jan 15, 2026"
        evidence="2FA enabled | Last login: 2h ago"
        source="Account system"
        sourceType="system"
      />

      <GovernContractSet
        auditId="GV-2026-0215-SET"
        modelVersion="Settings v1.0"
        explanationVersion="N/A"
      />
    </>
  );

  return (
    <PageShell
      slug="settings"
      contract={contract}
      layout="engine"
      fullWidth
      heroVariant="editorial"
      hero={{
        kicker: 'Settings',
        headline: 'Account & preferences',
        subline: 'Manage notifications, security, and AI behavior.',
        freshness: new Date(Date.now() - 2 * 60 * 60 * 1000),
        kpis: [
          { label: 'Active policies', value: '14', definition: 'Configured and enforced policy rules.', accent: 'blue' },
          { label: 'Team seats', value: '8', definition: 'Licensed team members with active access.', accent: 'teal' },
          { label: 'Alerts muted', value: '2', definition: 'Temporarily suppressed alert categories.', accent: 'amber' },
          { label: 'Backups', value: 'Daily', definition: 'Automatic configuration backup frequency.', accent: 'cyan' },
        ],
      }}
      primaryFeed={primaryFeed}
    />
  );
};

export default Settings;
