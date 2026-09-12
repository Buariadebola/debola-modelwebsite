import { motion } from 'framer-motion';

export default function TypingIndicator({
  label = 'Typing...',
}) {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#938797]">
      <span>{label}</span>

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-[#a77abf]"
            animate={{
              opacity: [0.25, 1, 0.25],
              y: [0, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: dot * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}