import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import { Home, BarChart3, Globe, Brain, Lightbulb, Plus, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Globe, label: "3D View", path: "/visualization" },
    { icon: Brain, label: "AI Predict", path: "/prediction" },
    { icon: Sparkles, label: "AI Recommend", path: "/recommendations" },
    { icon: Lightbulb, label: "Tips", path: "/recommendations" },
  ];

  return (
    <div
      className="fixed bottom-8 right-8 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setHoveredItem(null);
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3 mb-4"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-center justify-end gap-3"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <AnimatePresence>
                  {hoveredItem === item.path && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Link to={item.path}>
                  <Button
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
                      location.pathname === item.path
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xl flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}