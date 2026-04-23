import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ScarcityBadgeProps {
  stockCount?: number;
  isSold?: boolean;
}

export default function ScarcityBadge({
  stockCount = 3,
  isSold = false,
}: ScarcityBadgeProps) {
  if (isSold) return null;

  const isLowStock = stockCount < 5;
  const isVeryLowStock = stockCount <= 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
        isVeryLowStock
          ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse-urgency"
          : isLowStock
            ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
            : "bg-white/5 border-white/20 text-white/70"
      }`}
    >
      <AlertTriangle
        size={14}
        className={isVeryLowStock ? "text-red-400" : "text-yellow-400"}
      />
      <span className="text-xs font-medium uppercase tracking-widest">
        {isVeryLowStock
          ? "Final custodian remaining"
          : `${stockCount} custodians remaining`}
      </span>
    </motion.div>
  );
}
