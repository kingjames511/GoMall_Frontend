import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, CheckCircle2, RefreshCw } from "lucide-react";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/query";
// ─── Constants ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60; // seconds

// ─── Props ──────────────────────────────────────────────────────────────────
interface OTPPageProps {
  email?: string;
  onNavigate?: (page: string) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
const OTPPage = ({ email = "example@email.com", onNavigate }: OTPPageProps) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(OTP_LENGTH).fill(null)
  );

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // ── Auto-dismiss banner 
  useEffect(() => {
    const id = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(id);
  }, []);

  // ── Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const allFilled = digits.every((d) => d !== "");
  const otpValue = digits.join("");

  // ── Handle single digit change
  const handleChange = useCallback(
    (index: number, value: string) => {
      const numeric = value.replace(/\D/g, "");
      if (!numeric && value !== "") return; // reject non-numeric

      setError(null);
      const newDigits = [...digits];

      if (numeric.length > 1) {
        // Handle paste via input event (fallback)
        const chars = numeric.slice(0, OTP_LENGTH - index).split("");
        chars.forEach((ch, i) => {
          if (index + i < OTP_LENGTH) newDigits[index + i] = ch;
        });
        setDigits(newDigits);
        const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
        inputRefs.current[nextFocus]?.focus();
        return;
      }

      newDigits[index] = numeric;
      setDigits(newDigits);

      if (numeric && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  // ── Keyboard navigation
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newDigits = [...digits];
        if (newDigits[index]) {
          newDigits[index] = "";
          setDigits(newDigits);
        } else if (index > 0) {
          newDigits[index - 1] = "";
          setDigits(newDigits);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === "Enter" && allFilled) {
        handleVerify();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [digits, allFilled]
  );

  // ── Paste handler 
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;
      const newDigits = [...digits];
      pasted.slice(0, OTP_LENGTH).split("").forEach((ch, i) => {
        newDigits[i] = ch;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      setError(null);
    },
    [digits]
  );


  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtpMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => onNavigate?.("home"), 2000);
    },
    onError: (error) => {
      const code = error.response?.data?.detail?.code;
      const message = error.response?.data?.detail?.message ?? "Invalid code. Please check and try again.";

      if (code === "OTP_MAX_ATTEMPTS") {
        setError(message); // e.g. "Too many attempts. Try again in 10 minutes."
      } else {
        // covers OTP_EXPIRED, OTP_INVALID, REGISTRATION_EXPIRED, etc.
        setError(message);
      }

      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    },
  });

  // ── Verify

  const handleVerify = useCallback(() => {
    if (!allFilled || isVerifying) return;
    setError(null);
    verifyOtp({ email, otp: otpValue });
  }, [allFilled, isVerifying, otpValue, email, verifyOtp]);

  const { mutate: resendOtp, isPending: isResending } = useResendOtpMutation({
    onSuccess: () => {
      setCountdown(RESEND_COUNTDOWN);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      const message = error.response?.data?.detail?.message ?? "Failed to resend code. Please try again.";
      setError(message);
    }
  });

  // ── Resend
  const handleResend = useCallback(() => {
    if (countdown > 0 || isResending) return;
    setError(null);
    setDigits(Array(OTP_LENGTH).fill(""));
    resendOtp({ email });
  }, [countdown, isResending, email, resendOtp]);

  return (
    <div className="h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden p-[2px] gap-0">
      {/* ── Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex w-full lg:w-[50%] relative rounded-[20px] overflow-hidden h-full flex-col justify-between p-10 lg:p-12 text-white shadow-md"
      >
        <img
          src="/assets/signup.png"
          alt="GoMall Shopping Experience"
          className="absolute inset-0 z-0 object-cover object-center w-full h-full"
        />
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
            className="cursor-pointer focus:outline-none"
            aria-label="Go to home"
          >
            <img
              src="/assets/logo.png"
              alt="GoMall Logo"
              className="object-contain w-auto h-10 md:h-12 brightness-0 invert"
            />
          </button>
        </div>

        {/* Hero copy */}
        <div className="relative z-20 py-8 my-auto">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-[1.15] tracking-tight max-w-[460px]">
            Shop Smarter with GoMalL
          </h1>
          <p className="text-sm text-white/90 mt-4 max-w-[380px] leading-relaxed">
            Discover thousands of products, compare prices, and enjoy seamless
            delivery from trusted stores.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative z-20 p-5 border shadow-lg bg-white/10 backdrop-blur-md rounded-2xl border-white/15">
          <p className="text-sm leading-relaxed text-white/90">
            GoMall makes shopping so convenient. I can compare prices across
            different stores and always find the best deals.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full w-9 h-9 bg-white/30">
              <img
                src="/assets/promo-shopper.jpg"
                alt="Amaka C."
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                Amaka C.
              </p>
              <p className="text-xs text-white/70">Buyer, Lagos</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel*/}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-[50%] relative flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 bg-white h-full"
      >
        {/* ── Toast banner — fixed top-right so it never displaces the form ── */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="polite"
              className="fixed top-5 right-5 z-50 w-[320px] flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3.5"
            >
              {/* Green dot */}
              <div className="flex-shrink-0 mt-0.5">
                <span className="flex items-center justify-center w-4 h-4 bg-green-100 rounded-full">
                  <span className="block w-2 h-2 bg-green-500 rounded-full" />
                </span>
              </div>
              {/* Left accent bar */}
              <div className="absolute left-0 w-1 bg-green-500 rounded-full top-3 bottom-3" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Confirmation code sent!
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Check your email for the confirmation code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── OTP Form  */}
        <div className="max-w-[480px] w-full mx-auto flex flex-col items-center">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
              Enter OTP
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-[320px] mx-auto">
              A confirmation code has been sent to your email address{" "}
              <span className="font-semibold text-gray-700 break-all">
                {email}
              </span>
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center w-full gap-2 px-4 py-3 mb-5 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50"
                role="alert"
                aria-live="assertive"
              >
                <X size={15} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP inputs */}
          <div
            className="flex items-center gap-3 mb-6 sm:gap-4"
            role="group"
            aria-label="Enter 6-digit OTP"
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                disabled={isVerifying}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2
                  transition-all duration-150 outline-none bg-white
                  caret-transparent select-all
                  ${error
                    ? "border-red-500 text-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                    : digit
                      ? "border-navy text-navy"
                      : "border-gray-200 text-gray-900"
                  }
                  ${!error && "focus:border-navy focus:ring-2 focus:ring-navy/15"}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="flex items-center gap-2 mb-8">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded
                ${countdown === 0 && !isResending
                  ? "text-navy hover:text-navy-hover cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
                }`}
              aria-disabled={countdown > 0 || isResending}
              aria-label={
                countdown > 0
                  ? `Resend available in ${formatTime(countdown)}`
                  : "Resend confirmation code"
              }
            >
              {isResending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Resend confirmation code
            </button>
            {countdown > 0 && (
              <span className="text-sm text-gray-500" aria-live="polite">
                in {formatTime(countdown)}
              </span>
            )}
          </div>

          {/* Verify button */}
          <motion.button
            type="button"
            onClick={handleVerify}
            disabled={!allFilled || isVerifying}
            whileHover={allFilled && !isVerifying ? { scale: 1.01 } : {}}
            whileTap={allFilled && !isVerifying ? { scale: 0.99 } : {}}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-lg text-sm transition-all duration-200 shadow-sm
              ${allFilled && !isVerifying
                ? "bg-navy hover:bg-navy-hover text-white cursor-pointer"
                : "bg-navy/40 text-white cursor-not-allowed"
              }`}
            aria-busy={isVerifying}
            aria-disabled={!allFilled || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle2 size={48} className="text-green" />
            </motion.div>
            <p className="text-xl font-bold text-gray-800">
              Account Verified!
            </p>
            <p className="text-sm text-gray-500">Redirecting you home…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OTPPage;
