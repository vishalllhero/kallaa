import React from "react";
import { motion } from "framer-motion";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomImage({
  src,
  alt,
  className = "",
}: ZoomImageProps) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      whileHover={{ scale: 1.1 }}
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
    </motion.div>
  );
}
