import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const StartSellingCTA = () => {
  return (
    <section className="bg-white pt-0 pb-8 md:pt-0 md:pb-16">
      <div className="container-main">
        <div className="relative bg-navy pt-8 md:pt-4 px-8 md:px-16 pb-0 overflow-hidden rounded-3xl">
          {/* Subtle decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy-blue pointer-events-none z-0" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8"
          >
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 lg:pb-16 w-full">
              <div className="max-w-[450px]">
                <h2 className="text-h3 md:text-h2 font-bold text-white leading-tight">
                  Start Selling on <br></br> GoMall Today
                </h2>
                <p className="text-body-sm text-white/90 mt-2">
                  Join thousands of merchants and grow your business with our easy-to-use seller tools.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold text-body px-8 py-3.5 rounded-lg transition-colors duration-200 shrink-0 self-start md:self-center"
              >
                Get Started
                <ArrowRight size={18} />
              </motion.button>
            </div>

            {/* Shopping Bag Image sitting at the bottom */}
            {/* <div className="w-full lg:w-[440px] xl:w-[500px] shrink-0 flex  items-end self-end mt-auto">
              <img
                src="/assets/bag-back.png"
                alt="Shopping Bag"
                className="w-full h-[400px] object-contain block"
              />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StartSellingCTA;
