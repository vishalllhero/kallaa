import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/stories", productController.getCollectedStories);
router.get("/:id", productController.getProductById);

// Collect/Own product (protected)
router.post("/:id/collect", authenticate, productController.collectProduct);

// Image upload route
router.post("/upload", upload.single("image"), productController.uploadImage);

// Test Cloudinary connection
router.get("/test-cloudinary", productController.testCloudinary);

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
