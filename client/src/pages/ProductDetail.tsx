import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";

export type Product = {
  title: string;
  image: string;
  price: number;
  description?: string;
  story?: string;
  owner: string;
};

// 1. IN-MEMORY CACHE
export const productCache = new Map<string, Product>();
const activeFetches = new Map<string, Promise<void>>();

// 2. GLOBAL PREFETCH FUNCTION (Call onMouseEnter)
export const prefetchProduct = async (id: string) => {
  if (!id || productCache.has(id)) return;
  if (activeFetches.has(id)) return activeFetches.get(id);

  const fetchPromise = (async () => {
    try {
      // Background fetch without AbortController since we want it to complete
      const res = await (productApi.getById as any)(id);
      const data = res?.data?.product || res?.data || res;
      if (data) {
        productCache.set(id, {
          title: data.title || data.name || "Untitled",
          image: data.image || data.imageUrl || data.images?.[0] || "",
          price: data.price || 0,
          description: data.description || "",
          story: data.story || "",
          owner: data.owner || "Available"
        });
      }
    } catch (err) {
      // Silently fail for prefetches
    } finally {
      activeFetches.delete(id);
    }
  })();

  activeFetches.set(id, fetchPromise);
  return fetchPromise;
};

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  // 3. INITIALIZE FROM CACHE (Zero Lag)
  const [product, setProduct] = useState<Product | null>(() => {
    if (id && productCache.has(id)) return productCache.get(id)!;
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!product);
  const [error, setError] = useState<string | null>(null);

  // Debug states
  const [isCacheHit] = useState<boolean>(!!product);
  const [fetchTime, setFetchTime] = useState<number>(0);

  // 4. STALE-WHILE-REVALIDATE FETCH
  useEffect(() => {
    if (!id) return;

    // If id changed, reset state immediately from cache if available
    const cached = productCache.get(id);
    if (cached) {
      setProduct(cached);
      setLoading(false);
    } else {
      setProduct(null);
      setLoading(true);
    }

    const controller = new AbortController();
    const startTime = performance.now();

    const fetchProduct = async () => {
      try {
        setError(null);

        const res = await (productApi.getById as any)(id, {
          signal: controller.signal
        });

        const data = res?.data?.product || res?.data || res;

        const freshProduct = {
          title: data.title || data.name || "Untitled",
          image: data.image || data.imageUrl || data.images?.[0] || "",
          price: data.price || 0,
          description: data.description || "",
          story: data.story || "",
          owner: data.owner || "Available"
        };

        productCache.set(id, freshProduct);
        setProduct(freshProduct);
        setFetchTime(Math.round(performance.now() - startTime));

      } catch (err: any) {
        if (err.name !== "AbortError") {
          // Only show hard error if we don't have a cached version to display
          if (!productCache.has(id)) {
            setError("Failed to load product");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-zinc-500 text-lg">Initializing route...</div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error</div>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  // 5. SKELETON UI (No hard loading screens)
  if (loading || !product) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="text-center mb-12 flex flex-col items-center">
            <div className="h-14 bg-white/5 w-3/4 max-w-lg rounded-lg mb-4"></div>
            <div className="h-6 bg-white/5 w-64 rounded-lg"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="flex justify-center">
               <div className="w-full aspect-square bg-zinc-900/50 rounded-xl border border-white/5 shadow-2xl"></div>
            </div>
            <div className="space-y-8">
               <div className="border-b border-white/5 pb-8 space-y-4">
                 <div className="h-4 bg-white/5 w-1/4 rounded"></div>
                 <div className="h-10 bg-white/5 w-1/2 rounded"></div>
               </div>
               <div className="border-b border-white/5 pb-8 space-y-4">
                 <div className="h-4 bg-white/5 w-1/4 rounded"></div>
                 <div className="h-4 bg-white/5 w-full rounded"></div>
                 <div className="h-4 bg-white/5 w-5/6 rounded"></div>
                 <div className="h-4 bg-white/5 w-4/6 rounded"></div>
               </div>
               <div className="border-b border-white/5 pb-8 space-y-4">
                 <div className="h-4 bg-white/5 w-1/4 rounded"></div>
                 <div className="h-10 bg-white/5 w-1/3 rounded-full"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = product.owner === "Available";

  // 6. MAIN UI (Smooth Fade-In)
  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-500 fill-mode-forwards">
      <div className="max-w-4xl mx-auto">
        {import.meta.env.DEV && (
          <div className="bg-yellow-900/20 border border-yellow-600/50 text-yellow-200 p-4 mb-8 rounded-lg font-mono text-sm flex justify-between items-center">
            <div>
              <strong>DEBUG: ProductDetail</strong><br/>
              ID: {id}
            </div>
            <div className="text-right">
              Cache: {isCacheHit ? "HIT ⚡" : "MISS 🐢"}<br/>
              Fetch: {fetchTime}ms
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-white tracking-wide leading-tight">
            {product.title}
          </h1>
          <p className="text-zinc-400 italic text-lg tracking-wide opacity-80">This piece exists only once</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="flex justify-center group">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-xl border border-white/10 shadow-2xl transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              />
            ) : (
              <div className="w-full aspect-square bg-zinc-900 flex flex-col items-center justify-center rounded-xl border border-white/10 shadow-2xl">
                <div className="text-6xl mb-4 opacity-30">🖼️</div>
                <p className="text-zinc-600 font-medium tracking-wide">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-8 relative">
            <div className="border-b border-white/10 pb-8 transition-all duration-500 hover:border-white/20">
              <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
                Price
              </h3>
              <p className="text-4xl text-yellow-400 font-serif tracking-tight drop-shadow-sm">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div className="border-b border-white/10 pb-8 transition-all duration-500 hover:border-white/20">
                <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
                  Description
                </h3>
                <p className="text-zinc-300 leading-relaxed text-lg font-light opacity-90">
                  {product.description}
                </p>
              </div>
            )}

            {product.story && (
              <div className="border-b border-white/10 pb-8 transition-all duration-500 hover:border-white/20">
                <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
                  Story
                </h3>
                <p className="text-zinc-400 italic leading-relaxed text-lg font-light opacity-80">
                  {product.story}
                </p>
              </div>
            )}

            <div className="pt-4">
              <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-4 font-medium">
                Ownership
              </h3>
              <div
                className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium tracking-widest transition-all duration-300 ${
                  isAvailable
                    ? "bg-green-900/20 text-green-400 border border-green-500/30 hover:bg-green-900/40 hover:border-green-500/50"
                    : "bg-blue-900/20 text-blue-400 border border-blue-500/30 hover:bg-blue-900/40 hover:border-blue-500/50"
                }`}
              >
                {isAvailable ? "AVAILABLE" : `OWNED BY ${product.owner.toUpperCase()}`}
              </div>
            </div>

            {isAvailable && (
              <div className="pt-8">
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-6 rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-500 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] transform hover:-translate-y-1 active:translate-y-0">
                  Acquire This Masterpiece
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
