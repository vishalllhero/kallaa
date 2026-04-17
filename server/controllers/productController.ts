import { Request, Response } from "express";
import { Product } from "../models/Product";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Fetching all products`);
    const products = await Product.find().sort({ createdAt: -1 });
    const formattedProducts = products(Array.isArray(data) ? data : []).map(...)
      (Array.isArray(orders) ? orders : []).map(...)
      (Array.isArray(items) ? items : []).map(...)p => ({
        ...p.toObject(),
        id: p._id.toString()
      }));
res.json(formattedProducts);
  } catch (error) {
  console.error(`[ERROR] Error fetching products:`, error);
  res.status(500).json({ message: "Error fetching products", error });
}
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({
      ...product.toObject(),
      id: product._id.toString()
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
    if (data.image && (!data.images || data.images.length === 0)) data.images = [data.image];

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

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getCollectedStories = async (req: Request, res: Response) => {
  try {
    const stories = await Product.find({ isSold: true }).sort({ updatedAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories", error });
  }
};
