/**
 * Detects if an order is a dropshipping order.
 * Checks the user's role/roles field on the populated userId object,
 * and also checks if products have DS-specific fields (costPrice/sellingPrice).
 */
export function isDSOrder(order) {
  if (!order) return false;
  const user = order?.userId;
  if (user && typeof user !== "string") {
    if (user.role === "DROPSHIPPING") return true;
    if (Array.isArray(user.roles) && user.roles.includes("DROPSHIPPING")) return true;
  }
  // Fallback: check if any product has sellingPrice set and differs from price
  // DS orders: price=costPrice, sellingPrice=customer price (different)
  // Normal orders: price=retailPrice, sellingPrice=retailPrice or unset (same)
  if (Array.isArray(order.products) && order.products.length > 0) {
    return order.products.some(
      (p) => p.sellingPrice && p.sellingPrice > 0 && p.sellingPrice !== p.price
    );
  }
  return false;
}
