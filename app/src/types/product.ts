export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: number;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  currentPrice: number;
  originalPrice: number;
  inStock: boolean;
  store: string;
  // Extended fields for details and filters
  description?: string;
  colors?: ProductColor[];
  quantityLeft?: number;
  purchasedCount?: string;
  location?: string;
  reviews?: ProductReview[];
  category?: string;
  availability?: "in-stock" | "out-of-stock" | "pre-order";
}
