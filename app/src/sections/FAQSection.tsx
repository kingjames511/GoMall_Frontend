import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { faqs } from "@/data/siteData";

const FAQSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="faqs"
      ref={ref}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <img
          src="/assets/logo.png"
          alt="GoMall Watermark Logo"
          className="w-[280px] sm:w-[450px] md:w-[400px] lg:w-[580px] opacity-10 object-contain"
        />
      </div>

      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-caption uppercase text-text-secondary tracking-[0.1em] font-semibold">
            FAQS
          </span>
          <h2 className="text-h2 text-text-primary mt-2 font-bold">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12 md:gap-y-16 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex gap-4 md:gap-5 items-start text-left"
            >
              {/* Number Badge */}
              <div className="w-8 h-8 rounded-full bg-[#0B1F3F] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {faq.id}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-h4 md:text-h3 font-bold text-text-primary leading-snug">
                  {faq.question}
                </h3>
                <p className="text-body text-text-secondary mt-2.5 md:mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

