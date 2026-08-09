import { useState, useMemo } from "react";
import { Link } from "react-router";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/utils/format";
import { useProductsQuery } from "@/query/products";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Categories"]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(["In Stock"]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 60000]);
  const [currentPage, setCurrentPage] = useState(3);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

 

  const categories = [
    "All Categories",
    "Smartphones",
    "Electronics",
    "Beauty",
    "Home & Living",
    "Laptops",
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

  const handleAvailabilityToggle = (status: string) => {
    if (selectedAvailability.includes(status)) {
      setSelectedAvailability(selectedAvailability.filter((s) => s !== status));
    } else {
      setSelectedAvailability([...selectedAvailability, status]);
    }
  };

  // Determine if we are in "Search/Filter Mode" or "Sectioned/All Products Mode"
  const isSearchActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      !selectedCategories.includes("All Categories") ||
      selectedAvailability.length !== 1 ||
      selectedAvailability[0] !== "In Stock" ||
      priceRange[0] !== 10000 ||
      priceRange[1] !== 60000 ||
      sortBy !== "Most Popular"
    );
  }, [searchQuery, selectedCategories, selectedAvailability, priceRange, sortBy]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (!selectedCategories.includes("All Categories") && selectedCategories.length > 0) {
      result = result.filter((p) => p.category && selectedCategories.includes(p.category));
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
    result = result.filter((p) => {
      return p.currentPrice >= priceRange[0] && p.currentPrice <= priceRange[1];
    });

    // Sort by
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedAvailability, priceRange, sortBy]);

  // Sectioned Products slices
  const trendingProducts = useMemo(() => products.slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.slice(4, 8), [products]);
  const bestSellers = useMemo(() => products.slice(2, 6), [products]);
  const flashDeals = useMemo(
    () => [products[7], products[0], products[3], products[6]].filter(Boolean),
    [products]
  );

  const hasSectionedProducts =
    trendingProducts.length > 0 ||
    newArrivals.length > 0 ||
    bestSellers.length > 0 ||
    flashDeals.length > 0;

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
        {/* Breadcrumbs */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">Products</span>
        </div>

        {/* All Products Banner Cover */}
        <div className="relative bg-navy text-white py-16 px-6 sm:px-12 overflow-hidden">
          {/* Cover background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/promo-shopping-bags.jpg"
              alt="All Products Cover Background"
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
              All Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-body text-gray-300 max-w-xl leading-relaxed"
            >
              Explore thousands of products from trusted stores and find the best deals across multiple categories.
            </motion.p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container-main py-10">
          {/* Heading and Controls Section */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-gray mb-8">
              <h2 className="text-h2 font-bold text-text-primary">
                {isSearchActive ? "Search Results" : "Trending Products"}
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-3 w-full sm:w-auto">
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

                  {/* Search Input */}
                  <div className="relative flex-grow sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="text"
                      placeholder="Search products, brands, or stores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-border-gray rounded-lg text-body bg-white outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-body">
                  <span className="text-text-secondary font-medium shrink-0">
                    {isSearchActive ? filteredProducts.length : products.length} Products Found
                  </span>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-border-gray rounded-lg bg-white font-semibold text-text-primary hover:bg-gray-bg cursor-pointer transition-all min-w-[150px]"
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
            </div>
          </div>

          <div className="flex gap-8 relative items-start">
            {/* Filter sidebar */}
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
                    {/* Category checkboxes */}
                    <div>
                      <h4 className="text-body font-bold text-text-primary mb-3">Category</h4>
                      <div className="space-y-3">
                        {categories.map((c) => {
                          const checked = selectedCategories.includes(c);
                          return (
                            <label
                              key={c}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleCategoryToggle(c)}
                                className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                              />
                              <span className={`text-body transition-colors ${checked ? "font-semibold text-navy" : "text-text-secondary group-hover:text-text-primary"}`}>
                                {c}
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
                    className="w-full mt-8 py-3 rounded-lg bg-border-gray text-text-primary font-bold text-body hover:bg-navy/5 transition-colors cursor-pointer text-center"
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
                            {categories.map((c) => {
                              const checked = selectedCategories.includes(c);
                              return (
                                <label
                                  key={c}
                                  className="flex items-center gap-3 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleCategoryToggle(c)}
                                    className="rounded border-gray-300 text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                                  />
                                  <span className={`text-body ${checked ? "font-semibold text-navy" : "text-text-secondary"}`}>
                                    {c}
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
                      className="w-full py-3 bg-border-gray text-text-primary font-bold text-body hover:bg-navy/5 rounded-lg transition-colors cursor-pointer text-center mt-4"
                    >
                      Apply Filter
                    </button>
                  </motion.div>
                  <div className="flex-1" onClick={() => setShowFilters(false)} />
                </div>
              )}
            </AnimatePresence>

            {/* Products Lists / Grids */}
            <div className="flex-grow">
              {isLoading ? (
                /* Skeleton loader while products are fetched from the API */
                <ProductGridSkeleton count={8} />
              ) : isSearchActive ? (
                /* Search Results View */
                <div>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border-gray rounded-2xl bg-gray-bg/10">
                      <p className="text-text-muted text-body-sm">No products found matching your filter criteria.</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategories(["All Categories"]);
                          setSelectedAvailability(["In Stock"]);
                          setPriceRange([10000, 60000]);
                          setSortBy("Most Popular");
                        }}
                        className="mt-4 text-navy font-bold hover:underline text-body"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                      {filteredProducts.map((product, idx) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="block"
                          onClick={(e) => {
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
              ) : !hasSectionedProducts ? (
                /* Empty state while products load from the API */
                <div className="text-center py-20 border border-dashed border-border-gray rounded-2xl bg-gray-bg/10">
                  <p className="text-body font-medium text-text-primary">No products yet</p>
                  <p className="text-body-sm text-text-muted mt-1">
                    Products will appear here once they are available.
                  </p>
                </div>
              ) : (
                /* Static Row Sections View matching design attachment */
                <div className="space-y-12">
                  {/* Trending Products Grid (4 items) */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                      {trendingProducts.map((product, idx) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("button")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <ProductCard product={product} index={idx} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* New Arrivals Section */}
                  <div>
                    <h3 className="text-h3 font-bold text-text-primary mb-6">New Arrivals</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                      {newArrivals.map((product, idx) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("button")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <ProductCard product={product} index={idx} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Best Sellers Section */}
                  <div>
                    <h3 className="text-h3 font-bold text-text-primary mb-6">Best Sellers</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                      {bestSellers.map((product, idx) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("button")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <ProductCard product={product} index={idx} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Flash Deals Section */}
                  <div>
                    <h3 className="text-h3 font-bold text-text-primary mb-6">Flash Deals</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
                      {flashDeals.map((product, idx) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="block"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("button")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <ProductCard product={product} index={idx} />
                        </Link>
                      ))}
                    </div>
                  </div>
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
