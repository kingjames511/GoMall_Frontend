import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";

// ─── Zod Schema ────────────────────────────────────────────────────────────────
const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must be at least 7 digits")
      .regex(/^[+\d\s\-()]+$/, "Invalid phone number"),
    address: z.string().trim().min(5, "Address must be at least 5 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// ─── Password Strength ──────────────────────────────────────────────────────
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "#DC3545" };
  if (score <= 3) return { score, label: "Fair", color: "#E8782F" };
  if (score <= 4) return { score, label: "Good", color: "#F5A623" };
  return { score, label: "Strong", color: "#22A65A" };
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface SignUpPageProps {
  onNavigate?: (page: string, data?: Record<string, string>) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
const SignUpPage = ({ onNavigate }: SignUpPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1500));
      // On success, navigate to OTP page
      onNavigate?.("otp", { email: data.email });
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden p-[2px] gap-0">
      {/* ── Left Panel ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex w-full lg:w-[50%] relative rounded-[20px] overflow-hidden h-full flex-col justify-between p-10 lg:p-12 text-white shadow-md"
      >
        {/* Background Image */}
        <img
          src="/assets/signup.png"
          alt="GoMall Shopping Experience"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,31,63,0.80) 0%, rgba(11,31,63,0.25) 50%, rgba(11,31,63,0.88) 100%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-20 flex items-center">
          <button
            onClick={() => onNavigate?.("home")}
            className="focus:outline-none cursor-pointer"
            aria-label="Go to home"
          >
            <img
              src="/assets/logo.png"
              alt="GoMall Logo"
              className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
            />
          </button>
        </div>

        {/* Hero copy */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl lg:text-[44px] font-extrabold text-white leading-[1.15] tracking-tight max-w-[460px]">
            Shop Smarter with GoMalL
          </h1>
          <p className="text-sm text-white/90 mt-4 max-w-[380px] leading-relaxed">
            Discover thousands of products, compare prices, and enjoy seamless
            delivery from trusted stores.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg">
          <p className="text-white/90 text-sm leading-relaxed">
            GoMall makes shopping so convenient. I can compare prices across
            different stores and always find the best deals.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/assets/promo-shopper.jpg"
                alt="Amaka C."
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">
                Amaka C.
              </p>
              <p className="text-white/70 text-xs">Buyer, Lagos</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-[50%] flex items-center justify-center px-6 py-6 sm:px-10 lg:px-14 bg-white h-full overflow-y-auto"
      >
        <div className="max-w-[480px] w-full mx-auto">
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-[26px] font-bold text-gray-900 leading-tight">
              Let's Get Started
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter the information below
            </p>
          </div>

          {/* Server error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5"
                role="alert"
              >
                <XCircle size={16} className="flex-shrink-0" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-2.5"
          >
            {/* First Name + Last Name – side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-all bg-white outline-none
                    placeholder:text-gray-300
                    focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                    ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                    <XCircle size={11} /> {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-all bg-white outline-none
                    placeholder:text-gray-300
                    focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                    ${errors.lastName ? "border-red-400" : "border-gray-300"}`}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                    <XCircle size={11} /> {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all bg-white outline-none
                  placeholder:text-gray-300
                  focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                  ${errors.email ? "border-red-400" : "border-gray-300"}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <XCircle size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all bg-white outline-none
                  placeholder:text-gray-300
                  focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                  ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <XCircle size={11} /> {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                placeholder="Enter your address"
                {...register("address")}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all bg-white outline-none
                  placeholder:text-gray-300
                  focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                  ${errors.address ? "border-red-400" : "border-gray-300"}`}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && (
                <p id="address-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <XCircle size={11} /> {errors.address.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all bg-white outline-none
                    placeholder:text-gray-300
                    focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                    ${errors.password ? "border-red-400" : "border-gray-300"}`}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-strength password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Strength bar */}
              {passwordValue && (
                <div id="password-strength" className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= strength.score ? strength.color : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}

              {errors.password && (
                <p id="password-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <XCircle size={11} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("confirmPassword")}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all bg-white outline-none
                    placeholder:text-gray-300
                    focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10
                    ${errors.confirmPassword ? "border-red-400" : "border-gray-300"}`}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  tabIndex={0}
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-error" className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <XCircle size={11} /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Referral Code */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Referral Code{" "}
                <span className="text-gray-400 font-normal">(If any)</span>
              </label>
              <input
                id="referralCode"
                type="text"
                placeholder="Enter your code"
                {...register("referralCode")}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm transition-all bg-white outline-none
                  placeholder:text-gray-300
                  focus:border-[#0B4A8F] focus:ring-2 focus:ring-[#0B4A8F]/10"
              />
            </div>

            {/* Submit button */}
            <div className="pt-0.5">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                className="w-full flex items-center justify-center gap-2 bg-[#0B2D6E] hover:bg-[#091f50] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors duration-200 shadow-sm cursor-pointer"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </div>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("login")}
              className="text-[#0B2D6E] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2D6E] rounded"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
