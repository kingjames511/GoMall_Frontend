import { motion } from "framer-motion";
import { Star, Package, Store } from "lucide-react";
import type { Store as StoreType } from "@/data/siteData";

interface StoreCardProps {
  store: StoreType;
  index: number;
}

const StoreCard = ({ store, index }: StoreCardProps) => {
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
      whileHover={{ y: -2 }}
      className="bg-white border border-border-gray rounded-xl shadow-sm hover:shadow-hover transition-all duration-300 p-4"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-bg flex items-center justify-center shrink-0">
          <Store size={22} className="text-text-secondary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold text-text-primary truncate">
            {store.name}
          </h3>
          <p className="text-caption text-text-secondary truncate mt-0.5">
            {store.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-caption text-text-muted">
            <span className="flex items-center gap-1">
              <Star size={10} className="fill-star text-star" />
              {store.rating} ({store.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Package size={10} />
              {store.productCount} Products
            </span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full border border-border-gray text-text-primary font-medium text-caption py-2 rounded-md hover:border-navy transition-colors duration-200"
      >
        Visit Store
      </motion.button>
    </motion.div>
  );
};

export default StoreCard;
