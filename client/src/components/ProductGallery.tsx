import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThumbnailList from './ThumbnailList';
import ImageZoom from './ImageZoom';
import { getProductImages } from '@/utils/image';

interface ProductGalleryProps {
  images: string | string[] | undefined;
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const allImages = getProductImages(images);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-lg">🎨</span>
          </div>
          <span className="text-zinc-500 text-sm">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
      {/* Thumbnails */}
      <div className="flex xl:flex-col gap-4 xl:gap-4 order-2 xl:order-1 overflow-x-auto xl:overflow-x-visible pb-4 xl:pb-0">
        <ThumbnailList
          images={images}
          selectedIndex={selectedImageIndex}
          onSelectImage={setSelectedImageIndex}
        />
      </div>

      {/* Main Image */}
      <div className="flex-1 order-1 xl:order-2">
        <div className="relative aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for luxury feel
              }}
              className="absolute inset-0"
            >
              <ImageZoom
                src={allImages[selectedImageIndex]}
                alt={`${title} - Image ${selectedImageIndex + 1} of ${allImages.length}`}
                className="w-full h-full"
                debug={import.meta.env.DEV}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/10">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <motion.button
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 border border-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous image"
              >
                ‹
              </motion.button>
              <motion.button
                onClick={() => setSelectedImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 border border-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next image"
              >
                ›
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}