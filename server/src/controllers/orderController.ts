import { Request, Response } from "express";
import { Order } from "../models/Order.js";

export const create = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Incoming create order request:`, req.body);
    const order = new Order(req.body);
    await order.save();
    console.log(`[DEBUG] Order saved successfully:`, order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error(`[ERROR] Failed to create order:`, error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    console.log(`[DEBUG] Fetching all orders`);
    const orders = await (Order as any).find().sort({ createdAt: -1 });
    const formattedOrders = Array.isArray(orders)
      ? orders.map(o => ({
          ...o.toObject(),
          id: o._id.toString(),
        }))
      : [];
    res.json(formattedOrders);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch orders:`, error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[DEBUG] Updating order ${id} status to ${status}`);
    const order = await (Order as any).findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    console.error(`[ERROR] Failed to update order status:`, error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
