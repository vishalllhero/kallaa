import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link, useParams } from "wouter";
import { productApi } from "@/api";
import { ChevronLeft, X, ShoppingCart, Crown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ImageSlider from "@/components/ImageSlider";
import ProductInfo from "@/components/ProductInfo";
import { ProductSkeleton } from "@/components/Skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "cash",
  });
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Debug logging
  console.log(
    "[ProductDetail] Component render - URL ID:",
    id,
    "Product exists:",
    !!product,
    "Product keys:",
    product ? Object.keys(product) : "none",
    "Loading:",
    loading
  );

  const fetchProduct = useCallback(
    async (productId: string) => {
      console.log("[ProductDetail] Starting fetch for product ID:", productId);
      try {
        setLoading(true);
        // Clear previous product data immediately
        setProduct(null);
        console.log("[ProductDetail] Cleared previous product data");

        const data = await productApi.getById(productId);
        console.log("[ProductDetail] API returned data:", data);

        // Normalize product data extraction
        const product =
          data?.data?.product || data?.product || data?.data || data;
        console.log("[ProductDetail] Normalized product:", product);

        // Normalize field mappings
        const normalizedProduct = {
          ...product,
          // Normalize image field
          image: product?.image || product?.imageUrl || product?.images?.[0],
          // Normalize title field
          title: product?.title || product?.name,
          // Normalize story field
          story: product?.story || product?.description,
        };

        console.log("[ProductDetail] Normalized fields:");
        console.log("  - Image:", normalizedProduct.image);
        console.log("  - Title:", normalizedProduct.title);
        console.log("  - Story:", normalizedProduct.story);
        console.log("  - All fields:", Object.keys(normalizedProduct));

        setProduct(normalizedProduct);
        console.log("[ProductDetail] Normalized product state updated");
      } catch (err) {
        console.error("[ProductDetail] Fetch error:", err);
        toast.error("Piece not found");
        setLocation("/products");
      } finally {
        setLoading(false);
        console.log("[ProductDetail] Loading set to false");
      }
    },
    [setLocation]
  );

  useEffect(() => {
    console.log("[ProductDetail] useEffect triggered with ID:", id);
    if (id) {
      console.log("[ProductDetail] Valid ID, calling fetchProduct");
      fetchProduct(id);
    } else {
      console.log("[ProductDetail] No ID, redirecting to products");
      setLocation("/products");
    }
  }, [id, fetchProduct, setLocation]);

  // Placeholder: Razorpay script would be loaded here when ready
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //   script.async = true;
  //
  //   const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  //   if (!existingScript) {
  //     document.body.appendChild(script);
  //   }
  // }, []);

  // Fear of Loss Trigger - show message when user tries to leave
  useEffect(() => {
    if (!product || product?.owner !== "Available") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "This exclusive piece may not be available again. Are you sure you want to leave?";
      return "This exclusive piece may not be available again. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [product]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setIsPurchasing(true);

      // Create order
      const productId = safeProduct._id;
      if (!productId) {
        throw new Error("Invalid product ID");
      }

      const orderData = {
        products: [productId],
        total: safeProduct.price || 0,
        paymentMethod: orderForm.paymentMethod,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Purchase completed successfully!");
        setIsOrderModalOpen(false);

        // Update product ownership locally
        setProduct(prev =>
          prev
            ? {
                ...prev,
                owner: "You", // Could be actual user name
                isSold: true,
              }
            : null
        );
      } else {
        throw new Error(result.message || "Purchase failed");
      }
    } catch (err: any) {
      console.error("Purchase error:", err);
      toast.error(err.message || "Purchase failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black text-white"
      >
        <div className="container mx-auto px-6 pt-24 pb-20">
          <div className="mb-16">
            <div className="h-4 bg-zinc-800 rounded w-32 mb-8 animate-pulse" />
            <div className="h-12 bg-zinc-800 rounded w-96 animate-pulse" />
          </div>
          <ProductSkeleton />
        </div>
      </motion.div>
    );
  if (!product) {
    console.log("[ProductDetail] No product data, showing fallback");
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-yellow-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading masterpiece...</p>
        </div>
      </div>
    );
  }

  // Normalize product data with safe defaults
  const safeProduct = {
    _id: product?._id || product?.id || "",
    title: product?.title || product?.name || "Untitled Artwork",
    image: product?.image || product?.imageUrl || product?.images?.[0] || "",
    price: product?.price || 0,
    description: product?.description || "",
    story: product?.story || "",
    owner: product?.owner || "Available",
    thumbnail: product?.thumbnail || product?.image || "",
    zoomImage: product?.zoomImage || product?.image || "",
  };

  console.log("PRODUCT DATA:", product);
  console.log("SAFE PRODUCT:", safeProduct);
  console.log("[ProductDetail] Safe product normalization:");
  console.log("  - Raw title:", product?.title || product?.name || "none");
  console.log("  - Safe title:", safeProduct.title);
  console.log("  - Raw image:", product?.image || product?.imageUrl || "none");
  console.log("  - Safe image:", safeProduct.image);
  console.log("  - Has story:", !!safeProduct.story);

  return (
    <motion.div
      key={id}
      className="min-h-screen text-white selection:bg-yellow-400 selection:text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 pt-24 pb-20 relative z-10">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300 uppercase text-[10px] tracking-[0.3em] font-bold mb-16 group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Back to Collection
          </Link>
        </motion.div>

        {/* Simple Product Display - Safe Fallback UI */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-3xl p-8 border border-white/10"
          >
            {/* Product Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-serif text-white mb-6"
            >
              {safeProduct.title}
            </motion.h1>

            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              {safeProduct.image ? (
                <div className="w-full max-w-md mx-auto">
                  <img
                    src={safeProduct.image}
                    alt={safeProduct.title}
                    className="w-full h-auto rounded-2xl border border-white/10"
                    onError={e => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full aspect-[4/5] bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
                            <div class="text-center">
                              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span class="text-zinc-400 text-2xl">🎨</span>
                              </div>
                              <span class="text-zinc-500 text-sm font-medium">Image not available</span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/5] bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-zinc-400 text-2xl">🎨</span>
                    </div>
                    <span className="text-zinc-500 text-sm font-medium">
                      Image not available
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Product Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <span className="text-3xl font-serif text-[#d4af37]">
                $
                {typeof safeProduct.price === "number"
                  ? safeProduct.price.toLocaleString()
                  : safeProduct.price}
              </span>
            </motion.div>

            {/* Product Description */}
            {safeProduct.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {safeProduct.description}
                </p>
              </motion.div>
            )}

            {/* Product Story */}
            {safeProduct.story && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-3">
                  Story
                </h3>
                <p className="text-zinc-300 leading-relaxed italic">
                  {safeProduct.story}
                </p>
              </motion.div>
            )}

            {/* Product Owner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  safeProduct.owner === "Available"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                }`}
              >
                <span>Owner: {safeProduct.owner}</span>
              </span>
            </motion.div>

            {/* Purchase Button */}
            {safeProduct.owner === "Available" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black h-16 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:from-[#b8860b] hover:to-[#daa520] transition-all duration-300 flex items-center justify-center gap-3"
              >
                Acquire This Piece
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && safeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-xl p-12 relative animate-fade-in">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-serif mb-4">Acquisition Request</h2>
            <p className="text-zinc-400 mb-12">
              Please provide your details to initiate the private acquisition
              process for{" "}
              <span className="text-white">"{safeProduct.title}"</span>.
            </p>

            <form onSubmit={handlePurchase} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 block mb-3">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.name}
                  onChange={e =>
                    setOrderForm(f => ({ ...f, name: e.target.value }))
                  }
                  className="w-full bg-black border border-white/5 rounded-xl px-6 h-14 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Collector Name"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 block mb-3">
                  Professional Email
                </label>
                <input
                  type="email"
                  required
                  value={orderForm.email}
                  onChange={e =>
                    setOrderForm(f => ({ ...f, email: e.target.value }))
                  }
                  className="w-full bg-black border border-white/5 rounded-xl px-6 h-14 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 block mb-3">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={orderForm.address}
                  onChange={e =>
                    setOrderForm(f => ({ ...f, address: e.target.value }))
                  }
                  className="w-full bg-black border border-white/5 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  placeholder="Full delivery address for secure transport"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 block mb-3">
                  Payment Method
                </label>
                <select
                  value={orderForm.paymentMethod}
                  onChange={e =>
                    setOrderForm(f => ({ ...f, paymentMethod: e.target.value }))
                  }
                  className="w-full bg-black border border-white/5 rounded-xl px-6 h-14 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isPurchasing}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black h-16 rounded-xl font-bold uppercase tracking-[0.2em] text-sm mt-8 hover:from-[#b8860b] hover:to-[#daa520] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isPurchasing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing Acquisition...
                  </>
                ) : (
                  <>
                    <Crown size={18} />
                    Complete Acquisition
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Debug Panel (Development Only) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50 text-xs max-h-96 overflow-y-auto">
          <div className="mb-2 font-bold text-yellow-400">
            ProductDetail Debug
          </div>
          <div>URL ID: {id || "none"}</div>
          <div>Product exists: {product ? "✅" : "❌"}</div>
          <div>Loading: {loading ? "⏳" : "✅"}</div>
          {product && safeProduct && (
            <>
              <div className="border-t border-zinc-700 pt-2 mt-2">
                <div className="font-semibold text-green-400 mb-1">
                  Safe Product:
                </div>
                <div>ID: {safeProduct._id || "none"}</div>
                <div>Title: {safeProduct.title}</div>
                <div>Image: {safeProduct.image ? "✅" : "❌"}</div>
                <div>Price: ${safeProduct.price}</div>
                <div>Owner: {safeProduct.owner}</div>
                <div>Story: {safeProduct.story ? "✅" : "❌"}</div>
              </div>
              <div className="border-t border-zinc-700 pt-2 mt-2">
                <div className="font-semibold text-blue-400 mb-1">
                  Raw Product:
                </div>
                <div>All fields: {Object.keys(product).join(", ")}</div>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
