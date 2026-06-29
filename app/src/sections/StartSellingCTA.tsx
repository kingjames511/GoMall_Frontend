import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const StartSellingCTA = () => {
  return (
    <section className="relative bg-navy py-20 overflow-hidden">
      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <h2 className="text-h2 text-white max-w-[300px]">
            Start Selling on GoMall Today
          </h2>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 border border-white/60 text-white font-semibold text-body px-6 py-3 rounded-md hover:border-white transition-colors duration-200"
          >
            Get Started
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StartSellingCTA;
