import { Router } from "express";
import * as paymentController from "../controllers/paymentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create-order", authenticate, paymentController.createRazorpayOrder);
router.post("/verify", authenticate, paymentController.verifyPayment);

export default router;
