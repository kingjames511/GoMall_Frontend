import { Link } from "react-router";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import FAQSection from "@/sections/FAQSection";

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow pb-16">
        {/* Breadcrumb */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">FAQs</span>
        </div>

        {/* Grey Header Banner matching Attachment 3 */}
        <div className="container-main mb-8">
          <div className="bg-navy rounded-2xl md:rounded-2xl py-12 md:py-16 px-6 text-center text-white shadow-sm relative overflow-hidden">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-200 mt-3 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-normal">
              Everything you need to know about using GoMall, all in one place.
            </p>
          </div>
        </div>

        {/* FAQ Grid Component */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
