import React, { useEffect, useState, useRef } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";
import { normalizeProduct, type Product } from "@/utils/normalizeProduct";

export { type Product } from "@/utils/normalizeProduct";
export const productCache = new Map<string, Product>();

/* ── Skeleton loader matching final layout ── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <div className="aspect-[4/5] rounded-2xl bg-zinc-900/40 animate-pulse" />
          <div className="space-y-10 py-6 animate-pulse">
            <div className="h-3 w-28 bg-zinc-800/50 rounded" />
            <div className="space-y-3">
              <div className="h-14 w-4/5 bg-zinc-800/40 rounded-lg" />
              <div className="h-14 w-3/5 bg-zinc-800/30 rounded-lg" />
            </div>
            <div className="h-10 w-48 bg-zinc-800/30 rounded" />
            <div className="h-9 w-36 bg-zinc-800/20 rounded-full" />
            <div className="w-12 h-px bg-zinc-800" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-zinc-800/20 rounded" />
              <div className="h-3 w-5/6 bg-zinc-800/15 rounded" />
              <div className="h-3 w-3/4 bg-zinc-800/10 rounded" />
            </div>
            <div className="h-36 w-full bg-zinc-900/30 rounded-xl" />
            <div className="h-16 w-full bg-zinc-800/15 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgReady, setImgReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!id) return;
    if (!productApi || typeof productApi.getById !== "function") {
      setError("Service temporarily unavailable");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setImgReady(false);
        setVisible(false);

        if (productCache.has(id)) {
          setProduct(productCache.get(id)!);
          setLoading(false);
          setTimeout(() => { if (mounted.current) setVisible(true); }, 50);
          return;
        }

        const res = await productApi.getById(id);
        const formatted = normalizeProduct(res);

        if (!mounted.current) return;
        productCache.set(id, formatted);
        setProduct(formatted);
      } catch {
        if (mounted.current) setError("Unable to load this piece");
      } finally {
        if (mounted.current) {
          setLoading(false);
          setTimeout(() => { if (mounted.current) setVisible(true); }, 50);
        }
      }
    };

    fetchData();
  }, [id]);

  /* ── Skeleton while loading ── */
  if (loading || (!product && !error)) {
    return <DetailSkeleton />;
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
        <div>
          <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase mb-4">Something went wrong</p>
          <p className="text-zinc-400 text-lg font-light">{error}</p>
        </div>
      </div>
    );
  }

  /* ── Fallback guard ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Piece not found</p>
      </div>
    );
  }

  const isAvailable = product.owner === "Available";

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* ── Cinematic Content ── */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">

            {/* ════════════ LEFT: HERO IMAGE ════════════ */}
            <div className="relative group cursor-crosshair">
              {/* Ambient glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-500/[0.03] via-transparent to-emerald-500/[0.02] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              <div className="relative overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl shadow-black/50">
                {/* Gold sweep overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/[0.04] via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />

                <img
                  src={product.image || "https://placehold.co/800x1000/0a0a0a/222?text=KALLAA"}
                  alt={product.title}
                  className={[
                    "w-full aspect-[4/5] object-cover",
                    "transition-all duration-700 ease-out",
                    "group-hover:scale-105 group-hover:brightness-110",
                    imgReady ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                  onLoad={() => setImgReady(true)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/800x1000/0a0a0a/222?text=KALLAA";
                    setImgReady(true);
                  }}
                />

                {!imgReady && (
                  <div className="absolute inset-0 bg-zinc-950 animate-pulse" />
                )}
              </div>

              <p className="mt-5 text-center text-zinc-700 text-[10px] tracking-[0.5em] uppercase select-none">
                One of One · Unrepeatable
              </p>
            </div>

            {/* ════════════ RIGHT: DETAILS ════════════ */}
            <div className="lg:sticky lg:top-20 space-y-10 py-2">

              {/* Collection label */}
              <p className="text-zinc-600 text-[11px] tracking-[0.35em] uppercase font-medium">
                Kallaa Collection
              </p>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight text-white">
                {product.title}
              </h1>

              {/* Price */}
              <p className="text-3xl sm:text-4xl text-yellow-400 font-extralight tracking-tight">
                ₹{product.price.toLocaleString()}
              </p>

              {/* Ownership badge */}
              {isAvailable ? (
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Available for Acquisition
                </span>
              ) : (
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.15em] uppercase bg-zinc-900/60 text-zinc-500 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  Collected by {product.owner}
                </span>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
                <span className="text-zinc-700 text-[10px] tracking-[0.4em] uppercase">Details</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mb-4 font-medium">
                  About This Piece
                </h3>
                <p className="text-zinc-300 text-lg leading-relaxed font-light">
                  {product.description || "No description available"}
                </p>
              </div>

              {/* Story Block */}
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500/60 via-yellow-500/20 to-transparent" />
                <div className="relative px-7 py-7">
                  <h3 className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mb-4 font-medium">
                    The Story
                  </h3>
                  <p className="text-zinc-400 text-base leading-[1.8] italic font-light">
                    {product.story || "Every masterpiece carries an untold story. This one awaits its narrator — perhaps you."}
                  </p>
                </div>
              </div>

              {/* CTA */}
              {isAvailable && (
                <button className="group relative w-full py-5 rounded-xl font-semibold text-sm uppercase tracking-[0.25em] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-yellow-400 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative text-black">Acquire This Masterpiece</span>
                </button>
              )}

              {/* Exclusivity psychology */}
              <p className="text-center text-zinc-700 text-[10px] tracking-[0.4em] uppercase leading-relaxed select-none">
                This piece exists only once.<br />
                It cannot be reproduced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
