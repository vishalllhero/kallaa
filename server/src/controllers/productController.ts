import { Request, Response } from "express";
import { Product } from "../models/Product.js";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await (Product as any).find().sort({ createdAt: -1 });

    const safeProducts = Array.isArray(products)
      ? products.map(p => ({
          ...p.toObject(),
          id: p._id.toString(),
        }))
      : [];

    res.json({
      success: true,
      data: safeProducts
    });
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS:", error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : "Undefined error"
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await (Product as any).findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({
      success: true,
      data: {
        ...product.toObject(),
        id: product._id.toString(),
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching product", 
      error: error instanceof Error ? error.message : "Undefined error" 
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (data.title && !data.name) data.name = data.title;
    if (data.image && (!data.images || data.images.length === 0)) data.images = [data.image];

    const product = new Product(data);
    await product.save();
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(`[ERROR] Error creating product:`, error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating product", 
      error: error instanceof Error ? error.message : "Undefined error" 
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await (Product as any).findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error updating product", 
      error: error instanceof Error ? error.message : "Undefined error" 
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await (Product as any).findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error deleting product", 
      error: error instanceof Error ? error.message : "Undefined error" 
    });
  }
};

export const getCollectedStories = async (req: Request, res: Response) => {
  try {
    const stories = await (Product as any).find({ isSold: true }).sort({
      updatedAt: -1,
    });
    const formattedStories = Array.isArray(stories)
      ? stories.map(s => ({
          ...s.toObject(),
          id: s._id.toString(),
        }))
      : [];
    res.json({
      success: true,
      data: formattedStories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: [], 
      message: "Error fetching stories", 
      error: error instanceof Error ? error.message : "Undefined error" 
    });
  }
};
