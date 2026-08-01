import { createContext, useContext, useState } from "react";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
}

export interface DeliveryInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface AppContextType {
  wishlist: Product[];
  cart: CartItem[];
  deliveryInfo: DeliveryInfo;
  requestRider: boolean;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  updateDeliveryInfo: (info: DeliveryInfo) => void;
  toggleRequestRider: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [requestRider, setRequestRider] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addToCart = (product: Product, quantity = 1, color = "Black") => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.color === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, color }];
      }
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.color === color)));
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateDeliveryInfo = (info: DeliveryInfo) => {
    setDeliveryInfo(info);
  };

  const toggleRequestRider = () => {
    setRequestRider((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        wishlist,
        cart,
        deliveryInfo,
        requestRider,
        toggleWishlist,
        isInWishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        updateDeliveryInfo,
        toggleRequestRider,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};
