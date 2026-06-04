import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    impact: { type: String, enum: ["low", "medium", "high"], required: true },
    effort: { type: String, enum: ["easy", "medium", "hard"], required: true },
    sourcePredictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", default: null }
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);
