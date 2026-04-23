import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import path from "path";

// Disk storage for saving files locally
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// File filter for images only
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Memory-based upload for production
export const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Cloudinary upload utility function using buffer/stream
export const uploadToCloudinary = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  try {
    console.log(`[CLOUDINARY] Starting upload for file: ${filename}`);

    const uploadOptions = {
      folder: "kallaa",
      public_id: `${Date.now()}-${filename}`,
      resource_type: "auto" as const,
    };

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("[CLOUDINARY] Upload error:", error);
            reject(error);
          } else if (result) {
            console.log(`[CLOUDINARY] Upload successful: ${result.secure_url}`);
            resolve(result);
          } else {
            reject(new Error("Upload failed - no result"));
          }
        }
      );

      uploadStream.end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("[CLOUDINARY] Upload failed:", error);
    throw error;
  }
};
