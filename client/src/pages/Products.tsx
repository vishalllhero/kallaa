import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import DebugImage from "@/components/DebugImage";
import { useProducts } from "@/hooks/useProducts";

export default function Products() {
  const { products, loading, error } = useProducts();
  const [filter, setFilter] = useState<"all" | "available" | "collected">(
    "all"
  );

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    p => {
      if (filter === "available") return !p?.isSold;
      if (filter === "collected") return p?.isSold;
      return true;
    }
  );

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
              {(Array.isArray(["all", "available", "collected"] as const)
                ? (["all", "available", "collected"] as const)
                : []
              ).map(f => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p>Failed to load archive: {error}</p>
          </div>
        ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            {products.length === 0 ? (
              <>
                <div className="text-6xl mb-8">🎨</div>
                <h3 className="text-2xl font-serif text-zinc-400 mb-4">
                  The archive is empty
                </h3>
                <p className="text-zinc-600">
                  New pieces will be added soon. Check back later.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-8">🔍</div>
                <h3 className="text-2xl font-serif text-zinc-400 mb-4">
                  No {filter} pieces found
                </h3>
                <p className="text-zinc-600">
                  Try selecting a different category.
                </p>
              </>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={product.id || (product as any)._id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Debug component for development */}
        {import.meta.env.DEV && products.length > 0 && (
          <DebugImage
            images={products
              .slice(0, 3)
              .map(p => p.image || p.images?.[0])
              .filter(Boolean) as string[]}
          />
        )}
      </div>
    </div>
  );
}
