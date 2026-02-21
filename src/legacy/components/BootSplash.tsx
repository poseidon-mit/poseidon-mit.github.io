import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { copy } from '../content/microcopy-catalog';

interface BootSplashProps {
  title?: string;
  subtitle?: string;
}

export function BootSplash({
  title = 'Poseidon',
  subtitle = copy('app_boot_subtitle'),
}: BootSplashProps) {
  const reducedMotion = useReducedMotionSafe();

  return (
    <div className="boot-splash" role="status" aria-live="polite" aria-label={copy('app_loading')}>
      <motion.div
        className="boot-splash__core"
        initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.16, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="boot-splash__pill">{title}</div>
        <div className="boot-splash__subtitle">{subtitle}</div>
      </motion.div>
    </div>
  );
}
