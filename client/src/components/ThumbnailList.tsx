import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';
import { getProductImages } from '@/utils/image';

interface ThumbnailListProps {
  images: string | string[] | undefined;
  selectedIndex: number;
  onSelectImage: (index: number) => void;
}

export default function ThumbnailList({ images, selectedIndex, onSelectImage }: ThumbnailListProps) {
  const allImages = getProductImages(images);

  if (allImages.length <= 1) return null;

  return (
    <div className="flex xl:flex-col gap-4">
      {allImages.map((image, index) => (
        <motion.button
          key={`thumb-${index}`}
          onClick={() => onSelectImage(index)}
          className={`relative w-20 h-28 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
            selectedIndex === index
              ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400/30'
              : 'border-white/10 hover:border-white/30 hover:shadow-md'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`View image ${index + 1} of ${allImages.length}`}
        >
          <ImageWithFallback
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            debug={import.meta.env.DEV}
          />
          {selectedIndex === index && (
            <motion.div
              className="absolute inset-0 bg-yellow-400/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}