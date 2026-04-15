import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  debug?: boolean;
}

export default function ImageZoom({ src, alt, className = '', debug = false }: ImageZoomProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
        debug={debug}
      />

      {/* Subtle overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Luxury border glow */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
    </motion.div>
  );
}