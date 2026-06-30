import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo form submission
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-x-hidden p-[2px] gap-6 lg:gap-0">

      {/* Left Side: Marketing Card Banner (Spans full height with 2px padding) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 xl:w-[50%] relative rounded-[10px] lg:rounded-[20px] overflow-hidden min-h-[520px] lg:min-h-[calc(100vh-4px)] flex flex-col justify-between p-8 sm:p-10 lg:p-12 text-white shadow-md"
      >
        {/* Background Image */}
        <img
          src="/assets/login-picture.png"
          alt="GoMall Shopping Experience"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Gradient Overlay for legibility */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,31,63,0.85) 0%, rgba(11,31,63,0.35) 45%, rgba(11,31,63,0.92) 100%)",
          }}
        />

        {/* Top Header: Logo */}
        <div className="relative z-20 flex items-center">
          <button
            onClick={() => onNavigate?.("home")}
            className="focus:outline-none cursor-pointer"
          >
            <img
              src="/assets/logo.png"
              alt="GoMall Logo"
              className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
            />
          </button>
        </div>

        {/* Middle Content: Title and Subtitle */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.15] tracking-tight max-w-[460px]">
            Everything You Need, One Marketplace
          </h1>
          <p className="text-sm sm:text-base text-white/90 mt-4 max-w-[420px] leading-relaxed font-normal">
            Shop from multiple stores, find the best deals, and get your orders delivered with ease.
          </p>
        </div>

        {/* Bottom Card: GoMall Benefits */}
        <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/15 shadow-lg">
          <span className="text-orange text-xs font-bold tracking-wider uppercase">
            GoMaLL Benefits
          </span>
          <h3 className="text-white text-base md:text-lg font-bold mt-1">
            Compare Prices Across Multiple Stores
          </h3>
          <p className="text-white/85 text-xs md:text-sm mt-1.5 leading-relaxed">
            Save more by finding the best deals from trusted merchants, all in one place.
          </p>
        </div>
      </motion.div>

      {/* Right Side: Perfectly Centered Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-1/2 xl:w-[50%] flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white min-h-[500px] lg:min-h-[calc(100vh-4px)]"
      >
        <div className="max-w-[440px] w-full mx-auto my-auto">
          {/* Form Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy flex items-center justify-center gap-2">
              Welcome Back! <span className="text-2xl sm:text-3xl">😁</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Enter your email and password to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone / Email Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">
                Phone No/Email Address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm transition-all bg-white"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm transition-all pr-11 bg-white placeholder:text-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right pt-1">
              <a
                href="#forgot"
                className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Forgot Password?{" "}
                <span className="text-[#0B4A8F] font-bold hover:underline">
                  Click Here
                </span>
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full mt-4 bg-[#0B4A8F] hover:bg-[#08376b] text-white font-semibold py-3.5 rounded-lg text-sm transition-colors duration-200 shadow-sm cursor-pointer"
            >
              Login
            </motion.button>
          </form>

          {/* Bottom Register Prompt */}
          <p className="text-center text-xs sm:text-sm text-text-secondary mt-8">
            Don’t have an account yet?{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("signup")}
              className="text-[#0B4A8F] font-bold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default LoginPage;
