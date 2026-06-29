import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import StoreCard from "@/components/StoreCard";
import { stores } from "@/data/siteData";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularStores;
