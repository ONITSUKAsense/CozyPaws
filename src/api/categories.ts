import client from "./client";
import type { Category } from "../types";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get("/categories");
  return data;
}

export async function fetchCategory(id: number): Promise<Category> {
  const { data } = await client.get(`/categories/${id}`);
  return data;
}
