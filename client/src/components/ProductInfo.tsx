import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Truck, ArrowRight, Users, Award, Gem } from 'lucide-react';
import ScarcityBadge from './ScarcityBadge';
import OwnershipMessage from './OwnershipMessage';
import StorySection from './StorySection';
import CountdownTimer from './CountdownTimer';

interface ProductInfoProps {
  product: any;
  onInitiateAcquisition: () => void;
}

export default function ProductInfo({ product, onInitiateAcquisition }: ProductInfoProps) {
  return (
    <motion.div
      className="flex flex-col justify-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header */}
      <div className="mb-12">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="text-yellow-400 text-[10px] uppercase tracking-[0.5em] font-bold">
            Unique Archive No. 00{product.id}
          </span>
          {product.isSold && (
            <span className="bg-zinc-800 text-zinc-400 text-[8px] px-3 py-1 uppercase tracking-widest border border-white/10">
              Privately Owned
            </span>
          )}
        </motion.div>

        {/* Scarcity & Urgency */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <ScarcityBadge stockCount={product.stockCount || 3} isSold={product.isSold} />
          <CountdownTimer isSold={product.isSold} />
        </motion.div>

        <motion.h1
          className="text-luxury-h1 mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {product.name}
        </motion.h1>

        <motion.div
          className="text-3xl md:text-4xl font-serif text-white/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          ${product.price?.toLocaleString()}
        </motion.div>
      </div>

      {/* Story */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-6 flex items-center gap-2">
          <Info size={14} className="text-yellow-400/50" />
          The Narrative
        </h3>
        <p className="text-zinc-300 text-lg leading-relaxed font-serif italic max-w-lg">
          "{product.story || product.description}"
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {product.isSold ? (
          <div className="p-8 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] mb-2 font-bold font-serif italic">Curator</p>
            <p className="text-yellow-400 text-2xl font-serif">{product.ownerName || 'Exclusive Collector'}</p>
            <p className="text-zinc-500 text-sm mt-4">This piece has been acquired and is no longer available for public collection.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.button
              onClick={onInitiateAcquisition}
              className="btn-luxury w-full h-20 flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 60px rgba(212, 175, 55, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex items-center gap-3">
                Initiate Acquisition
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </span>
              <span className="text-[10px] opacity-80 group-hover:opacity-100 transition-opacity">
                Secure this piece before it disappears
              </span>
            </motion.button>

            {/* Coming Soon Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-yellow-400/80 text-sm bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4"
            >
              <div className="font-medium mb-1">💎 Payment Integration Coming Soon</div>
              <div className="text-xs text-zinc-400">
                We're preparing a secure payment system. For now, contact us directly to acquire this masterpiece.
              </div>
            </motion.div>

            {/* Fear of Loss Trigger */}
            <motion.p
              className="text-center text-zinc-500 text-xs italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              If you leave, this piece may not be available again.
            </motion.p>
          </div>
        )}
      </motion.div>

      {/* Premium Badges */}
      <motion.div
        className="grid grid-cols-1 gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="flex items-center gap-4 text-zinc-500 group">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
            <ShieldCheck size={18} className="text-yellow-400/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Certificate of Rarity
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 group">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
            <Award size={18} className="text-yellow-400/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Hand-Finished
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 group">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
            <Gem size={18} className="text-yellow-400/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Limited Drop
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 group">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
            <Truck size={18} className="text-yellow-400/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">
            White-Glove Delivery
          </span>
        </div>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        className="flex items-center gap-3 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
          <Users size={14} className="text-yellow-400" />
        </div>
        <span className="text-zinc-500 text-sm">
          Collected by 27 individuals worldwide
        </span>
      </motion.div>

      {/* Ownership Message */}
      <OwnershipMessage delay={1.1} />

      {/* Story Section */}
      <StorySection story={product.story} delay={1.3} />
    </motion.div>
  );
}