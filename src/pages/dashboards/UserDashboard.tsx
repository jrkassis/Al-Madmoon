import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  plan: string;
  role: string;
  created_at: string;
  total_messages?: number;
}

interface SubscriptionInfo {
  plan: string;
  renewalDate: string;
  remainingPrompts: number;
  totalPrompts?: number;
  status: "active" | "cancelled" | "expired";
  monthlyUsed: number;
  planLabel: string;
}

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError("You must be signed in to view the dashboard.");
        setLoading(false);
        return;
      }

      try {
        setError(null);

        // Fetch user profile from public.users
        // First try with maybeSingle() to handle potential duplicates
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("id, full_name, email, phone, plan, role, created_at, total_messages")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          // If we get a coercion error, it means there are duplicates
          if (profileError.message.includes("coerce")) {
            throw new Error("Duplicate user records found in database. Contact support or check CHECK_DUPLICATES.md guide.");
          }
          throw new Error(`Failed to load profile: ${profileError.message}`);
        }

        if (!profileData) {
          throw new Error("User profile not found. Please ensure your account is set up in the users table.");
        }

        setProfile(profileData);

        // Normalize plan
        const normalizePlan = (plan: string | null): "free" | "pro" | "ultimate" => {
          if (!plan || plan === "free") return "free";
          if (plan === "t1" || plan === "pro") return "pro";
          if (plan === "t2" || plan === "ultimate") return "ultimate";
          return "free";
        };

        const planKey = normalizePlan(profileData.plan ?? "free");
        const planLabel =
          planKey === "free" ? "Free" : planKey === "pro" ? "Pro" : "Ultimate";

        // Plan quotas
        // Message quotas per month by plan
        const planQuota: Record<"free" | "pro" | "ultimate", number> = {
          free: 3,
          pro: 300,
          ultimate: 600,
        };

        // Usage is driven by users.total_messages
        const monthlyUsed = profileData.total_messages ?? 0;
        const now = new Date();
        let effectivePlanKey = planKey;
        let renewalDate: Date;
        let billingCycle: "monthly" | "annual" = "monthly";

        if (planKey !== "free") {
          try {
            const { data: latestPayment, error: paymentError } = await supabase
              .from("payments")
              .select("billing, created_at")
              .eq("user_id", user.id)
              .eq("status", "success")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (paymentError) {
              throw paymentError;
            }

            const billingValue = String(latestPayment?.billing ?? "monthly").toLowerCase();
            billingCycle =
              billingValue === "annual" || billingValue === "yearly"
                ? "annual"
                : "monthly";

            const startDate = latestPayment?.created_at
              ? new Date(latestPayment.created_at)
              : new Date(profileData.created_at);

            renewalDate = new Date(startDate);
            if (billingCycle === "annual") {
              renewalDate.setUTCFullYear(renewalDate.getUTCFullYear() + 1);
            } else {
              renewalDate.setUTCMonth(renewalDate.getUTCMonth() + 1);
            }
          } catch (paymentLookupError) {
            console.warn("Failed to read payment billing cycle, falling back to monthly:", paymentLookupError);
            renewalDate = new Date(profileData.created_at);
            renewalDate.setUTCMonth(renewalDate.getUTCMonth() + 1);
          }

          // Keep existing behavior: once subscription period ends, downgrade to free.
          if (now >= renewalDate) {
            try {
              const { error: downgradeError } = await supabase
                .from("users")
                .update({ plan: "free" })
                .eq("id", user.id);
              if (downgradeError) throw downgradeError;
              effectivePlanKey = "free";
              setProfile({ ...profileData, plan: "free" });
            } catch (downgradeErr) {
              console.warn("Failed to auto-downgrade expired plan:", downgradeErr);
            }
          }
        } else {
          renewalDate = new Date(profileData.created_at);
          renewalDate.setUTCMonth(renewalDate.getUTCMonth() + 1);
        }

        const effectivePlanLabel =
          effectivePlanKey === "free"
            ? "Free"
            : effectivePlanKey === "pro"
              ? "Pro"
              : "Ultimate";
        const totalPrompts = planQuota[effectivePlanKey];
        const remainingPrompts = Math.max(0, totalPrompts - monthlyUsed);

        const sub: SubscriptionInfo = {
          plan: effectivePlanLabel,
          planLabel: effectivePlanLabel,
          renewalDate: renewalDate.toISOString(),
          remainingPrompts,
          totalPrompts,
          status: "active",
          monthlyUsed,
        };

        setSubscription(sub);
      } catch (e: any) {
        console.error("Dashboard fetch error:", e);
        setError(e?.message ?? "Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const externalId = params.get("externalId");
    const paymentFromQuery = params.get("payment");
    const paymentFromStorage = window.localStorage.getItem("payment_success") === "1";
    const shouldShow = paymentFromQuery === "success" || paymentFromStorage;

    if (!shouldShow) return;

    setShowPaymentSuccess(true);
    window.localStorage.removeItem("payment_success");

    if (paymentFromQuery === "success") {
      params.delete("payment");
      params.delete("externalId");
      const nextQuery = params.toString();
      const cleanUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", cleanUrl);
    }

    const timeoutId = window.setTimeout(() => setShowPaymentSuccess(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paymentFromQuery = params.get("payment");
    const externalId = params.get("externalId");
    if (paymentFromQuery !== "success" || !externalId) return;

    let cancelled = false;
    const syncStatus = async () => {
      // Force local callback fallback first (useful when external callbacks to localhost are not reachable).
      try {
        await fetch(`/api/whish-callback?status=success&externalId=${encodeURIComponent(externalId)}`);
      } catch {
        // Non-blocking; continue polling fallback.
      }

      for (let i = 0; i < 5; i++) {
        try {
          const res = await fetch("/api/whish-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ externalId }),
          });
          const data = await res.json();
          const status = String(data?.collectStatus ?? "").toLowerCase();
          if (status === "success" || status === "failed") {
            if (!cancelled) {
              window.location.reload();
            }
            return;
          }
        } catch {
          // keep retrying briefly
        }
        await new Promise((r) => setTimeout(r, 1800));
      }
    };
    void syncStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deleteConfirmation !== "DELETE") {
      alert('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeleting(true);

    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      // Delete from public.users table
      console.log("🗑️ Deleting account...");
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        throw new Error(`Failed to delete profile: ${deleteError.message}`);
      }

      console.log("✅ Profile deleted successfully");

      // Sign out and redirect
      await signOut();
      navigate("/auth/signin");
    } catch (err: any) {
      console.error("Delete account error:", err);
      alert(err?.message ?? "Failed to delete account. Please contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/signin");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M5.707 4.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zm0 0a1 1 0 010-1.414L8.586 2a1 1 0 011.414 0l10 10a1 1 0 010 1.414l-10 10a1 1 0 01-1.414-1.414L14.586 12 5.707 3.121z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <p className="text-slate-600 mb-4">No subscription data found.</p>
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  const renewalDate = new Date(subscription.renewalDate);
  const formattedRenewalDate = renewalDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysUntilRenewal = Math.ceil(
    (renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Calculate usage percentage
  const usagePercentage =
    subscription.totalPrompts !== undefined
      ? (subscription.monthlyUsed / subscription.totalPrompts) * 100
      : 0;
  const isFreePlan = subscription.planLabel.toLowerCase() === "free";

  return (
    <div className="min-h-screen patternbg bg-linear-to-br from-slate-50 to-slate-100 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {showPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                Payment successful. Welcome aboard and enjoy your new plan!
              </p>
              <button
                type="button"
                onClick={() => setShowPaymentSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Dashboard</h1>
          <p className="text-lg text-slate-600">
            Welcome back, {profile.full_name || "User"}
          </p>
        </motion.div>

        {/* Main Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8"
        >
          <div className="bg-linear-to-r from-brand-50 to-slate-50 px-6 sm:px-8 py-6 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Current Plan
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                  {subscription.plan}
                </h2>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${subscription.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                  }`}
              >
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)} 
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Usage Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Monthly Usage</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {subscription.monthlyUsed}
                  </p>
                  {subscription.totalPrompts !== undefined && (
                    <p className="text-sm text-slate-600">
                      of {subscription.totalPrompts} available
                    </p>
                  )}
                  {subscription.totalPrompts === undefined && (
                    <p className="text-sm text-slate-600">of ∞ available</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex h-3 bg-slate-200 rounded-full overflow-hidden">
                  {subscription.totalPrompts !== undefined ? (
                    <div
                      className="bg-linear-to-r from-red-300 to-red-600 rounded-full transition-all duration-600"
                      style={{
                        width: `${Math.min(100, usagePercentage)}%`,
                      }}
                    ></div>
                  ) : (
                    <div className="w-0"></div>
                  )}
                </div>
                {subscription.totalPrompts !== undefined && (
                  <p className="text-xs text-slate-500 mt-2">
                    {usagePercentage.toFixed(1)}% of monthly quota used
                  </p>
                )}
              </div>

              {/* Warning Messages */}
              {subscription.totalPrompts !== undefined &&
                subscription.remainingPrompts === 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      ⚠️ You've reached your monthly limit
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Your usage will reset on{" "}
                      <strong>
                        {new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </strong>
                    </p>
                  </div>
                )}

              {subscription.totalPrompts !== undefined &&
                subscription.remainingPrompts > 0 &&
                subscription.remainingPrompts <= 50 && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700 font-medium">
                      💡 Running low on prompts
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      You have {subscription.remainingPrompts} prompts remaining.{" "}
                      <button
                        onClick={() => navigate("/pricing")}
                        className="font-semibold underline hover:no-underline"
                      >
                        Upgrade now
                      </button>
                    </p>
                  </div>
                )}
            </div>

            {/* Renewal Info (hidden for free plan) */}
            {!isFreePlan && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Renewal Date</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {formattedRenewalDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Days Remaining</p>
                  <p
                    className={`text-lg font-semibold mt-1 ${daysUntilRenewal > 0
                        ? "text-slate-900"
                        : "text-red-600"
                      }`}
                  >
                    {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : "Expired"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              {!isFreePlan && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="px-5 py-2.5 bg-brand-600 text-black rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
                >
                  Manage Subscription
                </button>
              )}
              {isFreePlan && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="px-5 py-2.5 border border-brand-300 text-brand-700 rounded-lg hover:bg-brand-50 transition-colors font-medium text-sm"
                >
                  Upgrade
                </button>
              )}
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">How It Works</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Each message you send consumes one prompt from your monthly quota.
                  Usage resets on the 1st of each month.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Need More?</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Upgrade to Pro or Ultimate for higher monthly limits and exclusive features.
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="mt-3 text-brand-600 text-sm font-semibold hover:text-brand-700"
                >
                  View all plans →
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6 mb-8"
        >
          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
              <p className="text-sm text-slate-600 mt-1">Your profile details</p>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Full Name</p>
                  <p className="text-base font-medium text-slate-900 mt-1">
                    <strong>{profile.full_name || "Not set"}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-base font-medium text-slate-900 mt-1 break-all">
                    <strong>{profile.email || "Not set"}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="text-base font-medium text-slate-900 mt-1">
                    <strong>{profile.phone || "Not set"}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Account Role</p>
                  <p className="text-base font-medium text-slate-900 mt-1 capitalize">
                    <strong>{profile.role || "User"}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>
              <p className="text-sm text-slate-600 mt-1">Manage your account</p>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              {/* Delete Account */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-slate-200 last:border-b-0">
                <div>
                  <p className="font-semibold text-slate-900">Delete Account</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium whitespace-nowrap"
                >
                  Delete Account
                </button>
              </div>

              {/* Sign Out */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">Sign Out</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Sign out from this device
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-slate-900 text-black rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
              Delete Account
            </h2>
            <p className="text-slate-600 text-center mb-6">
              This action is <strong>permanent</strong> and cannot be undone. All your data
              will be deleted.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type <span className="font-mono font-bold text-red-600">DELETE</span> to
                  confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                  placeholder="DELETE"
                  disabled={isDeleting}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isDeleting || deleteConfirmation !== "DELETE"
                  }
                  className="flex-1 px-4 py-2.5 bg-red-600 text-black rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}