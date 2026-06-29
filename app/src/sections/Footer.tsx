import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-navy pt-16 border-t border-white/5 overflow-hidden">
      {/* Background Watermark at the bottom spanning screen length */}
      <div className="absolute bottom-[-3%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[20vw] text-center font-black text-white/[0.025] tracking-[0.1em] uppercase leading-none select-none">
          GOMALL
        </span>
      </div>

      {/* Top CTA Section */}
      <div className="container-main relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-badge uppercase text-white/50 tracking-[0.15em] font-bold">
            CONVINCED?
          </span>
          <h2 className="text-h2 text-white mt-3 font-bold">
            Discover Stores Near You
          </h2>
          <p className="text-body text-white/70 mt-4 max-w-[500px] leading-relaxed">
            Browse verified vendors and compare products from multiple stores with ease.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 bg-[#0B4A8F] hover:bg-[#0B4A8F]/90 text-white font-semibold text-body px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* Full Width Divider */}
      <div className="w-full h-[1px] bg-white/10 relative z-10" />

      {/* Full Width Footer Bottom */}
      <div className="w-full px-6 md:px-12 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="GoMall"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </a>

          {/* Copyright */}
          <p className="text-caption text-white/60 text-center">
            &copy; 2026 GoMall. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 shrink-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              >
                <social.icon size={15} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
