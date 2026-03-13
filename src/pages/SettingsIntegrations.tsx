import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CreditCard,
  Landmark,
  Link2,
  Wallet,
} from "lucide-react";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { SETTINGS_ROUTES, SettingsPanel } from "@/components/settings/SettingsLayout";
import { CyberToggle } from "@/components/poseidon/cyber-toggle";

const INTEGRATIONS = [
  {
    id: "stripe",
    icon: CreditCard,
    label: "Stripe",
    description: "Payments, refunds, and transaction traces.",
    status: "Synced 2m ago",
    permissions: ["Transactions", "Balances", "Refunds"],
    accent: "violet" as const,
    accentVar: "var(--engine-grow)",
  },
  {
    id: "plaid",
    icon: Building2,
    label: "Plaid",
    description: "Balances, cash movement, and account health.",
    status: "Synced 11m ago",
    permissions: ["Balances", "Transfers", "Statements"],
    accent: "cyan" as const,
    accentVar: "var(--engine-dashboard)",
  },
  {
    id: "coinbase",
    icon: Wallet,
    label: "Coinbase Prime",
    description: "Wallet balances and transfer confirmations.",
    status: "Synced 24m ago",
    permissions: ["Wallets", "Transfers", "Counterparties"],
    accent: "amber" as const,
    accentVar: "var(--engine-execute)",
  },
  {
    id: "fidelity",
    icon: Landmark,
    label: "Fidelity",
    description: "Positions, cash sweeps, and portfolio detail.",
    status: "Synced 1h ago",
    permissions: ["Positions", "Cash", "Statements"],
    accent: "blue" as const,
    accentVar: "var(--engine-govern)",
  },
] as const;

type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export function SettingsIntegrationsContent() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);

  const [enabled, setEnabled] = useState<Record<IntegrationId, boolean>>({
    stripe: true,
    plaid: true,
    coinbase: false,
    fidelity: true,
  });

  const connectedCount = Object.values(enabled).filter(Boolean).length;

  return (
    <motion.div variants={staggerContainer} className="flex flex-col gap-6 pb-16">
      <motion.div variants={fadeUp}>
        <SettingsPanel
          eyebrow="Connections"
          title="Connected systems"
          description={`${connectedCount} active.`}
          accent={SETTINGS_ROUTES["/settings/integrations"].accent}
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
                      <integration.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                        style={{ color: integration.accentVar }}
                      />
                      <h3 className="text-2xl font-semibold tracking-tight text-white">
                        {integration.label}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">
                      {integration.description}
                    </p>
                    <div className="mt-3 space-y-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/38">
                      <p>{isEnabled ? integration.status : "Paused"}</p>
                      <p>Scopes: {integration.permissions.join(", ")}</p>
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
                    accent={integration.accent}
                  />
                </div>
              );
            })}
          </div>
        </SettingsPanel>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsIntegrations() {
  return <SettingsIntegrationsContent />;
}
