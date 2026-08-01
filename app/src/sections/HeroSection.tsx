import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  description: string;
  image: string;
  cta: string;
}

// Static marketing slides for the hero carousel (not API data)
const slides: HeroSlide[] = [
  {
    id: 1,
    badge: "ENDLESS PRODUCT DEALS",
    title: "Find Everything You Need in One Place",
    description:
      "Shop from your favorite stores, compare prices, and enjoy fast, reliable delivery across Nigeria.",
    image: "/assets/hero.png",
    cta: "Shop now",
  },
  {
    id: 2,
    badge: "TRUSTED LOCAL STORES",
    title: "Discover Stores You'll Love",
    description:
      "Browse thousands of verified sellers and find quality products from stores near you.",
    image: "/assets/hero-bg.jpg",
    cta: "Explore stores",
  },
  {
    id: 3,
    badge: "FAST & RELIABLE DELIVERY",
    title: "Get It Delivered to Your Door",
    description:
      "Order today and enjoy quick, dependable delivery wherever you are in Nigeria.",
    image: "/assets/promo-store-interior.jpg",
    cta: "Start shopping",
  },
];

const AUTO_ADVANCE_MS = 3000;

// Soft, natural easing for the crossfades (standard material "emphasized" curve)
const EASE = [0.4, 0, 0.2, 1] as const;

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  // Auto-advance; resets its timer whenever the active slide changes
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [index, next]);

  const slide = slides[index];

  return (
    <section className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden">
      {/* Background Image (cross-fades between slides) */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              opacity: { duration: 1.4, ease: EASE },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,31,63,0.92) 0%, rgba(11,31,63,0.65) 50%, rgba(11,31,63,0.2) 100%)",
          }}
        />
      </div>

      {/* Content (cross-fades between slides) */}
      <div className="relative z-10 container-main h-full flex items-center py-6 sm:py-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-xs sm:max-w-md md:max-w-xl"
          >
            <span className="inline-block text-[10px] sm:text-badge uppercase bg-orange text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-sm tracking-wide font-semibold">
              {slide.badge}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-h1 text-white mt-3 sm:mt-6 leading-tight font-bold">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-body text-white/95 mt-2 sm:mt-4 max-w-[480px] leading-relaxed">
              {slide.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 sm:mt-8 bg-orange hover:bg-orange/90 text-white font-semibold text-xs sm:text-body px-5 py-2.5 sm:px-6 sm:py-3 rounded-md transition-colors duration-200"
            >
              {slide.cta}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === index
                  ? "w-6 bg-orange"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
