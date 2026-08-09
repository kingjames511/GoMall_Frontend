import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Product } from "@/types/product";
import { isAuthenticated } from "@/utils/storage";
import { useProductsQuery } from "@/query/products";
import {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/query/cart";

// A cart row hydrated with full product details, ready for the UI.
export interface CartLine {
  product: Product;
  quantity: number;
}

/**
 * Central cart hook. The API cart ([{ product_id, quantity }]) is the source of
 * truth; product details are hydrated by joining against the cached products
 * list, so no extra requests are needed. Mutations invalidate the cart query,
 * so the UI updates automatically.
 *
 * Adding to cart is gated behind authentication — the cart endpoints are
 * JWT-secured, so an unauthenticated add would 401. We redirect to login with a
 * return path instead of firing a doomed request.
 */
export const useCart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cartQuery = useCartQuery();
  const productsQuery = useProductsQuery();

  const addMutation = useAddToCartMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveFromCartMutation();

  // Join cart items with product details from the products cache.
  const lines = useMemo<CartLine[]>(() => {
    const items = cartQuery.data?.items ?? [];
    const products = productsQuery.data ?? [];
    const byId = new Map(products.map((p) => [p.id, p]));

    return items
      .map((item) => {
        const product = byId.get(item.product_id);
        if (!product) return null; // product not in the current cache; skip
        return { product, quantity: item.quantity };
      })
      .filter((line): line is CartLine => line !== null);
  }, [cartQuery.data, productsQuery.data]);

  const itemCount = useMemo(
    () => lines.reduce((acc, line) => acc + line.quantity, 0),
    [lines]
  );

  // Redirect to login with a return path, then bail out of the action.
  const requireAuth = (): boolean => {
    if (isAuthenticated()) return true;
    const returnTo = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?redirect=${returnTo}`);
    return false;
  };

  const addItem = (productId: string, quantity = 1): boolean => {
    if (!requireAuth()) return false;
    addMutation.mutate({ product_id: productId, quantity });
    return true;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!requireAuth()) return;
    // DELETE-on-zero: unambiguous regardless of how the backend treats a 0 patch.
    if (quantity <= 0) {
      removeMutation.mutate(productId);
      return;
    }
    updateMutation.mutate({ productId, payload: { quantity } });
  };

  const removeItem = async (productId: string) => {
    if (!requireAuth()) return;
    return await removeMutation.mutateAsync(productId);
  };

  return {
    lines,
    itemCount,
    isLoading: cartQuery.isLoading || productsQuery.isLoading,
    isError: cartQuery.isError,
    addItem,
    updateQuantity,
    removeItem,
    // expose mutation pending states for button spinners if needed
    isMutating:
      addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
  };
};
