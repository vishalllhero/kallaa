import { useEffect, useState } from "react";
import { adminApi, productApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Upload,
  Trash2,
  Edit,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  EyeOff,
  Clock,
  BarChart3,
  X,
  Truck,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getProductImage, getImageUrl } from "@/utils/image";
import { safeMap } from "@/utils/safeMap";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    story: "",
    mood: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null;
    productTitle: string;
  }>({ isOpen: false, productId: null, productTitle: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pRes, oRes] = await Promise.all([
        adminApi.getProducts().catch(() => ({ data: { data: [] } })),
        adminApi.getOrders().catch(() => ({ data: { data: [] } })),
      ]);

      const pData =
        pRes?.data?.data || pRes?.data?.products || pRes?.data || [];
      const oData = oRes?.data?.data || oRes?.data?.orders || oRes?.data || [];

      setProducts(Array.isArray(pData) ? pData : []);
      setOrders(Array.isArray(oData) ? oData : []);
    } catch (err: any) {
      console.error("Admin data fetch error:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");

      // Ensure arrays are always arrays
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append("image", selectedFile);

      const uploadResponse = await fetch("/api/products/upload", {
        method: "POST",
        credentials: "include",
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      // Create product with image URL
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        story: formData.story.trim(),
        image: imageUrl,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Product created successfully!");
        resetForm();
        fetchData();
      } else {
        throw new Error(result.message || "Failed to create product");
      }
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      title: product.title || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      story: product.story || "",
      mood: product.mood || "",
    });
    setSelectedFile(null); // Clear selected file when editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (product: any) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id || product._id,
      productTitle: product.title || product.name || "this product",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productTitle: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.productId) return;

    try {
      const response = await fetch(`/api/products/${deleteModal.productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Product deleted successfully");
        fetchData();
        closeDeleteModal();
      } else {
        throw new Error(result.message || "Failed to delete product");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success("Order status updated");
      fetchData();
    } catch (err: any) {
      console.error("[AdminDashboard] Status update error:", err);
      toast.error("Status update failed");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: "", price: "", description: "", story: "", mood: "" });
    setSelectedFile(null);
  };

  // Enhanced loading guard
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3" />
        <span className="text-sm uppercase tracking-widest">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-serif mb-4">Dashboard Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all rounded-full uppercase tracking-widest text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced data integrity check
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3" />
        <span className="text-sm uppercase tracking-widest">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  if (error || !Array.isArray(products) || !Array.isArray(orders)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-serif mb-4">Dashboard Error</h2>
          <p className="text-zinc-400 mb-6">
            {error ||
              "Failed to load dashboard data. Please check your connection and try again."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all rounded-full uppercase tracking-widest text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 pt-20">
      <div className="container mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">Admin Panel</h1>
            <p className="text-zinc-500 text-sm">
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={logout}
              className="px-6 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-full text-xs uppercase tracking-widest font-bold transition-all"
            >
              Logout
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${activeTab === "products" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${activeTab === "orders" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
            >
              Order Management
            </button>
          </div>
        </header>
        {/* Task 2: Detailed Navigation */}
        <div className="flex gap-8 mb-12 overflow-x-auto pb-4 border-b border-white/5 no-scrollbar">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap ${activeTab === "products" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Plus
              size={14}
              className={
                activeTab === "products" ? "text-white" : "text-zinc-700"
              }
            />{" "}
            Add Product
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap ${activeTab === "products" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Package
              size={14}
              className={
                activeTab === "products" ? "text-white" : "text-zinc-700"
              }
            />{" "}
            View Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap ${activeTab === "orders" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Clock
              size={14}
              className={
                activeTab === "orders" ? "text-white" : "text-zinc-700"
              }
            />{" "}
            Recent Orders
          </button>
        </div>
        {/* Task 2: Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Total Products
              </p>
              <h3 className="text-2xl font-serif text-white">
                {products?.length || 0}
              </h3>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Total Orders
              </p>
              <h3 className="text-2xl font-serif text-white">
                {orders?.length || 0}
              </h3>
            </div>
          </div>
        </div>
        {activeTab === "products" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 sticky top-32">
                <h2 className="text-xl font-serif text-white mb-8">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      value={formData.title}
                      onChange={e =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      value={formData.price}
                      onChange={e =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Product Image *
                    </label>
                    <div className="space-y-4">
                      {selectedFile ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#d4af37]/50">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            className="w-full h-full object-cover"
                            alt="Selected image"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl hover:border-[#d4af37]/50 transition-colors cursor-pointer p-6 group">
                          <Plus
                            size={24}
                            className="text-zinc-500 group-hover:text-[#d4af37] mb-2"
                          />
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-[#d4af37] font-bold text-center">
                            Click to select image
                          </span>
                          <span className="text-[8px] text-zinc-600 mt-1">
                            Required for product creation
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Mood (for story generation)
                    </label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      value={formData.mood}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          mood: e.target.value,
                        })
                      }
                    >
                      <option value="">Select mood (optional)</option>
                      <option value="dark">Dark</option>
                      <option value="emotional">Emotional</option>
                      <option value="love">Love</option>
                      <option value="power">Power</option>
                      <option value="mystery">Mystery</option>
                      <option value="serenity">Serenity</option>
                    </select>
                    <p className="text-zinc-600 text-xs mt-1">
                      Leave empty for random story generation
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Story
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      value={formData.story}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          story: e.target.value,
                        })
                      }
                      placeholder="Leave empty for AI-generated story based on mood..."
                    />
                    <p className="text-zinc-600 text-xs mt-1">
                      Leave blank to auto-generate an emotional story
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : isEditing ? (
                        "Update Piece"
                      ) : (
                        "Archive Piece"
                      )}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-3 bg-zinc-800 rounded-xl hover:bg-zinc-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {!products || products?.length || 0 === 0 ? (
                  <div className="text-center py-12 text-zinc-600">
                    No products found in inventory.
                  </div>
                ) : (
                  (Array.isArray(products) ? products : []).map(product => (
                    <div
                      key={product.id || product._id}
                      className="bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 p-6 rounded-2xl border border-white/10 flex items-center justify-between hover:border-[#d4af37]/30 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 group-hover:border-[#d4af37]/20 transition-colors">
                          <ImageWithFallback
                            src={getImageUrl(product.image)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif font-medium text-white mb-1 group-hover:text-[#d4af37] transition-colors">
                            {product.title || product.name}
                          </h3>
                          <p className="text-[#d4af37] text-sm font-medium">
                            ${product.price?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-white font-serif">
                            {product.title}
                          </h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-white/5 rounded-xl hover:bg-[#d4af37]/20 text-white hover:text-[#d4af37] transition-all duration-300 hover:scale-105 border border-transparent hover:border-[#d4af37]/30"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 text-red-500 transition-all duration-300 hover:scale-105 border border-red-500/20 hover:border-red-500/40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : !Array.isArray(orders) ? (
          <div>No Data Found</div>
        ) : (
          <div className="space-y-6">
            {(Array.isArray(orders) ? orders : []).map(order => (
              <div
                key={order.id || order._id}
                className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-xl">
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-2">
                        Name:
                      </span>
                      {order.customerName}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-2">
                        Email:
                      </span>
                      {order.customerEmail} •{" "}
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-2">
                        ID:
                      </span>
                      Piece #{order.productId}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-700 mt-2">
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-2">
                        Address:
                      </span>
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${
                      order.status === "completed"
                        ? "border-green-500/20 text-green-500 bg-green-500/5"
                        : order.status === "shipped"
                          ? "border-blue-500/20 text-blue-500 bg-blue-500/5"
                          : "border-yellow-500/20 text-yellow-500 bg-yellow-500/5"
                    }`}
                  >
                    {order.status}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateStatus(order.id || order._id, "shipped")
                      }
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10"
                      title="Mark Shipped"
                    >
                      <Truck size={16} />
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(order.id || order._id, "completed")
                      }
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10"
                      title="Mark Completed"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Debug Panel (Development Only) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-md z-50 text-xs max-h-96 overflow-y-auto">
            <div className="mb-2 font-bold">AdminDashboard Debug</div>
            <div>
              Products:{" "}
              {Array.isArray(products) ? products?.length || 0 : "N/A"}
            </div>
            <div>Orders: {Array.isArray(orders) ? orders.length : "N/A"}</div>
            <div>Current Tab: {activeTab}</div>
            <div className="mt-2">
              <div className="font-bold">Form Data Image:</div>
              <div className="ml-2">
                {formData.image ? (
                  <div>{formData.image}</div>
                ) : (
                  <div>No image selected</div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="font-bold">Selected Files:</div>
              <div>{selectedFile ? "1 file selected" : "No file selected"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-zinc-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                Delete Product
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="text-white font-medium">
                  "{deleteModal.productTitle}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-3 px-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
