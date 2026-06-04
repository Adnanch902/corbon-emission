import { motion } from "motion/react";
import { Link } from "react-router";
import { Leaf, TrendingDown, BarChart3, Globe, Lightbulb, ArrowRight, Info, Brain, Home as HomeIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { FloatingNav } from "../components/FloatingNav";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { InfoModal } from "../components/InfoModal";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getLocale, setLocale, t, type Locale } from "../lib/i18n";

export function Home() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [locale, setActiveLocale] = useState<Locale>(getLocale());

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ur" : "en";
    setLocale(nextLocale);
    setActiveLocale(nextLocale);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <AnimatedBackground />
      <FloatingNav />
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  GLIP
                </h1>
                <p className="text-xs text-gray-600">Green Lifestyle Impact</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLocale}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                {t("language", locale)}: {locale === "en" ? "English" : "اردو"}
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfoModal(true)}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium"
              >
                🌍 {t("appName", locale)}
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                Track Your Environmental Impact
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Analyze your carbon footprint, water usage, and environmental impact with AI-powered insights. Make informed decisions for a sustainable future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/input">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg group">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/visualization">
                  <Button size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-20"></div>
                <ImageWithFallback
                  src="figma:asset/feee844776c90b77be1d5001d43ba2515c05e749.png"
                  alt="GLIP System Architecture"
                  className="relative rounded-2xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to understand and reduce your environmental impact</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 shadow-lg hover:shadow-xl transition-all overflow-hidden relative"
              >
                {/* Background image icon */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 overflow-hidden">
                  <ImageWithFallback
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="relative z-10 text-xl font-bold mb-2">{feature.title}</h3>
                <p className="relative z-10 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of users taking control of their environmental impact
            </p>
            <Link to="/input">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">GLIP</span>
          </div>
          <p className="text-gray-600">
            Green Lifestyle Impact Predictor - Your partner in sustainable living
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: TrendingDown,
    title: "CO₂ Tracking",
    description: "Monitor your carbon footprint across all activities with real-time analytics",
    imageUrl: "https://images.unsplash.com/photo-1614480633889-6fdf43a03a8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJib24lMjBmb290cHJpbnQlMjB0cmFja2luZyUyMGRpZ2l0YWx8ZW58MXx8fHwxNzc1MDMzNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: BarChart3,
    title: "Multi-Impact Analysis",
    description: "Track water, plastic, energy usage, and more in one comprehensive dashboard",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc3NDk1NTMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description: "Machine learning-powered forecasting of your future environmental impact",
    imageUrl: "https://images.unsplash.com/photo-1770233621425-5d9ee7a0a700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NDkzNzc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Globe,
    title: "3D Visualization",
    description: "Interactive 3D globe showing your environmental impact in an immersive way",
    imageUrl: "https://images.unsplash.com/photo-1760000232856-8659375112b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGdsb2JlJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzc1MDMzNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "AI-powered suggestions to reduce your impact and live more sustainably",
    imageUrl: "https://images.unsplash.com/photo-1750727769935-978b2f48f49f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodGJ1bGIlMjBpbm5vdmF0aW9uJTIwZ3JlZW4lMjBlbmVyZ3l8ZW58MXx8fHwxNzc1MDMzNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];
