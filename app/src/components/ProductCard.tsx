import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Bell, Heart } from "lucide-react";
import type { Product } from "@/data/siteData";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex flex-col w-full bg-transparent overflow-hidden"
    >
      {/* Image Area */}
      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative bg-gray-bg flex items-center justify-center">
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
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-[2px] flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-colors duration-200 z-10"
          aria-label="Add to favorites"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${isFavorite ? "fill-[#DC3545] text-[#DC3545]" : "text-white"
              }`}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="pt-3 px-0 flex flex-col flex-1">
        {/* Name and Rating */}
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xs sm:text-sm md:text-[15px] font-bold text-[#1A1A1A] truncate flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <div className="flex items-center gap-[1px]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < product.rating
                    ? "fill-[#F5A623] text-[#F5A623]"
                    : "text-[#E5E5E5] fill-none"
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
            ? "bg-[#22A65A]/10 text-[#22A65A]"
            : "bg-[#DC3545]/10 text-[#DC3545]"
            }`}
        >
          {product.inStock ? "In-Stock" : "Out of Stock"}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-[#1A1A1A]">
            {product.currentPrice}
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm text-[#737373] line-through">
            {product.originalPrice}
          </span>
        </div>

        {/* Store */}
        <p className="text-[10px] sm:text-xs text-text-secondary mt-1">
          From {product.store}
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 border-2 border-[#054182] rounded-md font-semibold text-[#0B1F3F] hover:bg-[#054182] hover:text-white transition-all duration-200 text-[11px] sm:text-xs md:text-sm"
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
