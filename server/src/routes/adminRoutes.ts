import { Router } from "express";
import * as productController from "../controllers/productController.js";
import * as orderController from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply admin protection to all routes in this router
router.use(authenticate, authorizeAdmin);

// Admin Product APIs
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Admin Order APIs
router.get("/orders", orderController.getAll);
router.put("/orders/:id", orderController.updateStatus);

export default router;
