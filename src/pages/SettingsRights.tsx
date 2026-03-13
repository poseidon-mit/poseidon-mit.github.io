import { useState } from "react";
import { motion } from "framer-motion";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useToast } from "@/hooks/useToast";
import { useDemoState } from "@/lib/demo-state/provider";
import type { DemoDataRetention } from "@/lib/demo-state/types";
import { SETTINGS_ROUTES, SettingsPanel } from "@/components/settings/SettingsLayout";
import { CyberToggle } from "@/components/poseidon/cyber-toggle";
import { cn } from "@/lib/utils";

const CONSENT_SCOPES = [
  { id: "read", label: "Read", description: "Access your financial account data." },
  { id: "categorize", label: "Categorize", description: "Classify transactions with AI." },
  { id: "recommend", label: "Recommend", description: "Generate personalized insights." },
  {
    id: "execute-draft",
    label: "Execute (draft)",
    description: "Prepare actions for your approval before anything moves.",
  },
] as const;

const RETENTION_OPTIONS = ["7d", "30d", "unlimited"] as const;

export function SettingsRightsContent() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { showToast } = useToast();
  const { state, updateSettings } = useDemoState();
  const { rights } = state.settings;
  const [deleteInput, setDeleteInput] = useState("");
  const isDeleteConfirmed = deleteInput === "DELETE";

  function handleExport(format: "JSON" | "CSV") {
    showToast({ variant: "info", message: `Export ${format} is not available in the demo.` });
  }

  function handleDelete() {
    if (!isDeleteConfirmed) return;
    showToast({ variant: "info", message: "Delete is not available in the demo." });
  }

  return (
    <motion.div variants={staggerContainer} className="flex flex-col gap-6 pb-16">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <motion.div variants={fadeUp}>
          <SettingsPanel
            eyebrow="Sovereignty"
            title="Rights & privacy"
            description="Keep consent and retention obvious."
            accent={SETTINGS_ROUTES["/settings/rights"].accent}
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/88">
                    Block shared-model training
                  </p>
                  <p className="mt-1 text-sm text-white/52">
                    Keep your data out of shared training.
                  </p>
                </div>
                <CyberToggle
                  checked={rights.llmTrainingOptOut}
                  onChange={(checked) =>
                    updateSettings({ rights: { ...rights, llmTrainingOptOut: checked } })
                  }
                  accent="blue"
                />
              </div>

              <div className="border-b border-white/10 pb-5">
                <p className="text-sm font-medium text-white/88">Retention</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {RETENTION_OPTIONS.map((option) => {
                    const isActive = option === rights.dataRetention;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          updateSettings({ rights: { ...rights, dataRetention: option } })
                        }
                        className={cn(
                          "rounded-2xl border px-4 py-4 text-left text-sm transition-colors",
                          isActive
                            ? "border-white/16 bg-white/[0.06] text-white"
                            : "border-white/[0.08] bg-black/25 text-white/58 hover:bg-white/[0.04] hover:text-white/78",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white/88">Data consent scopes</h3>
                <div className="mt-4 flex flex-col">
                  {CONSENT_SCOPES.map((scope) => (
                    <div
                      key={scope.id}
                      className="border-t border-white/10 py-4 first:border-t-0 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/88">{scope.label}</p>
                        <p className="mt-1 text-sm text-white/50">{scope.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SettingsPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-6">
          <SettingsPanel
            eyebrow="Export"
            title="Delete my data"
            description="Export first if needed, then confirm deletion."
            accent={SETTINGS_ROUTES["/settings/rights"].accent}
            className="border-red-500/30 bg-red-500/6"
          >
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white/88">Export</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleExport("JSON")}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
                  >
                    Export as JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("CSV")}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-5">
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  value={deleteInput}
                  onChange={(event) => setDeleteInput(event.target.value)}
                  className="w-full rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-red-400/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isDeleteConfirmed}
                  className="mt-4 rounded-xl border border-red-400/30 bg-red-500/12 px-4 py-2 text-sm font-medium text-red-200 transition-colors disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:bg-red-500/18"
                >
                  {isDeleteConfirmed
                    ? "Permanently delete all data"
                    : "Type DELETE above to confirm"}
                </button>
              </div>
            </div>
          </SettingsPanel>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <div className="mission-govern-badge border-t border-white/10 px-1 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/38">
            Audit ID: GV-2026-0216-SETT-RTS
          </p>
          <p className="mt-2 text-sm text-white/48">
            Rights & Privacy · Poseidon Govern · Verified deletion gate and export pathway.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsRights() {
  return <SettingsRightsContent />;
}
