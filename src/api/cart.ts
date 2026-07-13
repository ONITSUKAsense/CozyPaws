import client from "./client";

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  total: number;
}

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await client.get("/cart");
  return data;
}

export async function addToCart(req: CartItemRequest): Promise<CartResponse> {
  const { data } = await client.post("/cart/items", req);
  return data;
}

export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<CartResponse> {
  const { data } = await client.put(`/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItem(itemId: number): Promise<void> {
  await client.delete(`/cart/items/${itemId}`);
}
