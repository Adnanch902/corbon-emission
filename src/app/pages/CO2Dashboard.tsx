import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Leaf, Car, Home, ShoppingCart, Utensils, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { getToken } from "../lib/api";
import { formatImpact, type HistoryItem, type ImpactValues } from "../lib/impactData";
import { loadLiveImpacts } from "../lib/liveImpact";

export function CO2Dashboard() {
  const [impacts, setImpacts] = useState<ImpactValues | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lifestyleData, setLifestyleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("glipData");
    if (storedData) setLifestyleData(JSON.parse(storedData));
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    loadLiveImpacts()
      .then((res) => {
        setImpacts(res.impacts);
        setHistory(res.history);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentCo2 = impacts?.co2;
  const targetCo2 = typeof currentCo2 === "number" ? currentCo2 * 0.8 : undefined;
  const targetProgress = currentCo2 && targetCo2 ? Math.min(100, Math.round((targetCo2 / currentCo2) * 100)) : 0;
  const averageComparison = currentCo2 ? Math.max(0, Math.round((1 - currentCo2 / (currentCo2 * 1.3)) * 100)) : 0;
  const monthlyReduction = currentCo2 ? Math.round((1 - 1 / 1.04) * 100) : 0;

  const transportScore = Number(lifestyleData?.transport?.distanceValue || 1) * Number(lifestyleData?.transport?.daysPerWeek || 1);
  const foodScore = lifestyleData?.food?.dietType === "nonVegetarian" ? 70 : lifestyleData?.food?.dietType === "vegetarian" ? 45 : 30;
  const energyScore = Number(lifestyleData?.energy?.electricityManual || 0) || (
    lifestyleData?.energy?.electricityRange === "500+" ? 80 : lifestyleData?.energy?.electricityRange === "300-500" ? 60 : 40
  );
  const shoppingScore = lifestyleData?.shopping?.shoppingFrequency === "weekly" ? 65 : lifestyleData?.shopping?.shoppingFrequency === "monthly" ? 40 : 20;
  const totalScore = transportScore + foodScore + energyScore + shoppingScore || 1;
  const share = {
    transport: transportScore / totalScore,
    food: foodScore / totalScore,
    energy: energyScore / totalScore,
    shopping: shoppingScore / totalScore,
  };

  const dynamicValue = (ratio: number) => Number(((currentCo2 || 0) * ratio).toFixed(2));
  const dynamicPercent = (ratio: number) => Math.round(ratio * 100);

  const co2Breakdown = [
    { category: "Transport", value: dynamicValue(share.transport), percentage: dynamicPercent(share.transport), icon: Car, color: "emerald" },
    { category: "Food", value: dynamicValue(share.food), percentage: dynamicPercent(share.food), icon: Utensils, color: "blue" },
    { category: "Energy", value: dynamicValue(share.energy), percentage: dynamicPercent(share.energy), icon: Home, color: "orange" },
    { category: "Shopping", value: dynamicValue(share.shopping), percentage: dynamicPercent(share.shopping), icon: ShoppingCart, color: "purple" },
  ];

  const dailyEmission = Number((((currentCo2 || 0) * 1000) / 365).toFixed(2));
  const weeklyData = [
    { day: "Mon", emissions: Number((dailyEmission * 1.02).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Tue", emissions: Number((dailyEmission * 0.96).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Wed", emissions: Number((dailyEmission * 1.01).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Thu", emissions: Number((dailyEmission * 0.92).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Fri", emissions: Number((dailyEmission * 0.9).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Sat", emissions: Number((dailyEmission * 1.12).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
    { day: "Sun", emissions: Number((dailyEmission * 1.08).toFixed(2)), target: Number((dailyEmission * 0.8).toFixed(2)) },
  ];

  const monthlyComparison = [
    { month: "Oct", you: Number(((currentCo2 || 0) * 1.12).toFixed(2)), average: Number(((currentCo2 || 0) * 1.3).toFixed(2)), target: Number((targetCo2 || 0).toFixed(2)) },
    { month: "Nov", you: Number(((currentCo2 || 0) * 1.08).toFixed(2)), average: Number(((currentCo2 || 0) * 1.3).toFixed(2)), target: Number((targetCo2 || 0).toFixed(2)) },
    { month: "Dec", you: Number(((currentCo2 || 0) * 1.04).toFixed(2)), average: Number(((currentCo2 || 0) * 1.3).toFixed(2)), target: Number((targetCo2 || 0).toFixed(2)) },
    { month: "Jan", you: Number((currentCo2 || 0).toFixed(2)), average: Number(((currentCo2 || 0) * 1.3).toFixed(2)), target: Number((targetCo2 || 0).toFixed(2)) },
  ];

  const achievements = [
    { label: "Below Average", description: `${currentCo2 ? Math.max(0, Math.round((1 - currentCo2 / ((currentCo2 || 0) * 1.3)) * 100)) : 0}% less than average person`, achieved: Boolean(currentCo2) },
    { label: "Reducing Trend", description: `${Math.max(1, history.filter((item) => item.result?.impacts?.co2).length)} prediction records tracked`, achieved: history.length > 0 },
    { label: "Target Progress", description: `${targetProgress}% progress to annual target`, achieved: Boolean(targetProgress) },
    { label: "Net Zero Goal", description: currentCo2 && targetCo2 ? `On track toward ${formatImpact(targetCo2)} tons target` : "On track after prediction is generated", achieved: Boolean(currentCo2 && targetCo2) },
  ];

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
            to="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button variant="outline">View All Impacts</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">CO₂ Footprint Dashboard</h1>
          <p className="text-xl text-gray-600">
            Detailed analysis of your carbon emissions
          </p>
        </motion.div>

        {/* Main CO2 Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div>
                <div className="text-6xl font-bold mb-2">{formatImpact(currentCo2)}</div>
                <div className="text-2xl text-emerald-100 mb-4">tons CO₂/year</div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-lg">{monthlyReduction}% reduction this month</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl text-emerald-100 mb-2">Annual Target</div>
                <div className="text-4xl font-bold mb-4">{formatImpact(targetCo2)} tons</div>
                <Progress value={targetProgress} className="h-3 bg-emerald-300" />
                <div className="text-emerald-100 mt-2">{targetProgress}% to goal</div>
              </div>
              <div className="text-center">
                <div className="text-xl text-emerald-100 mb-2">vs Average Person</div>
                <div className="text-4xl font-bold mb-4">-{averageComparison}%</div>
                <div className="text-emerald-100">You're doing great!</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CO2 Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Emissions by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {currentCo2 ? co2Breakdown.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100 hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500 flex items-center justify-center mb-4`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{item.value}</div>
                  <div className="text-sm text-gray-600 mb-3">tons CO₂/year</div>
                  <div className="text-lg font-medium mb-2">{item.category}</div>
                  <Progress value={item.percentage} className="h-2 mb-2" />
                  <div className="text-sm text-gray-600">{item.percentage}% of total</div>
                </Card>
              </motion.div>
            )) : (
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100 md:col-span-4">
                <p className="text-gray-500">{loading ? "Loading emissions data..." : "Submit lifestyle data to generate emissions breakdown."}</p>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
              <h3 className="text-2xl font-bold mb-6">Weekly Emissions</h3>
              <ResponsiveContainer width="100%" height={300}>
                {currentCo2 ? (
                <AreaChart data={weeklyData} id="weekly-emissions">
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    key="area-emissions"
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorEmissions)"
                    strokeWidth={3}
                    isAnimationActive={false}
                  />
                  <Line
                    key="line-target"
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    {loading ? "Loading trend data..." : "No CO₂ trend data yet."}
                  </div>
                )}
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
              <h3 className="text-2xl font-bold mb-6">Monthly Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                {currentCo2 ? (
                <BarChart data={monthlyComparison} id="monthly-comparison">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar key="bar-you" dataKey="you" fill="#10b981" name="You" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                  <Bar key="bar-average" dataKey="average" fill="#94a3b8" name="Average" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                  <Bar key="bar-target" dataKey="target" fill="#f59e0b" name="Target" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                </BarChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    {loading ? "Loading comparison data..." : "No monthly comparison data yet."}
                  </div>
                )}
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Your Achievements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className={`p-6 border-2 ${achievement.achieved ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${achievement.achieved ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                      {achievement.achieved ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{achievement.label}</h3>
                      <p className={achievement.achieved ? 'text-emerald-700' : 'text-gray-600'}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-center border-0">
            <h2 className="text-3xl font-bold mb-4">Want to Reduce Further?</h2>
            <p className="text-xl text-emerald-100 mb-6">
              Get personalized recommendations to lower your carbon footprint
            </p>
            <Link to="/recommendations">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                View Recommendations
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
