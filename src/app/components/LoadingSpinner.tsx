import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="inline-block mb-4"
        >
          <Leaf className="w-16 h-16 text-emerald-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl font-semibold text-gray-700">Loading GLIP...</p>
          <p className="text-gray-500">Calculating your environmental impact</p>
        </motion.div>
      </div>
    </div>
  );
}
