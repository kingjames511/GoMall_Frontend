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
      className="bg-white border border-border-gray rounded-2xl p-5 flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Large Blue Avatar Circle */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 text-white">
          <Store className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Title and Verification Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-body font-bold text-text-primary truncate">
              {store.name}
            </h3>
            <span className="flex items-center gap-1 bg-[#22A65A]/10 text-[#22A65A] text-[10px] sm:text-badge px-2 py-0.5 rounded-full font-semibold shrink-0">
              <svg
                className="w-3 h-3 text-[#22A65A]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          </div>

          {/* Description - Un-truncated to allow wrapping */}
          <p className="text-caption text-text-secondary mt-1 leading-normal">
            {store.description}
          </p>

          {/* Metadata: Ratings & Products */}
          <div className="flex items-center gap-3.5 mt-3 text-caption text-text-secondary font-medium">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-[#F5A623] text-[#F5A623]" />
              <span className="text-text-primary">{store.rating}</span>
              <span className="text-text-muted text-[11px]">
                ({store.reviewCount})
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Package size={13} className="text-[#8E5A36]" />
              <span>{store.productCount} Products</span>
            </span>
          </div>
        </div>
      </div>

      {/* Visit Store Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-5 w-full border border-[#0B1F3F] text-[#0B1F3F] font-bold text-caption py-2.5 rounded-md hover:bg-[#054182] hover:text-white transition-all duration-200"
      >
        Visit Store
      </motion.button>
    </motion.div>
  );
};

export default StoreCard;
