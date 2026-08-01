export interface ProductCategory {
  id: string;
  name: string;
}

// Raw product shape as returned by the API
export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  in_stock: boolean;
  category: ProductCategory;
}
