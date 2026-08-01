import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/query/cart";
import { formatPrice } from "@/utils/format";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    deliveryInfo,
    requestRider,
    updateDeliveryInfo,
    toggleRequestRider,
  } = useAppContext();
  const { lines, itemCount, removeItem } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(deliveryInfo);

  const checkoutItems = lines.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    store: `From ${item.product.store}`,
    price: formatPrice(item.product.currentPrice),
    image: item.product.image,
  }));

  const totalCount = itemCount;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliveryInfo(editForm);
    setIsEditing(false);
    toast.success("Delivery information updated successfully!");
  };

  const handleContinue = () => {
    toast.success("Order Placed Successfully!");
    // Clear the server cart by removing each line (no bulk-clear endpoint).
    lines.forEach((line) => removeItem(line.product.id));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow bg-[#FAFAFA] py-8">
        <div className="container-main max-w-3xl">
          
          {/* Breadcrumbs (matching attachment 3 layout) */}
          <div className="py-2 text-caption text-text-secondary flex items-center gap-2 mb-6">
            <Link to="/" className="hover:text-navy transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/cart" className="hover:text-navy transition-colors">Cart</Link>
            <span className="text-gray-300">/</span>
            <span className="text-text-muted font-semibold">Checkout</span>
          </div>

          {/* Stepper Progress Bar & Go Back Row */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-body font-bold text-text-primary hover:text-navy transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </Link>

            {/* Steps capsule progress indicator */}
            <div className="flex gap-2">
              <span className="w-12 h-1.5 rounded-full bg-[#0B4A8F]" />
              <span className="w-12 h-1.5 rounded-full bg-gray-200" />
              <span className="w-12 h-1.5 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Checkout Steps Container */}
          <div className="space-y-6">
            
            {/* Step 1: Order Summary */}
            <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-body-lg font-bold text-text-primary">Order Summary</h2>
                <span className="bg-[#0B4A8F] text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  {totalCount}
                </span>
              </div>

              <div className="divide-y divide-border-gray">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-bg border border-border-gray shrink-0"
                    />
                    <div className="flex-grow flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-body font-bold text-text-primary leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {item.store}
                        </p>
                      </div>
                      <span className="text-body font-extrabold text-text-primary">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Delivery Method (Optional) */}
            <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-body-lg font-bold text-text-primary">Delivery Method</h2>
                  <span className="text-[10px] text-navy border border-navy/35 px-2 py-0.5 rounded font-semibold bg-navy/5">
                    Optional
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-body font-bold text-text-primary">Request a Rider</span>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={toggleRequestRider}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative p-0.5 cursor-pointer ${
                    requestRider ? "bg-[#0B4A8F]" : "bg-gray-200"
                  }`}
                  aria-label="Toggle Rider Request"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      requestRider ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Step 3: Delivery Information (Editable) */}
            <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-body-lg font-bold text-text-primary">Delivery Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditForm(deliveryInfo);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1 text-caption text-[#0B4A8F] hover:underline font-semibold cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Delivery Form Overlay/Container */
                <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption font-bold text-text-primary mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-bold text-text-primary mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-caption font-bold text-text-primary mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3 py-2 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-caption font-bold text-text-primary mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-border-gray rounded-lg text-body-sm text-text-secondary hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B4A8F] text-white rounded-lg text-body-sm font-semibold hover:bg-navy"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* Display Mode */
                <div className="space-y-3.5 pt-2">
                  <h3 className="text-body font-bold text-text-primary">{deliveryInfo.name}</h3>
                  <div className="space-y-2 text-caption text-text-secondary">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">🏠</span>
                      <span>{deliveryInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">📞</span>
                      <span>{deliveryInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">✉️</span>
                      <span>{deliveryInfo.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button (matching attachment 3 layout) */}
            <button
              onClick={handleContinue}
              className="w-full bg-[#0B2D6E] hover:bg-[#091f50] text-white font-bold py-4 rounded-lg shadow-md transition-colors cursor-pointer text-center text-body mt-8"
            >
              Continue
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
