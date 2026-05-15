import React, { useEffect, useState, useRef } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";
import { normalizeProduct, type Product } from "@/utils/normalizeProduct";
import { formatPrice } from "@/utils/formatPrice";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export { type Product } from "@/utils/normalizeProduct";
export const productCache = new Map<string, Product>();

/* ── Skeleton ── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
          <div className="aspect-[4/5] rounded-2xl bg-zinc-900/40 animate-pulse" />
          <div className="space-y-8 py-4 animate-pulse">
            <div className="h-3 w-28 bg-zinc-800/50 rounded" />
            <div className="space-y-3">
              <div className="h-12 w-4/5 bg-zinc-800/40 rounded-lg" />
              <div className="h-12 w-3/5 bg-zinc-800/30 rounded-lg" />
            </div>
            <div className="h-8 w-40 bg-zinc-800/30 rounded" />
            <div className="h-8 w-32 bg-zinc-800/20 rounded-full" />
            <div className="w-10 h-px bg-zinc-800" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-zinc-800/20 rounded" />
              <div className="h-3 w-5/6 bg-zinc-800/15 rounded" />
              <div className="h-3 w-3/4 bg-zinc-800/10 rounded" />
            </div>
            <div className="h-32 w-full bg-zinc-900/30 rounded-xl" />
            <div className="h-14 w-full bg-zinc-800/15 rounded-xl" />
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

  const { addToCart } = useCart();

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

  if (loading || (!product && !error)) return <DetailSkeleton />;

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

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Piece not found</p>
      </div>
    );
  }

  const isSold =
    product.isSold === true ||
    (product as any).isSold === 1 ||
    (product.owner !== undefined && product.owner !== "Available");

  /* Build the best available description text */
  const descriptionText =
    product.description?.trim() ||
    (product.story ? product.story.substring(0, 200) + "…" : null) ||
    "A singular work of art — meticulously crafted, never to be repeated.";

  const storyText =
    product.story?.trim() ||
    "Every masterpiece carries an untold story. This one awaits its narrator — perhaps you.";

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to your collection`);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">

            {/* ════════════ LEFT: HERO IMAGE ════════════ */}
            <div className="relative group cursor-crosshair w-full">
              {/* Ambient glow */}
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

                {/* Sold overlay on image */}
                {isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="text-center">
                      <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Collected by</p>
                      <p className="text-white font-serif text-xl">{product.owner || "Anonymous"}</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-4 text-center text-zinc-700 text-[10px] tracking-[0.5em] uppercase select-none">
                One of One · Unrepeatable
              </p>
            </div>

            {/* ════════════ RIGHT: DETAILS ════════════ */}
            <div className="lg:sticky lg:top-20 space-y-8 py-2">

              {/* Collection label */}
              <p className="text-zinc-600 text-[11px] tracking-[0.35em] uppercase font-medium">
                Kallaa Collection
              </p>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif leading-[1.05] tracking-tight text-white break-words">
                {product.title}
              </h1>

              {/* Price / Collected */}
              {!isSold ? (
                <p className="text-yellow-400 text-2xl font-light">
                  {formatPrice(product.price)}
                </p>
              ) : (
                <p className="text-gray-400 text-lg tracking-wide uppercase">
                  Collected
                </p>
              )}

              {/* Status badge */}
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs tracking-widest font-semibold uppercase ${
                  isSold
                    ? "bg-gray-800 text-gray-400"
                    : "bg-green-900/60 text-green-400 border border-green-500/20"
                }`}
              >
                {isSold ? "COLLECTED" : "● AVAILABLE"}
              </span>

              {/* Ownership display for sold products */}
              {isSold && (
                <p className="text-gray-400 text-sm">
                  Collected by{" "}
                  <span className="text-white font-medium">
                    {product.owner || "Anonymous"}
                  </span>
                </p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
                <span className="text-zinc-700 text-[10px] tracking-[0.4em] uppercase">Details</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">
                  About This Piece
                </h3>
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
                  {descriptionText}
                </p>
              </div>

              {/* Story Block */}
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500/60 via-yellow-500/20 to-transparent" />
                <div className="relative px-6 py-6">
                  <h3 className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">
                    The Story
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-[1.8] italic font-light">
                    {storyText}
                  </p>
                </div>
              </div>

              {/* CTA */}
              {!isSold ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-yellow-500/40 uppercase tracking-widest text-sm"
                >
                  <ShoppingCart size={18} />
                  Acquire This Masterpiece
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-3 bg-gray-700/50 text-gray-500 font-bold py-4 px-6 rounded-xl cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  Already Collected
                </button>
              )}

              {/* Price repeat (mobile friendly) */}
              {!isSold && (
                <p className="text-center text-zinc-500 text-sm">
                  {formatPrice(product.price)} · Free Worldwide Shipping
                </p>
              )}

              {/* Exclusivity note */}
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
