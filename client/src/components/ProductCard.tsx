import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getImageUrl } from "@/utils/image";
import { formatPrice } from "@/utils/formatPrice";

interface ProductCardProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    price: number;
    image?: string;
    images?: string[];
    story?: string;
    description?: string;
    owner?: string;
    ownerName?: string;
  };
  showStory?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  showStory = true,
  className = "",
}: ProductCardProps) {
  const isSold = product.owner !== "Available";
  const title = product.title || product.name || "Untitled";
  const image = getImageUrl(product.image || product.images?.[0]);
  const story = product.story || product.description;

  return (
    <motion.div
      className={`group ${className}`}
      whileHover={{ y: isSold ? 0 : -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border transition-all duration-500 ${
            isSold
              ? "border-white/10 opacity-75"
              : "border-white/5 group-hover:border-[#d4af37]/30"
          }`}
        >
          <ImageWithFallback
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isSold ? "grayscale" : "group-hover:scale-105"
            }`}
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {isSold ? (
              <div className="px-3 py-1 bg-gray-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                COLLECTED
              </div>
            ) : (
              <div className="px-3 py-1 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                AVAILABLE
              </div>
            )}
          </div>

          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white/80 text-sm font-medium mb-1">
                  Collected by
                </div>
                <div className="text-white font-serif text-lg">
                  {product.ownerName || product.owner || 'Anonymous'}
                </div>
              </div>
            </div>
          )}

          {!isSold && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <h3 className="text-white font-serif text-xl mb-2">{title}</h3>
              {showStory && story && (
                <p className="text-zinc-300 text-sm mb-4 line-clamp-2">
                  {story.substring(0, 120)}...
                </p>
              )}
              <div className="flex items-center justify-between">
                {!isSold ? (
                  <p className="text-gold font-light">
                    {formatPrice(3000)}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    COLLECTED
                  </p>
                )}
                <span className="text-white/80 text-sm uppercase tracking-wider">
                  Collect Story →
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-zinc-700 text-[10px] tracking-[0.5em] uppercase select-none">
          One of One · Unrepeatable
        </p>
      </Link>
    </motion.div>
  );
}
