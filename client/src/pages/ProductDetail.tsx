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
      if (import.meta.env.DEV) console.error("❌ productApi missing");
      setError("API not available");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (productCache.has(id)) {
          if (import.meta.env.DEV) console.log("⚡ CACHE HIT:", id);
          setProduct(productCache.get(id)!);
          setLoading(false);
          return;
        }

        if (import.meta.env.DEV) console.log("FETCH START:", id);

        const res = await productApi.getById(id);
        if (import.meta.env.DEV) console.log("RAW:", res);

        const formatted = normalizeProduct(res);
        if (import.meta.env.DEV) console.log("NORMALIZED PRODUCT:", formatted);

        productCache.set(id, formatted);
        setProduct(formatted);
      } catch (err) {
        if (import.meta.env.DEV) console.error("❌ Fetch failed:", err);
        setError(
          err instanceof Error && err.message.includes("response shape")
            ? "Product data is unavailable"
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ── ROUTE NOT READY ──
  if (!id) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Resolving route...</p>
      </div>
    );
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading product...</p>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  // ── NO PRODUCT ──
  if (!product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Product not found</p>
      </div>
    );
  }

  // ── MAIN UI — FORCED VISIBLE, NO CONDITIONAL HIDING ──
  const isAvailable = product.owner === "Available";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* DEV DEBUG — always visible in dev */}
        {import.meta.env.DEV && (
          <pre style={{ color: "lime", fontSize: 12, background: "#111", padding: 16, borderRadius: 8, marginBottom: 24, overflow: "auto", maxHeight: 200 }}>
            {JSON.stringify(product, null, 2)}
          </pre>
        )}

        {/* TITLE — always visible */}
        <h1 style={{ fontSize: 36, fontFamily: "serif", textAlign: "center", marginBottom: 32 }}>
          {product.title}
        </h1>

        {/* IMAGE — always visible with fallback */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src={product.image || "https://placehold.co/600x400/1a1a1a/666?text=No+Image"}
            alt={product.title}
            style={{ width: "100%", maxWidth: 500, height: "auto", borderRadius: 12, objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a1a1a/666?text=No+Image";
            }}
          />
        </div>

        {/* PRICE — always visible */}
        <p style={{ fontSize: 28, color: "#facc15", marginBottom: 16 }}>
          ₹{product.price.toLocaleString()}
        </p>

        {/* DESCRIPTION — always visible with fallback */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 4 }}>Description</h3>
          <p style={{ color: "#d4d4d8", lineHeight: 1.6 }}>{product.description}</p>
        </div>

        {/* STORY — always visible with fallback */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 4 }}>Story</h3>
          <p style={{ color: "#a1a1aa", fontStyle: "italic", lineHeight: 1.6 }}>
            {product.story || "No story yet"}
          </p>
        </div>

        {/* OWNER — always visible */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 4 }}>Owner</h3>
          <p>{isAvailable ? "Available" : product.owner}</p>
        </div>

        {/* CTA — always visible when available */}
        {isAvailable && (
          <button style={{
            width: "100%",
            maxWidth: 500,
            backgroundColor: "#facc15",
            color: "#000",
            padding: "16px 24px",
            borderRadius: 12,
            fontWeight: "bold",
            fontSize: 16,
            border: "none",
            cursor: "pointer",
          }}>
            Acquire This Masterpiece
          </button>
        )}
      </div>
    </div>
  );
}
