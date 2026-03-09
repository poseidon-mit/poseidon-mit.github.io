import { motion } from 'framer-motion';
import type { ModelId } from '@/lib/types';
import { MODELS } from '@/lib/models';
import { ModelTag } from './ModelTag';

interface TypingIndicatorProps {
  model: ModelId;
}

export function TypingIndicator({ model }: TypingIndicatorProps) {
  const modelConfig = MODELS[model];

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-6, 0, -6],
      transition: {
        duration: 0.6,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              delay: i * 0.1,
            }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: modelConfig.color }}
          />
        ))}
      </div>
      <ModelTag model={model} size="sm" />
    </motion.div>
  );
}
