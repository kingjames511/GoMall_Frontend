import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  ShieldAlert,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { useCurrentUserQuery } from "@/query/auth";
import { clearAuth } from "@/utils/storage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useCurrentUserQuery();

  const handleLogout = () => {
    clearAuth();
    // Drop any cached user/cart data so nothing leaks into the next session.
    queryClient.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim() || "GoMall User"
    : "";
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "";

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow bg-[#FAFAFA] py-8">
        <div className="container-main max-w-2xl">
          {/* Breadcrumbs */}
          <div className="py-2 text-caption text-text-secondary flex items-center gap-2 mb-6">
            <Link to="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-text-muted font-semibold">Profile</span>
          </div>

          {/* Go Back */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-body font-bold text-text-primary hover:text-navy transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-56 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          )}

          {/* Error / not-authenticated state */}
          {!isLoading && (isError || !user) && (
            <div className="bg-white border border-border-gray rounded-2xl p-8 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-7 h-7 text-navy" />
              </div>
              <h1 className="text-body-lg font-bold text-text-primary">
                We couldn't load your profile
              </h1>
              <p className="text-caption text-text-secondary mt-1">
                Please sign in again to view your account details.
              </p>
              <Link
                to="/login"
                className="inline-block mt-6 bg-navy hover:bg-navy-blue text-white px-6 py-2.5 rounded-full font-bold text-body transition-colors"
              >
                Go to login
              </Link>
            </div>
          )}

          {/* Profile content */}
          {!isLoading && user && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6"
            >
              {/* Identity card */}
              <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0B4A8F] text-white flex items-center justify-center text-h3 font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-h3 font-bold text-text-primary truncate">
                        {fullName}
                      </h1>
                      {user.is_verified ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#22A65A] bg-[#22A65A]/10 px-2 py-0.5 rounded-full shrink-0">
                          <BadgeCheck size={12} />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#DC3545] bg-[#DC3545]/10 px-2 py-0.5 rounded-full shrink-0">
                          <ShieldAlert size={12} />
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-text-secondary truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="bg-white border border-border-gray rounded-2xl p-6 shadow-sm">
                <h2 className="text-body-lg font-bold text-text-primary mb-5">
                  Account Details
                </h2>

                <div className="divide-y divide-border-gray">
                  <DetailRow icon={<Mail size={16} />} label="Email" value={user.email} />
                  <DetailRow icon={<Phone size={16} />} label="Phone" value={user.phone} />
                  <DetailRow icon={<MapPin size={16} />} label="Address" value={user.address} />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-[#DC3545]/40 text-[#DC3545] font-semibold py-3.5 rounded-lg text-body hover:bg-[#DC3545]/5 transition-colors cursor-pointer bg-white"
              >
                <LogOut size={18} />
                Log out
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div className="w-9 h-9 rounded-full bg-gray-bg flex items-center justify-center text-text-secondary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">
          {label}
        </p>
        <p className="text-body text-text-primary font-medium mt-0.5 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
