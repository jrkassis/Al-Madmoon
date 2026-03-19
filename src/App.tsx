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
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Auth routes - no layout */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Dashboard routes - they have their own layout (DashboardLayout) */}
        <Route path="/admin" element={<AdminAnalytics />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/affiliates" element={<AdminAffiliates />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        <Route path="/affiliate" element={<AffiliateMyCode />} />
        <Route path="/affiliate/referrals" element={<AffiliateReferrals />} />
        <Route path="/affiliate/withdraw" element={<AffiliateWithdraw />} />
        <Route path="/affiliate/settings" element={<AffiliateSettings />} />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}
