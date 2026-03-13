import { usePageTitle } from "@/hooks/use-page-title";
import { useRouter } from "@/router";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
// Static imports — all content loads in one chunk for instant tab switching
import { SettingsGeneralContent } from "./SettingsGeneral";
import { SettingsAIContent } from "./SettingsAI";
import { SettingsIntegrationsContent } from "./SettingsIntegrations";
import { SettingsRightsContent } from "./SettingsRights";

const PAGE_TITLES: Record<string, string> = {
  "/settings": "System Settings",
  "/settings/ai": "AI Preferences",
  "/settings/integrations": "Integrations",
  "/settings/rights": "Rights & Privacy",
};

export default function SettingsPage() {
  const { path } = useRouter();
  const currentPath = path.startsWith("/settings") ? path : "/settings";
  usePageTitle(PAGE_TITLES[currentPath] ?? "Settings");

  return (
    <div className="hero-viewport">
      <SettingsLayout currentPath={currentPath}>
        {currentPath === "/settings" && <SettingsGeneralContent />}
        {currentPath === "/settings/ai" && <SettingsAIContent />}
        {currentPath === "/settings/integrations" && <SettingsIntegrationsContent />}
        {currentPath === "/settings/rights" && <SettingsRightsContent />}
      </SettingsLayout>
    </div>
  );
}
