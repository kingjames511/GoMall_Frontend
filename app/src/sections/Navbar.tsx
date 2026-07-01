import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingCart, User, Menu, X, LogIn, UserPlus } from "lucide-react";
import { navLinks } from "@/data/siteData";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`bg-white border-b border-border-gray sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container-main h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none cursor-pointer"
        >
          <img
            src="/assets/logo.png"
            alt="GoMall"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href === "/") {
                  e.preventDefault();
                  navigate("/");
                }
              }}
              className="text-body font-medium text-text-primary hover:text-navy transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <button
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Favorites"
            >
              <Heart size={20} />
            </button>

            <button
              className="text-text-secondary hover:text-text-primary transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* User Menu */}
            <div
              className="relative py-2"
              ref={userMenuRef}
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gray-bg flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <User size={18} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-10 w-44 bg-white rounded-lg shadow-lg border border-border-gray py-2 z-50"
                  >
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-text-primary hover:bg-gray-bg transition-colors cursor-pointer text-left"
                    >
                      <LogIn size={16} />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/signup");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-text-primary hover:bg-gray-bg transition-colors cursor-pointer text-left"
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-border-gray overflow-hidden"
          >
            <div className="container-main py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-3 text-body font-medium text-text-primary hover:text-navy transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border-gray">
                <button className="flex items-center gap-2 text-text-secondary">
                  <Heart size={18} /> Favorites
                </button>
                <button className="flex items-center gap-2 text-text-secondary">
                  <ShoppingCart size={18} /> Cart (0)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
