import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PromoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
          {/* Left Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative rounded-2xl overflow-hidden min-h-[420px] lg:min-h-0 lg:row-span-2"
          >
            <img
              src="/assets/promo-shopping-bags.jpg"
              alt="Shopping bags"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,31,63,0.95) 0%, rgba(11,31,63,0.4) 50%, rgba(11,31,63,0.1) 100%)",
              }}
            />
            <div className="relative z-10 p-8 flex flex-col justify-end h-full min-h-[420px] lg:min-h-full">
              <span className="text-caption uppercase text-orange tracking-wider">
                THE FUTURE OF SHOPPING
              </span>
              <h2 className="text-h2 text-white mt-2">
                Your Trusted Marketplace for Everyday Needs
              </h2>
              <p className="text-body-sm text-white/70 mt-4 max-w-md">
                We bring together buyers, merchants, and delivery partners on one platform, making online shopping simple, convenient, and accessible.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 bg-orange hover:bg-orange/90 text-white font-semibold text-body px-6 py-3 rounded-md transition-colors duration-200 w-fit"
              >
                Shop now
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Top Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="relative rounded-2xl overflow-hidden min-h-[200px]"
          >
            <img
              src="/assets/promo-store-interior.jpg"
              alt="Store interior"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10 p-6 flex flex-col justify-center h-full min-h-[200px]">
              <h3 className="text-h3 text-white">Explore Trusted Stores</h3>
              <p className="text-body-sm text-white/70 mt-2 max-w-xs">
                Discover a wide range of verified stores and shop from your favorite businesses all in one place
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 border border-white/60 text-white font-semibold text-body-sm px-5 py-2.5 rounded-md hover:border-white transition-colors duration-200 w-fit"
              >
                Explore Stores
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Bottom Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative rounded-2xl overflow-hidden min-h-[200px]"
          >
            <img
              src="/assets/promo-shopper.jpg"
              alt="Happy shopper"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full min-h-[200px]">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold text-body-sm px-5 py-2.5 rounded-md transition-colors duration-200 w-fit"
              >
                Shop now
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;
