import { useState, useEffect } from "react";
import { productApi } from "@/api";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll();
      const data = response?.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("useProducts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
