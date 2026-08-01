import { ChevronRight, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { useProductsQuery } from "@/query/products";

const TrendingProducts = () => {
  const { data: allProducts = [], isLoading } = useProductsQuery();

  // Show the first 8 products as the trending set.
  const products = allProducts.slice(0, 8);

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-h2 text-text-primary">Trending Products</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-body font-medium text-navy hover:underline transition-all"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton
            count={8}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageSearch className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-body font-medium text-text-primary">
              No trending products yet
            </p>
            <p className="text-caption text-text-secondary mt-1">
              Check back soon for the latest deals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
