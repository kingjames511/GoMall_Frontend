import { motion } from "framer-motion";

const DiscoverStores = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-bg via-white to-gray-bg/50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-caption uppercase text-text-secondary tracking-[0.1em]">
            CONVINCED?
          </span>
          <h2 className="text-h2 text-text-primary mt-3">
            Discover Stores Near You
          </h2>
          <p className="text-body text-text-secondary mt-4 max-w-[500px]">
            Browse verified vendors and compare products from multiple stores with ease.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 bg-orange hover:bg-orange/90 text-white font-semibold text-body px-8 py-3 rounded-md transition-colors duration-200"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoverStores;
