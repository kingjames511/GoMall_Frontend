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
    <section id="about" className="py-16 bg-white">
      <div className="container-main">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-h2 text-text-primary max-w-[400px] mb-12"
        >
          We provide the best customer experiences
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gray-bg flex items-center justify-center">
                  <Icon size={24} className="text-navy" />
                </div>
                <h3 className="text-body font-semibold text-text-primary mt-4">
                  {feature.title}
                </h3>
                <p className="text-caption text-text-secondary mt-1 max-w-[200px]">
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
