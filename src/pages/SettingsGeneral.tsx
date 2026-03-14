import { Mail, Phone, ShieldCheck } from "lucide-react";
import {
  HeroEyebrow,
  HeroPanel,
} from "@/components/poseidon/hero-concept-primitives";
import { SETTINGS_SECTION_ACCENTS } from "@/components/settings/SettingsLayout";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { useDemoUser } from "@/lib/demo-state/provider";

export function SettingsGeneralContent() {
  const user = useDemoUser();
  const { profile } = usePerformanceProfile();
  const profileDetails = [
    user.email
      ? { icon: Mail, label: "Email", value: user.email }
      : null,
    user.phone
      ? { icon: Phone, label: "Phone", value: user.phone }
      : null,
  ].filter(Boolean) as Array<{
    icon: typeof Mail;
    label: string;
    value: string;
  }>;

  return (
    <HeroPanel
      performanceProfile={profile}
      className="poseidon-settings-profile-card w-full px-6 py-7 md:px-8 md:py-8 lg:px-10"
      data-testid="settings-profile-card"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:items-center lg:gap-8">
        <div className="flex flex-col items-center lg:min-w-[300px] lg:items-start">
          <HeroEyebrow className="poseidon-settings-eyebrow">
            <SETTINGS_SECTION_ACCENTS.profile.icon
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
              style={{ color: SETTINGS_SECTION_ACCENTS.profile.eyebrowColor }}
            />
            Profile
          </HeroEyebrow>

          <div className="mt-5 flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[1.65rem] font-semibold tracking-[-0.04em] text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
              {user.initials}
            </div>
            <h2
              id="settings-profile-heading"
              className="text-[clamp(2rem,4vw,2.7rem)] font-light tracking-tight text-white lg:whitespace-nowrap"
            >
              {user.name}
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-white/46">
            <ShieldCheck
              className="h-4 w-4"
              aria-hidden="true"
              style={{ color: SETTINGS_SECTION_ACCENTS.rights.eyebrowColor }}
            />
            <span className="font-mono uppercase tracking-[0.18em] text-white/42">
              Plan
            </span>
            <span className="font-mono tabular-nums text-white/64">
              {user.plan}
            </span>
          </div>
        </div>

        {profileDetails.length > 0 ? (
          <div className="grid min-w-0 w-full max-w-md gap-3 lg:self-center lg:justify-self-end">
            {profileDetails.map((detail) => (
              <div
                key={detail.label}
                className="poseidon-settings-profile-line flex min-h-[52px] w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/[0.08] px-4 py-3 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <detail.icon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                    style={{
                      color: SETTINGS_SECTION_ACCENTS.profile.detailAccent,
                    }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
                    {detail.label}
                  </span>
                </div>
                <span className="min-w-0 text-right font-mono text-sm tabular-nums text-white/84 lg:whitespace-nowrap">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </HeroPanel>
  );
}

export default function SettingsGeneral() {
  return <SettingsGeneralContent />;
}
