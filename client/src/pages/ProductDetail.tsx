import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { productApi } from "@/api";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);

      const res = await productApi.getById(productId);

      // normalize response
      const raw =
        res?.data?.product || res?.data || res;

      const normalized = {
        _id: raw?._id || raw?.id,
        title: raw?.title || raw?.name || "Untitled Artwork",
        image:
          raw?.image ||
          raw?.imageUrl ||
          raw?.images?.[0] ||
          "",
        price: raw?.price || 0,
        description: raw?.description || "",
        story: raw?.story || "",
        owner: raw?.owner || "Available",
      };

      setProduct(normalized);
    } catch (err) {
      console.error("Product fetch error:", err);
      setLocation("/products");
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    if (id) fetchProduct(id);
    else setLocation("/products");
  }, [id, fetchProduct, setLocation]);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading masterpiece...</p>
      </div>
    );
  }

  // ❌ No product
  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-serif mb-6">
          {product.title}
        </h1>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full rounded-xl border border-white/10"
              />
            ) : (
              <div className="w-full h-[400px] bg-zinc-900 flex items-center justify-center rounded-xl">
                No Image
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="space-y-6">

            {/* PRICE */}
            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Price</h3>
              <p className="text-3xl text-yellow-400">
                ₹{product.price}
              </p>
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <div>
                <h3 className="text-zinc-400 text-sm mb-1">Description</h3>
                <p className="text-zinc-300">
                  {product.description}
                </p>
              </div>
            )}

            {/* STORY */}
            {product.story && (
              <div>
                <h3 className="text-zinc-400 text-sm mb-1">Story</h3>
                <p className="text-zinc-300 italic">
                  {product.story}
                </p>
              </div>
            )}

            {/* OWNER */}
            <div>
              <h3 className="text-zinc-400 text-sm mb-1">Owner</h3>
              <p>
                {product.owner === "Available"
                  ? "Available"
                  : product.owner}
              </p>
            </div>

            {/* BUTTON */}
            {product.owner === "Available" && (
              <button className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold">
                Acquire This Piece
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}