import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getImageUrl } from "@/utils/image";

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
    isSold?: boolean;
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
  const title = product.title || product.name || "Untitled";
  const image = getImageUrl(product.image || product.images?.[0]);
  const story = product.story || product.description;

  return (
    <motion.div
      className={`group ${className}`}
      whileHover={{ y: product.isSold ? 0 : -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border transition-all duration-500 ${
            product.isSold
              ? "border-white/10 opacity-75"
              : "border-white/5 group-hover:border-[#d4af37]/30"
          }`}
        >
          <ImageWithFallback
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              product.isSold ? "grayscale" : "group-hover:scale-105"
            }`}
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {product.isSold ? (
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Collected
              </div>
            ) : (
              <div className="px-3 py-1 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                Available
              </div>
            )}
          </div>

          {product.isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white/80 text-sm font-medium mb-1">
                  Owned by
                </div>
                <div className="text-white font-serif text-lg">
                  {product.ownerName || "Anonymous"}
                </div>
              </div>
            </div>
          )}

          {!product.isSold && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <h3 className="text-white font-serif text-xl mb-2">{title}</h3>
              {showStory && story && (
                <p className="text-zinc-300 text-sm mb-4 line-clamp-2">
                  {story.substring(0, 120)}...
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#d4af37] font-serif text-lg">
                  ${product.price?.toLocaleString()}
                </span>
                <span className="text-white/80 text-sm uppercase tracking-wider">
                  Collect Story →
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
