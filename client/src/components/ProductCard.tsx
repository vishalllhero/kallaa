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
    isSold?: boolean | number;
  };
  showStory?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  showStory = true,
  className = "",
}: ProductCardProps) {
  const isSold =
    product.isSold === true ||
    product.isSold === 1 ||
    (product.owner !== undefined && product.owner !== "Available");

  const title = product.title || product.name || "Untitled";
  const image = getImageUrl(product.image || product.images?.[0]);
  const story = product.story || product.description || "";

  return (
    <motion.div
      className={`group flex flex-col w-full ${className}`}
      whileHover={{ y: isSold ? 0 : -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/product/${product.id}`} className="flex flex-col w-full">
        {/* ── IMAGE SECTION ── fixed aspect ratio, no overflow */}
        <div
          className={`relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border transition-all duration-500 flex-shrink-0 ${
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
          <div className="absolute top-4 left-4 z-10">
            {isSold ? (
              <div className="px-3 py-1 bg-gray-500/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                COLLECTED
              </div>
            ) : (
              <div className="px-3 py-1 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                AVAILABLE
              </div>
            )}
          </div>

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-white/70 text-xs font-medium mb-1 uppercase tracking-widest">
                  Collected by
                </div>
                <div className="text-white font-serif text-lg">
                  {product.ownerName || product.owner || "Anonymous"}
                </div>
              </div>
            </div>
          )}

          {/* Hover gradient (available only) */}
          {!isSold && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
          )}
        </div>

        {/* ── CONTENT SECTION ── always below image, auto height */}
        <div className="flex flex-col gap-2 pt-5 pb-2 px-1">
          {/* Title */}
          <h3
            className="text-white font-serif text-base md:text-lg leading-tight line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300"
            title={title}
          >
            {title}
          </h3>

          {/* Story preview */}
          {showStory && story && (
            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
              {story}
            </p>
          )}

          {/* Bottom row: price + CTA */}
          <div className="flex items-center justify-between mt-1">
            {!isSold ? (
              <span className="text-[#d4af37] font-light text-sm">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-gray-500 text-xs uppercase tracking-widest">
                Collected
              </span>
            )}

            {!isSold && (
              <span className="text-white/50 text-[10px] uppercase tracking-widest group-hover:text-white/80 transition-colors duration-300">
                Collect →
              </span>
            )}
          </div>
        </div>

        {/* Rarity tagline */}
        <p className="mt-1 text-center text-zinc-700 text-[9px] tracking-[0.5em] uppercase select-none pb-1">
          One of One · Unrepeatable
        </p>
      </Link>
    </motion.div>
  );
}
