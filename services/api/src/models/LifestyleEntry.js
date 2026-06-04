import mongoose from "mongoose";

const lifestyleEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const LifestyleEntry = mongoose.model("LifestyleEntry", lifestyleEntrySchema);

