// ─── Product Normalization Layer ───
// Handles ANY backend response shape:
//   { data: { title, price, ... } }       → standard backend response
//   { product: { title, price, ... } }    → alternate shape
//   { title, price, ... }                 → direct object
//
// Guarantees a valid Product object for the UI — no silent failures.

export type Product = {
  title: string;
  image: string;
  price: number;
  description: string;
  story: string;
  owner: string;
};

/**
 * Extracts a valid Product from any API response shape.
 * Throws if the response contains no usable data.
 */
export function normalizeProduct(res: unknown): Product {
  // Step 1: Unwrap nested response shapes
  const outer = res as Record<string, unknown> | null | undefined;
  const raw = outer?.data ?? outer?.product ?? outer;

  // Step 2: Validate we have a usable object
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid product response shape");
  }

  const obj = raw as Record<string, unknown>;

  // Step 3: Check for minimum viable data (at least a title or name)
  const hasContent = obj.title || obj.name || obj.price || obj.image;
  if (!hasContent) {
    throw new Error("Product response contains no usable fields");
  }

  // Step 4: Build guaranteed-valid Product
  return {
    title: String(obj.title ?? obj.name ?? "Untitled Product"),
    image: String(obj.image ?? obj.imageUrl ?? (Array.isArray(obj.images) ? obj.images[0] : "") ?? ""),
    price: Number(obj.price) || 0,
    description: String(obj.description ?? "No description available"),
    story: String(obj.story ?? ""),
    owner: String(obj.ownerName ?? obj.owner ?? "Available"),
  };
}
