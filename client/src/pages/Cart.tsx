import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getImageUrl } from "@/utils/image";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast.success("Item removed from cart");
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag size={64} className="mx-auto mb-6 text-zinc-600" />
            <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
            <p className="text-zinc-400 mb-8">
              Discover unique pieces and add them to your collection.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-yellow-400 text-black font-bold uppercase tracking-widest hover:bg-yellow-300 transition-all rounded-full"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">
              Your Collection
            </h1>
            <p className="text-zinc-500 text-sm">
              {itemCount} unique piece{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div
                key={item.product.id}
                className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 flex items-center gap-6"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800">
                  <ImageWithFallback
                    src={getImageUrl(item.product.image)}
                    className="w-full h-full object-cover"
                    alt={item.product.title}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-serif text-lg">
                    {item.product.title}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    ${item.product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.product.id);
                      toast.success("Item removed from cart");
                    }}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5 sticky top-32">
              <h2 className="text-xl font-serif text-white mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full block text-center px-8 py-4 bg-yellow-400 text-black font-bold uppercase tracking-widest hover:bg-yellow-300 transition-all rounded-full"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="w-full block text-center mt-4 px-8 py-4 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all rounded-full uppercase tracking-widest text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
