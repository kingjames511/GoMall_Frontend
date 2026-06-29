import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[520px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/background.jpg"
          alt="Shopping scene"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,31,63,0.88) 0%, rgba(11,31,63,0.5) 50%, rgba(11,31,63,0.15) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-block text-badge uppercase bg-orange text-white px-3 py-1 rounded-sm tracking-wide">
            ENDLESS PRODUCT DEALS
          </span>

          <h1 className="text-h1 text-white mt-6 leading-tight">
            Find Everything You Need in One Place
          </h1>

          <p className="text-body text-white/80 mt-4 max-w-[480px]">
            Shop from your favorite stores, compare prices, and enjoy fast, reliable delivery across Nigeria.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 bg-orange hover:bg-orange/90 text-white font-semibold text-body px-6 py-3 rounded-md transition-colors duration-200"
          >
            Shop now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
