import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Globe, Zap, Droplet, Leaf, Wind, Sun, Moon, ArrowRight, Brain, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { type ImpactValues } from "../lib/impactData";
import { loadLiveImpacts } from "../lib/liveImpact";

export function Visualization3D() {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState([50]);
  const [isDark, setIsDark] = useState(false);
  const [liveImpacts, setLiveImpacts] = useState<ImpactValues | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadLiveImpacts()
      .then((res) => {
        setLiveImpacts(res.impacts);
      })
      .catch(() => {});
  }, []);

  const impactLevel = (value?: number, multiplier = 1) =>
    Math.max(0, Math.min(100, Math.round((value || 0) * multiplier)));
  const co2Level = impactLevel(liveImpacts?.co2, 1.3);
  const waterLevel = impactLevel(liveImpacts?.water, 4.5);
  const energyLevel = impactLevel(liveImpacts?.ewaste, 25);
  const airLevel = impactLevel((liveImpacts?.plastic || 0) + (liveImpacts?.forest_loss || 0), 8);
  const betterThanAverage = liveImpacts?.co2 ? Math.max(0, Math.min(99, Math.round(100 - liveImpacts.co2))) : 0;
  const rankingPercent = liveImpacts?.co2 ? Math.max(1, Math.min(99, 100 - betterThanAverage)) : 0;

  const impactLayers = [
    { name: "CO₂ Emissions", value: co2Level, color: "#10b981", icon: Leaf },
    { name: "Water Usage", value: waterLevel, color: "#3b82f6", icon: Droplet },
    { name: "Energy Consumption", value: energyLevel, color: "#f59e0b", icon: Zap },
    { name: "Air Quality", value: airLevel, color: "#8b5cf6", icon: Wind },
  ];
  const countriesCompared = liveImpacts
    ? Math.max(1, Math.round(impactLayers.reduce((total, layer) => total + layer.value, 0) / impactLayers.length))
    : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'} transition-colors duration-500`}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDark ? 'border-gray-700' : 'border-emerald-100'} sticky top-0 z-50 transition-colors duration-500`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsDark(!isDark)}
              variant="outline"
              className="gap-2"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? "Light" : "Dark"} Mode
            </Button>
            <Link to="/">
              <Button variant="outline" className={`gap-2 ${isDark ? 'border-emerald-400 text-emerald-400 hover:bg-emerald-900' : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'}`}>
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Globe className={`w-12 h-12 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <h1 className={`text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            3D Impact Visualization
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Interactive globe showing your environmental footprint
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className={`p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur border-emerald-100'} transition-colors duration-500`}>
              <div className="relative aspect-square rounded-2xl overflow-hidden" style={{
                background: isDark 
                  ? 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
                  : 'radial-gradient(circle at 50% 50%, #d1fae5 0%, #a7f3d0 100%)'
              }}>
                {/* Animated Globe */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `scale(${zoom[0] / 50})` }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="relative"
                  >
                    {/* Globe Core */}
                    <div className={`w-64 h-64 rounded-full ${isDark ? 'bg-gradient-to-br from-blue-900 to-emerald-900' : 'bg-gradient-to-br from-blue-400 to-emerald-500'} shadow-2xl relative overflow-hidden`}>
                      {/* Grid Lines */}
                      <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={`h-${i}`}
                            className={`absolute w-full ${isDark ? 'border-blue-400/20' : 'border-white/30'}`}
                            style={{
                              height: '1px',
                              top: `${(i + 1) * 12.5}%`,
                              borderTopWidth: '1px',
                            }}
                          />
                        ))}
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={`v-${i}`}
                            className={`absolute h-full ${isDark ? 'border-blue-400/20' : 'border-white/30'}`}
                            style={{
                              width: '1px',
                              left: `${(i + 1) * 8.33}%`,
                              borderLeftWidth: '1px',
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Impact Hotspots */}
                      {impactLayers.map((layer, i) => (
                        <motion.div
                          key={layer.name}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: layer.color,
                            width: `${layer.value}px`,
                            height: `${layer.value}px`,
                            top: `${20 + i * 20}%`,
                            left: `${30 + i * 15}%`,
                            opacity: 0.6,
                            boxShadow: `0 0 20px ${layer.color}`,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0.8, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}

                      {/* Glow Effect */}
                      <div className="absolute inset-0 rounded-full" style={{
                        background: isDark 
                          ? 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.4) 0%, transparent 50%)'
                          : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)'
                      }} />
                    </div>

                    {/* Orbit Rings */}
                    <motion.div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full ${isDark ? 'border-emerald-400/20' : 'border-emerald-600/30'}`}
                      style={{ borderWidth: '2px' }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${isDark ? 'border-teal-400/10' : 'border-teal-600/20'}`}
                      style={{ borderWidth: '2px' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </motion.div>

                {/* Control Panel */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur p-4 rounded-xl`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Zoom</span>
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        min={30}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{zoom[0]}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Impact Layers Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Impact Layers
            </h2>
            
            {impactLayers.map((layer, index) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur border-emerald-100'} transition-colors duration-500`}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: layer.color,
                        boxShadow: `0 0 20px ${layer.color}40`,
                      }}
                    >
                      <layer.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {layer.name}
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: layer.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${layer.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Impact Level: {layer.value}%
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className={`p-6 ${isDark ? 'bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-700' : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-0'} text-white`}>
                <h3 className="text-xl font-bold mb-4">Global Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Countries Compared</span>
                    <span className="text-2xl font-bold">{countriesCompared}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Your Ranking</span>
                    <span className="text-2xl font-bold">{liveImpacts ? `Top ${rankingPercent}%` : "No data"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Better Than Avg</span>
                    <span className="text-2xl font-bold">{liveImpacts ? `${betterThanAverage}%` : "No data"}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <Link to="/dashboard">
              <Button className={`w-full ${isDark ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                View Detailed Analytics
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className={`p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur border-emerald-100'}`}>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Interactive View
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Use the zoom slider to explore different aspects of your environmental impact in detail.
            </p>
          </Card>
          <Card className={`p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur border-emerald-100'}`}>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Real-Time Data
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              The visualization updates in real-time based on your latest activity data and habits.
            </p>
          </Card>
          <Card className={`p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur border-emerald-100'}`}>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Global Context
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              See how your impact compares to global averages and sustainability targets.
            </p>
          </Card>
        </motion.div>

        {/* AI Prediction CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12"
        >
          <Card className={`p-8 ${isDark ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700' : 'bg-gradient-to-r from-purple-500 to-indigo-600 border-0'} text-white text-center`}>
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Discover Your Future Impact</h2>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Use AI-powered predictions to forecast your environmental impact and plan for a sustainable future
            </p>
            <Link to="/prediction">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 gap-2">
                View AI Predictions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
