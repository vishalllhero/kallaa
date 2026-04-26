import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";

console.log("🔥 ProductDetail ACTIVE");
console.log("API:", productApi);

export type Product = {
  title: string;
  image: string;
  price: number;
  description?: string;
  story?: string;
  owner: string;
};

// ✅ CACHE
export const productCache = new Map<string, Product>();

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("ID:", id);
  console.log("PRODUCT:", product);
  console.log("LOADING:", loading);
  console.log("ERROR:", error);

  useEffect(() => {
    if (!id) return;

    if (!productApi || typeof productApi.getById !== "function") {
      console.error("❌ productApi.getById is not a function!", productApi);
      setError("System Error: API module is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ CACHE FIRST
        if (productCache.has(id)) {
          console.log("⚡ CACHE HIT");
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        console.log("FETCH START");

        const res = await productApi.getById(id);
        console.log("API RESPONSE:", res);

        // api.ts already destructures { data } from axios, so res IS the data
        const data = res?.product ?? res ?? null;
        console.log("DATA:", data);

        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
          setError("Product not found");
          return;
        }

        const formatted: Product = {
          title: data.title ?? data.name ?? "Untitled",
          image: data.image ?? data.imageUrl ?? data.images?.[0] ?? "",
          price: data.price ?? 0,
          description: data.description ?? "",
          story: data.story ?? "",
          owner: data.owner ?? "Available",
        };

        productCache.set(id, formatted);
        setProduct(formatted);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ ROUTE NOT READY
  if (!id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-zinc-400">Loading route...</p>
      </div>
    );
  }

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-zinc-300">Loading product...</p>
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // ✅ NO PRODUCT
  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">No product found</p>
      </div>
    );
  }

  const isAvailable = product.owner === "Available";

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
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
              <div className="w-full h-96 bg-zinc-900 flex items-center justify-center rounded-xl">
                No Image
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Price</h3>
              <p className="text-3xl text-yellow-400">
                ₹{product.price.toLocaleString()}
              </p>
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
