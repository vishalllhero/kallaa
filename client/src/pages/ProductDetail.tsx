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

  useEffect(() => {
    if (!id) return;

    if (!productApi || typeof productApi.getById !== "function") {
      if (import.meta.env.DEV) console.error("❌ productApi missing");
      setError("API not available");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cache-first
        if (productCache.has(id)) {
          if (import.meta.env.DEV) console.log("⚡ CACHE HIT:", id);
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        if (import.meta.env.DEV) console.log("FETCH START:", id);

        const res = await productApi.getById(id);
        if (import.meta.env.DEV) console.log("RAW:", res);

        // Centralized normalization — handles any response shape
        const formatted = normalizeProduct(res);
        if (import.meta.env.DEV) console.log("NORMALIZED PRODUCT:", formatted);

        productCache.set(id, formatted);
        setProduct(formatted);
      } catch (err) {
        if (import.meta.env.DEV) console.error("❌ Fetch failed:", err);
        setError(
          err instanceof Error && err.message.includes("response shape")
            ? "Product data is unavailable"
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ── Render pipeline ──

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
        <p className="text-zinc-400">Product not found</p>
      </div>
    );
  }

  // Safe derived values
  const isAvailable = product.owner === "Available";
  const displayPrice = product.price.toLocaleString();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* DEV debug — stripped from production */}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-96 bg-zinc-900 flex items-center justify-center rounded-xl text-zinc-500">
                No Image Available
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Price</h3>
              <p className="text-3xl text-yellow-400">₹{displayPrice}</p>
            </div>

            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Description</h3>
              <p className="text-zinc-300">{product.description}</p>
            </div>

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
