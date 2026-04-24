import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "image" | "button";
}

export default function Skeleton({
  className = "",
  variant = "text",
}: SkeletonProps) {
  const baseClasses =
    "bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-pulse";

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${baseClasses} rounded-2xl overflow-hidden ${className}`}
      >
        <div className="aspect-[4/5] bg-zinc-800" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-zinc-700 rounded w-3/4" />
          <div className="h-3 bg-zinc-700 rounded w-1/2" />
          <div className="h-6 bg-zinc-700 rounded w-1/4 mt-4" />
        </div>
      </motion.div>
    );
  }

  if (variant === "image") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${baseClasses} rounded-2xl aspect-[4/5] ${className}`}
      />
    );
  }

  if (variant === "button") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${baseClasses} rounded-xl h-16 w-full ${className}`}
      />
    );
  }

  // Default text skeleton
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} rounded h-4 ${className}`}
    />
  );
}

// Specialized skeletons for different use cases
export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 lg:gap-16">
      <Skeleton variant="image" className="w-full" />
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton variant="button" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden"
    >
      <Skeleton variant="image" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </motion.div>
  );
}
