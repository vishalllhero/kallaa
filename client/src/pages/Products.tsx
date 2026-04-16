import { useEffect, useState } from "react";
import { Link } from "wouter";
import { productApi } from "@/api";
import { ShoppingBag, Star, Info, ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "@/components/ImageWithFallback";
import DebugImage from "@/components/DebugImage";
import { getProductImage, debugImageInfo } from "@/utils/image";
import { safeMap } from "@/utils/safeMap";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "collected">(
    "all"
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.getAll();
        const productsArray = Array.isArray(data)
          ? data
          : data?.products || data?.data || [];
        setProducts(productsArray);

        // Debug image URLs in development
        if (import.meta.env.DEV) {
          console.log("[Products] Loaded products:", productsArray.length);
          productsArray.slice(0, 3).forEach((product: any, i: number) => {
            debugImageInfo(product.images, `Product ${i + 1}: ${product.name}`);
          });
        }
      } catch (err) {
        toast.error("Failed to load pieces");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === "available") return !p.isSold;
    if (filter === "collected") return p.isSold;
    return true;
  });

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div className="max-w-2xl">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-yellow-400 font-bold mb-4">
                Repository
              </h2>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
                The <span className="italic text-zinc-500">Archive</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Every digital piece in this archive is unique. These are not
                editions; they are individual stories painted onto the digital
                canvas.
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-1 bg-zinc-900 border border-white/5 rounded-full">
              {(["all", "available", "collected"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${filter === f ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-zinc-500 hover:text-white"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-zinc-900 animate-pulse rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                </div>
                <div className="h-6 w-2/3 bg-zinc-900 animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-zinc-900 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🎨</div>
            <h3 className="text-2xl font-serif text-zinc-400 mb-4">
              The archive is empty
            </h3>
            <p className="text-zinc-600">
              New pieces will be added soon. Check back later.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {safeMap(filteredProducts, (product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={product.id}
              >
                <Link href={`/product/${product.id}`} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all duration-700">
                    <ImageWithFallback
                      src={getProductImage(product.images)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      debug={true}
                    />

                    {/* Status Tag */}
                    <div className="absolute top-6 left-6">
                      {product.isSold ? (
                        <div className="px-4 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[8px] font-bold uppercase tracking-[0.3em]">
                          Collected
                        </div>
                      ) : (
                        <div className="px-4 py-1 bg-yellow-400 text-black text-[8px] font-bold uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                          New Release
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-2xl font-serif">
                        ${parseFloat(product.price).toLocaleString()}
                      </span>
                      <div className="w-12 h-12 rounded-full border border-white/10 group-hover:bg-white flex items-center justify-center text-white group-hover:text-black transition-all duration-300">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <h3 className="text-zinc-400 text-xl font-serif mb-1 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                      {product.isSold
                        ? `Curated by ${product.ownerName || "Unknown"}`
                        : "Artist Edition"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Debug component for development */}
        <DebugImage
          images={safeMap(products.slice(0, 3), p => p.images?.[0]).filter(
            Boolean
          )}
        />
      </div>
    </div>
  );
}
