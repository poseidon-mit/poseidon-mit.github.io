import { motion } from "framer-motion";
import { getMotionPreset } from "@/lib/motion-presets";
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from "@/lib/page-layout";
import { usePageTitle } from "@/hooks/use-page-title";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useRouter } from "@/router";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
// Static imports — all content loads in one chunk for instant tab switching
import { SettingsAIContent } from "./SettingsAI";
import { SettingsIntegrationsContent } from "./SettingsIntegrations";
import { SettingsRightsContent } from "./SettingsRights";

const PAGE_TITLES: Record<string, string> = {
  "/settings": "Settings",
  "/settings/ai": "AI Preferences",
  "/settings/integrations": "Integrations",
  "/settings/rights": "Rights & Privacy",
};

export default function SettingsPage() {
  const { path } = useRouter();
  const currentPath = path.startsWith("/settings") ? path : "/settings";
  usePageTitle(PAGE_TITLES[currentPath] ?? "Settings");
  const prefersReducedMotion = useReducedMotionSafe();
  const { staggerContainer: staggerContainerVariant } =
    getMotionPreset(prefersReducedMotion);

  // All settings routes show Integrations layout
  const effectivePath =
    currentPath === "/settings" ? "/settings/integrations" : currentPath;

  return (
    <SettingsLayout currentPath={effectivePath}>
      <motion.section
        key={effectivePath}
        className={`${PAGE_CONTENT_CLASS} command-center__main`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {effectivePath === "/settings/ai" && <SettingsAIContent />}
        {effectivePath === "/settings/integrations" && (
          <SettingsIntegrationsContent />
        )}
        {effectivePath === "/settings/rights" && <SettingsRightsContent />}
      </motion.section>
    </SettingsLayout>
  );
}
