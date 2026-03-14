import { useMemo } from "react";
import { GlassSlider } from "@/components/poseidon/glass-slider";
import {
  SETTINGS_SECTION_ACCENTS,
  SettingsPanel,
} from "@/components/settings/SettingsLayout";
import { useDemoActions, useDemoSettings } from "@/lib/demo-state/provider";
import type { DemoAITone } from "@/lib/demo-state/types";
import { cn } from "@/lib/utils";

const TONE_OPTIONS = [
  "Direct & Concise",
  "Analytical & Detailed",
  "Strategic Coaching",
] as const;

export function SettingsAIContent() {
  const settings = useDemoSettings();
  const { updateSettings } = useDemoActions();
  const { ai } = settings;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settings.general.displayCurrency,
        maximumFractionDigits: 0,
      }),
    [settings.general.displayCurrency],
  );

  const formatThreshold = (value: number) => currencyFormatter.format(value);

  return (
    <SettingsPanel
      eyebrow="AI Control"
      title="Global approval ceiling"
      titleId="settings-ai-heading"
      accent={SETTINGS_SECTION_ACCENTS.ai.accent}
      eyebrowColor={SETTINGS_SECTION_ACCENTS.ai.eyebrowColor}
      icon={SETTINGS_SECTION_ACCENTS.ai.icon}
      className="h-full"
    >
      <div className="grid gap-6">
        <div className="rounded-[24px] border border-white/[0.08] bg-black/25 p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
                Autonomy threshold
              </p>
              <p className="mt-2 text-lg font-light tracking-tight text-white">
                Auto-execute limit
              </p>
              <p className="mt-1 text-sm text-white/52">
                Anything above this holds for human review.
              </p>
            </div>
            <div className="font-mono text-sm tabular-nums text-white/68">
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

        <div className="grid gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
              Default AI voice
            </p>
          </div>
          {TONE_OPTIONS.map((option) => {
            const isActive = option === ai.toneAndPersona;
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  updateSettings({
                    ai: { ...ai, toneAndPersona: option as DemoAITone },
                  })
                }
                className={cn(
                  "min-h-[48px] rounded-2xl border px-4 py-4 text-left text-sm transition-colors",
                  isActive
                    ? "border-blue-400/35 bg-blue-500/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "border-white/[0.08] bg-black/25 text-white/58 hover:bg-white/[0.04] hover:text-white/78",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </SettingsPanel>
  );
}

export default function SettingsAI() {
  return <SettingsAIContent />;
}
