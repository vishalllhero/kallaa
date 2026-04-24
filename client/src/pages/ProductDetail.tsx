import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link, useParams } from "wouter";
import { productApi } from "@/api";
import { ChevronLeft, X, ShoppingCart, Crown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
    paymentMethod: "cash",
  });
  const [isPurchasing, setIsPurchasing] = useState(false);

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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setIsPurchasing(true);

      // Create order
      const orderData = {
        products: [product._id || product.id],
        total: product.price,
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
        <div>Product Detail Page - {product?.title || "Loading..."}</div>
      </div>
    </motion.div>
  );
}
