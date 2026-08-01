import api from "@/services/axios";
import type { ApiCart, AddToCartPayload, UpdateCartItemPayload } from "./cart.types";

export const getCart = async (): Promise<ApiCart> => {
  const response = await api.get<ApiCart>("/cart");
  return response.data;
};

export const addToCart = async (payload: AddToCartPayload): Promise<void> => {
  await api.post("/cart/items", payload);
};

export const updateCartItem = async (
  productId: string,
  payload: UpdateCartItemPayload
): Promise<void> => {
  await api.patch(`/cart/items/${productId}`, payload);
};

export const removeFromCart = async (productId: string): Promise<void> => {
  await api.delete(`/cart/items/${productId}`);
};
