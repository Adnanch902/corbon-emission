import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  Leaf,
  Droplet,
  Trash2,
  Zap,
  Trees,
  TrendingDown,
  ArrowLeft,
  Download,
  Share2,
  Home,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollToTop } from "../components/ScrollToTop";
import { apiRequest, getToken } from "../lib/api";
import { formatImpact, type HistoryItem } from "../lib/impactData";
import { loadLiveImpacts } from "../lib/liveImpact";

export function MultiImpactDashboard() {
  const [data, setData] = useState<any>(null);
  const [liveImpacts, setLiveImpacts] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("glipData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    const token = getToken();
    if (token) {
      loadLiveImpacts()
        .then((res) => {
          setLiveImpacts(res.impacts);
          setHistory(res.history);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const runSimulation = async () => {
    try {
      const result = await apiRequest<any>("/simulate", "POST", {
        transport: { distanceValue: Math.max(1, Number(data?.transport?.distanceValue || 10) * 0.7) },
        shopping: { sustainable: "yes" }
      });
      setSimulation(result);
    } catch (_error) {
      setSimulation(null);
    }
  };

  const impactMetrics = [
    {
      icon: Leaf,
      label: "CO₂ Emissions",
      value: formatImpact(liveImpacts?.co2),
      unit: "tons/year",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Droplet,
      label: "Water Usage",
      value: formatImpact(liveImpacts?.water),
      unit: "m³/month",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Trash2,
      label: "Plastic Waste",
      value: formatImpact(liveImpacts?.plastic),
      unit: "kg/month",
      color: "orange",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Zap,
      label: "Energy Use",
      value: formatImpact(liveImpacts?.ewaste),
      unit: "kWh/month",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Trees,
      label: "Trees Equivalent",
      value: formatImpact(liveImpacts?.forest_loss),
      unit: "trees/year",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const monthlyData = [
    { month: "Jan", co2: Number(((liveImpacts?.co2 || 0) * 1.12).toFixed(2)), water: Number(((liveImpacts?.water || 0) * 1.12).toFixed(2)), plastic: Number(((liveImpacts?.plastic || 0) * 1.12).toFixed(2)), energy: Number(((liveImpacts?.ewaste || 0) * 1.12).toFixed(2)), trees: Number(((liveImpacts?.forest_loss || 0) * 1.12).toFixed(2)) },
    { month: "Feb", co2: Number(((liveImpacts?.co2 || 0) * 1.08).toFixed(2)), water: Number(((liveImpacts?.water || 0) * 1.08).toFixed(2)), plastic: Number(((liveImpacts?.plastic || 0) * 1.08).toFixed(2)), energy: Number(((liveImpacts?.ewaste || 0) * 1.08).toFixed(2)), trees: Number(((liveImpacts?.forest_loss || 0) * 1.08).toFixed(2)) },
    { month: "Mar", co2: Number(((liveImpacts?.co2 || 0) * 1.04).toFixed(2)), water: Number(((liveImpacts?.water || 0) * 1.04).toFixed(2)), plastic: Number(((liveImpacts?.plastic || 0) * 1.04).toFixed(2)), energy: Number(((liveImpacts?.ewaste || 0) * 1.04).toFixed(2)), trees: Number(((liveImpacts?.forest_loss || 0) * 1.04).toFixed(2)) },
    { month: "Apr", co2: Number((liveImpacts?.co2 || 0).toFixed(2)), water: Number((liveImpacts?.water || 0).toFixed(2)), plastic: Number((liveImpacts?.plastic || 0).toFixed(2)), energy: Number((liveImpacts?.ewaste || 0).toFixed(2)), trees: Number((liveImpacts?.forest_loss || 0).toFixed(2)) },
  ];

  const totalImpact = (liveImpacts?.co2 || 0) + (liveImpacts?.water || 0) + (liveImpacts?.plastic || 0) + (liveImpacts?.ewaste || 0) || 1;
  const categoryBreakdown = [
    { name: "Transport", value: Math.round(((liveImpacts?.co2 || 0) / totalImpact) * 100), color: "#10b981" },
    { name: "Food", value: Math.round(((liveImpacts?.water || 0) / totalImpact) * 100), color: "#3b82f6" },
    { name: "Energy", value: Math.round(((liveImpacts?.ewaste || 0) / totalImpact) * 100), color: "#f59e0b" },
    { name: "Shopping", value: Math.round(((liveImpacts?.plastic || 0) / totalImpact) * 100), color: "#8b5cf6" },
  ];

  const radarData = [
    { category: "Transport", current: Number((liveImpacts?.co2 || 0).toFixed(2)), target: Number(((liveImpacts?.co2 || 0) * 0.8).toFixed(2)) },
    { category: "Food", current: Number((liveImpacts?.water || 0).toFixed(2)), target: Number(((liveImpacts?.water || 0) * 0.85).toFixed(2)) },
    { category: "Energy", current: Number((liveImpacts?.ewaste || 0).toFixed(2)), target: Number(((liveImpacts?.ewaste || 0) * 0.8).toFixed(2)) },
    { category: "Shopping", current: Number((liveImpacts?.plastic || 0).toFixed(2)), target: Number(((liveImpacts?.plastic || 0) * 0.75).toFixed(2)) },
    { category: "Waste", current: Number((liveImpacts?.forest_loss || 0).toFixed(2)), target: Number(((liveImpacts?.forest_loss || 0) * 0.85).toFixed(2)) },
  ];
  const hasLiveData = Boolean(liveImpacts);

  const handleExportReport = () => {
    const generatedAt = new Date();
    const report = {
      generatedAt: generatedAt.toISOString(),
      currentImpacts: liveImpacts,
      summaryCards: impactMetrics.map(({ label, value, unit }) => ({ label, value, unit })),
      monthlyData,
      categoryBreakdown,
      radarData,
      simulation,
      predictionHistory: history.map((item) => ({
        type: item.type,
        result: item.result,
        createdAt: item.createdAt,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `glip-impact-report-${generatedAt.toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            to="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={handleExportReport} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Multi-Impact Dashboard</h1>
          <p className="text-xl text-gray-600">
            Comprehensive view of your environmental footprint
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-4`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-2">{metric.unit}</div>
                <div className="text-xs font-medium mb-1">{metric.label}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span>{hasLiveData ? "Live API value" : "Awaiting live data"}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="insights" className="mb-12">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6">Monthly Impact Trends</h2>
                {hasLiveData ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData} id="trends-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      key="line-co2"
                      type="monotone"
                      dataKey="co2"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="CO₂ (tons)"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      key="line-water"
                      type="monotone"
                      dataKey="water"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Water (m³)"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      key="line-energy"
                      type="monotone"
                      dataKey="energy"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Energy (kWh)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">{loading ? "Loading impact history..." : "Submit lifestyle data to generate trend charts."}</p>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="breakdown">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6">Impact by Category</h2>
                {hasLiveData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart id="pie-chart">
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No impact breakdown available yet.</p>
                )}
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6">Category Comparison</h2>
                {hasLiveData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData} id="bar-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar key="bar-co2" dataKey="co2" fill="#10b981" name="CO₂" isAnimationActive={false} />
                    <Bar key="bar-plastic" dataKey="plastic" fill="#f59e0b" name="Plastic" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No comparison history available yet.</p>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="comparison">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6">Current vs Target Performance</h2>
                {hasLiveData ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData} id="radar-chart">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis />
                    <Radar
                      key="radar-current"
                      name="Current"
                      dataKey="current"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      isAnimationActive={false}
                    />
                    <Radar
                      key="radar-target"
                      name="Target"
                      dataKey="target"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      isAnimationActive={false}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No current impact data available yet.</p>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="insights">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <h3 className="text-2xl font-bold mb-4">🤖 AI Prediction</h3>
                <p className="text-indigo-50 text-lg mb-4">
                  Get AI-powered forecasts of your future environmental impact and plan ahead for a greener lifestyle!
                </p>
                <Link to="/prediction">
                  <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                    {hasLiveData ? "View AI Predictions" : "Add Lifestyle Data"}
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <h3 className="text-2xl font-bold mb-4">🎉 Great Progress!</h3>
                <p className="text-emerald-50 text-lg mb-4">
                  {hasLiveData ? "Your live impact profile is ready for recommendations." : "Submit your lifestyle profile to unlock live progress insights."}
                </p>
                <Link to="/recommendations">
                  <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                    View Recommendations
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <h3 className="text-2xl font-bold mb-4">💧 Water Savings</h3>
                <p className="text-blue-50 text-lg mb-4">
                  {hasLiveData ? `Latest water impact: ${formatImpact(liveImpacts?.water)} m³ proxy.` : "Water insights will appear after your first prediction."}
                </p>
                <Link to="/visualization">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    See 3D Visualization
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                <h3 className="text-2xl font-bold mb-4">⚡ Energy Impact</h3>
                <p className="text-orange-50 text-lg mb-4">
                  {hasLiveData ? `Latest e-waste impact: ${formatImpact(liveImpacts?.ewaste)} kg proxy.` : "Energy and device insights will appear after prediction."}
                </p>
                <Link to="/co2-dashboard">
                  <Button className="bg-white text-orange-600 hover:bg-orange-50">
                    CO₂ Details
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h3 className="text-2xl font-bold mb-4">🌳 Tree Impact</h3>
                <p className="text-purple-50 text-lg mb-4">
                  {hasLiveData ? `Latest forest-loss proxy: ${formatImpact(liveImpacts?.forest_loss)} ha.` : "Forest impact appears once the model has your lifestyle input."}
                </p>
                <Link to="/input">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Update Activities
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold">What-if Simulation</h2>
                <p className="text-gray-600">Reduce travel by 30% and prefer sustainable shopping.</p>
              </div>
              <Button onClick={runSimulation} className="bg-emerald-600 hover:bg-emerald-700">
                Run
              </Button>
            </div>
            {simulation?.impacts ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(simulation.impacts).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-emerald-50 p-3">
                    <div className="font-medium capitalize">{key.replace("_", " ")}</div>
                    <div className="text-xl font-bold text-emerald-700">{String(value)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Run a simulation after saving a lifestyle entry.</p>
            )}
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur border-emerald-100">
            <h2 className="text-2xl font-bold mb-4">Prediction History</h2>
            {history.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-auto">
                {history.slice(0, 6).map((item) => (
                  <div key={item._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div>
                      <div className="font-medium capitalize">{item.type}</div>
                      <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">
                      {item.result?.impacts?.co2 ?? item.result?.recommendations?.length ?? "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No saved predictions yet.</p>
            )}
          </Card>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
