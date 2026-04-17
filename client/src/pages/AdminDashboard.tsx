import { useEffect, useState } from "react";
import { adminApi, productApi } from "@/api";
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
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    images: [] as string[],
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pData, oData] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getOrders(),
      ]);
      setProducts(Array.isArray(pData?.data) ? pData.data : []);
      setOrders(Array.isArray(oData?.data) ? oData.data : []);
    } catch (err) {
      toast.error("Access denied or server error");
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
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      console.log("[AdminDashboard] Uploading files:", selectedFiles.length);
      const { urls } = await adminApi.uploadImages(selectedFiles);
      console.log("[AdminDashboard] Upload response URLs:", urls);
      setFormData(prev => ({ ...prev, images: urls }));
      console.log("[AdminDashboard] Set formData.images to:", urls);
      setSelectedFiles([]);
      toast.success("Images uploaded to gallery");
    } catch (err) {
      console.error("[AdminDashboard] Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      let imageUrls = formData.images;

      // Upload images first if any files are selected
      if (selectedFiles.length > 0) {
        console.log("[AdminDashboard] Uploading images first...");
        const formDataUpload = new FormData();
        selectedFiles.forEach(file => formDataUpload.append("images", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadRes.json();
        imageUrls = uploadData.urls;
        console.log("[AdminDashboard] Images uploaded:", imageUrls);

        // Clear selected files after successful upload
        setSelectedFiles([]);
      }

      // Prepare product data
      const productData = {
        name: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        story: formData.description, // Using description as story for now
        images: imageUrls,
      };

      console.log("[AdminDashboard] Submitting product data:", productData);

      if (isEditing && currentId) {
        console.log("[AdminDashboard] Updating product:", currentId);
        await adminApi.updateProduct(currentId, productData);
        toast.success("Product updated");
      } else {
        console.log("[AdminDashboard] Creating new product");
        const result = await adminApi.createProduct(productData);
        console.log("[AdminDashboard] Create result:", result);
        toast.success("Product added successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error("[AdminDashboard] Submit error:", err);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      title: product.name || "",
      price: product.price?.toString() || "",
      images: product.images || [],
      description: product.description || product.story || "",
    });
    setSelectedFiles([]); // Clear selected files when editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success("Order status updated");
      fetchData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: "", price: "", images: [], description: "" });
    setSelectedFiles([]);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 pt-20">
      <div className="container mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">Admin Panel</h1>
            <p className="text-zinc-500 text-sm">
              Manage your repository and collectors
            </p>
          </div>
          <div className="flex gap-4">
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
                {products.length}
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
                {orders.length}
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
                      Product Images
                    </label>
                    <div className="space-y-4">
                      {/* Uploaded Images */}
                      {formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {safeMap(formData.images)(Array.isArray(data) ? data : []).map(...)
                            (Array.isArray(orders) ? orders : []).map(...)
                            (Array.isArray(items) ? items : []).map(...)(url, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-white/10"
                          >
                            <ImageWithFallback
                              src={getImageUrl(url)}
                              className="w-full h-full object-cover"
                              alt={`Uploaded ${index + 1}`}
                            />
                          </div>
                          ))}
                        </div>
                      )}
                      {/* Selected Files Preview */}
                      {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {safeMap(selectedFiles)(Array.isArray(data) ? data : []).map(...)
                            (Array.isArray(orders) ? orders : []).map(...)
                            (Array.isArray(items) ? items : []).map(...)(file, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-yellow-400/50"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              alt={`Preview ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                            >
                              ×
                            </button>
                          </div>
                          ))}
                        </div>
                      )}
                      {/* File Input */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl hover:border-yellow-400/50 transition-colors cursor-pointer p-4 group">
                        <Plus
                          size={20}
                          className="text-zinc-500 group-hover:text-yellow-400 mb-1"
                        />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-yellow-400 font-bold">
                          Select Images (Max 5)
                        </span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                      {/* Upload Button */}
                      {selectedFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={isUploading}
                          className="w-full bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-50"
                        >
                          {isUploading
                            ? "Uploading..."
                            : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? "s" : ""}`}
                        </button>
                      )}
                    </div>
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
                      disabled={isSubmitting || isUploading}
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
                {!Array.isArray(products) ? (
                  <div>No Data Found</div>
                ) : (
                  safeMap(products)(Array.isArray(data) ? data : []).map(...)
                    (Array.isArray(orders) ? orders : []).map(...)
                    (Array.isArray(items) ? items : []).map(...)product => (
                <div
                  key={product.id}
                  className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
                      <ImageWithFallback
                        src={getProductImage(product.images)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-serif">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
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
            {safeMap(orders)(Array.isArray(data) ? data : []).map(...)
              (Array.isArray(orders) ? orders : []).map(...)
              (Array.isArray(items) ? items : []).map(...)order => (
            <div
              key={order.id}
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
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${order.status === "completed"
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
                    onClick={() => updateStatus(order.id, "shipped")}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10"
                    title="Mark Shipped"
                  >
                    <Truck size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
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
        ){/* Debug Panel (Development Only) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-md z-50 text-xs max-h-96 overflow-y-auto">
            <div className="mb-2 font-bold">AdminDashboard Debug</div>
            <div>Products: {products.length}</div>
            <div>Orders: {orders.length}</div>
            <div>Current Tab: {activeTab}</div>
            <div className="mt-2">
              <div className="font-bold">Form Data Images:</div>
              <div className="ml-2">
                {formData.images.length > 0 ? (
                  safeMap(formData.images)(Array.isArray(data) ? data : []).map(...)
                    (Array.isArray(orders) ? orders : []).map(...)
                    (Array.isArray(items) ? items : []).map(...)(img, i) => (
                <div key={i} className="truncate">
                  [{i}]: {img}
                </div>
                ))
                ) : (
                <div>No images</div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="font-bold">Selected Files:</div>
              <div>{selectedFiles.length} files selected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
