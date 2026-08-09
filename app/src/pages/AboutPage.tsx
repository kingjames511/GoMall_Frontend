import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Store, ThumbsUp, Truck } from "lucide-react";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function AboutPage() {
  const cards = [
    {
      id: 1,
      title: "Original Products",
      desc: "Shop authentic and high-quality products from trusted stores and verified sellers.",
      icon: ShieldCheck,
      active: false,
    },
    {
      id: 2,
      title: "Shop from Multiple Stores",
      desc: "Browse thousands of products from trusted merchants and find everything you need in one place.",
      icon: Store,
      active: true, // Card 2 has active dark-blue styling
    },
    {
      id: 3,
      title: "Satisfaction Guarantee",
      desc: "We ensure money-back guarantee if the product is counterfeit.",
      icon: ThumbsUp,
      active: false,
    },
    {
      id: 4,
      title: "Fast & Reliable Delivery",
      desc: "Get your items delivered safely and swiftly to your doorstep through our integrated logistics network.",
      icon: Truck,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">About Us</span>
        </div>

        {/* Cover Photo Banner */}
        <div className="relative h-[240px] md:h-[280px] bg-navy overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/promo-shopping-bags.jpg"
              alt="About Us Banner"
              className="w-full h-full object-cover opacity-20 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/85 to-navy/90" />
          </div>

          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            >
              About Us
            </motion.h1>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="container-main py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary md:col-span-1">
              Who We Are
            </h2>
            <p className="text-body text-text-secondary leading-relaxed md:col-span-2 text-justify">
              GoMall is a multi-store e-commerce and logistics platform designed to make shopping simple, convenient, and accessible. We connect customers with trusted vendors, allowing them to discover products, compare prices, and shop from multiple stores in one place. Through our integrated delivery network, orders can be tracked in real time and delivered safely to customers' preferred locations.
            </p>
          </div>
        </div>

        {/* Why Choose GoMall Section */}
        <div className="bg-gray-bg/30 py-16 border-t border-b border-border-gray">
          <div className="container-main">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary text-center mb-12">
              Why Choose GoMall
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                      card.active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-text-primary border-border-gray hover:shadow-md"
                    }`}
                  >
                    {/* Circle icon container */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 shrink-0 ${
                        card.active ? "bg-white/10 text-white" : "bg-navy/10 text-navy"
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="text-body-lg font-bold mb-3">{card.title}</h3>
                    
                    <p
                      className={`text-body-sm leading-relaxed ${
                        card.active ? "text-white/80" : "text-text-secondary"
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="container-main py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left side text blocks */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-extrabold text-navy mb-4">
                  Our Mission
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  To create a trusted digital marketplace that connects customers, merchants, and delivery partners, making commerce simple, accessible, and efficient for everyone.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-navy mb-4">
                  Our Vision
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  To become the leading marketplace that transforms how people buy, sell, and deliver products across communities and beyond.
                </p>
              </div>
            </div>

            {/* Right side graphic mockup image */}
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-gray-bg border border-border-gray">
              <img
                src="/assets/promo-shopper.jpg"
                alt="Two shoppers holding shopping bags and looking at phone"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
