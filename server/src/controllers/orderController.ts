import { Request, Response } from "express";
import { Order } from "../models/Order.js";

export const create = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Incoming create order request:`, req.body);
    const orderData = { ...req.body, userId: (req as any).user._id };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(`[ERROR] Failed to create order:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Undefined error",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const orders = await (Order as any).find().sort({ createdAt: -1 });
    const formattedOrders = Array.isArray(orders)
      ? orders.map(o => ({
          ...o.toObject(),
          id: o._id.toString(),
        }))
      : [];
    res.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error(`[ERROR] Failed to fetch orders:`, error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Failed to fetch orders",
      error: error instanceof Error ? error.message : "Undefined error",
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const orders = await (Order as any)
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate("products");
    const formattedOrders = Array.isArray(orders)
      ? orders.map(o => ({
          ...o.toObject(),
          id: o._id.toString(),
        }))
      : [];
    res.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error(`[ERROR] Failed to fetch user orders:`, error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Failed to fetch user orders",
      error: error instanceof Error ? error.message : "Undefined error",
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await (Order as any).findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(`[ERROR] Failed to update order status:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error instanceof Error ? error.message : "Undefined error",
    });
  }
};
