import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 left-8 z-40"
        >
          <Button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 p-0"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
