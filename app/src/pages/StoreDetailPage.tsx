import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { SlidersHorizontal, Search, Star, Package, ChevronLeft, ChevronRight, X, StoreIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { formatPrice, formatCount } from "@/utils/format";
import type { Product } from "@/types/product";
import type { Store } from "@/types/store";

// TODO: replace with the store fetched from the API by id
const mockStores: Store[] = [];
// TODO: replace with the store's products fetched from the API
const mockProducts: Product[] = [];

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Categories", "Electronics", "Smartphones", "Laptops"]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(["In Stock"]);
  const [priceRange, setPriceRange] = useState<[number, number]>([24900, 50000]);
  const [currentPage, setCurrentPage] = useState(3);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Find store by id (no fallback — undefined when not found)
  const store = useMemo(
    () => mockStores.find((s) => s.id === Number(id)),
    [id]
  );

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (category === "All Categories") {
      if (selectedCategories.includes("All Categories")) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(["All Categories", "Electronics", "Smartphones", "Laptops"]);
      }
    } else {
      let updated = selectedCategories.filter((c) => c !== "All Categories");
      if (updated.includes(category)) {
        updated = updated.filter((c) => c !== category);
      } else {
        updated.push(category);
      }
      // If all sub-categories are checked, also check All Categories
      if (
        updated.includes("Electronics") &&
        updated.includes("Smartphones") &&
        updated.includes("Laptops")
      ) {
        updated.push("All Categories");
      }
      setSelectedCategories(updated);
    }
  };

  // Handle availability toggle
  const handleAvailabilityToggle = (status: string) => {
    if (selectedAvailability.includes(status)) {
      setSelectedAvailability(selectedAvailability.filter((s) => s !== status));
    } else {
      setSelectedAvailability([...selectedAvailability, status]);
    }
  };

  // Filter and sort products
  const storeProducts = useMemo(() => {
    // Filter products belonging to this store
    let result = mockProducts.filter((p) => p.store === store?.name);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Category filter
    if (!selectedCategories.includes("All Categories") && selectedCategories.length > 0) {
      result = result.filter((p) => {
        if (!p.category) return false;
        return selectedCategories.includes(p.category) ||
               (selectedCategories.includes("Electronics") && p.category === "Electronics") ||
               (selectedCategories.includes("Smartphones") && p.category === "Smartphones") ||
               (selectedCategories.includes("Laptops") && p.category === "Laptops");
      });
    } else if (selectedCategories.length === 0) {
      result = []; // If no categories selected, show nothing
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        const inStock = p.inStock;
        const availability = p.availability || (inStock ? "in-stock" : "out-of-stock");

        return selectedAvailability.some((status) => {
          if (status === "In Stock") return availability === "in-stock";
          if (status === "Out of Stock") return availability === "out-of-stock";
          if (status === "Pre Order") return availability === "pre-order";
          return false;
        });
      });
    }

    // Price range filter
    result = result.filter(
      (p) => p.currentPrice >= priceRange[0] && p.currentPrice <= priceRange[1]
    );

    // Sort by
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [store?.name, searchQuery, selectedCategories, selectedAvailability, priceRange, sortBy]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= 12) {
      setCurrentPage(page);
    }
  };

  // Not-found / empty state (until the store is fetched from the API)
  if (!store) {
    return (
      <div className="min-h-screen bg-white font-vietnam flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <StoreIcon className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-body font-medium text-text-primary">
              Store not found
            </p>
            <p className="text-caption text-text-secondary mt-1">
              This store may no longer be available.
            </p>
            <Link
              to="/stores"
              className="mt-6 bg-navy hover:bg-navy-blue text-white px-6 py-2.5 rounded-full font-bold text-body transition-colors"
            >
              Browse stores
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Section */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/stores" className="hover:text-navy transition-colors">Stores</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">{store.name}</span>
        </div>

        {/* Store Cover Header Banner */}
        <div className="bg-navy text-white py-10 relative overflow-hidden">
          {/* Subtle Background pattern overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-30 z-0" />

          <div className="container-main relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Store Avatar Circular image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-white overflow-hidden shrink-0 shadow-lg">
              <img
                src={store.avatarImage || "/assets/promo-shopping-bags.jpg"}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Store Text details */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5 justify-center md:justify-start">
                <h1 className="text-h2 font-bold text-white tracking-tight leading-tight">
                  {store.name}
                </h1>
                {store.verified && (
                  <span className="inline-flex items-center gap-1 bg-green/20 text-white border border-green/30 text-[10px] sm:text-badge px-2.5 py-0.5 rounded-full font-semibold self-center">
                    <svg
                      className="w-3 h-3 text-green fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-body-sm text-white/90 mt-1 max-w-xl leading-relaxed">
                {store.description}
              </p>

              {/* Ratings and products counts */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-caption text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-star text-star" />
                  <span className="text-white font-bold">{store.rating}</span>
                  <span className="text-white/60">({formatCount(store.reviewCount)})</span>
                </span>
                <span className="text-white/40 font-normal">|</span>
                <span className="flex items-center gap-1">
                  <Package size={13} className="text-orange" />
                  <span>{formatCount(store.productCount)} Products</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Products list */}
        <div className="container-main py-10">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border-gray mb-8">
            <div className="flex items-center gap-3 w-full md:w-auto">
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
                {storeProducts.length} Products Found
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
                      className="absolute right-0 mt-2 w-52 bg-white border border-border-gray rounded-lg shadow-lg py-1 z-30"
                    >
                      {[
                        "Most Popular",
                        "Newest Arrivals",
                        "Price: High to Low",
                        "Price: Low to High",
                        "Highest Rated",
                        "Best Selling",
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

          <div className="flex gap-8 items-start relative">
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

                  <div className="space-y-6">
                    {/* Category Checkboxes */}
                    <div>
                      <h4 className="text-body font-bold text-text-primary mb-3">Category</h4>
                      <div className="space-y-3">
                        {[
                          { key: "All Categories", label: "All Categories" },
                          { key: "Electronics", label: "Electronics" },
                          { key: "Smartphones", label: "Smartphones" },
                          { key: "Laptops", label: "Laptops" },
                        ].map((c) => {
                          const checked = selectedCategories.includes(c.key);
                          return (
                            <label
                              key={c.key}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleCategoryToggle(c.key)}
                                className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                              />
                              <span className={`text-body transition-colors ${checked ? "font-semibold text-navy" : "text-text-secondary group-hover:text-text-primary"}`}>
                                {c.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Availability Checkboxes */}
                    <div>
                      <h4 className="text-body font-bold text-text-primary mb-3">Availability</h4>
                      <div className="space-y-3">
                        {[
                          { key: "In Stock", label: "In Stock" },
                          { key: "Out of Stock", label: "Out of Stock" },
                          { key: "Pre Order", label: "Pre Order" },
                        ].map((av) => {
                          const checked = selectedAvailability.includes(av.key);
                          return (
                            <label
                              key={av.key}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleAvailabilityToggle(av.key)}
                                className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                              />
                              <span className={`text-body transition-colors ${checked ? "font-semibold text-navy" : "text-text-secondary group-hover:text-text-primary"}`}>
                                {av.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Range Slider */}
                    <div>
                      <h4 className="text-body font-bold text-text-primary mb-3">Price Range</h4>
                      <div className="px-1 pt-2">
                        <Slider
                          min={10000}
                          max={60000}
                          step={500}
                          value={priceRange}
                          onValueChange={(val) => setPriceRange(val as [number, number])}
                          className="my-4"
                        />
                        <div className="flex items-center justify-between text-body-sm text-text-secondary mt-2">
                          <span className="font-semibold text-navy">{formatPrice(priceRange[0])}</span>
                          <span className="text-text-muted">of</span>
                          <span className="font-semibold text-navy">{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-8 py-3 rounded-lg bg-navy text-white font-bold text-body hover:bg-navy-blue transition-colors cursor-pointer text-center"
                  >
                    Apply Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Sidebar Filters */}
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

                      <div className="space-y-6">
                        {/* Category checkboxes */}
                        <div>
                          <h4 className="text-body font-bold text-text-primary mb-3">Category</h4>
                          <div className="space-y-3">
                            {[
                              { key: "All Categories", label: "All Categories" },
                              { key: "Electronics", label: "Electronics" },
                              { key: "Smartphones", label: "Smartphones" },
                              { key: "Laptops", label: "Laptops" },
                            ].map((c) => {
                              const checked = selectedCategories.includes(c.key);
                              return (
                                <label
                                  key={c.key}
                                  className="flex items-center gap-3 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleCategoryToggle(c.key)}
                                    className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                                  />
                                  <span className={`text-body ${checked ? "font-semibold text-navy" : "text-text-secondary"}`}>
                                    {c.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Availability checkboxes */}
                        <div>
                          <h4 className="text-body font-bold text-text-primary mb-3">Availability</h4>
                          <div className="space-y-3">
                            {[
                              { key: "In Stock", label: "In Stock" },
                              { key: "Out of Stock", label: "Out of Stock" },
                              { key: "Pre Order", label: "Pre Order" },
                            ].map((av) => {
                              const checked = selectedAvailability.includes(av.key);
                              return (
                                <label
                                  key={av.key}
                                  className="flex items-center gap-3 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleAvailabilityToggle(av.key)}
                                    className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                                  />
                                  <span className={`text-body ${checked ? "font-semibold text-navy" : "text-text-secondary"}`}>
                                    {av.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Price Range Slider */}
                        <div>
                          <h4 className="text-body font-bold text-text-primary mb-3">Price Range</h4>
                          <div className="px-1 pt-2">
                            <Slider
                              min={10000}
                              max={60000}
                              step={500}
                              value={priceRange}
                              onValueChange={(val) => setPriceRange(val as [number, number])}
                              className="my-4"
                            />
                            <div className="flex items-center justify-between text-body-sm text-text-secondary mt-2">
                              <span className="font-semibold text-navy">{formatPrice(priceRange[0])}</span>
                              <span className="text-text-muted">of</span>
                              <span className="font-semibold text-navy">{formatPrice(priceRange[1])}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 bg-navy text-white font-bold text-body hover:bg-navy-blue rounded-lg transition-colors cursor-pointer text-center mt-4"
                    >
                      Apply Filter
                    </button>
                  </motion.div>
                  <div className="flex-1" onClick={() => setShowFilters(false)} />
                </div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-grow">
              {storeProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border-gray rounded-2xl bg-gray-bg/10">
                  <p className="text-text-muted text-body-sm">No products found matching your filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategories(["All Categories", "Electronics", "Smartphones", "Laptops"]);
                      setSelectedAvailability(["In Stock"]);
                      setPriceRange([24900, 50000]);
                    }}
                    className="mt-4 text-navy font-bold hover:underline text-body"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {storeProducts.map((product, idx) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="block"
                      onClick={(e) => {
                        // Prevent navigation if favorite button or cart buttons inside the ProductCard are clicked
                        if ((e.target as HTMLElement).closest("button")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <ProductCard product={product} index={idx} />
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
