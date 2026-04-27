import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Info,
  ShieldCheck,
  Truck,
  ArrowRight,
  Users,
  Award,
  Gem,
  Heart,
  X,
  Crown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { productApi } from "@/api";
import { toast } from "sonner";
import { formatPrice } from "@/utils/formatPrice";
import ScarcityBadge from "./ScarcityBadge";
import OwnershipMessage from "./OwnershipMessage";
import StorySection from "./StorySection";
import CountdownTimer from "./CountdownTimer";

interface ProductInfoProps {
  product: any;
  onInitiateAcquisition: () => void;
}

export default function ProductInfo({
  product,
  onInitiateAcquisition,
}: ProductInfoProps) {
  const { user } = useAuth();
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [ownerName, setOwnerName] = useState(user?.name || "");
  const [ownerStory, setOwnerStory] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const isSold = product.owner !== "Available";

  const handleCollectPiece = async () => {
    if (!user) {
      toast.error("Please sign in to collect this piece");
      return;
    }

    try {
      setIsCollecting(true);
      const response = await productApi.collectProduct(product.id, {
        ownerName: ownerName || "Anonymous Collector",
        ownerStory: ownerStory || "",
      });

      if (response.success) {
        toast.success(
          "🎨 Piece successfully collected! You now own this story."
        );
        setShowCollectModal(false);
        // Optionally refresh the page or update state
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to collect piece");
      }
    } catch (error: any) {
      console.error("Collect error:", error);
      toast.error("Failed to collect piece. Please try again.");
    } finally {
      setIsCollecting(false);
    }
  };

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
          <ScarcityBadge
            stockCount={product.stockCount || 3}
            isSold={product.isSold}
          />
          <CountdownTimer isSold={product.isSold} />
        </motion.div>

        <motion.h1
          className="text-luxury-h1 mb-6 leading-tight font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {product.title || product.name}
        </motion.h1>

        {/* Emotional Story Section - Above Price */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-[#d4af37]" />
              </div>
              <h3 className="text-[#d4af37] text-sm font-serif font-medium uppercase tracking-wider">
                The Artist's Vision
              </h3>
            </div>
            <div className="text-zinc-200 text-base leading-relaxed font-serif">
              {product.story ? (
                <p className="italic leading-relaxed">"{product.story}"</p>
              ) : product.description ? (
                <p className="leading-relaxed">{product.description}</p>
              ) : (
                <div className="space-y-3 italic leading-relaxed text-zinc-300">
                  <p>This piece was born from a moment of pure inspiration.</p>
                  <p>
                    Painted during the quiet hours when the world sleeps, it
                    captures the essence of solitude and creation.
                  </p>
                  <p>
                    Each brushstroke tells a story that only reveals itself to
                    those who pause to listen.
                  </p>
                  <p>
                    This is not just art — it's a preserved emotion, waiting for
                    its perfect companion.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-700/50">
              <p className="text-zinc-500 text-xs italic font-serif">
                "Every masterpiece deserves a custodian who understands its
                silence."
              </p>
              <p className="text-zinc-600 text-xs mt-2">
                — KALLAA Curatorial Archive
              </p>
            </div>
          </div>
        </motion.div>

        {/* Price Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="flex items-baseline gap-4">
            <span className={`text-4xl md:text-5xl font-serif font-light ${isSold ? "text-zinc-400" : "text-[#d4af37]"}`}>
              {isSold ? "COLLECTED" : formatPrice(3000)}
            </span>
            <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
              Investment Value
            </span>
          </div>
          <p className="text-zinc-600 text-xs mt-2 font-serif italic">
            This piece appreciates in both beauty and worth over time.
          </p>
        </motion.div>

        {/* Unique Archive Number */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-[#d4af37]/50 rounded-lg backdrop-blur-sm">
            <Award size={14} className="text-[#d4af37]" />
            <span className="text-[#d4af37] text-xs font-medium font-mono tracking-wider">
              UNIQUE ARCHIVE #
              {String(
                (product._id || product.id || "").slice(-6)
              ).toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Scarcity Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">
                  Only 1 Piece Exists
                </p>
                <p className="text-red-400/70 text-xs">
                  This artwork will never be reproduced
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-300 text-xs font-mono">LIMITED</p>
              <p className="text-red-400 text-lg font-bold">∞</p>
            </div>
          </div>
        </motion.div>

        {/* Ownership Status */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
        >
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border-2 backdrop-blur-sm ${
              product.owner === "Available"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
            }`}
          >
            <Crown
              size={16}
              className={
                product.owner === "Available"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            />
            <span className="font-serif">
              {product.owner === "Available"
                ? "Available for Private Acquisition"
                : `Permanently Owned by ${product.owner}`}
            </span>
          </div>
        </motion.div>

        {/* Limited Edition Badge */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
            <Gem size={14} className="text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm font-medium font-serif">
              Limited Edition • Only 1 Exists
            </span>
          </div>
        </motion.div>
      </div>

      {/* Story */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-bold mb-8 flex items-center gap-2">
          <Info size={16} className="text-[#d4af37]" />
          The Artist's Vision
        </h3>
        <div className="max-w-xl">
          <div className="text-zinc-200 text-lg leading-relaxed font-serif mb-8 p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border-l-4 border-[#d4af37]/50 rounded-r-lg">
            {product.story ? (
              <p className="italic leading-relaxed">"{product.story}"</p>
            ) : product.description ? (
              <p className="leading-relaxed">{product.description}</p>
            ) : (
              <div className="space-y-4 italic leading-relaxed">
                <p>This is not just an artwork.</p>
                <p>It is a moment captured before it disappeared.</p>
                <p>
                  Painted in isolation — a study of beauty that refuses to stay
                  still.
                </p>
                <p>Only one exists. Once claimed, it will never return.</p>
              </div>
            )}
          </div>
          <div className="pt-6 border-t border-[#d4af37]/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                <Award size={14} className="text-[#d4af37]" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm italic font-serif">
                  "Art doesn't ask to be understood. It asks to be felt."
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  — KALLAA Curatorial Archive
                </p>
              </div>
            </div>
          </div>
        </div>
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
            <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] mb-2 font-bold font-serif italic">
              Curator
            </p>
            <p className="text-yellow-400 text-2xl font-serif">
              {product.ownerName || "Exclusive Collector"}
            </p>
            <p className="text-zinc-500 text-sm mt-4">
              This piece has been acquired and is no longer available for public
              collection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {product.owner === "Available" ? (
              <motion.button
                onClick={() => onInitiateAcquisition()}
                className="btn-luxury w-full h-24 flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 80px rgba(212, 175, 55, 0.6)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex items-center gap-3">
                  <Heart
                    size={24}
                    className="group-hover:fill-current group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="text-lg font-serif font-medium">
                    Become Its Custodian
                  </span>
                </span>
                <span className="text-[10px] opacity-80 group-hover:opacity-100 transition-opacity font-light">
                  This piece will wait for no one else
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/10 to-[#d4af37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            ) : (
              <motion.div
                className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-2xl backdrop-blur-sm"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
              >
                <span className="flex items-center gap-3 text-zinc-500">
                  <Crown size={24} className="text-amber-400" />
                  <span className="text-lg font-serif font-medium">
                    Permanently Acquired
                  </span>
                </span>
                <span className="text-[10px] text-zinc-600 font-light">
                  This masterpiece has found its forever home
                </span>
              </motion.div>
            )}

            {/* Coming Soon Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-yellow-400/80 text-sm bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4"
            >
              <div className="font-medium mb-1">
                💎 Payment Integration Coming Soon
              </div>
              <div className="text-xs text-zinc-400">
                We're preparing a secure payment system. For now, contact us
                directly to acquire this masterpiece.
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

      {/* Ownership Benefits */}
      <motion.div
        className="mb-12 p-6 bg-gradient-to-br from-[#d4af37]/5 to-[#d4af37]/10 border border-[#d4af37]/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <h4 className="text-[#d4af37] text-sm font-serif font-medium mb-4 uppercase tracking-wide">
          Your Acquisition Includes
        </h4>
        <ul className="space-y-3 text-sm text-zinc-300">
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
            Signed digital certificate of authenticity
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
            Permanent placement in the KALLAA story archive
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
            Your identity recorded as the custodian
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
            This piece will never be reproduced or sold again
          </li>
        </ul>
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

      {/* Collect Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setShowCollectModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-xl p-8 relative"
          >
            <button
              onClick={() => setShowCollectModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <Heart size={48} className="mx-auto mb-4 text-[#d4af37]" />
              <h2 className="text-3xl font-serif text-white mb-2">
                Collect This Piece
              </h2>
              <p className="text-zinc-400">
                You are about to become the custodian of "
                {product.title || product.name}"
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                  Your Name (as it will appear to others)
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="Anonymous Collector"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                  Your Story (optional)
                </label>
                <textarea
                  value={ownerStory}
                  onChange={e => setOwnerStory(e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="Share why this piece spoke to you..."
                />
              </div>

              <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl p-4">
                <p className="text-[#d4af37] text-sm">
                  By collecting this piece, you become its permanent custodian.
                  This action cannot be undone.
                </p>
              </div>

              <button
                onClick={handleCollectPiece}
                disabled={isCollecting}
                className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-xl hover:bg-[#e8c547] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCollecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Collecting...
                  </>
                ) : (
                  <>
                    <Heart size={20} />
                    Collect This Piece - {formatPrice(3000)}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
