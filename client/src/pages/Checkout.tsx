import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { orderApi } from "@/api";
import { toast } from "sonner";
import { CreditCard, Truck, Shield } from "lucide-react";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const orderData = {
        userId: user.id,
        products: items.map(item => item.product.id),
        total,
        status: "pending",
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: formData.address,
      };

      await orderApi.create(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      setLocation("/");
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-white mb-2">Checkout</h1>
          <p className="text-zinc-500 mb-12">Complete your collection</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Form */}
            <div>
              <div className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
                <h2 className="text-xl font-serif text-white mb-6">
                  Shipping Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.address}
                      onChange={e =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      placeholder="Enter your full shipping address"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Place Order - ${total.toLocaleString()}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
                <h2 className="text-xl font-serif text-white mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-8">
                  {items.map(item => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {item.product.title}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-white font-medium">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Shield size={16} />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Truck size={16} />
                    <span>Free worldwide shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
