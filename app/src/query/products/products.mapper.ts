import type { Product } from "@/types/product";
import type { ApiProduct } from "./products.types";

// Adapts the raw API product into the frontend Product shape used across the UI.
// The API doesn't yet return rating/reviewCount/store/originalPrice, so we fall
// back to sensible defaults until those fields exist server-side.
export const mapApiProduct = (api: ApiProduct): Product => ({
  id: api.id,
  name: api.name,
  image: api.image_url,
  currentPrice: api.price,
  originalPrice: api.price,
  inStock: api.in_stock,
  rating: 0,
  reviewCount: 0,
  store: api.category?.name ?? "",
  description: api.description,
  quantityLeft: api.stock_quantity,
  category: api.category?.name,
  availability: api.in_stock ? "in-stock" : "out-of-stock",
});

export const mapApiProducts = (items: ApiProduct[]): Product[] =>
  items.map(mapApiProduct);
