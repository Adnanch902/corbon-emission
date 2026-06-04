import { motion, AnimatePresence } from "motion/react";
import { X, Leaf, Database, Cpu, Globe, BarChart3, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const systemComponents = [
    {
      icon: Leaf,
      title: "User Interface",
      description: "Web App + 3D UI for seamless interaction",
      color: "emerald",
    },
    {
      icon: Database,
      title: "Backend Server",
      description: "Node.js/Express processing your data",
      color: "blue",
    },
    {
      icon: Cpu,
      title: "AI/ML Engine",
      description: "Multi-impact calculations and CO₂ analysis",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Real-time analytics and visualizations",
      color: "orange",
    },
    {
      icon: Globe,
      title: "3D Visualization",
      description: "Interactive Three.js/WebGL globe",
      color: "teal",
    },
    {
      icon: Lightbulb,
      title: "Recommendations",
      description: "AI-powered sustainability suggestions",
      color: "amber",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">GLIP System</h2>
                    <p className="text-emerald-100">Green Lifestyle Impact Predictor</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-lg text-emerald-50">
                An AI-powered platform to analyze and reduce your environmental footprint
              </p>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">System Architecture</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {systemComponents.map((component, index) => (
                  <motion.div
                    key={component.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${component.color}-500 flex items-center justify-center flex-shrink-0`}>
                      <component.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{component.title}</h4>
                      <p className="text-gray-600 text-sm">{component.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-xl mb-3 text-emerald-900">Key Features</h4>
                <ul className="space-y-2 text-emerald-800">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    Track CO₂, water, plastic, energy usage in real-time
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    Interactive 3D globe visualization of your impact
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    AI-powered recommendations for sustainable living
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    MongoDB database for secure data storage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    Comprehensive analytics and progress tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Final Year Project 2026</p>
                <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
