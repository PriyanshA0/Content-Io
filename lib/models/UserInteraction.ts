import mongoose, { Schema } from "mongoose";

const UserInteractionSchema = new Schema(
  {
    userId: { type: String, default: null, index: true },
    eventType: { type: String, required: true, index: true },
    path: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.UserInteraction ||
  mongoose.model("UserInteraction", UserInteractionSchema);
