import { motion } from "framer-motion";
import { Star, ShoppingCart, Bell } from "lucide-react";
import type { Product } from "@/data/siteData";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
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
      whileHover={{ y: -4 }}
      className="bg-white border border-border-gray rounded-xl shadow-sm hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Area */}
      <div className="aspect-square bg-gray-bg flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-body-sm font-semibold text-text-primary truncate">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={12} className="fill-star text-star" />
          <span className="text-caption text-text-secondary">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-h4 font-bold text-text-primary">
            {product.currentPrice}
          </span>
          <span className="text-body text-text-muted line-through">
            {product.originalPrice}
          </span>
        </div>

        {/* Stock Badge */}
        <span
          className={`inline-block self-start text-badge px-2 py-1 rounded-sm mt-2 ${
            product.inStock
              ? "bg-green/10 text-green"
              : "bg-red/10 text-red"
          }`}
        >
          {product.inStock ? "In-Stock" : "Out of Stock"}
        </span>

        {/* Store */}
        <p className="text-caption text-text-muted mt-2">
          From: {product.store}
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-body-sm transition-colors duration-200 ${
            product.inStock
              ? "bg-orange hover:bg-orange/90 text-white"
              : "bg-gray-bg hover:bg-gray-bg/80 text-text-secondary"
          }`}
        >
          {product.inStock ? (
            <>
              <ShoppingCart size={15} />
              Add to Cart
            </>
          ) : (
            <>
              <Bell size={15} />
              Notify me
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
