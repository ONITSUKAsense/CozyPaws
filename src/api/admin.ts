import client from "./client";

export interface DashboardData {
  productCount: number;
  orderCount: number;
  userCount: number;
  totalRevenue: number;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await client.get("/admin/dashboard");
  return data;
}

// Products
export async function createProduct(body: Record<string, unknown>) {
  const { data } = await client.post("/admin/products", body);
  return data;
}

export async function updateProduct(id: number, body: Record<string, unknown>) {
  const { data } = await client.put(`/admin/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: number) {
  await client.delete(`/admin/products/${id}`);
}

// Categories
export async function createCategory(body: Record<string, string>) {
  const { data } = await client.post("/admin/categories", body);
  return data;
}

export async function updateCategory(id: number, body: Record<string, string>) {
  const { data } = await client.put(`/admin/categories/${id}`, body);
  return data;
}

export async function deleteCategory(id: number) {
  await client.delete(`/admin/categories/${id}`);
}

// Orders
export interface AdminOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  shippingAddress: string;
  phone: string;
  note?: string;
  items: {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}

export async function fetchAllOrders(): Promise<AdminOrder[]> {
  const { data } = await client.get("/admin/orders");
  return data;
}

export async function updateOrderStatus(id: number, status: string) {
  const { data } = await client.put(`/admin/orders/${id}/status`, { status });
  return data;
}

// Blog
export async function fetchBlogPostById(id: number) {
  const { data } = await client.get(`/admin/blog/${id}`);
  return data;
}

export async function createBlogPost(body: Record<string, unknown>) {
  const { data } = await client.post("/admin/blog", body);
  return data;
}

export async function updateBlogPost(id: number, body: Record<string, unknown>) {
  const { data } = await client.put(`/admin/blog/${id}`, body);
  return data;
}

export async function deleteBlogPost(id: number) {
  await client.delete(`/admin/blog/${id}`);
}

// File upload
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await client.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}
