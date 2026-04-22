import { useState, useEffect } from "react";
import { productApi } from "@/api";

interface Product {
  id: string;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  images?: string[];
  story?: string;
  description?: string;
  isSold?: boolean;
  ownerName?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll().catch(() => ({ data: [] }));
      const data =
        response?.data?.data ||
        response?.data?.products ||
        response?.data ||
        [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      console.error("useProducts error:", err);
      setProducts([]); // Ensure products is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: products || [], // Guarantee array return
    loading,
    error,
    refetch: fetchProducts,
  };
};
