import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Hammer } from "lucide-react";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center justify-center py-24 px-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-6">
            <Hammer className="w-8 h-8 text-navy" />
          </div>

          <span className="text-caption uppercase tracking-wider text-orange font-semibold">
            Coming soon
          </span>

          <h1 className="text-h2 text-text-primary font-bold mt-3">
            We're still building this page
          </h1>

          <p className="text-body text-text-secondary mt-3 max-w-md">
            This part of GoMall isn't ready yet. Check back soon — in the
            meantime you can head back or return to the homepage.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-navy hover:bg-navy-blue text-white px-6 py-2.5 rounded-full font-bold text-body transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              Go back
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 border border-border-gray text-text-primary hover:bg-gray-bg px-6 py-2.5 rounded-full font-bold text-body transition-colors"
            >
              Go to homepage
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
