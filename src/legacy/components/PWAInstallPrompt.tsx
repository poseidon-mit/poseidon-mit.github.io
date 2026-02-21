import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000;

export function PWAInstallPrompt(): React.ReactNode {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!isInstallable || isInstalled) {
      setShowPrompt(false);
      return;
    }

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissedTime = Number.parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        setShowPrompt(false);
        return;
      }
    }

    setShowPrompt(true);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    await promptInstall();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showPrompt && (
        <motion.div
          key="pwa-install-prompt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="mission-pwa-prompt-wrap"
        >
          <div className="mission-pwa-prompt">
            <div className="mission-pwa-prompt-icon" aria-hidden="true">📲</div>

            <div className="mission-pwa-prompt-copy">
              <div className="mission-pwa-prompt-title">Install Poseidon</div>
              <div className="mission-pwa-prompt-subtitle">Get faster access and offline support</div>
            </div>

            <div className="mission-pwa-prompt-actions">
              <button onClick={handleInstall} className="entry-btn entry-btn--primary mission-pwa-prompt-install">
                Install
              </button>
              <button onClick={handleDismiss} className="entry-btn entry-btn--ghost mission-pwa-prompt-later">
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
