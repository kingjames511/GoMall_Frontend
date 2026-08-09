import { motion } from "framer-motion";
import { Star, ShoppingCart, Bell, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { Product } from "@/types/product";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/query/cart";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useAppContext();
  const { addItem } = useCart();
  const isFavorite = isInWishlist(product.id);

  return (
    <motion.div
      onClick={() => {
        if (!product.inStock) {
          toast.error(`${product.name} is currently out of stock`);
          return;
        }
        navigate(`/products/${product.id}`);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 3) * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="cursor-pointer flex flex-col w-full bg-transparent overflow-hidden"
    >
      {/* Image Area */}
      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative bg-gray-bg flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
            const active = isInWishlist(product.id);
            if (active) {
              toast.success(`Removed ${product.name} from wishlist`);
            } else {
              toast.success(`Added ${product.name} to wishlist`);
            }
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-[2px] flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-colors duration-200 z-10"
          aria-label="Add to favorites"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${isFavorite ? "fill-red text-red" : "text-white"
              }`}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="pt-3 px-0 flex flex-col flex-1">
        {/* Name and Rating */}
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xs sm:text-sm md:text-[15px] font-bold text-text-primary truncate flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <div className="flex items-center gap-[1px]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < product.rating
                    ? "fill-star text-star"
                    : "text-border-gray fill-none"
                    }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-text-secondary font-medium ml-0.5">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Stock Badge */}
        <span
          className={`inline-block self-start text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2 ${product.inStock
            ? "bg-green/10 text-green"
            : "bg-red/10 text-red"
            }`}
        >
          {product.inStock ? "In-Stock" : "Out of Stock"}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-text-primary">
            {formatPrice(product.currentPrice)}
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm text-text-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Store */}
        <p className="text-[10px] sm:text-xs text-text-secondary mt-1">
          From {product.store}
        </p>

        {/* Action Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (product.inStock) {
              // addItem redirects to login if unauthenticated; only toast on a real add.
              const added = addItem(product.id, 1);
              if (added) {
                toast.success(`Added ${product.name} to cart!`);
              }
            } else {
              toast.error(`${product.name} is out of stock`);
            }
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn btn-outline mt-3.5 w-full h-9 sm:h-10 px-3 text-[11px] sm:text-xs md:text-sm"
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add to Cart
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Notify me
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
