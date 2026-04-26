import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";
import { normalizeProduct, type Product } from "@/utils/normalizeProduct";

export { type Product } from "@/utils/normalizeProduct";
export const productCache = new Map<string, Product>();

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (!productApi || typeof productApi.getById !== "function") {
      setError("API not available");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageLoaded(false);

        if (productCache.has(id)) {
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        const res = await productApi.getById(id);
        const formatted = normalizeProduct(res);
        productCache.set(id, formatted);
        setProduct(formatted);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isAvailable = product?.owner === "Available";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── LOADING SKELETON ── */}
      {(loading || !product) && !error && (
        <div className="min-h-screen bg-black animate-pulse">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="aspect-[4/5] bg-zinc-900/50 rounded-2xl" />
              <div className="space-y-8 py-8">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
                <div className="h-12 w-3/4 bg-zinc-800/60 rounded-lg" />
                <div className="h-10 w-40 bg-zinc-800/40 rounded" />
                <div className="h-8 w-32 bg-zinc-800/30 rounded-full" />
                <div className="space-y-3 pt-4">
                  <div className="h-4 w-full bg-zinc-800/30 rounded" />
                  <div className="h-4 w-5/6 bg-zinc-800/20 rounded" />
                  <div className="h-4 w-4/6 bg-zinc-800/20 rounded" />
                </div>
                <div className="h-32 w-full bg-zinc-900/40 rounded-xl" />
                <div className="h-16 w-full bg-zinc-800/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR STATE ── */}
      {error && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-zinc-500 text-sm uppercase tracking-[0.3em]">Error</p>
            <p className="text-zinc-300 text-lg">{error}</p>
          </div>
        </div>
      )}

      {/* ── MAIN PRODUCT UI ── */}
      {product && !loading && !error && (
        <div
          className="transition-opacity duration-700 ease-out"
          style={{ opacity: 1, animation: "fadeIn 0.6s ease-out" }}
        >
          {/* Hero Grid */}
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              {/* ── LEFT: Hero Image ── */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-950">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

                  <img
                    src={product.image || "https://placehold.co/800x1000/0a0a0a/333?text=KALLAA"}
                    alt={product.title}
                    className={`w-full aspect-[4/5] object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/800x1000/0a0a0a/333?text=KALLAA";
                      setImageLoaded(true);
                    }}
                  />

                  {/* Image loading placeholder */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-zinc-950 animate-pulse" />
                  )}
                </div>

                {/* Subtle label */}
                <p className="mt-4 text-center text-zinc-600 text-xs tracking-[0.4em] uppercase">
                  One of One · Unrepeatable
                </p>
              </div>

              {/* ── RIGHT: Details ── */}
              <div className="lg:sticky lg:top-24 space-y-10 py-4">

                {/* Category tag */}
                <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase font-medium">
                  Kallaa Collection
                </p>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight tracking-tight">
                  {product.title}
                </h1>

                {/* Price */}
                <p className="text-3xl md:text-4xl text-yellow-400 font-light tracking-tight">
                  ₹{product.price.toLocaleString()}
                </p>

                {/* Ownership Badge */}
                <div>
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-700">
                      <span className="w-2 h-2 rounded-full bg-zinc-500" />
                      COLLECTED BY {product.owner.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-zinc-800" />

                {/* Description */}
                <div>
                  <h3 className="text-zinc-500 text-xs tracking-[0.25em] uppercase mb-3 font-medium">
                    About This Piece
                  </h3>
                  <p className="text-zinc-300 text-lg leading-relaxed font-light">
                    {product.description || "No description available"}
                  </p>
                </div>

                {/* Story Block */}
                <div className="relative pl-6 py-6 rounded-r-xl bg-gradient-to-r from-zinc-900/80 to-transparent border-l-2 border-yellow-500/40">
                  <h3 className="text-zinc-500 text-xs tracking-[0.25em] uppercase mb-3 font-medium">
                    The Story
                  </h3>
                  <p className="text-zinc-400 text-base leading-relaxed italic font-light">
                    {product.story || "Every masterpiece carries an untold story. This one awaits its narrator."}
                  </p>
                </div>

                {/* CTA */}
                {isAvailable && (
                  <button className="w-full py-5 px-8 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-[0.98]">
                    Acquire This Masterpiece
                  </button>
                )}

                {/* Rarity notice */}
                <p className="text-center text-zinc-600 text-xs tracking-[0.2em] leading-relaxed">
                  This piece exists only once. It cannot be reproduced.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fade-in keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
