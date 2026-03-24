import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Links from "./pages/Links";
import ErrorPage from "./pages/ErrorPage";

// Auth pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Onboarding from "./pages/Onboarding";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboard pages
import AdminAnalytics from "./pages/admin/Analytics";
import AdminClients from "./pages/admin/Clients";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminSettings from "./pages/admin/Settings";
import AffiliateMyCode from "./pages/affiliate/MyCode";
import AffiliateReferrals from "./pages/affiliate/Referrals";
import AffiliateWithdraw from "./pages/affiliate/Withdraw";
import AffiliateSettings from "./pages/affiliate/Settings";
import Logout from "../src/pages/auth/Logout";
import BecomeAffiliate from "../src/pages/onboarding-affiliate/BecomeAffiliate";

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
          <Route path="become-an-affiliate" element={<BecomeAffiliate />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/auth/signin" element={<SignIn />} />
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
            path="/admin/affiliates"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAffiliates />
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
            path="/affiliate"
            element={
              <ProtectedRoute allowedRoles={["affiliate", "client"]}>
                <AffiliateMyCode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliate/referrals"
            element={
              <ProtectedRoute allowedRoles={["affiliate", "client"]}>
                <AffiliateReferrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliate/withdraw"
            element={
              <ProtectedRoute allowedRoles={["affiliate", "client"]}>
                <AffiliateWithdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliate/settings"
            element={
              <ProtectedRoute allowedRoles={["affiliate", "client"]}>
                <AffiliateSettings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth routes - no layout */}
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Dashboard routes - they have their own layout (DashboardLayout) */}

        <Route
          path="/affiliate"
          element={
            <ProtectedRoute allowedRoles={["affiliate", "client"]}>
              <AffiliateMyCode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affiliate/referrals"
          element={
            <ProtectedRoute allowedRoles={["affiliate", "client"]}>
              <AffiliateReferrals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affiliate/withdraw"
          element={
            <ProtectedRoute allowedRoles={["affiliate", "client"]}>
              <AffiliateWithdraw />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affiliate/settings"
          element={
            <ProtectedRoute allowedRoles={["affiliate", "client"]}>
              <AffiliateSettings />
            </ProtectedRoute>
          }
        />

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
