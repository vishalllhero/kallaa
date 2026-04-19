import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { memoryUpload } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/stories", productController.getCollectedStories);
router.get("/:id", productController.getProductById);

// Upload route
router.post(
  "/upload",
  authenticate,
  memoryUpload.single("image"),
  productController.uploadImage
);

// Protected Admin Routes
router.post("/", authenticate, authorizeAdmin, productController.createProduct);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  productController.deleteProduct
);

export default router;
