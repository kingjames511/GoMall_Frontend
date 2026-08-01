import api from "@/services/axios";
import type { ApiProduct } from "./products.types";

export const getProducts = async (): Promise<ApiProduct[]> => {
  const response = await api.get<ApiProduct[]>("/products");
  return response.data;
};

export const getProduct = async (id: string): Promise<ApiProduct> => {
  const response = await api.get<ApiProduct>(`/products/${id}`);
  return response.data;
};
