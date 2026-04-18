/**
 * Centralized image utilities for KALLAA luxury e-commerce platform
 *
 * Handles image URL construction, fallbacks, validation, and loading states
 * Production-ready with CDN support and environment-based URL handling
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { safeMap } from "./safeMap";

// Configuration
export const IMAGE_CONFIG = {
  // Fallback image for when no image is available
  fallback:
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",

  // Backend base URL from environment (production-safe)
  backendUrl:
    import.meta.env.VITE_API_URL || "http://localhost:5000",

  // Supported image extensions for validation
  supportedExtensions: [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".svg",
  ] as const,

  // Loading placeholder colors (luxury theme)
  loadingBg: "bg-zinc-900",
  loadingPulse: "animate-pulse",

  // Fallback UI
  errorBg: "bg-zinc-800",
  errorText: "text-zinc-400",
  errorBorder: "border-red-500/20",
} as const;

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if an image path looks valid
 */
export function isValidImagePath(path: string | undefined): boolean {
  if (!path) return false;

  // Absolute URLs are assumed valid
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return true;
  }

  // Check for uploads path with valid extension
  if (path.startsWith("/uploads/")) {
    const extension = path
      .toLowerCase()
      .substring(
        path.lastIndexOf(".")
      ) as (typeof IMAGE_CONFIG.supportedExtensions)[number];
    return IMAGE_CONFIG.supportedExtensions.includes(extension);
  }

  // Check for relative paths with valid extension
  if (!path.startsWith("/") && path.includes(".")) {
    const extension = path
      .toLowerCase()
      .substring(
        path.lastIndexOf(".")
      ) as (typeof IMAGE_CONFIG.supportedExtensions)[number];
    return IMAGE_CONFIG.supportedExtensions.includes(extension);
  }

  return false;
}

/**
 * Constructs a complete image URL
 * - Prepends backend URL for relative paths
 * - Returns absolute URLs as-is
 * - Provides fallback for invalid/empty paths
 */
export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) {
    if (import.meta.env.DEV) {
      console.log("[ImageUtils] No image path provided, using fallback");
    }
    return IMAGE_CONFIG.fallback;
  }

  // If it's already an absolute URL (CDN, external), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (import.meta.env.DEV) {
      console.log("[ImageUtils] Absolute URL detected:", imagePath);
    }
    return imagePath;
  }

  // Check if backend URL is configured
  if (!IMAGE_CONFIG.backendUrl) {
    if (import.meta.env.DEV) {
      console.warn(
        "[ImageUtils] No backend URL configured, using fallback for:",
        imagePath
      );
    }
    return IMAGE_CONFIG.fallback;
  }

  // For local uploads, construct full URL
  if (imagePath.startsWith("/uploads/")) {
    const fullUrl = `${IMAGE_CONFIG.backendUrl}${imagePath}`;
    if (import.meta.env.DEV) {
      console.log(
        "[ImageUtils] Local upload path processed:",
        imagePath,
        "->",
        fullUrl
      );
    }
    return fullUrl;
  }

  // For other relative paths, assume they're from uploads
  if (!imagePath.startsWith("/")) {
    const fullUrl = `${IMAGE_CONFIG.backendUrl}/uploads/${imagePath}`;
    if (import.meta.env.DEV) {
      console.warn(
        "[ImageUtils] Relative path without /uploads/, assuming uploads:",
        imagePath,
        "->",
        fullUrl
      );
    }
    return fullUrl;
  }

  // For other absolute paths, prepend backend URL
  const fullUrl = `${IMAGE_CONFIG.backendUrl}${imagePath}`;
  if (import.meta.env.DEV) {
    console.log(
      "[ImageUtils] Absolute path processed:",
      imagePath,
      "->",
      fullUrl
    );
  }
  return fullUrl;
}

/**
 * Gets the main product image from an images array
 * Supports single image or array of images
 */
export function getProductImage(images: string | string[] | undefined): string {
  let imagePath: string | undefined;

  if (Array.isArray(images)) {
    imagePath = images[0]; // Use first image as main
  } else if (typeof images === "string") {
    imagePath = images; // Single image string
  }

  if (import.meta.env.DEV) {
    console.log(
      "[ImageUtils] getProductImage input:",
      images,
      "-> using:",
      imagePath
    );
  }

  return getImageUrl(imagePath);
}

/**
 * Gets all product images as an array of URLs
 */
export function getProductImages(
  images: string | string[] | undefined
): string[] {
  let imageArray: string[] = [];

  if (Array.isArray(images)) {
    imageArray = images;
  } else if (typeof images === "string") {
    imageArray = [images];
  }

  if (imageArray.length === 0) {
    if (import.meta.env.DEV) {
      console.log("[ImageUtils] No images provided, using fallback array");
    }
    return [IMAGE_CONFIG.fallback];
  }

  const processedImages = safeMap(imageArray, img => getImageUrl(img));

  if (import.meta.env.DEV) {
    console.log(
      "[ImageUtils] getProductImages processed:",
      imageArray,
      "->",
      processedImages
    );
  }

  return processedImages;
}

/**
 * Gets thumbnail images (all except first) for product galleries
 */
export function getProductThumbnails(
  images: string | string[] | undefined
): string[] {
  const allImages = getProductImages(images);
  return allImages.slice(1); // Skip first image (main image)
}

/**
 * Validates all images in an array and returns valid ones
 */
export function getValidProductImages(
  images: string | string[] | undefined
): string[] {
  const allImages = getProductImages(images);
  return allImages.filter(img => {
    const isValid = isValidImagePath(img);
    if (import.meta.env.DEV && !isValid) {
      console.warn("[ImageUtils] Invalid image path filtered out:", img);
    }
    return isValid;
  });
}

/**
 * Image loading state management
 */
export interface ImageLoadState {
  loading: boolean;
  error: boolean;
  loaded: boolean;
}

export function createImageLoadState(): ImageLoadState {
  return {
    loading: true,
    error: false,
    loaded: false,
  };
}

export function handleImageLoad(state: ImageLoadState) {
  state.loading = false;
  state.error = false;
  state.loaded = true;
}

export function handleImageError(state: ImageLoadState) {
  state.loading = false;
  state.error = true;
  state.loaded = false;
}

/**
 * Generates optimized image URLs for different sizes (future CDN support)
 */
export function getOptimizedImageUrl(
  imagePath: string | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpg" | "png";
  } = {}
): string {
  const baseUrl = getImageUrl(imagePath);

  // For now, just return the base URL
  // In production with CDN, this would append query parameters
  // e.g., `${baseUrl}?w=${options.width}&h=${options.height}&q=${options.quality}&f=${options.format}`

  if (import.meta.env.DEV && Object.keys(options).length > 0) {
    console.log(
      "[ImageUtils] Optimization requested but not implemented yet:",
      options
    );
  }

  return baseUrl;
}

/**
 * Debug utility for development
 */
export function debugImageInfo(
  images: string | string[] | undefined,
  context: string = "unknown"
) {
  if (!import.meta.env.DEV) return;

  console.group(`🖼️  [ImageUtils Debug] ${context}`);
  console.log("Raw input:", images);
  console.log("Main image:", getProductImage(images));
  console.log("All images:", getProductImages(images));
  console.log("Thumbnails:", getProductThumbnails(images));
  console.log("Valid images:", getValidProductImages(images));
  console.log("Backend URL:", IMAGE_CONFIG.backendUrl);
  console.groupEnd();
}
