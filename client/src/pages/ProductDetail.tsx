import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link, useParams } from "wouter";
import { productApi } from "@/api";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ImageSlider from "@/components/ImageSlider";
import ProductInfo from "@/components/ProductInfo";

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
  });

  // Debug logging
  console.log(
    "[ProductDetail] Component render - URL ID:",
    id,
    "Product ID:",
    product?.id,
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
        const product = data?.data || data;
        console.log("[ProductDetail] Full product data:", product);
        console.log("[ProductDetail] Setting product state with:", product);

        setProduct(product);
        console.log("[ProductDetail] Product state updated");
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
    if (!product || product.isSold) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "This exclusive piece may not be available again. Are you sure you want to leave?";
      return "This exclusive piece may not be available again. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [product]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;

    // Show coming soon message
    alert(
      "🎨 Payment integration coming soon!\n\nFor now, please contact us directly:\n📧 admin@kallaa.com\n📱 WhatsApp: +91-XXXXXXXXXX\n\nWe'll help you acquire this masterpiece personally."
    );

    // Alternative: Redirect to contact page or WhatsApp
    // window.location.href = 'https://wa.me/91XXXXXXXXXX?text=Hi%20Kallaa,%20I%20want%20to%20acquire%20this%20artwork';

    setIsOrderModalOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-yellow-400 rounded-full animate-spin" />
      </div>
    );
  if (!product) return null;

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
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Repository
          </Link>
        </motion.div>

        {/* Main Content Layout - Luxury Design */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 lg:gap-16">
          {/* Gallery Section - Large image on left */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ImageSlider
              images={product.image || []}
              alt={product.title || product.name || "Product"}
            />
          </motion.div>

          {/* Info Section - Details on right */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ProductInfo
              product={product}
              onInitiateAcquisition={() => setIsOrderModalOpen(true)}
            />
          </motion.div>
        </div>
      </div>

      {/* Debug Panel (Development Only) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50 text-xs">
          <div className="mb-2 font-bold">ProductDetail Debug</div>
          <div>URL ID: {id || "none"}</div>
          <div>Product ID: {product?.id || "none"}</div>
          <div>Loading: {loading ? "true" : "false"}</div>
          <div>Product Name: {product?.name || "none"}</div>
          <div>Image Field: {product?.image ? "present" : "missing"}</div>
          <div>Image URL: {product?.image?.substring(0, 30) || "none"}...</div>
        </div>
      )}

      {/* Order Modal */}
      {isOrderModalOpen && (
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
              process for <span className="text-white">"{product.name}"</span>.
            </p>

            <form onSubmit={handleOrder} className="space-y-6">
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
              <div className="grid grid-cols-2 gap-6">
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
                    Shipping Region
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.address}
                    onChange={e =>
                      setOrderForm(f => ({ ...f, address: e.target.value }))
                    }
                    className="w-full bg-black border border-white/5 rounded-xl px-6 h-14 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black h-16 rounded-xl font-bold uppercase tracking-[0.2em] text-xs mt-8 hover:bg-yellow-300 transition-all flex items-center justify-center"
              >
                Submit Acquisition Request
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
