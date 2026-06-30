import { useState, useEffect } from "react";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import HeroSection from "@/sections/HeroSection";
import PromoGrid from "@/sections/PromoGrid";
import TrendingProducts from "@/sections/TrendingProducts";
import CustomerExperience from "@/sections/CustomerExperience";
import PopularStores from "@/sections/PopularStores";
import FAQSection from "@/sections/FAQSection";
import StartSellingCTA from "@/sections/StartSellingCTA";
import Footer from "@/sections/Footer";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import OTPPage from "@/pages/OTPPage";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [pageData, setPageData] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#login") {
        setCurrentPage("login");
      } else if (hash === "#signup") {
        setCurrentPage("signup");
      } else if (hash === "#otp") {
        setCurrentPage("otp");
      } else {
        setCurrentPage("home");
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page: string, data?: Record<string, string>) => {
    if (data) setPageData((prev) => ({ ...prev, ...data }));
    setCurrentPage(page);
    window.location.hash = page === "home" ? "" : page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {currentPage === "login" ? (
        <LoginPage onNavigate={handleNavigate} />
      ) : currentPage === "signup" ? (
        <SignUpPage onNavigate={handleNavigate} />
      ) : currentPage === "otp" ? (
        <OTPPage email={pageData.email} onNavigate={handleNavigate} />
      ) : (
        <>
          <TopBar />
          <Navbar onNavigate={handleNavigate} />
          <main>
            <HeroSection />
            <PromoGrid />
            <TrendingProducts />
            <CustomerExperience />
            <PopularStores />
            <FAQSection />
            <StartSellingCTA />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
