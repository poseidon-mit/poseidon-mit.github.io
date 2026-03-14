import { useState } from "react";
import {
  Building2,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react";
import { CyberToggle } from "@/components/poseidon/cyber-toggle";
import {
  SETTINGS_SECTION_ACCENTS,
  SettingsPanel,
} from "@/components/settings/SettingsLayout";

const INTEGRATIONS = [
  {
    id: "stripe",
    icon: CreditCard,
    label: "Stripe",
    description: "Payments, refunds, and transaction traces.",
    status: "Synced 2m ago",
    accent: "violet" as const,
    accentVar: "var(--engine-grow)",
  },
  {
    id: "plaid",
    icon: Building2,
    label: "Plaid",
    description: "Balances, cash movement, and account health.",
    status: "Synced 11m ago",
    accent: "cyan" as const,
    accentVar: "var(--engine-dashboard)",
  },
  {
    id: "coinbase",
    icon: Wallet,
    label: "Coinbase Prime",
    description: "Wallet balances and transfer confirmations.",
    status: "Synced 24m ago",
    accent: "amber" as const,
    accentVar: "var(--engine-execute)",
  },
  {
    id: "fidelity",
    icon: Landmark,
    label: "Fidelity",
    description: "Positions, cash sweeps, and portfolio detail.",
    status: "Synced 1h ago",
    accent: "blue" as const,
    accentVar: "var(--engine-govern)",
  },
] as const;

type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export function SettingsIntegrationsContent() {
  const [enabled, setEnabled] = useState<Record<IntegrationId, boolean>>({
    stripe: true,
    plaid: true,
    coinbase: false,
    fidelity: true,
  });

  const connectedCount = Object.values(enabled).filter(Boolean).length;

  return (
    <SettingsPanel
      eyebrow="System Links"
      title="Connected systems"
      titleId="settings-integrations-heading"
      description={`${connectedCount} active connections with live status and visible scopes.`}
      accent={SETTINGS_SECTION_ACCENTS.integrations.accent}
      eyebrowColor={SETTINGS_SECTION_ACCENTS.integrations.eyebrowColor}
      icon={SETTINGS_SECTION_ACCENTS.integrations.icon}
      className="h-full"
    >
      <div className="flex flex-col">
        {INTEGRATIONS.map((integration) => {
          const isEnabled = enabled[integration.id];

          return (
            <div
              key={integration.id}
              className="flex flex-col gap-4 border-t border-white/10 py-5 first:border-t-0 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <integration.icon
                      className="h-4 w-4 shrink-0 text-white/72"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[1.45rem] font-light tracking-tight text-white">
                        {integration.label}
                      </h3>
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: integration.accentVar }}
                      />
                    </div>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-white/56">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: isEnabled
                        ? integration.accentVar
                        : "rgba(255,255,255,0.18)",
                    }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {isEnabled ? integration.status : "Paused"}
                  </span>
                </div>
              </div>
              <CyberToggle
                checked={isEnabled}
                onChange={(checked) =>
                  setEnabled((current) => ({
                    ...current,
                    [integration.id]: checked,
                  }))
                }
                accent="blue"
              />
            </div>
          );
        })}
      </div>
    </SettingsPanel>
  );
}

export default function SettingsIntegrations() {
  return <SettingsIntegrationsContent />;
}
