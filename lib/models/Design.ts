import mongoose, { Schema } from "mongoose";

const DesignSchema = new Schema(
  {
    userId: { type: String, default: null, index: true },
    title: { type: String, required: true },
    mode: { type: String, enum: ["image", "code"], required: true },
    imageUrl: { type: String, default: null },
    code: { type: String, default: "" },
    language: { type: String, enum: ["javascript", "typescript", "python", "bash"], required: true },
    settings: {
      background: String,
      padding: Number,
      radius: Number,
      shadow: Boolean,
      theme: String,
      layout: String,
      fontSize: Number,
      lineNumbers: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);