import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { 
  Car, ShoppingBag, Utensils, Zap, Leaf, ArrowLeft, ArrowRight, 
  Bike, Bus, Train, Footprints, Fuel, Battery, Droplets, Plug,
  Sun, Home, Users, Salad, Beef, Milk, Trash2, Package, 
  Shirt, Laptop, ShoppingCart, Smartphone, Globe, Recycle,
  Sparkles, CookingPot, Apple, Carrot, Wine
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { SuccessToast } from "../components/SuccessToast";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { apiRequest, getToken } from "../lib/api";

export function InputForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("transport");
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    // Transport
    transport: {
      travelMethod: "car" as "car" | "bike" | "bus" | "train" | "walking",
      fuelType: "petrol" as "petrol" | "diesel" | "electric" | "hybrid",
      distanceValue: 10,
      distanceUnit: "perDay" as "perDay" | "perWeek",
      daysPerWeek: 5
    },
    // Energy
    energy: {
      electricityInputMethod: "range" as "manual" | "range",
      electricityManual: 200,
      electricityRange: "100-300" as "0-100" | "100-300" | "300-500" | "500+",
      energySource: "grid" as "grid" | "solar" | "mixed",
      householdSize: "3-5" as "1-2" | "3-5" | "6+"
    },
    // Food
    food: {
      dietType: "vegetarian" as "vegetarian" | "nonVegetarian" | "vegan",
      milkUnit: "glass" as "glass" | "pack250" | "pack500" | "bottle1L" | "carton",
      milkQuantity: 2,
      milkFrequency: "perDay" as "perDay" | "perWeek",
      meatFrequency: "never" as "never" | "1-2week" | "3-5week" | "daily",
      meatPortion: "medium" as "small" | "medium" | "large",
      dairyLevel: "medium" as "low" | "medium" | "high",
      wasteLevel: "low" as "low" | "medium" | "high",
      wasteType: "cooked" as "cooked" | "raw" | "expired"
    },
    // Shopping
    shopping: {
      monthlyBudget: "medium" as "low" | "medium" | "high",
      clothingUnit: "item" as "item" | "pair" | "bulk",
      clothingQuantity: 2,
      clothingFrequency: "monthly" as "monthly" | "quarterly",
      electronicsFrequency: "yearly" as "yearly" | "2-3years",
      shoppingFrequency: "monthly" as "weekly" | "monthly" | "occasionally",
      sustainable: "no" as "yes" | "no"
    },
    // Gadgets
    gadgets: {
      phones: 1,
      laptops: 1,
      tablets: 0,
      usageHours: 5,
      deviceLifecycle: "2-3years" as "1year" | "2-3years" | "4+years",
      internetUsage: "medium" as "low" | "medium" | "high"
    }
  });

  const handleSubmit = async () => {
    localStorage.setItem("glipData", JSON.stringify(formData));
    const token = getToken();
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await apiRequest("/lifestyle/entry", "POST", formData);
      await apiRequest("/predict/current", "POST");
      setShowToast(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (_error) {
      setShowToast(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  const categories = [
    { id: "transport", label: "Transport", icon: Car },
    { id: "food", label: "Food", icon: Utensils },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "energy", label: "Energy", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-10 h-10 text-emerald-600" />
            <h1 className="text-4xl font-bold">Lifestyle Impact Calculator</h1>
          </div>
          <p className="text-xl text-gray-600">
            Tell us about your daily activities with our easy visual inputs
          </p>
        </motion.div>

        {/* Category Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8 flex-wrap"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                activeTab === category.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-emerald-50"
              }`}
            >
              <category.icon className="w-8 h-8" />
              <span className="text-sm font-medium">{category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Form Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            {/* ===== TRANSPORT TAB ===== */}
            <TabsContent value="transport">
              <Card className="p-8 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Car className="w-6 h-6 text-emerald-600" />
                  Transportation
                </h2>
                
                <div className="space-y-8">
                  {/* Travel Method */}
                  <div>
                    <Label className="text-lg mb-4 block">How do you travel?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { value: "car", icon: Car, label: "Car" },
                        { value: "bike", icon: Bike, label: "Bike" },
                        { value: "bus", icon: Bus, label: "Bus" },
                        { value: "train", icon: Train, label: "Train" },
                        { value: "walking", icon: Footprints, label: "Walking" }
                      ].map((method) => (
                        <motion.button
                          key={method.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            transport: { ...formData.transport, travelMethod: method.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                            formData.transport.travelMethod === method.value
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-200"
                          }`}
                        >
                          <method.icon className="w-10 h-10" />
                          <span className="font-medium">{method.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Details - Only show for Car/Bike */}
                  {(formData.transport.travelMethod === "car" || formData.transport.travelMethod === "bike") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label className="text-lg mb-4 block flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-emerald-600" />
                        Fuel Type
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: "petrol", icon: Fuel, label: "Petrol" },
                          { value: "diesel", icon: Fuel, label: "Diesel" },
                          { value: "electric", icon: Battery, label: "Electric" },
                          { value: "hybrid", icon: Plug, label: "Hybrid" }
                        ].map((fuel) => (
                          <motion.button
                            key={fuel.value}
                            onClick={() => setFormData({ 
                              ...formData, 
                              transport: { ...formData.transport, fuelType: fuel.value as any } 
                            })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                              formData.transport.fuelType === fuel.value
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                            }`}
                          >
                            <fuel.icon className="w-8 h-8" />
                            <span className="text-sm font-medium">{fuel.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Distance Input */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg mb-4 block">Distance</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={formData.transport.distanceValue}
                          onChange={(e) => setFormData({
                            ...formData,
                            transport: { ...formData.transport, distanceValue: parseInt(e.target.value) || 0 }
                          })}
                          className="text-2xl font-bold text-center h-16"
                        />
                        <span className="text-xl font-medium text-gray-600">km</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-lg mb-4 block">Frequency</Label>
                      <Select 
                        value={formData.transport.distanceUnit}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          transport: { ...formData.transport, distanceUnit: value as any }
                        })}
                      >
                        <SelectTrigger className="h-16 text-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perDay">Per Day</SelectItem>
                          <SelectItem value="perWeek">Per Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Days Per Week */}
                  <div>
                    <Label className="text-lg mb-4 block">Days traveled per week</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[formData.transport.daysPerWeek]}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          transport: { ...formData.transport, daysPerWeek: value[0] }
                        })}
                        max={7}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-3xl font-bold text-emerald-600 w-16 text-center">
                        {formData.transport.daysPerWeek}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* ===== FOOD TAB ===== */}
            <TabsContent value="food">
              <Card className="p-8 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-emerald-600" />
                  Food & Diet
                </h2>
                
                <div className="space-y-8">
                  {/* Diet Type */}
                  <div>
                    <Label className="text-lg mb-4 block">Diet Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "vegetarian", icon: Salad, label: "Vegetarian", color: "from-green-500 to-emerald-500" },
                        { value: "nonVegetarian", icon: Beef, label: "Non-Vegetarian", color: "from-red-500 to-orange-500" },
                        { value: "vegan", icon: Apple, label: "Vegan", color: "from-lime-500 to-green-600" }
                      ].map((diet) => (
                        <motion.button
                          key={diet.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            food: { ...formData.food, dietType: diet.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all relative overflow-hidden ${
                            formData.food.dietType === diet.value
                              ? "text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          {formData.food.dietType === diet.value && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${diet.color}`} />
                          )}
                          <diet.icon className="w-12 h-12 relative z-10" />
                          <span className="font-medium relative z-10">{diet.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Milk Consumption */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Milk className="w-6 h-6 text-blue-600" />
                      <Label className="text-lg">Milk Consumption</Label>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Unit Type</Label>
                        <Select 
                          value={formData.food.milkUnit}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            food: { ...formData.food, milkUnit: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="glass">🥛 Glass (250ml)</SelectItem>
                            <SelectItem value="pack250">📦 Pack (250ml)</SelectItem>
                            <SelectItem value="pack500">📦 Pack (500ml)</SelectItem>
                            <SelectItem value="bottle1L">🍼 Bottle (1L)</SelectItem>
                            <SelectItem value="carton">📦 Carton (12 packs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Quantity</Label>
                        <Input
                          type="number"
                          value={formData.food.milkQuantity}
                          onChange={(e) => setFormData({
                            ...formData,
                            food: { ...formData.food, milkQuantity: parseInt(e.target.value) || 0 }
                          })}
                          className="text-xl font-bold text-center bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Frequency</Label>
                        <Select 
                          value={formData.food.milkFrequency}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            food: { ...formData.food, milkFrequency: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="perDay">Per Day</SelectItem>
                            <SelectItem value="perWeek">Per Week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Meat Consumption */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Beef className="w-6 h-6 text-orange-600" />
                      <Label className="text-lg">Meat Consumption</Label>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Frequency</Label>
                        <Select 
                          value={formData.food.meatFrequency}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            food: { ...formData.food, meatFrequency: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">🚫 Never</SelectItem>
                            <SelectItem value="1-2week">🍗 1-2 times/week</SelectItem>
                            <SelectItem value="3-5week">🍖 3-5 times/week</SelectItem>
                            <SelectItem value="daily">🥩 Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Portion Size</Label>
                        <Select 
                          value={formData.food.meatPortion}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            food: { ...formData.food, meatPortion: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (1 piece)</SelectItem>
                            <SelectItem value="medium">Medium (1 plate)</SelectItem>
                            <SelectItem value="large">Large (multiple servings)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Dairy & Food Waste */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg mb-4 block flex items-center gap-2">
                        <Wine className="w-5 h-5 text-emerald-600" />
                        Dairy Consumption
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["low", "medium", "high"].map((level) => (
                          <motion.button
                            key={level}
                            onClick={() => setFormData({ 
                              ...formData, 
                              food: { ...formData.food, dairyLevel: level as any } 
                            })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl capitalize transition-all ${
                              formData.food.dairyLevel === level
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                            }`}
                          >
                            {level}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-lg mb-4 block flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        Food Waste Level
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["low", "medium", "high"].map((level) => (
                          <motion.button
                            key={level}
                            onClick={() => setFormData({ 
                              ...formData, 
                              food: { ...formData.food, wasteLevel: level as any } 
                            })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl capitalize transition-all ${
                              formData.food.wasteLevel === level
                                ? "bg-red-600 text-white shadow-lg"
                                : "bg-gray-50 text-gray-700 hover:bg-red-50"
                            }`}
                          >
                            {level}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Waste Type */}
                  <div>
                    <Label className="text-lg mb-4 block">Waste Type</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "cooked", icon: CookingPot, label: "Cooked Food" },
                        { value: "raw", icon: Carrot, label: "Raw Food" },
                        { value: "expired", icon: Trash2, label: "Expired Items" }
                      ].map((waste) => (
                        <motion.button
                          key={waste.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            food: { ...formData.food, wasteType: waste.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                            formData.food.wasteType === waste.value
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <waste.icon className="w-8 h-8" />
                          <span className="text-sm font-medium">{waste.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* ===== SHOPPING TAB ===== */}
            <TabsContent value="shopping">
              <Card className="p-8 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  Shopping Habits
                </h2>
                
                <div className="space-y-8">
                  {/* Monthly Budget */}
                  <div>
                    <Label className="text-lg mb-4 block">Monthly Budget Range</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "low", label: "Low (<10k PKR)", icon: "💰", color: "from-green-400 to-emerald-500" },
                        { value: "medium", label: "Medium (10k-50k)", icon: "💵", color: "from-yellow-400 to-orange-500" },
                        { value: "high", label: "High (50k+)", icon: "💸", color: "from-purple-500 to-pink-500" }
                      ].map((budget) => (
                        <motion.button
                          key={budget.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            shopping: { ...formData.shopping, monthlyBudget: budget.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all relative overflow-hidden ${
                            formData.shopping.monthlyBudget === budget.value
                              ? "text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          {formData.shopping.monthlyBudget === budget.value && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${budget.color}`} />
                          )}
                          <div className="text-4xl relative z-10">{budget.icon}</div>
                          <span className="font-medium relative z-10 text-center">{budget.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Clothing */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Shirt className="w-6 h-6 text-purple-600" />
                      <Label className="text-lg">Clothing Purchase</Label>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Unit Type</Label>
                        <Select 
                          value={formData.shopping.clothingUnit}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            shopping: { ...formData.shopping, clothingUnit: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="item">👕 1 Item (shirt/pant)</SelectItem>
                            <SelectItem value="pair">👟 1 Pair (shoes)</SelectItem>
                            <SelectItem value="bulk">👔 Bulk (3-5 items)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Quantity</Label>
                        <Input
                          type="number"
                          value={formData.shopping.clothingQuantity}
                          onChange={(e) => setFormData({
                            ...formData,
                            shopping: { ...formData.shopping, clothingQuantity: parseInt(e.target.value) || 0 }
                          })}
                          className="text-xl font-bold text-center bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Frequency</Label>
                        <Select 
                          value={formData.shopping.clothingFrequency}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            shopping: { ...formData.shopping, clothingFrequency: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Electronics & Shopping Frequency */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg mb-4 block flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-emerald-600" />
                        Electronics Purchase
                      </Label>
                      <Select 
                        value={formData.shopping.electronicsFrequency}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          shopping: { ...formData.shopping, electronicsFrequency: value as any }
                        })}
                      >
                        <SelectTrigger className="h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">📱 Yearly</SelectItem>
                          <SelectItem value="2-3years">💻 Every 2-3 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-lg mb-4 block flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                        Shopping Frequency
                      </Label>
                      <Select 
                        value={formData.shopping.shoppingFrequency}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          shopping: { ...formData.shopping, shoppingFrequency: value as any }
                        })}
                      >
                        <SelectTrigger className="h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">🛒 Weekly</SelectItem>
                          <SelectItem value="monthly">📅 Monthly</SelectItem>
                          <SelectItem value="occasionally">⏰ Occasionally</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sustainability Preference */}
                  <div>
                    <Label className="text-lg mb-4 block flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-emerald-600" />
                      Do you prefer eco-friendly products?
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "yes", label: "Yes, I prefer sustainable", icon: Recycle, color: "bg-emerald-600" },
                        { value: "no", label: "Not particularly", icon: ShoppingBag, color: "bg-gray-600" }
                      ].map((pref) => (
                        <motion.button
                          key={pref.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            shopping: { ...formData.shopping, sustainable: pref.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
                            formData.shopping.sustainable === pref.value
                              ? `${pref.color} text-white shadow-lg`
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <pref.icon className="w-6 h-6" />
                          <span className="font-medium">{pref.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* ===== ENERGY TAB ===== */}
            <TabsContent value="energy">
              <Card className="p-8 bg-white/80 backdrop-blur border-emerald-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-emerald-600" />
                  Energy Usage
                </h2>
                
                <div className="space-y-8">
                  {/* Electricity Input Method */}
                  <div>
                    <Label className="text-lg mb-4 block">Electricity Usage</Label>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {[
                        { value: "manual", label: "Enter Exact kWh", icon: "📊" },
                        { value: "range", label: "Select Range", icon: "📏" }
                      ].map((method) => (
                        <motion.button
                          key={method.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            energy: { ...formData.energy, electricityInputMethod: method.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                            formData.energy.electricityInputMethod === method.value
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-medium">{method.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {formData.energy.electricityInputMethod === "manual" ? (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-100">
                        <Label className="text-sm mb-2 block text-gray-600">Monthly kWh</Label>
                        <Input
                          type="number"
                          value={formData.energy.electricityManual}
                          onChange={(e) => setFormData({
                            ...formData,
                            energy: { ...formData.energy, electricityManual: parseInt(e.target.value) || 0 }
                          })}
                          className="text-3xl font-bold text-center h-20 bg-white"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: "0-100", label: "0-100 units", icon: "🟢" },
                          { value: "100-300", label: "100-300 units", icon: "🟡" },
                          { value: "300-500", label: "300-500 units", icon: "🟠" },
                          { value: "500+", label: "500+ units", icon: "🔴" }
                        ].map((range) => (
                          <motion.button
                            key={range.value}
                            onClick={() => setFormData({ 
                              ...formData, 
                              energy: { ...formData.energy, electricityRange: range.value as any } 
                            })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                              formData.energy.electricityRange === range.value
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                            }`}
                          >
                            <span className="text-3xl">{range.icon}</span>
                            <span className="text-sm font-medium text-center">{range.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Energy Source */}
                  <div>
                    <Label className="text-lg mb-4 block flex items-center gap-2">
                      <Sun className="w-5 h-5 text-yellow-600" />
                      Energy Source
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "grid", label: "Full Grid", icon: Zap, color: "from-gray-500 to-slate-600" },
                        { value: "solar", label: "Full Solar", icon: Sun, color: "from-yellow-400 to-orange-500" },
                        { value: "mixed", label: "Mixed", icon: Plug, color: "from-emerald-500 to-teal-600" }
                      ].map((source) => (
                        <motion.button
                          key={source.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            energy: { ...formData.energy, energySource: source.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all relative overflow-hidden ${
                            formData.energy.energySource === source.value
                              ? "text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          {formData.energy.energySource === source.value && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${source.color}`} />
                          )}
                          <source.icon className="w-10 h-10 relative z-10" />
                          <span className="font-medium relative z-10">{source.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Household Size */}
                  <div>
                    <Label className="text-lg mb-4 block flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Household Size
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "1-2", label: "1-2 persons", icon: "👤" },
                        { value: "3-5", label: "3-5 persons", icon: "👨‍👩‍👧" },
                        { value: "6+", label: "6+ persons", icon: "👨‍👩‍👧‍👦" }
                      ].map((size) => (
                        <motion.button
                          key={size.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            energy: { ...formData.energy, householdSize: size.value as any } 
                          })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                            formData.energy.householdSize === size.value
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-gray-50 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <span className="text-4xl">{size.icon}</span>
                          <span className="font-medium">{size.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Gadgets Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                      <Label className="text-lg">Gadgets & Devices</Label>
                    </div>
                    
                    {/* Device Count */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" /> Phones
                        </Label>
                        <Input
                          type="number"
                          value={formData.gadgets.phones}
                          onChange={(e) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, phones: parseInt(e.target.value) || 0 }
                          })}
                          className="text-xl font-bold text-center bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600 flex items-center gap-2">
                          <Laptop className="w-4 h-4" /> Laptops
                        </Label>
                        <Input
                          type="number"
                          value={formData.gadgets.laptops}
                          onChange={(e) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, laptops: parseInt(e.target.value) || 0 }
                          })}
                          className="text-xl font-bold text-center bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">📱 Tablets</Label>
                        <Input
                          type="number"
                          value={formData.gadgets.tablets}
                          onChange={(e) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, tablets: parseInt(e.target.value) || 0 }
                          })}
                          className="text-xl font-bold text-center bg-white"
                        />
                      </div>
                    </div>

                    {/* Usage Hours */}
                    <div className="mb-6">
                      <Label className="text-sm mb-2 block text-gray-600">Daily Usage (hours)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[formData.gadgets.usageHours]}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, usageHours: value[0] }
                          })}
                          max={24}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-2xl font-bold text-blue-600 w-16 text-center">
                          {formData.gadgets.usageHours}h
                        </span>
                      </div>
                    </div>

                    {/* Device Lifecycle & Internet Usage */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm mb-2 block text-gray-600">Replace devices every:</Label>
                        <Select 
                          value={formData.gadgets.deviceLifecycle}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, deviceLifecycle: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1year">1 year</SelectItem>
                            <SelectItem value="2-3years">2-3 years</SelectItem>
                            <SelectItem value="4+years">4+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm mb-2 block text-gray-600 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Internet Usage
                        </Label>
                        <Select 
                          value={formData.gadgets.internetUsage}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            gadgets: { ...formData.gadgets, internetUsage: value as any }
                          })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (social only)</SelectItem>
                            <SelectItem value="medium">Medium (videos + study)</SelectItem>
                            <SelectItem value="high">High (gaming/streaming)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-between items-center gap-4"
        >
          <Button
            onClick={() => {
              const tabs = ["transport", "food", "shopping", "energy"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            variant="outline"
            size="lg"
            disabled={activeTab === "transport"}
            className="px-8"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {["transport", "food", "shopping", "energy"].map((tab) => (
              <div
                key={tab}
                className={`h-2 w-12 rounded-full transition-all ${
                  activeTab === tab ? "bg-emerald-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {activeTab === "energy" ? (
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 group"
            >
              Calculate Impact
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                const tabs = ["transport", "food", "shopping", "energy"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                }
              }}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 px-8"
            >
              Next
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </motion.div>

        {/* Success Toast */}
        <SuccessToast 
          message="Your lifestyle data has been saved successfully!"
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
