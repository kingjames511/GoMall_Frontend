import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import HeroSection from "@/sections/HeroSection";
import PromoGrid from "@/sections/PromoGrid";
import TrendingProducts from "@/sections/TrendingProducts";
import CustomerExperience from "@/sections/CustomerExperience";
import PopularStores from "@/sections/PopularStores";
import FAQSection from "@/sections/FAQSection";
import StartSellingCTA from "@/sections/StartSellingCTA";
import DiscoverStores from "@/sections/DiscoverStores";
import Footer from "@/sections/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <TopBar />
      <Navbar />
      <main>
        <HeroSection />
        <PromoGrid />
        <TrendingProducts />
        <CustomerExperience />
        <PopularStores />
        <FAQSection />
        <StartSellingCTA />
        <DiscoverStores />
      </main>
      <Footer />
    </div>
  );
}

export default App;
