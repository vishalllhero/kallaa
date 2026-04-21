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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border border-white/5 group-hover:border-[#d4af37]/30 transition-all duration-500">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
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
                View Story →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
