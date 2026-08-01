import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getProducts, getProduct } from "./products.api";
import { mapApiProduct, mapApiProducts } from "./products.mapper";
import type { Product } from "@/types/product";
import type { ApiErrorResponse } from "@/types/api";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["products", id] as const,
};

export const useProductsQuery = (): UseQueryResult<
  Product[],
  AxiosError<ApiErrorResponse>
> => {
  return useQuery<Product[], AxiosError<ApiErrorResponse>>({
    queryKey: productKeys.all,
    queryFn: async () => mapApiProducts(await getProducts()),
  });
};

export const useProductQuery = (
  id: string | undefined
): UseQueryResult<Product, AxiosError<ApiErrorResponse>> => {
  return useQuery<Product, AxiosError<ApiErrorResponse>>({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: async () => mapApiProduct(await getProduct(id as string)),
    enabled: !!id,
  });
};
