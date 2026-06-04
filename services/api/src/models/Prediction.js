import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["current", "forecast", "simulate", "recommend"], required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const Prediction = mongoose.model("Prediction", predictionSchema);

