import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authenticate, orderController.create);
router.get("/user", authenticate, orderController.getUserOrders);

// Protected Admin Routes
router.get("/", authenticate, authorizeAdmin, orderController.getAll);
router.put(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  orderController.updateStatus
);

export default router;
