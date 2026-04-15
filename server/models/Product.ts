import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String }, // For Task 3 compatibility
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // For Task 3 compatibility
  images: [{ type: String }],
  isSold: { type: Boolean, default: false },
  category: { type: String, default: "unique" },
  story: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
