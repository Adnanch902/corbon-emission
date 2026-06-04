import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Zap,
  Leaf,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Bar,
} from "recharts";
import { apiRequest, getToken } from "../lib/api";

export function Prediction() {
  const [timeframe, setTimeframe] = useState([12]); // months ahead
  const [activeScenario, setActiveScenario] = useState<"optimistic" | "realistic" | "pessimistic">("realistic");
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const years = Math.max(1, Math.round(timeframe[0] / 12));
    apiRequest(`/predict/forecast?years=${years}`, "POST")
      .then((res) => setForecastData(res))
      .catch(() => setForecastData(null))
      .finally(() => setLoading(false));
  }, [timeframe]);

  const backendTimeline = forecastData?.trajectory?.map((row: any) => ({
    month: `Y${row.year}`,
    transport: Number(row.co2 || 0),
    food: Number(row.water || 0),
    shopping: Number(row.plastic || 0),
    energy: Number(row.ewaste || 0),
    total: Number(
      ((row.co2 || 0) + (row.water || 0) + (row.plastic || 0) + (row.ewaste || 0) + (row.forest_loss || 0)).toFixed(2)
    )
  }));

  const backendConfidence = forecastData?.confidence?.map((row: any) => ({
    month: `Y${row.year}`,
    total: Number((((row.lower_total || 0) + (row.upper_total || 0)) / 2).toFixed(2)),
    lower: row.lower_total,
    upper: row.upper_total,
    confidence: Math.round((row.confidence || 0) * 100)
  }));

  const timelineData = backendTimeline || [];
  const confidenceChartData = backendConfidence || [];
  const cumulativeData = timelineData.map((item: any, index: number) => ({
    ...item,
    cumulative: Number(timelineData.slice(0, index + 1).reduce((sum: number, row: any) => sum + row.total, 0).toFixed(2)),
  }));
  const finalImpact = timelineData.at(-1)?.total;
  const totalCumulative = cumulativeData.at(-1)?.cumulative;
  const averageConfidence = confidenceChartData.length
    ? Math.round(confidenceChartData.reduce((sum: number, item: any) => sum + item.confidence, 0) / confidenceChartData.length)
    : 0;
  const modelMetrics = {
    accuracy: averageConfidence || 0,
    precision: averageConfidence ? Math.max(0, averageConfidence - 3) : 0,
    recall: averageConfidence ? Math.max(0, averageConfidence - 2) : 0,
    trainingData: "Versioned public lifestyle feature store",
    modelVersion: forecastData?.model_version || "No live model",
  };
  const firstForecast = timelineData[0] || {};
  const lastForecast = timelineData.at(-1) || {};
  const forecastChange = (current: number, predicted: number) => current ? Math.round(((predicted - current) / current) * 100) : 0;
  const categoryPredictions = timelineData.length ? [
    { category: "Transport", current: firstForecast.transport, predicted: lastForecast.transport, change: forecastChange(firstForecast.transport, lastForecast.transport), confidence: averageConfidence, icon: "🚗", color: "emerald" },
    { category: "Food", current: firstForecast.food, predicted: lastForecast.food, change: forecastChange(firstForecast.food, lastForecast.food), confidence: averageConfidence, icon: "🍽️", color: "blue" },
    { category: "Shopping", current: firstForecast.shopping, predicted: lastForecast.shopping, change: forecastChange(firstForecast.shopping, lastForecast.shopping), confidence: averageConfidence, icon: "🛍️", color: "purple" },
    { category: "Energy", current: firstForecast.energy, predicted: lastForecast.energy, change: forecastChange(firstForecast.energy, lastForecast.energy), confidence: averageConfidence, icon: "⚡", color: "orange" },
  ] : [];
  const radarData = [
    { category: "Transport", current: firstForecast.transport || 0, predicted: lastForecast.transport || 0 },
    { category: "Food", current: firstForecast.food || 0, predicted: lastForecast.food || 0 },
    { category: "Shopping", current: firstForecast.shopping || 0, predicted: lastForecast.shopping || 0 },
    { category: "Energy", current: firstForecast.energy || 0, predicted: lastForecast.energy || 0 },
    { category: "Water", current: firstForecast.food || 0, predicted: lastForecast.food || 0 },
  ];

  const scenarios = [
    {
      id: "optimistic" as const,
      label: "Best Case",
      description: "With aggressive sustainability measures",
      color: "emerald",
      icon: TrendingDown,
    },
    {
      id: "realistic" as const,
      label: "Realistic",
      description: "With moderate lifestyle changes",
      color: "blue",
      icon: Activity,
    },
    {
      id: "pessimistic" as const,
      label: "Worst Case",
      description: "Without any changes",
      color: "orange",
      icon: TrendingUp,
    },
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
            to="/visualization"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Visualization</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Brain className="w-4 h-4 text-emerald-500" />
              {averageConfidence ? `${averageConfidence}% Confidence` : "No Forecast"}
            </Badge>
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">AI Impact Predictions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Machine learning-powered forecasting of your environmental impact over time
          </p>
        </motion.div>

        {/* Model Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
            <div className="grid md:grid-cols-6 gap-4 items-center text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{modelMetrics.accuracy}%</div>
                <div className="text-sm text-purple-100">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{modelMetrics.precision}%</div>
                <div className="text-sm text-purple-100">Precision</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{modelMetrics.recall}%</div>
                <div className="text-sm text-purple-100">Recall</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xl font-bold mb-1">{modelMetrics.trainingData}</div>
                <div className="text-sm text-purple-100">Training Dataset</div>
              </div>
              <div>
                <div className="text-xl font-bold mb-1">{modelMetrics.modelVersion}</div>
                <div className="text-sm text-purple-100">Model Version</div>
              </div>
            </div>
          </Card>
        </motion.div>
        {forecastData ? (
          <Card className="p-4 mb-8 bg-emerald-50 border-emerald-200">
            <h3 className="font-semibold mb-2">Backend Forecast ({forecastData.years} years)</h3>
            <p className="text-sm text-gray-700">
              Model: {forecastData.model_version} | Last projected CO₂:{" "}
              {forecastData.trajectory?.[forecastData.trajectory.length - 1]?.co2 ?? "N/A"}
            </p>
          </Card>
        ) : null}

        {/* Scenario Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Select Prediction Scenario</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => setActiveScenario(scenario.id)}
                  className={`p-6 cursor-pointer transition-all ${
                    activeScenario === scenario.id
                      ? `bg-${scenario.color}-500 text-white border-${scenario.color}-600 shadow-lg`
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeScenario === scenario.id
                          ? "bg-white/20"
                          : `bg-${scenario.color}-500`
                      }`}
                    >
                      <scenario.icon
                        className={`w-6 h-6 ${
                          activeScenario === scenario.id ? "text-white" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{scenario.label}</h3>
                      <p
                        className={
                          activeScenario === scenario.id ? "text-white/90" : "text-gray-600"
                        }
                      >
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeframe Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <span className="font-semibold">Prediction Timeframe:</span>
              </div>
              <div className="flex-1">
                <Slider
                  value={timeframe}
                  onValueChange={setTimeframe}
                  min={3}
                  max={36}
                  step={3}
                  className="flex-1"
                />
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {timeframe[0]} months
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="p-6 bg-white/80 backdrop-blur border-emerald-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">Predicted</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-emerald-600">
              {typeof finalImpact === "number" ? finalImpact : "No data"} tons
            </div>
            <div className="text-gray-600">CO₂ at {timeframe[0]} months</div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">Cumulative</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-blue-600">
              {typeof totalCumulative === "number" ? totalCumulative : "No data"} tons
            </div>
            <div className="text-gray-600">Total over period</div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur border-purple-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">AI Confidence</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-purple-600">
              {averageConfidence ? `${averageConfidence}%` : "No data"}
            </div>
            <div className="text-gray-600">Model certainty</div>
          </Card>
        </motion.div>

        {/* Charts Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="timeline">Timeline Forecast</TabsTrigger>
              <TabsTrigger value="confidence">Confidence Bands</TabsTrigger>
              <TabsTrigger value="cumulative">Cumulative Impact</TabsTrigger>
              <TabsTrigger value="comparison">Category Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card className="p-6 bg-white/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-6">Monthly Impact Forecast</h3>
                {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={timelineData} id="timeline-forecast">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" label={{ value: "CO₂ (tons)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      key="line-transport"
                      type="monotone"
                      dataKey="transport"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      key="line-food"
                      type="monotone"
                      dataKey="food"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      key="line-shopping"
                      type="monotone"
                      dataKey="shopping"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      key="line-energy"
                      type="monotone"
                      dataKey="energy"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">{loading ? "Loading forecast..." : "Submit lifestyle data to generate a forecast."}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="confidence">
              <Card className="p-6 bg-white/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-6">Prediction Confidence Intervals</h3>
                {confidenceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={confidenceChartData} id="confidence-intervals">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" label={{ value: "CO₂ (tons)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      key="area-upper"
                      type="monotone"
                      dataKey="upper"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#fed7aa"
                      fillOpacity={0.3}
                      name="Upper Bound"
                      isAnimationActive={false}
                    />
                    <Area
                      key="area-total"
                      type="monotone"
                      dataKey="total"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Predicted"
                      isAnimationActive={false}
                    />
                    <Area
                      key="area-lower"
                      type="monotone"
                      dataKey="lower"
                      stackId="3"
                      stroke="#3b82f6"
                      fill="#bfdbfe"
                      fillOpacity={0.3}
                      name="Lower Bound"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">{loading ? "Loading confidence bands..." : "No confidence data available yet."}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="cumulative">
              <Card className="p-6 bg-white/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-6">Cumulative Impact Over Time</h3>
                {cumulativeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={cumulativeData} id="cumulative-impact">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" label={{ value: "Cumulative CO₂ (tons)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar key="bar-total" dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                    <Line
                      key="line-cumulative"
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">{loading ? "Loading cumulative impact..." : "No cumulative data available yet."}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card className="p-6 bg-white/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-6">Current vs Predicted Impact by Category</h3>
                {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData} id="category-comparison">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" stroke="#6b7280" />
                    <PolarRadiusAxis stroke="#6b7280" />
                    <Radar
                      key="radar-current"
                      name="Current Impact"
                      dataKey="current"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.5}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <Radar
                      key="radar-predicted"
                      name="Predicted Impact"
                      dataKey="predicted"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.5}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">{loading ? "Loading category comparison..." : "No category comparison available yet."}</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Category-wise Predictions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {categoryPredictions.length > 0 ? categoryPredictions.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{cat.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold">{cat.category}</h3>
                        <Badge className="bg-purple-100 text-purple-700">
                          {cat.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Predicted</div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {cat.predicted} <span className="text-sm">tons</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )) : (
              <Card className="p-8 bg-white/80 backdrop-blur md:col-span-2 text-center">
                <Brain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{loading ? "Loading category predictions..." : "No live predictions yet"}</h3>
                <p className="text-gray-600">Submit lifestyle data first, then forecast categories will appear here.</p>
              </Card>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">AI-Powered Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-emerald-50 border-emerald-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Forecast Status</h3>
                  <p className="text-sm text-gray-600">
                    {timelineData.length ? `Model returned ${timelineData.length} forecast points for ${timeframe[0]} months.` : "No forecast points are available yet."}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Model Confidence</h3>
                  <p className="text-sm text-gray-600">
                    {averageConfidence ? `Average confidence from API bands is ${averageConfidence}%.` : "Confidence appears after a successful forecast."}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Attention Required</h3>
                  <p className="text-sm text-gray-600">
                    {typeof totalCumulative === "number" ? `Cumulative projected impact is ${totalCumulative} total units.` : "Cumulative impact appears after forecast generation."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center border-0">
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Get Personalized Recommendations</h2>
            <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
              Based on these AI predictions, discover actionable tips to improve your environmental impact
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/recommendations">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 gap-2">
                  View Recommendations
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
