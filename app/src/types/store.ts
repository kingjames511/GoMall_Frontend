export interface Store {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  // Extended fields
  verified?: boolean;
  sellerSince?: string;
  salesCount?: string;
  avatarImage?: string;
  bannerImage?: string;
}
