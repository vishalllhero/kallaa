import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageWithFallback from "./ImageWithFallback";
import ZoomImage from "./ZoomImage";

interface ImageSliderProps {
  mainImage: string;
  thumbnail?: string;
  zoomImage?: string;
  alt: string;
}

export default function ImageSlider({
  mainImage,
  thumbnail,
  zoomImage,
  alt,
}: ImageSliderProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // For now, we only have one image, but structure is ready for multiple
  const images = [
    {
      main: mainImage,
      thumbnail: thumbnail || mainImage,
      zoom: zoomImage || mainImage,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5"
      >
        <ZoomImage
          src={images[selectedImage].zoom || images[selectedImage].main}
          alt={alt}
          className="w-full h-full"
          zoomFactor={1.1}
        />
      </motion.div>

      {/* Thumbnails (ready for multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-[#d4af37] opacity-100"
                  : "border-white/10 opacity-60 hover:opacity-80"
              }`}
            >
              <ImageWithFallback
                src={image.thumbnail}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
