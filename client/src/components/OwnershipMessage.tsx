import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

interface OwnershipMessageProps {
  delay?: number;
}

export default function OwnershipMessage({ delay = 0.8 }: OwnershipMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="mt-16 p-8 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
          <Crown size={20} className="text-yellow-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-lg font-serif italic leading-relaxed">
            "Once this piece is owned, it will never be recreated. Your story becomes part of the KALLAA archive."
          </p>
          <p className="text-zinc-500 text-sm font-light">
            Owned by few, not by everyone.
          </p>
        </div>
      </div>
    </motion.div>
  );
}