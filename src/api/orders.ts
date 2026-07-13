import client from "./client";
import type { Order } from "../types";

export interface CreateOrderRequest {
  shippingAddress: string;
  phone: string;
  note?: string;
}

export async function createOrder(
  req: CreateOrderRequest
): Promise<Order> {
  const { data } = await client.post("/orders", req);
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await client.get("/orders");
  return data;
}

export async function fetchOrder(id: number): Promise<Order> {
  const { data } = await client.get(`/orders/${id}`);
  return data;
}
