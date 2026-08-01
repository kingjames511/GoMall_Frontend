import { ChevronRight, Store as StoreIcon } from "lucide-react";
import { motion } from "framer-motion";
import StoreCard from "@/components/StoreCard";
import type { Store } from "@/types/store";

// TODO: replace with stores fetched from the API
const stores: Store[] = [];

const PopularStores = () => {
  return (
    <section id="stores" className="py-16 bg-white">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-h2 text-text-primary">Popular Stores</h2>
          <a
            href="#all-stores"
            className="flex items-center gap-1 text-body font-medium text-navy hover:underline transition-all"
          >
            View All
            <ChevronRight size={16} />
          </a>
        </motion.div>

        {/* Store Grid */}
        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <StoreIcon className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-body font-medium text-text-primary">
              No stores yet
            </p>
            <p className="text-caption text-text-secondary mt-1">
              Popular stores will appear here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularStores;
