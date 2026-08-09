import { useState, useMemo } from "react";
import { Link } from "react-router";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import StoreCard from "@/components/StoreCard";
import type { Store } from "@/types/store";

// TODO: replace with stores fetched from the API
const mockStores: Store[] = [];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Categories"]);
  const [currentPage, setCurrentPage] = useState(3);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Groceries",
    "Beauty",
    "Home & Living",
    "Sports",
  ];

  const handleCategoryToggle = (category: string) => {
    if (category === "All Categories") {
      setSelectedCategories(["All Categories"]);
    } else {
      let updated = selectedCategories.filter((c) => c !== "All Categories");
      if (updated.includes(category)) {
        updated = updated.filter((c) => c !== category);
        if (updated.length === 0) {
          updated = ["All Categories"];
        }
      } else {
        updated.push(category);
      }
      setSelectedCategories(updated);
    }
  };

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let result = [...mockStores];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Category filter (mock behavior since categories are not fully mapped in mockStores)
    // For realistic simulation, we use category names to match descriptions or store IDs
    if (!selectedCategories.includes("All Categories")) {
      result = result.filter((s) => {
        return selectedCategories.some((cat) => {
          if (cat === "Electronics") return s.description.toLowerCase().includes("gadget") || s.description.toLowerCase().includes("electronic");
          if (cat === "Fashion") return s.name.toLowerCase().includes("fashion") || s.description.toLowerCase().includes("wear");
          return true; // fallback
        });
      });
    }

    // Sort
    if (sortBy === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Most Products") {
      result.sort((a, b) => b.productCount - a.productCount);
    }

    return result;
  }, [searchQuery, selectedCategories, sortBy]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= 12) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      {/* <TopBar /> */}
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section */}
        <div className="relative bg-navy text-white py-16 px-6 sm:px-12 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/promo-store-interior.jpg"
              alt="Explore Stores Banner Background"
              className="w-full h-full object-cover opacity-20 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />
          </div>

          <div className="container-main relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            >
              Explore Stores
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-body text-gray-300 max-w-xl leading-relaxed"
            >
              Discover verified stores offering quality products and competitive prices across multiple categories.
            </motion.p>
          </div>
        </div>

        {/* Filter and Content section */}
        <div className="container-main py-10">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border-gray mb-8">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-body font-semibold transition-all cursor-pointer ${
                  showFilters
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-text-primary border-border-gray hover:bg-gray-bg"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>Filter</span>
              </button>

              {/* Search bar */}
              <div className="relative flex-1 md:w-80">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="Search for anything here......"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto text-body">
              <span className="text-text-secondary font-medium">
                {filteredStores.length} Stores Found
              </span>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border-gray rounded-lg bg-white font-semibold text-text-primary hover:bg-gray-bg cursor-pointer transition-all min-w-[160px]"
                >
                  <span className="text-text-muted font-normal mr-1">Sort by:</span>
                  <span className="text-navy">{sortBy}</span>
                  <svg
                    className={`w-4 h-4 text-text-muted ml-auto transition-transform ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-border-gray rounded-lg shadow-lg py-1 z-30"
                    >
                      {[
                        "Most Popular",
                        "Highest Rated",
                        "Newest Stores",
                        "Most Products",
                        "All",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-body hover:bg-gray-bg transition-colors flex justify-between items-center ${
                            sortBy === option
                              ? "text-navy font-semibold bg-gray-bg/50"
                              : "text-text-primary"
                          }`}
                        >
                          <span>{option}</span>
                          {sortBy === option && (
                            <svg
                              className="w-4 h-4 text-navy"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex gap-8 relative items-start">
            {/* Sidebar filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 280 }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="hidden lg:block shrink-0 bg-white border border-border-gray rounded-2xl p-6 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border-gray mb-6">
                    <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      Filter
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-body font-bold text-text-primary mb-3">Category</h4>
                    <div className="space-y-3">
                      {categories.map((category) => {
                        const checked = selectedCategories.includes(category);
                        return (
                          <label
                            key={category}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCategoryToggle(category)}
                              className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-body transition-colors ${checked ? "font-semibold text-navy" : "text-text-secondary group-hover:text-text-primary"}`}>
                              {category}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-8 py-3 rounded-lg bg-border-gray text-text-primary font-bold text-body hover:bg-navy/5 transition-colors cursor-pointer text-center"
                  >
                    Apply Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile / Floating Drawer filters */}
            <AnimatePresence>
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40 flex justify-start">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    className="w-80 bg-white h-full p-6 shadow-lg flex flex-col justify-between overflow-y-auto"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-border-gray mb-6">
                        <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
                          <SlidersHorizontal size={16} />
                          Filter
                        </h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-body font-bold text-text-primary mb-3">Category</h4>
                        <div className="space-y-3">
                          {categories.map((category) => {
                            const checked = selectedCategories.includes(category);
                            return (
                              <label
                                key={category}
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleCategoryToggle(category)}
                                  className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                                />
                                <span className={`text-body ${checked ? "font-semibold text-navy" : "text-text-secondary"}`}>
                                  {category}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 rounded-lg bg-border-gray text-text-primary font-bold text-body hover:bg-navy/5 transition-colors cursor-pointer text-center mt-4"
                    >
                      Apply Filter
                    </button>
                  </motion.div>
                  <div className="flex-1" onClick={() => setShowFilters(false)} />
                </div>
              )}
            </AnimatePresence>

            {/* Grid Container */}
            <div className="flex-grow">
              {filteredStores.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border-gray rounded-2xl bg-gray-bg/10">
                  <p className="text-text-muted text-body-sm">No stores match your search or filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategories(["All Categories"]);
                    }}
                    className="mt-4 text-navy font-bold hover:underline text-body"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredStores.map((store, idx) => (
                    <Link
                      key={store.id}
                      to={`/stores/${store.id}`}
                      className="block group"
                    >
                      <StoreCard store={store} index={idx} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-border-gray text-body">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-border-gray rounded-lg font-semibold text-text-primary hover:bg-gray-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              {[1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === p
                      ? "border border-gray-300 text-text-secondary font-bold"
                      : "text-text-secondary hover:bg-gray-bg"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(3)}
                className={`w-9 h-9 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 3
                    ? "border border-gray-300 text-text-secondary font-bold"
                    : "text-text-secondary hover:bg-gray-bg"
                }`}
              >
                3
              </button>

              <span className="text-text-muted px-1">...</span>

              {[10, 11, 12].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === p
                      ? "border border-gray-300 text-text-secondary font-bold"
                      : "text-text-secondary hover:bg-gray-bg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Mobile simplified page indicator */}
            <span className="sm:hidden text-text-secondary font-medium">
              Page {currentPage} of 12
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === 12}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-border-gray rounded-lg font-semibold text-text-primary hover:bg-gray-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
