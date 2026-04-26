import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { productApi } from "@/api";
import { normalizeProduct, type Product } from "@/utils/normalizeProduct";

export { type Product } from "@/utils/normalizeProduct";
export const productCache = new Map<string, Product>();

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (!productApi || typeof productApi.getById !== "function") {
      setError("API not available");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (productCache.has(id)) {
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        const res = await productApi.getById(id);
        const formatted = normalizeProduct(res);
        productCache.set(id, formatted);
        setProduct(formatted);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ── SINGLE RETURN — NO EARLY EXITS — EVERYTHING VISIBLE ──
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: 20 }}>

      <h1 style={{ fontSize: 28, color: "lime", marginBottom: 20 }}>DEBUG ROOT — ProductDetail</h1>

      <p>ID: {id ?? "undefined"}</p>
      <p>Loading: {String(loading)}</p>
      <p>Error: {error ?? "none"}</p>
      <p>Product exists: {String(!!product)}</p>

      <hr style={{ borderColor: "#333", margin: "20px 0" }} />

      <h2 style={{ color: "cyan", marginBottom: 10 }}>RAW PRODUCT STATE:</h2>
      <pre style={{ color: "#a3e635", fontSize: 12, background: "#111", padding: 16, borderRadius: 8, overflow: "auto", maxHeight: 300 }}>
        {JSON.stringify(product, null, 2) ?? "null"}
      </pre>

      <hr style={{ borderColor: "#333", margin: "20px 0" }} />

      <h2 style={{ color: "cyan", marginBottom: 10 }}>RENDERED UI:</h2>

      <h1 style={{ fontSize: 32, fontFamily: "serif", marginBottom: 16 }}>
        {product?.title ?? "NO TITLE"}
      </h1>

      <p style={{ fontSize: 24, color: "#facc15", marginBottom: 16 }}>
        ₹{product?.price ?? 0}
      </p>

      <img
        src={product?.image || "https://placehold.co/400x300/1a1a1a/666?text=No+Image"}
        alt={product?.title ?? "product"}
        style={{ width: 400, maxWidth: "100%", borderRadius: 12, marginBottom: 16 }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://placehold.co/400x300/1a1a1a/666?text=Image+Error";
        }}
      />

      <p style={{ color: "#d4d4d8", marginBottom: 12 }}>
        {product?.description ?? "No description"}
      </p>

      <p style={{ color: "#a1a1aa", fontStyle: "italic", marginBottom: 12 }}>
        {product?.story ?? "No story"}
      </p>

      <p style={{ marginBottom: 20 }}>
        Owner: {product?.owner ?? "Unknown"}
      </p>

      {product?.owner === "Available" && (
        <button style={{
          backgroundColor: "#facc15",
          color: "#000",
          padding: "14px 24px",
          borderRadius: 12,
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          width: "100%",
          maxWidth: 400,
        }}>
          Acquire This Masterpiece
        </button>
      )}

    </div>
  );
}
