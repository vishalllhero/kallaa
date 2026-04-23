import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    story: { type: String, default: "" },

    // Single image system with variants
    image: { type: String, required: true }, // Original/full size
    thumbnail: { type: String, required: true }, // 300px width
    zoomImage: { type: String, required: true }, // 1400px width

    // Ownership system
    owner: { type: String, default: "Available" },
    quantity: { type: Number, default: 1 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Legacy fields (deprecated)
    isSold: { type: Boolean, default: false },
    ownerName: { type: String },
    ownerStory: { type: String },
    soldAt: { type: Date },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
