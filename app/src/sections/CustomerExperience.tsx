import { motion } from "framer-motion";
import { ShieldCheck, Store, ThumbsUp, Truck } from "lucide-react";
import { features } from "@/data/siteData";

const iconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  store: Store,
  "thumbs-up": ThumbsUp,
  truck: Truck,
};

const CustomerExperience = () => {
  return (
    <section id="about" className="py-16 bg-white overflow-hidden">
      <div className="container-main">
        {/* Header Row with Line */}
        <div className="flex items-center gap-6 md:gap-12 mb-12 w-full">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-h2 text-text-primary font-bold leading-tight shrink-0 text-left"
          >
            We provide the <br />
            best customer experiences
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden sm:block flex-1 h-[3px] bg-border-gray origin-left"
          />
        </div>

        {/* Features Grid - Left Aligned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="flex flex-col items-start text-left"
              >
                {/* Left-Aligned Icon Circle */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EBF1FA] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                </div>
                <h3 className="text-body font-bold text-text-primary mt-4 sm:mt-5">
                  {feature.title}
                </h3>
                <p className="text-caption text-text-secondary mt-1.5 md:mt-2 max-w-[260px] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
