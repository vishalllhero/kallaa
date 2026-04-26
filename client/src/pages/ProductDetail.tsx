import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";

type Product = {
  title: string;
  image: string;
  price: number;
  description?: string;
  story?: string;
  owner: string;
};

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using any here as a fallback in case productApi.getById 
        // doesn't have the config parameter typed correctly yet
        const res = await (productApi.getById as any)(id, {
          signal: controller.signal
        });

        const data = res?.data?.product || res?.data || res;

        setProduct({
          title: data.title || data.name || "Untitled",
          image: data.image || data.imageUrl || data.images?.[0] || "",
          price: data.price || 0,
          description: data.description || "",
          story: data.story || "",
          owner: data.owner || "Available"
        });

      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to load product");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-zinc-300 text-lg">Loading masterpiece...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error</div>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-400 text-lg">Product not found</div>
        </div>
      </div>
    );
  }

  const isAvailable = product.owner === "Available";

  return (
    <div className="min-h-screen bg-black text-white p-8 transition-opacity duration-300">
      <div className="max-w-4xl mx-auto">
        {import.meta.env.DEV && (
          <div className="bg-yellow-900/20 border border-yellow-600/50 text-yellow-200 p-4 mb-8 rounded-lg font-mono text-sm">
            <strong>DEBUG: ProductDetail</strong>
            <br />
            ID: {id} | Loading: {loading ? "true" : "false"} | Product: loaded
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-white tracking-wide">
            {product.title}
          </h1>
          <p className="text-zinc-400 italic text-lg tracking-wide">This piece exists only once</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="flex justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full aspect-square bg-zinc-900 flex flex-col items-center justify-center rounded-xl border border-white/10 shadow-2xl">
                <div className="text-6xl mb-4 opacity-50">🖼️</div>
                <p className="text-zinc-500 font-medium tracking-wide">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
              <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3">
                Price
              </h3>
              <p className="text-4xl text-yellow-400 font-serif tracking-tight">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div className="border-b border-white/10 pb-8">
                <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3">
                  Description
                </h3>
                <p className="text-zinc-300 leading-relaxed text-lg font-light">
                  {product.description}
                </p>
              </div>
            )}

            {product.story && (
              <div className="border-b border-white/10 pb-8">
                <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-3">
                  Story
                </h3>
                <p className="text-zinc-400 italic leading-relaxed text-lg font-light">
                  {product.story}
                </p>
              </div>
            )}

            <div className="pt-4">
              <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-4">
                Ownership
              </h3>
              <div
                className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors ${
                  isAvailable
                    ? "bg-green-900/20 text-green-400 border border-green-500/30"
                    : "bg-blue-900/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {isAvailable ? "Available" : `Owned by ${product.owner}`}
              </div>
            </div>

            {isAvailable && (
              <div className="pt-8">
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-6 rounded-xl font-medium tracking-wide text-lg transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transform hover:-translate-y-1">
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
