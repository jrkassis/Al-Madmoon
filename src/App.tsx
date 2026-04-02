import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Links from "./pages/Links";
import ErrorPage from "./pages/ErrorPage";
import AdminMessages from "./pages/admin/AdminMessages";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { SupportPage } from "./pages/SupportPage";
// Auth pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Paywall from "./pages/paywall/paywall";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboard pages
import AdminAnalytics from "./pages/admin/Analytics";
import AdminClients from "./pages/admin/Clients";
import AdminPartners from "./pages/admin/Partners";
import AdminSettings from "./pages/admin/Settings";
import PartnerReferrals from "./pages/partner/Referrals";
import PartnerWithdraw from "./pages/partner/Withdraw";
import PartnerSettings from "./pages/partner/Settings";
import UserDashboard from "./pages/dashboards/UserDashboard";
import Logout from "../src/pages/auth/Logout";
import BecomePartner from "./pages/onboarding-partners/BecomePartner";
import PartnerOnboarding from "./pages/onboarding-partners/PartnerOnboarding";
import PartnerSuccess from "./pages/onboarding-partners/PartnerSuccess";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with navbar/footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="links" element={<Links />} />
          <Route path="become-a-partner" element={<BecomePartner />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/auth/signin" element={<SignIn />} />
          {/* Partner onboarding - apply form */}
        <Route path="/become-a-partner/apply" element={<PartnerOnboarding />} />
        <Route path="/become-a-partner/success" element={<PartnerSuccess />} />

          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={["partner"]}>
                <PartnerReferrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/referrals"
            element={
              <ProtectedRoute allowedRoles={["partner"]}>
                <PartnerReferrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/withdraw"
            element={
              <ProtectedRoute allowedRoles={["partner"]}>
                <PartnerWithdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/settings"
            element={
              <ProtectedRoute allowedRoles={["partner"]}>
                <PartnerSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminClients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth routes - no layout */}
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/paywall" element={<Paywall />} />

        {/* Dashboard routes - they have their own layout (DashboardLayout) */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />

        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}