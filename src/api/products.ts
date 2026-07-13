import client from "./client";
import type { Product } from "../types";

export interface ProductsResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function fetchProducts(params?: {
  categoryId?: number;
  sort?: string;
  page?: number;
  size?: number;
}): Promise<ProductsResponse> {
  const { data } = await client.get("/products", { params });
  return data;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data } = await client.get("/products/featured");
  return data;
}

export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await client.get(`/products/${id}`);
  return data;
}
