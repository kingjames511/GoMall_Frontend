import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, Heart, Plus, Minus, Store, PackageSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { ProductDetailSkeleton } from "@/components/Skeletons";
import { formatPrice, formatCount } from "@/utils/format";
import { useProductQuery } from "@/query/products";
import { useCart } from "@/query/cart";
import type { ProductReview } from "@/types/product";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userReviews, setUserReviews] = useState<ProductReview[]>([]);
  const [reviewInput, setReviewInput] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);

  const { data: product, isLoading } = useProductQuery(id);

  const handleAddToCart = () => {
    if (!product) return;
    const added = addItem(product.id, quantity);
    if (added) {
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    // addItem redirects to login if unauthenticated; only proceed on a real add.
    if (addItem(product.id, quantity)) {
      navigate("/cart");
    }
  };

  const colors = product?.colors ?? [];
  const reviewsList = useMemo(
    () => [...userReviews, ...(product?.reviews ?? [])],
    [userReviews, product]
  );

  const handleIncrement = () => {
    const limit = product?.quantityLeft || 12;
    if (quantity < limit) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewInput.trim()) return;

    const newRev: ProductReview = {
      id: Date.now(),
      reviewerName: "Ayebulu Eric",
      reviewerAvatar: "/assets/promo-shopper.jpg",
      rating: userRating,
      comment: reviewInput.trim(),
    };

    setUserReviews((prev) => [newRev, ...prev]);
    setReviewInput("");
    setShowReviewForm(false);
  };

  // Loading state while the product is fetched from the API
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-vietnam flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-grow">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  // Not-found / empty state (once the fetch resolves with no product)
  if (!product) {
    return (
      <div className="min-h-screen bg-white font-vietnam flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-body font-medium text-text-primary">
              Product not found
            </p>
            <p className="text-caption text-text-secondary mt-1">
              This product may no longer be available.
            </p>
            <Link
              to="/products"
              className="mt-6 bg-navy hover:bg-navy-blue text-white px-6 py-2.5 rounded-full font-bold text-body transition-colors"
            >
              Browse products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Section */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/products" className="hover:text-navy transition-colors">Cart</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">{product.name}</span>
        </div>

        {/* Store Detail Bar (Directly under breadcrumbs) */}
        <div className="container-main mb-6">
          <div className="flex items-center gap-3 bg-white py-2.5 border-b border-border-gray">
            <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-body font-bold text-text-primary">{product.store}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Detail Grid Layout */}
        <div className="container-main py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Image, Description, Reviews */}
            <div className="space-y-10">
              {/* Main Product Image Area */}
              <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden relative bg-gray-bg flex items-center justify-center shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Favorite Heart Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-[4px] flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-colors z-10"
                  aria-label="Add to favorites"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${isFavorite ? "fill-[#DC3545] text-[#DC3545]" : "text-white"}`}
                  />
                </button>
              </div>

              {/* Product Description */}
              <div>
                <h2 className="text-h3 font-bold text-text-primary mb-4 pb-2 border-b border-border-gray">
                  Product Description
                </h2>
                <p className="text-body text-text-secondary leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Customer Reviews Section */}
              <div>
                <h2 className="text-h3 font-bold text-text-primary mb-6 pb-2 border-b border-border-gray">
                  Customer Reviews
                </h2>

                {reviewsList.length === 0 && (
                  <p className="text-body text-text-secondary">
                    No reviews yet. Be the first to leave one.
                  </p>
                )}

                <div className="space-y-6">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="flex gap-4">
                      {/* Reviewer Avatar */}
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />

                      {/* Review Content */}
                      <div className="flex-grow min-w-0">
                        <p className="text-body font-bold text-text-primary leading-none">
                          {rev.reviewerName}
                        </p>
                        <div className="flex items-center gap-[1px] my-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`w-3 h-3 ${i < rev.rating ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-200 fill-none"}`}
                            />
                          ))}
                        </div>
                        <p className="text-body text-text-secondary leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leave a review button / form */}
                <div className="mt-8 flex flex-col items-center">
                  <AnimatePresence>
                    {showReviewForm ? (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddReview}
                        className="w-full bg-gray-bg/40 border border-border-gray rounded-2xl p-5 mb-4 space-y-4"
                      >
                        <div>
                          <label className="block text-body-sm font-bold text-text-primary mb-1">Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${star <= userRating ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-300 fill-none"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="reviewText" className="block text-body-sm font-bold text-text-primary mb-1">Your Review</label>
                          <textarea
                            id="reviewText"
                            value={reviewInput}
                            onChange={(e) => setReviewInput(e.target.value)}
                            placeholder="Write your review here..."
                            rows={3}
                            className="w-full px-4 py-2 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 resize-none"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 rounded-lg text-body-sm border border-border-gray text-text-secondary hover:bg-gray-bg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg text-body-sm bg-navy text-white hover:bg-navy-blue font-semibold"
                          >
                            Submit
                          </button>
                        </div>
                      </motion.form>
                    ) : null}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-navy hover:bg-navy-blue text-white px-6 py-2.5 rounded-full font-bold text-body cursor-pointer shadow-sm transition-all"
                  >
                    Leave a review
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Rating, Price, Options, Purchase actions */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                {/* Title */}
                <h1 className="text-h1 font-bold text-text-primary leading-tight">
                  {product.name}
                </h1>
                
                {/* Short description */}
                {product.description && (
                  <p className="text-body text-text-secondary mt-3 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Rating line */}
                <div className="flex items-center flex-wrap gap-2.5 mt-3 text-caption text-text-secondary">
                  <div className="flex items-center gap-[1px]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-200 fill-none"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-text-primary">({formatCount(product.reviewCount)})</span>
                  {product.purchasedCount && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-bold text-text-primary">{product.purchasedCount}</span>
                    </>
                  )}
                  {product.location && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{product.location}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Area */}
              <div className="flex items-baseline gap-3.5 pt-4 border-t border-border-gray">
                <span className="text-3xl font-extrabold text-[#0B4A8F]">
                  {formatPrice(product.currentPrice)}
                </span>
                <span className="text-lg text-text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>

              {/* Color Picker */}
              {colors.length > 0 && (
              <div className="pt-4 border-t border-border-gray">
                <h3 className="text-body font-bold text-text-primary mb-3">Choose a Color</h3>
                <div className="flex items-center gap-3">
                  {colors.map((color, idx) => {
                    const active = selectedColor === idx;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                          active ? "ring-2 ring-navy ring-offset-2" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-4 border-t border-border-gray">
                <h3 className="text-body font-bold text-text-primary mb-3">Quantity</h3>
                
                <div className="flex items-center gap-4">
                  {/* Selector element */}
                  <div className="flex items-center border border-border-gray bg-gray-bg/50 rounded-full p-1 min-w-[120px] justify-between">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-body text-text-primary">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= (product.quantityLeft || 12)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Quantity Left Label */}
                  <div className="text-caption text-text-secondary">
                    <span>Only </span>
                    <span className="font-bold text-navy">{product.quantityLeft || 12} Items </span>
                    <span>Left! </span>
                    <br />
                    <span>Don't miss it</span>
                  </div>
                </div>
              </div>

              {/* Buy & Cart buttons */}
              <div className="pt-6 space-y-3.5">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#0B2D6E] hover:bg-navy text-white font-semibold py-3.5 rounded-lg text-body transition-colors cursor-pointer shadow-sm"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full border border-[#0B2D6E] text-[#0B2D6E] hover:bg-blue-50/30 font-semibold py-3.5 rounded-lg text-body transition-colors cursor-pointer bg-white"
                >
                  Add to Cart
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
