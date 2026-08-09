import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface PromoSlide {
  id: number;
  image: string;
  alt: string;
  badge?: string;
  title: string;
  description: string;
  cta: string;
  ctaIcon?: boolean;
  variant: "solid" | "outline";
  overlay: string;
}

// Static advert slides for the promo channel (not API data)
const slides: PromoSlide[] = [
  {
    id: 1,
    image: "/assets/bags.png",
    alt: "Shopping bags",
    badge: "FEATURED AD",
    title: "Promote Your Brand to Ready Shoppers",
    description:
      "Showcase your latest store campaigns, seasonal launches, and exclusive deals across our audience-rich advert channel.",
    cta: "Advertise now",
    variant: "solid",
    overlay:
      "linear-gradient(to top, rgba(11,31,63,0.95) 0%, rgba(11,31,63,0.4) 50%, rgba(11,31,63,0.1) 100%)",
  },
  {
    id: 2,
    image: "/assets/bags3.png",
    alt: "Store interior",
    title: "Reach Customers with Premium Placement",
    description:
      "Connect merchants and buyers with featured ad placements that drive visibility, clicks, and conversions.",
    cta: "See advertising",
    variant: "outline",
    overlay:
      "linear-gradient(to right, rgba(11,31,63,0.85) 0%, rgba(11,31,63,0.35) 60%, transparent 100%)",
  },
  {
    id: 3,
    image: "/assets/bags2.png",
    alt: "Happy shopper",
    title: "Launch Campaigns That Stand Out",
    description:
      "Highlight your top offers with advertising that feels native, engaging, and easy for shoppers to act on.",
    cta: "Get started",
    ctaIcon: true,
    variant: "solid",
    overlay:
      "linear-gradient(to top, rgba(11,31,63,0.9) 0%, rgba(11,31,63,0.35) 55%, transparent 100%)",
  },
];

const AUTO_ADVANCE_MS = 5000;
const EASE = [0.4, 0, 0.2, 1] as const;

// Single card, reused by both the mobile carousel and the desktop grid
const PromoCard = ({ slide }: { slide: PromoSlide }) => (
  <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
    <img
      src={slide.image}
      alt={slide.alt}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0" style={{ background: slide.overlay }} />
    <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 md:p-12 min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
      {slide.badge && (
        <span className="text-caption uppercase text-orange tracking-wider">
          {slide.badge}
        </span>
      )}
      <h2 className="text-h2 text-white mt-2 max-w-xl">{slide.title}</h2>
      <p className="text-body-sm text-white/75 mt-4 max-w-md">
        {slide.description}
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-6 flex items-center gap-2 font-semibold text-body px-6 py-3 rounded-md transition-colors duration-200 w-fit ${
          slide.variant === "outline"
            ? "border border-white/60 text-white hover:border-white"
            : "bg-orange hover:bg-orange/90 text-white"
        }`}
      >
        {slide.cta}
        {slide.ctaIcon && <ArrowRight size={16} />}
      </motion.button>
    </div>
  </div>
);

const PromoGrid = () => {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance the mobile carousel; resets its timer whenever the slide changes
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [index, next]);

  return (
    <section className="py-16 bg-white">
      <div className="container-main">
        {/* Mobile / tablet: sliding carousel */}
        <div className="lg:hidden relative rounded-2xl overflow-hidden">
          {/* Sliding track */}
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full shrink-0">
                <PromoCard slide={slide} />
              </div>
            ))}
          </motion.div>

          {/* Prev / Next arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Pagination dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-5 right-6 sm:right-10 z-20 flex items-center gap-2">
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
        </div>

        {/* Desktop: static grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="rounded-2xl overflow-hidden"
            >
              <PromoCard slide={slide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;
