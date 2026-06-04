import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-40 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
