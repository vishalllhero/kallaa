import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", orderController.create);

// Protected Admin Routes
router.get("/", authenticate, authorizeAdmin, orderController.getAll);
router.put("/:id/status", authenticate, authorizeAdmin, orderController.updateStatus);

export default router;
