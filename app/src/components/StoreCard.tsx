import { motion } from "framer-motion";
import { Star, Package, Store } from "lucide-react";
import type { Store as StoreType } from "@/types/store";
import { formatCount } from "@/utils/format";

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
        duration: 0.4,
        delay: Math.min(index, 3) * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="card-surface p-3 sm:p-5 flex flex-col justify-between w-full hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Store Avatar Circle */}
        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-navy flex items-center justify-center shrink-0 text-white mx-auto sm:mx-0">
          <Store className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Title and Verification Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
            <h3 className="text-[13px] sm:text-body font-bold text-text-primary truncate text-center sm:text-left">
              {store.name}
            </h3>
            <span className="flex items-center gap-1 bg-green/10 text-green text-[9px] sm:text-badge px-1.5 sm:px-2 py-0.5 rounded-full font-semibold shrink-0">
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green"
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

          {/* Description */}
          <p className="text-[11px] sm:text-caption text-text-secondary mt-1 leading-normal line-clamp-2 text-center sm:text-left">
            {store.description}
          </p>

          {/* Metadata: Ratings & Products */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3.5 mt-2 sm:mt-3 text-[11px] sm:text-caption text-text-secondary font-medium">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Star size={11} className="fill-star text-star" />
              <span className="text-text-primary">{store.rating}</span>
              <span className="text-text-muted text-[10px] hidden sm:inline">
                ({formatCount(store.reviewCount)})
              </span>
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Package size={11} className="text-text-muted" />
              <span>{formatCount(store.productCount)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Visit Store Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="btn btn-outline mt-5 w-full h-9 sm:h-10 px-3 text-caption"
      >
        Visit Store
      </motion.button>
    </motion.div>
  );
};

export default StoreCard;
