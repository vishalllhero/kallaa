import { Router, Request } from "express";
import * as productController from "../controllers/productController";
import * as orderController from "../controllers/orderController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import cloudinary from "../config/cloudinary";

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

// Image Upload
router.post("/upload", upload.array("images", 5), async (req: Request, res) => {
  try {
    console.log("[DEBUG] Upload request received");

    if (!req.files || req.files.length === 0) {
      console.log("[DEBUG] No files uploaded");
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Get files array from req.files (multer.array creates an object with fieldname as key)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imagesFiles = files?.images || [];

    console.log(`[DEBUG] Processing ${imagesFiles.length} files`);

    // Generate local URLs for uploaded files
    const urls: string[] = [];
    for (const file of imagesFiles) {
      // Create URL relative to server root (Express static will serve from /uploads)
      const fileUrl = `/uploads/${file.filename}`;
      urls.push(fileUrl);
      console.log(`[DEBUG] File saved: ${fileUrl}, original: ${file.originalname}`);
    }

    console.log(`[DEBUG] Upload successful, returning ${urls.length} URLs:`, urls);
    res.json({ urls });
  } catch (error) {
    console.error("[ERROR] Upload failed:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
