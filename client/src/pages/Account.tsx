import { LogOut, User, Package, Heart, Settings } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { safeMap } from "@/utils/safeMap";

export default function Account() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        const orders = data?.data || data;
        setOrders(Array.isArray(orders) ? orders : []);
      })
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    fetch("/api/wishlist")
      .then(res => res.json())
      .then(data => {
        const wishlist = data?.data || data;
        setWishlist(Array.isArray(wishlist) ? wishlist : []);
      })
      .catch(() => setWishlist([]));
  }, []);

  // 🔐 NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Login Required</h1>
        <p className="mb-6 text-gray-400">
          Please login to access your account
        </p>
        <a href="/login" className="btn-luxury">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-gray-400">Manage your profile & orders</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <div className="bg-card p-6 rounded-lg border border-white/10">
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded ${
                activeTab === "profile"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              <User size={18} /> Profile
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded ${
                activeTab === "orders"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              <Package size={18} /> Orders
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded ${
                activeTab === "wishlist"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              <Heart size={18} /> Wishlist
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded ${
                activeTab === "settings"
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              <Settings size={18} /> Settings
            </button>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-2 rounded text-red-400 hover:bg-red-500/10 mt-4"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4">Profile</h2>
              <p>Name: {user.name || "User"}</p>
              <p>Email: {user.email}</p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4">Orders</h2>
              {!orders || !Array.isArray(orders) || orders.length === 0 ? (
                <p>No orders available</p>
              ) : (
                safeMap(orders, order => (
                  <div
                    key={order.id || order._id}
                    className="border-b border-white/10 py-2"
                  >
                    <p>Order ID: {order.id || order._id}</p>
                    <p>Total: {order.total || "N/A"}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4">Wishlist</h2>
              {!wishlist ||
              !Array.isArray(wishlist) ||
              wishlist.length === 0 ? (
                <p>No wishlist items</p>
              ) : (
                safeMap(wishlist, item => (
                  <div
                    key={item.id || item._id}
                    className="border-b border-white/10 py-2"
                  >
                    <p>Product: {item.name || "Unknown"}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
