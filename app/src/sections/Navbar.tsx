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
import CartPanel from "@/components/CartPanel";

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
  const [cartOpen, setCartOpen] = useState(false);
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

  const openCart = () => {
    if (window.innerWidth >= 1024) {
      setCartOpen(true);
      return;
    }
    navigate("/cart");
  };

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
          className="flex items-center cursor-pointer shrink-0 focus:outline-none"
        >
          <img
            src="/assets/logo.png"
            alt="GoMall"
            className="object-contain w-auto h-12"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="items-center hidden gap-2 lg:flex xl:gap-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-body font-medium transition-all duration-200 px-4 py-1.5 rounded-full ${
                  active
                    ? "bg-navy text-white"
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
            className="flex flex-col items-center justify-center transition-colors cursor-pointer text-text-secondary hover:text-navy group"
            aria-label="Search"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary group-hover:text-navy">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-semibold text-text-muted mt-0.5 group-hover:text-navy">Search</span>
          </button>

          {/* Wishlist / Favourite Button */}
          <button
            onClick={() => navigate("/wishlist")}
            className="flex flex-col items-center justify-center transition-colors cursor-pointer group"
            aria-label="Favorites"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isWishlistActive
                  ? "bg-navy text-white"
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
            onClick={openCart}
            className="relative flex flex-col items-center justify-center transition-colors cursor-pointer group"
            aria-label="Cart"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCartActive
                  ? "bg-navy text-white"
                  : "text-text-secondary group-hover:bg-gray-bg"
              }`}
            >
              <ShoppingCart size={20} />
              {/* Dynamic badge with green bg to match attachment 1 */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-1 w-5 h-5 bg-green border-2 border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
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
              <div className="flex items-center justify-center overflow-hidden border border-gray-100 rounded-full w-7 h-7 bg-gray-bg shrink-0">
                {loggedIn ? (
                  <span className="w-full h-full bg-navy text-white flex items-center justify-center text-[11px] font-bold">
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
                  className="absolute right-0 z-50 w-64 py-2 bg-white border rounded-md shadow-lg top-12 border-border-gray"
                >
                  {loggedIn ? (
                    <>
                      {/* Signed-in header with real user data */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-gray">
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-navy text-body shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-body text-text-primary">
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-red hover:bg-red/5 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Signed-out state */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-gray">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-bg text-text-secondary shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-body text-text-primary">
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
            className="cursor-pointer lg:hidden text-text-primary focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/45 lg:hidden"
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed right-0 top-0 z-[70] h-screen w-full max-w-md border-l border-border-gray bg-white shadow-lg"
          >
            <CartPanel onClose={() => setCartOpen(false)} className="h-screen" />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-t lg:hidden border-border-gray"
          >
            <div className="flex flex-col gap-1 py-4 container-main">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`py-3 text-body font-medium px-4 rounded-lg transition-colors ${
                      active
                        ? "bg-navy text-white"
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
                    className="flex items-center gap-2 font-medium text-text-secondary"
                  >
                    <Heart size={18} /> Favorites ({wishlist.length})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/cart");
                    }}
                    className="flex items-center gap-2 font-medium text-text-secondary"
                  >
                    <ShoppingCart size={18} /> Cart ({cartCount})
                  </button>
                </div>

                <div className="flex gap-3 px-4 pt-1 mb-2">
                  {loggedIn ? (
                    <> 
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="flex-1 btn btn-outline"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex-1 btn btn-primary"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login");
                        }}
                        className="flex-1 btn btn-outline"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/signup");
                        }}
                        className="flex-1 btn btn-primary"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
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
