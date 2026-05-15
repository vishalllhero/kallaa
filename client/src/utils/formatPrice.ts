/**
 * Central currency formatter — always outputs ₹ (Indian Rupee).
 * Use this everywhere prices are displayed. Never hardcode "$".
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(Number(price))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
};

/** Shorthand: same as formatPrice */
export const rupee = formatPrice;