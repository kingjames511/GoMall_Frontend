import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { navLinks } from "@/data/siteData";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/query/cart";
import { useCurrentUserQuery } from "@/query/auth";
import { clearAuth, isAuthenticated } from "@/utils/storage";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { wishlist } = useAppContext();
  const { itemCount: cartCount } = useCart();
  const loggedIn = isAuthenticated();
  const { data: user } = useCurrentUserQuery();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUserMenuOpen(false);
    clearAuth();
    // Drop cached user/cart data so it doesn't leak into the next session.
    queryClient.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim() || "GoMall User"
    : "";
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "";


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

  const isLinkActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isWishlistActive = location.pathname === "/wishlist" || location.pathname === "/favourites";
  const isCartActive = location.pathname === "/cart";

  return (
    <nav
      className={`bg-white border-b border-border-gray sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container-main h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none cursor-pointer"
        >
          <img
            src="/assets/logo.png"
            alt="GoMall"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-body font-medium transition-all duration-200 px-4 py-1.5 rounded-full ${
                  active
                    ? "bg-[#0B4A8F] text-white"
                    : "text-text-primary hover:text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Icons Row */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={() => navigate("/products")}
            className="flex flex-col items-center justify-center text-text-secondary hover:text-navy transition-colors group cursor-pointer"
            aria-label="Search"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary group-hover:text-navy">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-semibold text-text-muted mt-0.5 group-hover:text-navy">Search</span>
          </button>

          {/* Wishlist / Favourite Button */}
          <button
            onClick={() => navigate("/wishlist")}
            className="flex flex-col items-center justify-center transition-colors group cursor-pointer"
            aria-label="Favorites"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isWishlistActive
                  ? "bg-[#0B4A8F] text-white"
                  : "text-text-secondary group-hover:bg-gray-bg"
              }`}
            >
              <Heart size={20} className={isWishlistActive ? "fill-white" : ""} />
            </div>
            <span className={`text-[10px] font-semibold mt-0.5 ${isWishlistActive ? "text-navy" : "text-text-muted group-hover:text-navy"}`}>
              Favourite
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center justify-center transition-colors relative group cursor-pointer"
            aria-label="Cart"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCartActive
                  ? "bg-[#0B4A8F] text-white"
                  : "text-text-secondary group-hover:bg-gray-bg"
              }`}
            >
              <ShoppingCart size={20} />
              {/* Dynamic badge with green bg to match attachment 1 */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-1 w-5 h-5 bg-[#22A65A] border-2 border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold mt-0.5 ${isCartActive ? "text-navy" : "text-text-muted group-hover:text-navy"}`}>
              Cart
            </span>
          </button>

          {/* User Menu Pill Container matching Eric's design */}
          <div
            className="relative hidden sm:block"
            ref={userMenuRef}
          >
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="h-10 px-2 rounded-full border border-gray-200 bg-white flex items-center gap-1.5 hover:border-navy transition-all cursor-pointer shadow-sm"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-gray-bg overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center">
                {loggedIn ? (
                  <span className="w-full h-full bg-[#0B4A8F] text-white flex items-center justify-center text-[11px] font-bold">
                    {initials}
                  </span>
                ) : (
                  <User size={16} className="text-text-secondary" />
                )}
              </div>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-12 w-64 bg-white rounded-md shadow-lg border border-border-gray py-2 z-50"
                >
                  {loggedIn ? (
                    <>
                      {/* Signed-in header with real user data */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-gray">
                        <div className="w-10 h-10 rounded-full bg-[#0B4A8F] text-white flex items-center justify-center text-body font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body font-bold text-text-primary truncate">
                            {fullName || "Loading…"}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5 truncate">
                            {user?.email ?? "Signed in"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-text-primary hover:bg-gray-bg transition-colors cursor-pointer text-left mt-1"
                      >
                        <User size={16} className="text-text-secondary" />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-[#DC3545] hover:bg-[#DC3545]/5 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Signed-out state */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-gray">
                        <div className="w-10 h-10 rounded-full bg-gray-bg flex items-center justify-center text-text-secondary shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body font-bold text-text-primary truncate">
                            You're not signed in
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5 truncate">
                            Log in to view your account
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/login");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-text-primary hover:bg-gray-bg transition-colors cursor-pointer text-left mt-1"
                      >
                        <LogIn size={16} className="text-text-secondary" />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/signup");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-text-primary hover:bg-gray-bg transition-colors cursor-pointer text-left"
                      >
                        <UserPlus size={16} className="text-text-secondary" />
                        Sign Up
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-text-primary focus:outline-none cursor-pointer"
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
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`py-3 text-body font-medium px-4 rounded-lg transition-colors ${
                      active
                        ? "bg-[#0B4A8F] text-white"
                        : "text-text-primary hover:text-navy"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="flex flex-col gap-4 pt-4 border-t border-border-gray">
                <div className="flex items-center gap-4 px-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/wishlist");
                    }}
                    className="flex items-center gap-2 text-text-secondary font-medium"
                  >
                    <Heart size={18} /> Favorites ({wishlist.length})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/cart");
                    }}
                    className="flex items-center gap-2 text-text-secondary font-medium"
                  >
                    <ShoppingCart size={18} /> Cart ({cartCount})
                  </button>
                </div>

                <div className="flex gap-3 pt-1 px-4 mb-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-[#0B2D6E] text-[#0B2D6E] font-semibold text-center text-sm hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#0B2D6E] text-white font-semibold text-center text-sm hover:bg-[#091f50] transition-all cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
