export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shippingAddress: string;
  phone: string;
  note?: string;
  items: OrderItem[];
  createdAt: string;
}
