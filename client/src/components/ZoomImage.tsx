import React from "react";
import { motion } from "framer-motion";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomFactor?: number;
}

export default function ZoomImage({
  src,
  alt,
  className = "",
  zoomFactor = 1.5,
}: ZoomImageProps) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      whileHover={{ scale: zoomFactor }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Subtle overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Zoom indicator */}
      <motion.div
        className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="13" y1="9" x2="9" y2="13"></line>
        </svg>
      </motion.div>
    </motion.div>
  );
}
