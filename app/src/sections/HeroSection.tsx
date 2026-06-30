import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero.png"
          alt="Shopping scene"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,31,63,0.92) 0%, rgba(11,31,63,0.65) 50%, rgba(11,31,63,0.2) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main h-full flex items-center py-6 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xs sm:max-w-md md:max-w-xl"
        >
          <span className="inline-block text-[10px] sm:text-badge uppercase bg-orange text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-sm tracking-wide font-semibold">
            ENDLESS PRODUCT DEALS
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-h1 text-white mt-3 sm:mt-6 leading-tight font-bold">
            Find Everything You Need in One Place
          </h1>

          <p className="text-xs sm:text-sm md:text-body text-white/95 mt-2 sm:mt-4 max-w-[480px] leading-relaxed">
            Shop from your favorite stores, compare prices, and enjoy fast, reliable delivery across Nigeria.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 sm:mt-8 bg-orange hover:bg-orange/90 text-white font-semibold text-xs sm:text-body px-5 py-2.5 sm:px-6 sm:py-3 rounded-md transition-colors duration-200"
          >
            Shop now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
