import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, Home as HomeIcon } from "lucide-react";
import toast from "react-hot-toast";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ fullName: "", email: "", message: "" });
    }, 800);
  };

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
          <span className="text-text-muted font-semibold">Support</span>
        </div>

        {/* Customer Support Banner matching Attachment 2 */}
        <div className="container-main mb-10">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[220px] sm:h-[260px] md:h-[300px] flex items-center justify-center text-center px-6">
            {/* Background Image with Dark Blur Overlay */}
            <img
              src="/assets/support-bg.png"
              alt="Support Representative"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

            {/* Banner Text Overlay */}
            <div className="relative z-10 max-w-2xl mx-auto text-white">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                How Can We Help You?
              </h1>
              <p className="text-white/90 mt-3 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
                Get the assistance you need with orders, payments, deliveries, and account related questions.
              </p>
            </div>
          </div>
        </div>

        {/* Main Contact Card Container matching Attachment 2 */}
        <div className="container-main">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 md:p-14 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4A8F] focus:ring-1 focus:ring-[#0B4A8F] text-sm text-text-primary outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4A8F] focus:ring-1 focus:ring-[#0B4A8F] text-sm text-text-primary outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder=""
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4A8F] focus:ring-1 focus:ring-[#0B4A8F] text-sm text-text-primary outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0B2D6E] hover:bg-[#082255] text-white font-semibold py-3.5 px-8 rounded-lg text-sm transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Vertical Border Line for Desktop */}
              <div className="hidden lg:block lg:col-span-1 flex justify-center items-center">
                <div className="w-[1px] h-full bg-gray-100" />
              </div>

              {/* Right Column: Contact Info Container */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="bg-[#F9FAFB] rounded-2xl p-6 sm:p-8 flex flex-col justify-center gap-8 h-full border border-gray-100/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2">
                    Contact Info
                  </h2>

                  <div className="space-y-6">
                    {/* Mail */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#333333] shrink-0 shadow-2xs">
                        <Mail size={20} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-text-primary break-all">
                        support.gomall@gmail.com
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#333333] shrink-0 shadow-2xs">
                        <Phone size={20} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-text-primary">
                        +234 809 209 0307
                      </span>
                    </div>

                    {/* Location / Home */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#333333] shrink-0 shadow-2xs">
                        <HomeIcon size={20} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-text-primary">
                        Loremlpsum Lorem Ipsumlorem
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
