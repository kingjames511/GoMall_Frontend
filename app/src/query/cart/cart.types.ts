// Raw API response types
export interface ApiCartItem {
  product_id: string;
  quantity: number;
}

export interface ApiCart {
  items: ApiCartItem[];
}

// Request payload types
export interface AddToCartPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
