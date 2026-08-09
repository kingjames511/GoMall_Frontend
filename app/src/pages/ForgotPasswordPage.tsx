import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, XCircle, RefreshCw } from "lucide-react";
import { AxiosError } from "axios";
import { useForgotPasswordMutation, useResetPasswordMutation, useResendOtpMutation } from "@/query";

// ─── Constants 
const OTP_LEN = 6;
const COUNTDOWN_SEC = 60;

// ─── Schemas
const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[a-z]/, "Must include lowercase")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof newPasswordSchema>;
type Step = "email" | "otp" | "reset";

// ─── Props ───────────────────────────────────────────────────────────────────
interface ForgotPasswordPageProps {
  onNavigate?: (page: string) => void;
}

// ─── Shared Left Panel ─────────────────────────────────────────────────
function LeftPanel({ onHome }: { onHome?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden lg:flex w-full lg:w-[50%] relative rounded-[20px] overflow-hidden h-full flex-col justify-between p-10 lg:p-12 text-white shadow-md"
    >
      <img
        src="/assets/login-picture.png"
        alt="GoMall Shopping"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg,rgba(11,31,63,0.85) 0%,rgba(11,31,63,0.30) 45%,rgba(11,31,63,0.92) 100%)",
        }}
      />
      {/* Logo */}
      <div className="relative z-20">
        <button
          onClick={onHome}
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
      {/* Hero */}
      <div className="relative z-20 my-auto py-8">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-[1.15] tracking-tight max-w-[420px]">
          Everything You Need, One Marketplace
        </h1>
        <p className="text-sm text-white/90 mt-4 max-w-[380px] leading-relaxed">
          Shop from multiple stores, find the best deals, and get your orders
          delivered with ease.
        </p>
      </div>
      {/* Benefits card */}
      <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg">
        <span className="text-orange text-xs font-bold tracking-wider uppercase">
          GoMaLL Benefits
        </span>
        <h3 className="text-white text-base md:text-lg font-bold mt-1">
          Compare Prices Across Multiple Stores
        </h3>
        <p className="text-white/85 text-xs md:text-sm mt-1.5 leading-relaxed">
          Save more by finding the best deals from trusted merchants, all in one
          place.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Step 1 – Email ──────────────────────────────────────────────────────────
function StepEmail({
  onSent,
  onBack,
}: {
  onSent: (email: string) => void;
  onBack: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema), mode: "onTouched" });

  const { mutateAsync: forgotPassword, isPending: isSubmitting } = useForgotPasswordMutation();

  const onSubmit = async (data: EmailForm) => {
    setServerError(null);
    try {
      await forgotPassword({ email: data.email });
      onSent(data.email);
    } catch (err) {
      const errorMsg = err instanceof AxiosError
        ? err.response?.data?.detail?.message || err.message
        : "Failed to send code. Please try again.";
      setServerError(errorMsg);
    }
  };

  return (
    <motion.div
      key="email"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[420px]"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-[320px] mx-auto">
          Enter the email you used to create your account so we can send you a
          code
        </p>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4"
            role="alert"
          >
            <XCircle size={15} className="flex-shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="fp-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="fp-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-lg border text-sm bg-white outline-none transition-all
              placeholder:text-gray-300
              focus:border-navy focus:ring-2 focus:ring-navy/10
              ${errors.email ? "border-red-400" : "border-gray-300"}`}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <XCircle size={11} /> {errors.email.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
          className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-hover disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send Code"
          )}
        </motion.button>
      </form>

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition-colors focus:outline-none"
        >
          <ArrowLeft size={15} />
          Go Back
        </button>
      </div>
    </motion.div>
  );
}

// ─── Step 2 – OTP ────────────────────────────────────────────────────────────
function StepOTP({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: (otp: string) => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LEN).fill(null));

  const allFilled = digits.every((d) => d !== "");

  const { mutateAsync: resendOtp, isPending: isResending } = useResendOtpMutation();

  // countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // auto-focus first
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleChange = useCallback(
    (i: number, val: string) => {
      const num = val.replace(/\D/g, "");
      if (!num && val) return;
      setError(null);
      const next = [...digits];
      if (num.length > 1) {
        num.slice(0, OTP_LEN - i).split("").forEach((ch, j) => {
          if (i + j < OTP_LEN) next[i + j] = ch;
        });
        setDigits(next);
        refs.current[Math.min(i + num.length, OTP_LEN - 1)]?.focus();
        return;
      }
      next[i] = num;
      setDigits(next);
      if (num && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
    },
    [digits]
  );

  const handleKeyDown = useCallback(
    (i: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = [...digits];
        if (next[i]) { next[i] = ""; setDigits(next); }
        else if (i > 0) { next[i - 1] = ""; setDigits(next); refs.current[i - 1]?.focus(); }
      } else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus(); }
      else if (e.key === "ArrowRight" && i < OTP_LEN - 1) { e.preventDefault(); refs.current[i + 1]?.focus(); }
    },
    [digits]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;
      const next = [...digits];
      pasted.slice(0, OTP_LEN).split("").forEach((ch, i) => { next[i] = ch; });
      setDigits(next);
      refs.current[Math.min(pasted.length, OTP_LEN - 1)]?.focus();
      setError(null);
    },
    [digits]
  );

  const handleVerify = useCallback(() => {
    if (!allFilled) return;
    onVerified(digits.join(""));
  }, [allFilled, digits, onVerified]);

  const handleResend = useCallback(async () => {
    if (countdown > 0 || isResending) return;
    setError(null);
    setDigits(Array(OTP_LEN).fill(""));
    try {
      await resendOtp({ email });
      setCountdown(COUNTDOWN_SEC);
      refs.current[0]?.focus();
    } catch (err) {
      const errorMsg = err instanceof AxiosError
        ? err.response?.data?.detail?.message || err.message
        : "Failed to resend. Please try again.";
      setError(errorMsg);
    }
  }, [countdown, isResending, email, resendOtp]);

  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[420px] flex flex-col items-center"
    >
      <div className="text-center mb-8 w-full">
        <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
          Check your Email
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          We've sent a code to{" "}
          <span className="font-semibold text-gray-700 break-all">{email}</span>
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 w-full"
            role="alert"
          >
            <XCircle size={15} className="flex-shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP boxes */}
      <div
        className="flex items-center gap-4 mb-5"
        role="group"
        aria-label={`Enter ${OTP_LEN}-digit code`}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            id={`fp-otp-${i}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${OTP_LEN}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={isResending}
            className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none bg-white caret-transparent
              ${error
                ? "border-red-500 text-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                : digit
                  ? "border-navy text-navy"
                  : "border-gray-200 text-gray-900"
              }
              ${!error && "focus:border-navy focus:ring-2 focus:ring-navy/15"}
              disabled:opacity-50`}
          />
        ))}
      </div>

      {/* Resend */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus:outline-none rounded
            ${countdown === 0 && !isResending ? "text-navy hover:text-navy-hover cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
        >
          {isResending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          Resend confirmation code
        </button>
        {countdown > 0 && (
          <span className="text-sm text-gray-500" aria-live="polite">in {fmt(countdown)}</span>
        )}
      </div>

      {/* Continue */}
      <motion.button
        type="button"
        onClick={handleVerify}
        disabled={!allFilled || isResending}
        whileHover={allFilled && !isResending ? { scale: 1.01 } : {}}
        whileTap={allFilled && !isResending ? { scale: 0.99 } : {}}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-lg text-sm transition-all duration-200
          ${allFilled && !isResending ? "bg-navy hover:bg-navy-hover text-white cursor-pointer" : "bg-navy/40 text-white cursor-not-allowed"}`}
      >
        Continue
      </motion.button>

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition-colors focus:outline-none"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
      </div>
    </motion.div>
  );
}

// ─── Step 3 – New Password
function StepReset({
  email,
  otp,
  onDone,
  onBack,
}: {
  email: string;
  otp: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(newPasswordSchema), mode: "onTouched" });

  const { mutateAsync: resetPassword, isPending: isSubmitting } = useResetPasswordMutation();

  const onSubmit = async (data: PasswordForm) => {
    setServerError(null);
    try {
      await resetPassword({
        email,
        otp,
        new_password: data.password,
      });
      onDone();
    } catch (err) {
      const errorMsg = err instanceof AxiosError
        ? err.response?.data?.detail?.message || err.message
        : "Something went wrong. Please try again.";
      setServerError(errorMsg);
    }
  };

  return (
    <motion.div
      key="reset"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[420px]"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
          Create New Password
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Enter your details to create a new password
        </p>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4"
            role="alert"
          >
            <XCircle size={15} className="flex-shrink-0" /> {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="np-pwd" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="np-pwd"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password"
              {...register("password")}
              onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
              className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm bg-white outline-none transition-all
                placeholder:text-gray-300 focus:border-navy focus:ring-2 focus:ring-navy/10
                ${errors.password ? "border-red-400" : "border-gray-300"}`}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <XCircle size={11} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="np-cfm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="np-cfm"
              type={showCfm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password"
              {...register("confirm")}
              onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
              className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm bg-white outline-none transition-all
                placeholder:text-gray-300 focus:border-navy focus:ring-2 focus:ring-navy/10
                ${errors.confirm ? "border-red-400" : "border-gray-300"}`}
              aria-invalid={!!errors.confirm}
            />
            <button
              type="button"
              onClick={() => setShowCfm(!showCfm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              aria-label={showCfm ? "Hide confirm password" : "Show confirm password"}
            >
              {showCfm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.confirm && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <XCircle size={11} /> {errors.confirm.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
          className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-hover disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Create Password"}
        </motion.button>
      </form>

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition-colors focus:outline-none"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
const ForgotPasswordPage = ({ onNavigate }: ForgotPasswordPageProps) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const goBack = () => {
    if (step === "email") onNavigate?.("login");
    else if (step === "otp") setStep("email");
    else if (step === "reset") setStep("otp");
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden p-[2px] gap-0">
      {/* Left */}
      <LeftPanel onHome={() => onNavigate?.("home")} />

      {/* Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-[50%] flex flex-col items-center justify-center px-6 py-8 sm:px-10 lg:px-16 bg-white h-full"
      >
        <AnimatePresence mode="wait">
          {step === "email" && (
            <StepEmail
              key="email"
              onSent={(e) => { setEmail(e); setStep("otp"); }}
              onBack={goBack}
            />
          )}
          {step === "otp" && (
            <StepOTP
              key="otp"
              email={email}
              onVerified={(code) => { setOtp(code); setStep("reset"); }}
              onBack={goBack}
            />
          )}
          {step === "reset" && (
            <StepReset
              key="reset"
              email={email}
              otp={otp}
              onDone={() => onNavigate?.("login")}
              onBack={goBack}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
