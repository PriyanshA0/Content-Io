import mongoose, { Schema } from "mongoose";

const SupportPaymentSchema = new Schema(
  {
    userId: { type: String, default: null, index: true },
    status: {
      type: String,
      enum: ["initiated", "paid", "failed", "refunded", "cancelled"],
      default: "initiated",
      index: true,
    },
    amount: { type: Number, default: null },
    currency: { type: String, default: null },
    polarCheckoutId: { type: String, default: null, index: true },
    polarEventId: { type: String, default: null, index: true },
    checkoutUrl: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.SupportPayment ||
  mongoose.model("SupportPayment", SupportPaymentSchema);
