export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  categoryId: number;
  categoryName: string;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
