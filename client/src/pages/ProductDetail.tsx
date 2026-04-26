import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";

interface Product {
  title: string;
  image: string;
  price: number;
  description?: string;
  story?: string;
  owner: string;
}

interface RawProductData {
  title?: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  price?: number;
  description?: string;
  story?: string;
  owner?: string;
}

interface ApiResponse {
  data?: {
    product?: RawProductData;
  } & RawProductData;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID");
        setLoading(false);
        return;
      }

      try {
        const res: ApiResponse = await productApi.getById(id);
        const data = res?.data?.product || res?.data || res;

        if (data) {
          const normalizedProduct: Product = {
            title: data.title || data.name || "Untitled",
            image:
              data.image ||
              data.imageUrl ||
              (data.images && data.images[0]) ||
              "",
            price: data.price || 0,
            description: data.description || undefined,
            story: data.story || undefined,
            owner: data.owner || "Available",
          };
          setProduct(normalizedProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading masterpiece...</div>
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {import.meta.env.DEV && (
          <div className="bg-yellow-900/20 border border-yellow-600/50 text-yellow-200 p-4 mb-6 rounded-lg">
            <strong>DEBUG: ProductDetail</strong>
            <br />
            ID: {id} | Loading: {loading ? "true" : "false"} | Product: loaded
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif mb-4 text-white">
            {product.title}
          </h1>
          <p className="text-zinc-400 italic">This piece exists only once</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-w-md h-auto object-cover rounded-xl border border-white/10 shadow-2xl"
              />
            ) : (
              <div className="w-full max-w-md h-96 bg-zinc-900 flex flex-col items-center justify-center rounded-xl border border-white/10">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-zinc-400">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-3">
                Price
              </h3>
              <p className="text-4xl text-yellow-400 font-bold">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.story && (
              <div>
                <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-3">
                  Story
                </h3>
                <p className="text-zinc-300 italic leading-relaxed">
                  {product.story}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-3">
                Ownership
              </h3>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isAvailable
                    ? "bg-green-900/30 text-green-300 border border-green-600/50"
                    : "bg-blue-900/30 text-blue-300 border border-blue-600/50"
                }`}
              >
                {isAvailable ? "Available" : `Owned by ${product.owner}`}
              </div>
            </div>

            {isAvailable && (
              <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-6 rounded-xl font-bold text-lg transition-colors duration-200 shadow-lg">
                Acquire This Masterpiece
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
