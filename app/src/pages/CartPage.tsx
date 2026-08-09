import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { CartLineSkeleton } from "@/components/Skeletons";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/query/cart";
import ConfirmModal from "@/components/ConfirmModal";

export default function CartPage() {
  const navigate = useNavigate();
  const { lines, itemCount, isLoading, updateQuantity, removeItem } = useCart();
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  const getSubtotal = () => {
    return lines.reduce((acc, item) => {
      return acc + item.product.currentPrice * item.quantity;
    }, 0);
  };

  const deliveryFee = lines.length > 0 ? 2500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  const handleIncrement = (productId: string, currentQty: number, maxQty = 12) => {
    if (currentQty < maxQty) {
      updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    // updateQuantity handles DELETE-on-zero; guard keeps min at 1 here.
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeItem(itemToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">Cart</span>
        </div>

        <div className="container-main py-6">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy">
              My Cart
            </h1>
            <span className="bg-navy text-white font-bold text-sm px-3 py-1 rounded-full">
              {itemCount}
            </span>
          </div>

          {isLoading ? (
            /* Skeleton loader while the cart is fetched from the API */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2 space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CartLineSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : lines.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                {lines.map((item) => {
                  const unitPrice = item.product.currentPrice;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-border-gray rounded-2xl bg-white shadow-sm gap-4"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover bg-gray-bg border border-border-gray shrink-0"
                        />
                        <div>
                          <h3 className="text-body font-bold text-text-primary leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            From {item.product.store}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Selector, Price, Remove button */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
                        {/* Selector */}
                        <div className="flex items-center border border-border-gray bg-gray-bg/40 rounded-full p-1 w-28 justify-between">
                          <button
                            onClick={() => handleDecrement(item.product.id, item.quantity)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-text-primary hover:bg-white cursor-pointer transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-body-sm text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item.product.id, item.quantity, item.product.quantityLeft)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-text-primary hover:bg-white cursor-pointer transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[90px]">
                          <p className="text-body font-bold text-navy">
                            {formatPrice(itemTotal)}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {formatPrice(unitPrice)} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => setItemToDelete({ id: item.product.id, name: item.product.name })}
                          className="w-9 h-9 rounded-full bg-red/10 text-red flex items-center justify-center hover:bg-red/20 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Right Column: Checkout Summary Card */}
              <div className="bg-gray-bg/40 border border-border-gray rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-body-lg font-bold text-text-primary">Order Summary</h2>

                <div className="space-y-3.5 text-body text-text-secondary pb-4 border-b border-border-gray">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-text-primary">{formatPrice(deliveryFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline text-text-primary pt-2">
                  <span className="text-body font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-navy">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-navy hover:bg-navy text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors text-body"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>
          ) : (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-6">
                <ShoppingBag className="w-10 h-10" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                Your cart is empty!
              </h2>

              <p className="text-body text-text-secondary max-w-md mb-8 leading-relaxed">
                Explore our products catalog and add items to your cart to begin your storefront checkout flow.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="bg-navy hover:bg-navy text-white font-bold text-body py-3.5 px-10 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </main>


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

      <Footer />
    </div>
  );
}
