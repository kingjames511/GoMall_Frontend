import { useNavigate, Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist } = useAppContext();

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">Saved Items</span>
        </div>

        <div className="container-main py-6">
          {/* Page Heading & Count Badge */}
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy">
              Saved Items
            </h1>
            <span className="bg-navy text-white font-bold text-sm px-3 py-1 rounded-full">
              {wishlist.length}
            </span>
          </div>

          {/* Conditional rendering based on wishlist count */}
          {wishlist.length > 0 ? (
            /* Active Wishlist State (Grid matching attachment 1) */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {wishlist.map((product, idx) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="block"
                  onClick={(e) => {
                    // Prevent navigation if click is inside the Heart or Add to Cart buttons
                    if ((e.target as HTMLElement).closest("button")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <ProductCard product={product} index={idx} />
                </Link>
              ))}
            </div>
          ) : (
            /* Empty Wishlist State (matching attachment 2) */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              {/* Circular light blue icon container */}
              <div className="w-24 h-24 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-6">
                <ShoppingCart className="w-10 h-10" />
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                You haven't saved an item yet!
              </h2>

              {/* Subtitle */}
              <p className="text-body text-text-secondary max-w-md mb-8 leading-relaxed">
                Simply tap the heart-shaped icon beside the item to save it to your wishlist!
              </p>

              {/* Action Button */}
              <button
                onClick={() => navigate("/products")}
                className="bg-navy hover:bg-navy text-white font-bold text-body py-3.5 px-10 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
