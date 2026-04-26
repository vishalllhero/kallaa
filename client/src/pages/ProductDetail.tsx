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

export const productCache = new Map<string, Product>();

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Phase 8: Anti-crash guard
    if (!productApi || typeof productApi.getById !== "function") {
      if (import.meta.env.DEV) {
        console.error("❌ productApi.getById is not a function", productApi);
      }
      setError("API not available");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Phase 5: Cache-first
        if (productCache.has(id)) {
          if (import.meta.env.DEV) console.log("⚡ CACHE HIT:", id);
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        if (import.meta.env.DEV) console.log("FETCH START:", id);

        // Phase 1: All API variables scoped inside this function
        const res = await productApi.getById(id);
        if (import.meta.env.DEV) console.log("RAW:", res);

        // Phase 5: Normalize — api.ts already destructures { data } from axios
        const data = res?.product ?? res ?? null;
        if (import.meta.env.DEV) console.log("FINAL:", data);

        if (
          !data ||
          (typeof data === "object" && Object.keys(data).length === 0)
        ) {
          setError("Product not found");
          return;
        }

        const formatted: Product = {
          title: data.title ?? data.name ?? "Untitled",
          image: data.image ?? data.imageUrl ?? data.images?.[0] ?? "",
          price: Number(data.price) || 0,
          description: data.description ?? "",
          story: data.story ?? "",
          owner: data.owner ?? "Available",
        };

        if (import.meta.env.DEV) console.log("FORMATTED:", formatted);

        productCache.set(id, formatted);
        setProduct(formatted);
      } catch (err) {
        if (import.meta.env.DEV) console.error("❌ Fetch failed:", err);
        setError("Failed to load product");
      } finally {
        // Phase 4: Guaranteed — UI never hangs
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Phase 3: Strict render pipeline — no invalid state reaches main UI

  if (!id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-zinc-400">Resolving route...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-zinc-300">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-zinc-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">No product found</p>
      </div>
    );
  }

  // Phase 9: Safe derived state — guarded before main UI
  const isAvailable = product.owner === "Available";
  const displayPrice = typeof product.price === "number"
    ? product.price.toLocaleString()
    : "0";

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Phase 6: DEV debug panel — stripped in production */}
        {import.meta.env.DEV && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-8 font-mono text-xs text-green-400 overflow-auto max-h-48">
            <strong>DEBUG:</strong> id={id} | owner={product.owner} | price={product.price}
            <pre className="mt-2 text-zinc-400">{JSON.stringify(product, null, 2)}</pre>
          </div>
        )}

        <h1 className="text-4xl font-serif mb-6 text-center">
          {product.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-96 bg-zinc-900 flex items-center justify-center rounded-xl text-zinc-500">
                No Image
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Price</h3>
              <p className="text-3xl text-yellow-400">₹{displayPrice}</p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-zinc-400 text-sm mb-1">Description</h3>
                <p className="text-zinc-300">{product.description}</p>
              </div>
            )}

            {product.story && (
              <div>
                <h3 className="text-zinc-400 text-sm mb-1">Story</h3>
                <p className="italic text-zinc-400">{product.story}</p>
              </div>
            )}

            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Owner</h3>
              <p>{isAvailable ? "Available" : product.owner}</p>
            </div>

            {isAvailable && (
              <button className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
                Acquire This Masterpiece
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
