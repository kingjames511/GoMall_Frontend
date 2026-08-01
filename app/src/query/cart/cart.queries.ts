import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCart } from "./cart.api";
import type { ApiCart } from "./cart.types";
import type { ApiErrorResponse } from "@/types/api";
import { isAuthenticated } from "@/utils/storage";

export const cartKeys = {
  all: ["cart"] as const,
};

export const useCartQuery = (): UseQueryResult<
  ApiCart,
  AxiosError<ApiErrorResponse>
> => {
  return useQuery<ApiCart, AxiosError<ApiErrorResponse>>({
    queryKey: cartKeys.all,
    queryFn: getCart,
    // Cart endpoints are JWT-secured; only fetch when logged in. This keeps the
    // global cart badge (Navbar) from firing a 401 for guests and bouncing them
    // to login on public pages.
    enabled: isAuthenticated(),
  });
};
