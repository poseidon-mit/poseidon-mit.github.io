import { motion } from "framer-motion";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useDemoState } from "@/lib/demo-state/provider";
import type { DemoAITone } from "@/lib/demo-state/types";
import { SETTINGS_ROUTES, SettingsPanel } from "@/components/settings/SettingsLayout";
import { GlassSlider } from "@/components/poseidon/glass-slider";
import { cn } from "@/lib/utils";

const TONE_OPTIONS = [
  "Direct & Concise",
  "Analytical & Detailed",
  "Strategic Coaching",
] as const;

export function SettingsAIContent() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { state, updateSettings } = useDemoState();
  const { ai } = state.settings;

  const formatThreshold = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: state.settings.general.displayCurrency,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <motion.div variants={staggerContainer} className="flex flex-col gap-6 pb-16">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div variants={fadeUp}>
          <SettingsPanel
            eyebrow="Approval ceiling"
            title="Global approval ceiling"
            description="Anything above this stays in draft."
            accent={SETTINGS_ROUTES["/settings/ai"].accent}
          >
            <div className="rounded-[24px] border border-white/[0.08] bg-black/25 p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white/88">
                    Auto-execute limit
                  </p>
                </div>
                <div className="font-mono text-sm text-white/68">
                  {formatThreshold(ai.autonomyThreshold)}
                </div>
              </div>
              <div className="mt-5">
                <GlassSlider
                  value={ai.autonomyThreshold}
                  min={0}
                  max={10000}
                  step={100}
                  onChange={(value) =>
                    updateSettings({ ai: { ...ai, autonomyThreshold: value } })
                  }
                  formatLabel={formatThreshold}
                  accent="violet"
                />
              </div>
            </div>
          </SettingsPanel>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SettingsPanel
            eyebrow="Voice"
            title="Default AI voice"
            description="Used across every engine."
            accent={SETTINGS_ROUTES["/settings/ai"].accent}
          >
            <div className="grid gap-3">
              {TONE_OPTIONS.map((option) => {
                const isActive = option === ai.toneAndPersona;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      updateSettings({ ai: { ...ai, toneAndPersona: option as DemoAITone } })
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
          </SettingsPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SettingsAI() {
  return <SettingsAIContent />;
}
