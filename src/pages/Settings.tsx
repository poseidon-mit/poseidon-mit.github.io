import { useLayoutEffect } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { usePageTitle } from "@/hooks/use-page-title";
import { useRouter } from "@/router";
import { SettingsAIContent } from "./SettingsAI";
import { SettingsGeneralContent } from "./SettingsGeneral";
import { SettingsIntegrationsContent } from "./SettingsIntegrations";
import { SettingsRightsContent } from "./SettingsRights";

const LEGACY_SETTINGS_PATHS = new Set([
  "/settings/ai",
  "/settings/integrations",
  "/settings/rights",
]);

export default function SettingsPage() {
  const { path, navigate } = useRouter();
  usePageTitle("Settings");

  useLayoutEffect(() => {
    if (!LEGACY_SETTINGS_PATHS.has(path)) return;
    navigate("/settings", { strategy: "optimistic", replace: true });
  }, [navigate, path]);

  return (
    <div className="hero-viewport">
      <SettingsLayout>
        <div
          className="flex flex-col gap-6 pb-16 lg:gap-8"
          data-testid="settings-unified-page"
        >
          <section
            aria-labelledby="settings-profile-heading"
            className="animate-fade-up"
          >
            <SettingsGeneralContent />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section
              aria-labelledby="settings-ai-heading"
              className="order-1 animate-fade-up animate-fade-up-delay-1 lg:order-2"
            >
              <SettingsAIContent />
            </section>

            <section
              aria-labelledby="settings-integrations-heading"
              className="order-2 animate-fade-up animate-fade-up-delay-2 lg:order-1"
            >
              <SettingsIntegrationsContent />
            </section>
          </div>

          <section
            aria-labelledby="settings-rights-heading"
            className="animate-fade-up animate-fade-up-delay-3"
          >
            <SettingsRightsContent />
          </section>
        </div>
      </SettingsLayout>
    </div>
  );
}
