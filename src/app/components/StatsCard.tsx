import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  change?: number;
  gradient: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, unit, change, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100 hover:shadow-2xl transition-all cursor-pointer">
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1 }}
        >
          <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-sm text-gray-500 mb-3">{unit}</div>
          <div className="text-base font-semibold text-gray-700 mb-2">{label}</div>
          
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                change < 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span>{change < 0 ? "↓" : "↑"}</span>
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}
