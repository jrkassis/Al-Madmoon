import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import React from 'react';
import { useAuth } from "../../contexts/AuthContext";

interface SubscriptionInfo {
  plan: string;
  renewalDate: string;
  remainingPrompts: number;
  totalPrompts?: number;
  status: "active" | "cancelled" | "expired";
  nextBillingAmount?: number;
}

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Email form
  const [currentEmail, setCurrentEmail] = useState("user@example.com"); // mock
  const [newEmail, setNewEmail] = useState("");

  // Password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    // Mock data for preview
    const mockData: SubscriptionInfo = {
      plan: "Monthly",
      renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      remainingPrompts: 87,
      totalPrompts: 100,
      status: "active",
      nextBillingAmount: 20,
    };
    setSubscription(mockData);
    setLoading(false);
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    // Mock API call
    console.log("Change password:", { oldPassword, newPassword });
    alert("Password changed successfully (demo).");
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      alert("Please enter a new email.");
      return;
    }
    // Mock API call
    console.log("Change email:", { newEmail });
    setCurrentEmail(newEmail);
    alert("Email updated successfully (demo).");
    setShowEmailModal(false);
    setNewEmail("");
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      alert('Type "DELETE" to confirm.');
      return;
    }
    // Mock API call
    console.log("Delete account");
    alert("Account deleted (demo). Redirecting...");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No active subscription found.</p>
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
  const formattedRenewalDate = renewalDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysUntilRenewal = Math.ceil(
    (renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="pt-40 min-h-screen bg-white patternbg pb-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your subscription and view your usage</p>
        </motion.div>

        {/* Subscription card – same as before */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Subscription Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-slate-500">Current Plan</p>
                <p className="text-2xl font-bold text-slate-900">{subscription.plan}</p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : subscription.status === "cancelled"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-slate-500">Remaining Prompts</p>
                <p className="text-sm font-medium text-slate-700">
                  {subscription.remainingPrompts} / {subscription.totalPrompts ?? "∞"}
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-brand-600 h-2.5 rounded-full"
                  style={{
                    width: subscription.totalPrompts
                      ? `${(subscription.remainingPrompts / subscription.totalPrompts) * 100}%`
                      : "100%",
                  }}
                ></div>
              </div>
              {subscription.remainingPrompts === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  You have used all your prompts.{" "}
                  <a href="/pricing" className="underline">
                    Upgrade
                  </a>{" "}
                  to get more.
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Renewal Date</p>
                  <p className="text-base font-medium text-slate-900">{formattedRenewalDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Days Left</p>
                  <p className="text-base font-medium text-slate-900">
                    {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : "Expired"}
                  </p>
                </div>
                {subscription.nextBillingAmount && (
                  <div>
                    <p className="text-sm text-slate-500">Next Billing Amount</p>
                    <p className="text-base font-medium text-slate-900">
                      ${subscription.nextBillingAmount}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/pricing")}
                className="px-4 py-2 bg-brand-600 text-slate-700 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Manage Subscription
              </button>
              <button
                onClick={() => navigate("/faq")}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Help & Support
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-3">How it works</h3>
            <p className="text-sm text-slate-600">
              Each message you send to Al Madmoon consumes one prompt. You can upgrade your plan at any time.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-3">Need more prompts?</h3>
            <p className="text-sm text-slate-600">
              Upgrade to a higher tier or purchase additional prompts separately.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="mt-4 text-brand-600 text-sm font-medium hover:underline"
            >
              View plans →
            </button>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>
              <p className="text-sm text-slate-500">Manage your account preferences</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Change Password */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Change Password</p>
                  <p className="text-sm text-slate-500">Update your password to keep your account secure</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Update
                </button>
              </div>

              {/* Change Email with current email visible */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Email Address</p>
                  <p className="text-sm text-slate-500">Current email: {currentEmail}</p>
                </div>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Update
                </button>
              </div>

              {/* Notification Preferences */}


              {/* Delete Account */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <p className="font-medium text-slate-900">Delete Account</p>
                  <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 mb-16"
        >
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">Session</h3>
              <p className="text-sm text-slate-500">Sign out from this device.</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-slate-700 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-black rounded-lg hover:bg-brand-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Change Email Address</h2>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Email</label>
                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-black rounded-lg hover:bg-brand-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Delete Account</h2>
            <p className="text-slate-600 mb-4">Are you sure you want to delete your account? This action is permanent and cannot be undone.</p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-black rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}