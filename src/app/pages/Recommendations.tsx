import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  Leaf,
  Car,
  Home,
  ShoppingBag,
  Utensils,
  Zap,
  Droplet,
  Star,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getToken } from "../lib/api";
import { loadLiveImpacts } from "../lib/liveImpact";

export function Recommendations() {
  const [savedTips, setSavedTips] = useState<number[]>([]);
  const [liveImpacts, setLiveImpacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const toggleSave = (id: number) => {
    setSavedTips(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    loadLiveImpacts()
      .then((res) => {
        setLiveImpacts(res.impacts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dynamicSaving = (value: number | undefined, ratio: number, unit: string) =>
    `${Number(((value || 0) * ratio).toFixed(2))} ${unit}`;

  const recommendations = [
    {
      id: 1,
      category: "Transport",
      icon: Car,
      title: "Switch to Electric Vehicle",
      description: "Transitioning to an electric vehicle could reduce your transport emissions by up to 70%",
      impact: "High",
      savings: dynamicSaving(liveImpacts?.co2, 0.7, "tons CO₂/year"),
      difficulty: "Medium",
      color: "emerald",
    },
    {
      id: 2,
      category: "Transport",
      icon: Car,
      title: "Use Public Transportation",
      description: "Taking public transport 3 days a week can significantly reduce your carbon footprint",
      impact: "Medium",
      savings: dynamicSaving(liveImpacts?.co2, 0.42, "tons CO₂/year"),
      difficulty: "Easy",
      color: "emerald",
    },
    {
      id: 3,
      category: "Food",
      icon: Utensils,
      title: "Reduce Meat Consumption",
      description: "Eating plant-based meals 4 days a week can lower food-related emissions by 50%",
      impact: "High",
      savings: dynamicSaving(liveImpacts?.co2, 0.28, "tons CO₂/year"),
      difficulty: "Easy",
      color: "blue",
    },
    {
      id: 4,
      category: "Food",
      icon: Utensils,
      title: "Buy Local Produce",
      description: "Choosing locally grown food reduces transportation emissions and supports local farmers",
      impact: "Medium",
      savings: dynamicSaving(liveImpacts?.co2, 0.14, "tons CO₂/year"),
      difficulty: "Easy",
      color: "blue",
    },
    {
      id: 5,
      category: "Energy",
      icon: Zap,
      title: "Install Solar Panels",
      description: "Solar panels can offset 80% of your home energy consumption with clean renewable energy",
      impact: "High",
      savings: dynamicSaving(liveImpacts?.co2, 0.35, "tons CO₂/year"),
      difficulty: "Hard",
      color: "orange",
    },
    {
      id: 6,
      category: "Energy",
      icon: Home,
      title: "Upgrade to LED Lighting",
      description: "LED bulbs use 75% less energy and last 25 times longer than traditional bulbs",
      impact: "Low",
      savings: dynamicSaving(liveImpacts?.co2, 0.08, "tons CO₂/year"),
      difficulty: "Easy",
      color: "orange",
    },
    {
      id: 7,
      category: "Shopping",
      icon: ShoppingBag,
      title: "Buy Second-Hand Items",
      description: "Purchasing pre-owned goods reduces manufacturing emissions and waste",
      impact: "Medium",
      savings: dynamicSaving(liveImpacts?.plastic, 0.3, "kg plastic/month"),
      difficulty: "Easy",
      color: "purple",
    },
    {
      id: 8,
      category: "Water",
      icon: Droplet,
      title: "Install Low-Flow Fixtures",
      description: "Low-flow showerheads and faucets can reduce water usage by 30-50%",
      impact: "Medium",
      savings: dynamicSaving(liveImpacts?.water, 0.35, "m³ water/year"),
      difficulty: "Easy",
      color: "cyan",
    },
  ];

  const categories = ["All", "Transport", "Food", "Energy", "Shopping", "Water"];
  const [activeCategory, setActiveCategory] = useState("All");

  const allRecommendations = liveImpacts ? recommendations : [];
  const filteredRecommendations = activeCategory === "All"
    ? allRecommendations
    : allRecommendations.filter(r => r.category === activeCategory);

  const impactColors = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  };

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/prediction"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>AI Predictions</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {savedTips.length} Saved
            </Badge>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Smart Recommendations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized tips to reduce your environmental impact based on AI analysis of your lifestyle
          </p>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">{dynamicSaving(liveImpacts?.co2, 1.0, "")}</div>
                <div className="text-emerald-100">Tons CO₂ Potential Savings</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">{recommendations.length}</div>
                <div className="text-emerald-100">Personalized Tips</div>
              </div>
              <div className="text-center">
                <Leaf className="w-12 h-12 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">{liveImpacts?.co2 ? Math.round(Math.min(80, liveImpacts.co2 * 10)) : 0}%</div>
                <div className="text-emerald-100">Reduction Possible</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={activeCategory === category 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "hover:bg-emerald-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Recommendations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredRecommendations.length > 0 ? filteredRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100 hover:shadow-xl transition-all h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${rec.color}-500 flex items-center justify-center flex-shrink-0`}>
                    <rec.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{rec.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(rec.id)}
                        className="hover:bg-transparent"
                      >
                        <BookmarkPlus
                          className={`w-5 h-5 ${
                            savedTips.includes(rec.id)
                              ? "fill-emerald-600 text-emerald-600"
                              : "text-gray-400"
                          }`}
                        />
                      </Button>
                    </div>
                    <Badge variant="outline" className="mb-3">
                      {rec.category}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{rec.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={impactColors[rec.impact as keyof typeof impactColors]}>
                    Impact: {rec.impact}
                  </Badge>
                  <Badge className={difficultyColors[rec.difficulty as keyof typeof difficultyColors]}>
                    {rec.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <TrendingDown className="w-5 h-5" />
                    <span>{rec.savings}</span>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Learn More
                  </Button>
                </div>
              </Card>
            </motion.div>
          )) : (
            <Card className="p-8 bg-white/80 backdrop-blur border-emerald-100 md:col-span-2 text-center">
              <Lightbulb className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{loading ? "Loading recommendations..." : "No live recommendations yet"}</h3>
              <p className="text-gray-600 mb-4">
                Save lifestyle input first, then this page will request AI recommendations from the API.
              </p>
              <Link to="/input">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Add Lifestyle Data</Button>
              </Link>
            </Card>
          )}
        </motion.div>

        {/* Action Plan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center border-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Action?</h2>
            <p className="text-xl text-amber-100 mb-6 max-w-2xl mx-auto">
              Start implementing these recommendations today and track your progress over time
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/input">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                  Update My Data
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
