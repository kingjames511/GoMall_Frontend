import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { addToCart, updateCartItem, removeFromCart } from "./cart.api";
import { cartKeys } from "./cart.queries";
import type { AddToCartPayload, UpdateCartItemPayload } from "./cart.types";
import type { ApiErrorResponse } from "@/types/api";

export const useAddToCartMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<void, AxiosError<ApiErrorResponse>, AddToCartPayload> => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorResponse>, AddToCartPayload>({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useUpdateCartItemMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<
  void,
  AxiosError<ApiErrorResponse>,
  { productId: string; payload: UpdateCartItemPayload }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { productId: string; payload: UpdateCartItemPayload }
  >({
    mutationFn: ({ productId, payload }) => updateCartItem(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useRemoveFromCartMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<void, AxiosError<ApiErrorResponse>, string> => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
