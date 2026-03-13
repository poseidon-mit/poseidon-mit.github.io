import { motion } from "framer-motion";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useDemoState } from "@/lib/demo-state/provider";
import {
  SETTINGS_ROUTES,
  SettingsPanel,
  SettingsWorkspaceCard,
} from "@/components/settings/SettingsLayout";

export function SettingsGeneralContent() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { state } = useDemoState();

  return (
    <motion.div
      variants={staggerContainer}
      className="flex flex-col gap-6 pb-16"
    >
      <motion.div variants={fadeUp}>
        <SettingsPanel
          eyebrow="Profile"
          title={state.user.name}
          description="Workspace owner."
          accent={SETTINGS_ROUTES["/settings"].accent}
        />
      </motion.div>

      <motion.section variants={fadeUp} className="grid gap-4 xl:grid-cols-3">
        <SettingsWorkspaceCard
          path="/settings/ai"
          eyebrow="AI"
          title="AI"
          description="Approval ceiling and voice."
          accent={SETTINGS_ROUTES["/settings/ai"].accent}
        />
        <SettingsWorkspaceCard
          path="/settings/integrations"
          eyebrow="Integrations"
          title="Integrations"
          description="Connected systems and scopes."
          accent={SETTINGS_ROUTES["/settings/integrations"].accent}
        />
        <SettingsWorkspaceCard
          path="/settings/rights"
          eyebrow="Rights"
          title="Rights"
          description="Consent, retention, export, delete."
          accent={SETTINGS_ROUTES["/settings/rights"].accent}
        />
      </motion.section>
    </motion.div>
  );
}

export default function SettingsGeneral() {
  return <SettingsGeneralContent />;
}
