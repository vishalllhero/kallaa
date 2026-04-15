import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface StorySectionProps {
  story?: string;
  delay?: number;
}

export default function StorySection({ story, delay = 1.0 }: StorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className="mt-20"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
          <BookOpen size={16} className="text-yellow-400" />
        </div>
        <h3 className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold">
          The Story Behind This Piece
        </h3>
      </div>

      <div className="space-y-6">
        <p className="text-zinc-300 text-xl leading-relaxed font-serif italic max-w-2xl">
          {story || `"Every piece in the KALLAA collection tells a story of transformation. This particular creation emerged from a moment of creative intensity, where digital canvas became a vessel for emotion and identity.

          What began as pixels and algorithms evolved into something deeply personal - a reflection of the human experience, captured in digital form. Each brushstroke, each texture, each shadow represents a choice, a feeling, a memory.

          When you acquire this piece, you're not just owning art - you're becoming part of its ongoing narrative. Your appreciation, your story, your presence in the world adds another layer to its meaning.

          This is more than luxury. This is legacy.`}
        </p>

        <div className="pt-6 border-t border-white/5">
          <p className="text-zinc-500 text-sm italic">
            "Art doesn't exist in isolation. It exists in relationship to those who experience it."
          </p>
        </div>
      </div>
    </motion.div>
  );
}