import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "./ImageWithFallback";
import ZoomImage from "./ZoomImage";

interface ImageData {
  main: string;
  thumbnail?: string;
  zoom?: string;
}

interface ImageSliderProps {
  images?: string | string[]; // Can accept single image or array
  alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Process images - handle single image or array
  let imageArray: ImageData[] = [];

  if (Array.isArray(images)) {
    imageArray = images.map(img => ({
      main: img,
      thumbnail: img, // Could be enhanced to use thumbnail variants
      zoom: img, // Could be enhanced to use zoom variants
    }));
  } else if (typeof images === "string" && images) {
    imageArray = [
      {
        main: images,
        thumbnail: images,
        zoom: images,
      },
    ];
  }

  // Fallback for no images
  if (imageArray.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-2xl">🎨</span>
          </div>
          <span className="text-zinc-500 text-sm font-medium">
            No images available
          </span>
        </div>
      </div>
    );
  }

  // Fallback for no images
  if (imageArray.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-2xl">🎨</span>
          </div>
          <span className="text-zinc-500 text-sm font-medium">
            No images available
          </span>
        </div>
      </div>
    );
  }

  const currentImage = imageArray[selectedImage];

  const goToPrevious = () => {
    setSelectedImage(prev => (prev > 0 ? prev - 1 : imageArray.length - 1));
  };

  const goToNext = () => {
    setSelectedImage(prev => (prev < imageArray.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image with Zoom */}
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 group cursor-pointer"
          onClick={toggleFullscreen}
        >
          <ZoomImage
            src={currentImage.zoom || currentImage.main}
            alt={`${alt} - Image ${selectedImage + 1}`}
            className="w-full h-full"
            zoomFactor={1.1}
          />

          {/* Navigation arrows - only show if multiple images */}
          {imageArray.length > 1 && (
            <>
              <motion.button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous image"
              >
                ‹
              </motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next image"
              >
                ›
              </motion.button>
            </>
          )}

          {/* Fullscreen toggle */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle fullscreen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </motion.button>

          {/* Image counter */}
          {imageArray.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/10">
              {selectedImage + 1} / {imageArray.length}
            </div>
          )}
        </motion.div>

      {/* Thumbnails */}
      {imageArray.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageArray.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-[#d4af37] opacity-100 scale-105"
                  : "border-white/10 opacity-60 hover:opacity-80 hover:scale-105"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageWithFallback
                src={image.thumbnail || image.main}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ZoomImage
                src={currentImage.zoom || currentImage.main}
                alt={`${alt} - Image ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
                zoomFactor={1.2}
              />

              {/* Close button */}
              <motion.button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Fullscreen navigation */}
              {imageArray.length > 1 && (
                <>
                  <motion.button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ‹
                  </motion.button>
                  <motion.button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ›
                  </motion.button>
                </>
              )}

              {/* Image info */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                <div className="text-sm font-medium">{alt}</div>
                {imageArray.length > 1 && (
                  <div className="text-xs opacity-80">
                    {selectedImage + 1} of {imageArray.length}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
