import { Request, Response } from "express";
import { Product } from "../models/Product";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await (Product as any).find().sort({ createdAt: -1 });

    const safeProducts = Array.isArray(products)
      ? products.map(p => ({
          ...p.toObject(),
          id: p._id.toString(),
        }))
      : [];

    res.json(safeProducts);
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS:", error);
    res.status(500).json({
      success: false,
      products: [],
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await (Product as any).findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({
      ...product.toObject(),
      id: product._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Incoming create product request:`, req.body);
    console.log(`[DEBUG] Images in request:`, req.body.images);
    const data = { ...req.body };

    // Task 3 compatibility: map title to name, image to images
    if (data.title && !data.name) data.name = data.title;
    if (data.image && (!data.images || data.images.length === 0))
      data.images = [data.image];

    console.log(`[DEBUG] Final product data before save:`, data);

    const product = new Product(data);
    await product.save();
    console.log(`[DEBUG] Product saved successfully:`, product._id);
    console.log(`[DEBUG] Saved product images:`, product.images);
    res.status(201).json(product);
  } catch (error) {
    console.error(`[ERROR] Error creating product:`, error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Update product request for ID: ${req.params.id}`);
    console.log(`[DEBUG] Update data:`, req.body);
    console.log(`[DEBUG] Images in update:`, req.body.images);

    const product = await (Product as any).findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    console.log(`[DEBUG] Product updated successfully:`, product._id);
    console.log(`[DEBUG] Updated product images:`, product.images);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await (Product as any).findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
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
    res.json(formattedStories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories", error });
  }
};
