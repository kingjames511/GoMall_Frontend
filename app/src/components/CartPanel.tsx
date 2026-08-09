import { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, X } from "lucide-react";
import { CartLineSkeleton } from "@/components/Skeletons";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/query/cart";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ConfirmModal";

interface CartPanelProps {
  className?: string;
  onClose?: () => void;
}

export default function CartPanel({ className, onClose }: CartPanelProps) {
  const navigate = useNavigate();
  const { lines, itemCount, isLoading, updateQuantity, removeItem } = useCart();
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  const getSubtotal = () => {
    return lines.reduce((acc, item) => {
      return acc + item.product.currentPrice * item.quantity;
    }, 0);
  };

  const subtotal = getSubtotal();

  const handleIncrement = (productId: string, currentQty: number, maxQty = 12) => {
    if (currentQty < maxQty) {
      updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeItem(itemToDelete.id);
    }
  };

  const handleCheckout = () => {
    onClose?.();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose?.();
    navigate("/products");
  };

  return (
    <div className={cn("flex h-full flex-col bg-white", className)}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border-gray px-5 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-[#0B1F3F]">My Cart</h1>
          <span className="rounded-full bg-[#0B2D6E] px-3 py-0.5 text-sm font-bold text-white">
            {itemCount}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-gray-bg cursor-pointer"
          aria-label="Close cart"
        >
          <X size={22} />
        </button>
      </div>

      {/* Scrollable items */}
      <div className="flex-1 overflow-y-auto px-5">
        {isLoading ? (
          <div className="space-y-4 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartLineSkeleton key={i} />
            ))}
          </div>
        ) : lines.length > 0 ? (
          <div>
            {lines.map((item) => {
              const unitPrice = item.product.currentPrice;
              const itemTotal = unitPrice * item.quantity;
              const color = item.product.colors?.[0]?.name;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 border-b border-border-gray py-5"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 shrink-0 rounded-xl bg-gray-bg object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-body font-bold leading-tight text-text-primary">
                        {item.product.name}
                      </h3>
                      <p className="shrink-0 text-body font-bold text-text-primary">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>

                    {color && (
                      <p className="mt-1.5 text-[11px] text-text-muted">Color : {color}</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      From {item.product.store}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-full bg-gray-bg p-1">
                        <button
                          onClick={() => handleDecrement(item.product.id, item.quantity)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-white cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[2rem] text-center text-body-sm font-bold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.product.id, item.quantity, item.product.quantityLeft)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-white cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => setItemToDelete({ id: item.product.id, name: item.product.name })}
                        className="text-red transition-colors hover:text-red/70 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#0B4A8F]/10 text-[#0B4A8F]">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <h2 className="mb-3 text-xl font-bold text-text-primary">Your cart is empty!</h2>
            <p className="mb-8 max-w-md text-body leading-relaxed text-text-secondary">
              Explore our products catalog and add items to your cart to begin your storefront checkout flow.
            </p>

            <button
              onClick={handleContinueShopping}
              className="rounded-lg bg-[#0B4A8F] px-10 py-3.5 font-bold text-body text-white shadow-sm transition-colors hover:bg-navy cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Pinned footer */}
      {!isLoading && lines.length > 0 && (
        <div className="shrink-0 space-y-5 border-t border-border-gray px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-body font-medium text-text-secondary">Subtotal:</span>
            <span className="text-2xl font-extrabold text-[#0B1F3F]">{formatPrice(subtotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full rounded-lg bg-[#0B2D6E] py-4 text-body font-bold text-white shadow-sm transition-colors hover:bg-navy cursor-pointer"
          >
            Checkout
          </button>
        </div>
      )}

      {/* Remove Item Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove from cart"
        description="Are you sure you want to delete this item fro cart?"
        confirmText="Yes, Remove Item"
        cancelText="No, Cancel"
        variant="danger"
      />
    </div>
  );
}
