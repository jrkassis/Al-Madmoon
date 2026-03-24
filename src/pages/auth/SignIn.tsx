import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { BadgeCheck, MessageCircle, Zap } from "lucide-react";

export default function SignIn() {
  const defaultCountryCode = "961";
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const { rememberMe, setRememberMe } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isEmail = (value: string) => value.includes("@");

  const normalizePhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith(defaultCountryCode)) return digits;

    const withoutLeadingZeros = digits.replace(/^0+/, "");
    return `${defaultCountryCode}${withoutLeadingZeros}`;
  };

  const resolveIdentifierToEmail = async (identifier: string) => {
    if (isEmail(identifier)) {
      return identifier.trim().toLowerCase();
    }

    const normalizedPhone = normalizePhoneNumber(identifier);
    if (!normalizedPhone) {
      throw new Error("Please enter a valid email or phone number.");
    }

    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (error) {
      throw new Error(
        error.message || "Could not find account by phone number.",
      );
    }

    if (!data?.email) {
      throw new Error("No login email is linked to this phone number.");
    }

    return data.email;
  };

  const getDashboardPathForRole = (role: string | null | undefined) => {
    if (role === "admin") return "/admin";
    if (role === "client") return "/dashboard";
    if (role === "affiliate") return "/affiliate";
  };

  const isFormValid =
    formData.identifier.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const email = await resolveIdentifierToEmail(formData.identifier.trim());
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message || "Invalid credentials.");
      }

      setSuccessMessage("Signed in successfully.");
      const { data: roleRow } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .maybeSingle();
      navigate(getDashboardPathForRole(roleRow?.role));
    } catch (signinError) {
      const message =
        signinError instanceof Error
          ? signinError.message
          : "Could not sign in. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute top-0  overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 mt-10 lg:mt-0">
        <div className="w-full max-w-md ">
          {/* White Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
            {/* Brand Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8"></div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Sign In
              </h1>
              <p className="text-slate-600 text-base">
                Access your AI betting assistant and unlock winning insights
              </p>
            </div>

            {/* Sign In Form */}
            <form className="space-y-5 mb-8" onSubmit={handleSubmit}>
              {/* Email / Phone Field */}
              <div className="relative">
                <label
                  htmlFor="identifier"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                  />
                  {/* Email Icon SVG */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3.98 8.223A10.477 10.477 0 001.934 12c2.71 5.555 8.063 9 13.066 9 .75 0 1.49-.035 2.221-.1a4.5 4.5 0 00-7.707-7.707l-.5.5zm15.848-1.299a4.5 4.5 0 00-7.707 7.707l.5-.5A10.477 10.477 0 0122.066 12c-2.71-5.555-8.063-9-13.066-9-.75 0-1.49.035-2.221.1a4.5 4.5 0 007.707 7.707l.5-.5zM6.5 12a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 bg-white cursor-pointer accent-sky-500"
                  />
                  <span className="text-slate-600 group-hover:text-slate-700 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              {errorMessage && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  {successMessage}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isFormValid || isSubmitting}
                className="btn-icon btn-shadow w-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ display: "inline-flex" }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pb-6 border-b border-slate-200">
              <p className="text-slate-600">
                New to Al Madmoon?{" "}
                <Link
                  to="/auth/signup"
                  className="text-sky-500 font-semibold hover:text-sky-600 link transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <Link
                to="/privacy"
                className="hover:text-slate-700 transition-colors"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                to="/terms"
                className="hover:text-slate-700 transition-colors"
              >
                Terms
              </Link>
              <span>•</span>
              <Link
                to="/support"
                className="hover:text-slate-700 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Main Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl bg-white"></div>
              <div className="relative w-24 h-24 backdrop-blur-xl rounded-3xl flex items-center justify-center border-2 border-sky-200 shadow-xl">
                <img
                  src="/Icon-2.svg"
                  alt="Al Madmoon"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            AI-Powered Betting Intelligence
          </h2>
          <p className="text-slate-600 text-lg mb-10">
            Get real-time analysis, data-driven predictions, and personalized
            insights delivered to WhatsApp 24/7.
          </p>

          {/* Features Grid */}
          <div className="space-y-4 mt-10">
            {/* Feature 1 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <Zap className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Instant Analysis
                </h3>
                <p className="text-sm text-slate-600">
                  Real-time match insights in seconds
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <BadgeCheck className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Verified Data
                </h3>
                <p className="text-sm text-slate-600">
                  Backed by advanced algorithms
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  WhatsApp Direct
                </h3>
                <p className="text-sm text-slate-600">
                  Recommendations on your phone
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t-2 border-sky-200">
            <p className="text-sm text-slate-600 mb-4">
              Join thousands of successful bettors
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-sky-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden p-6 bg-gradient-to-r from-sky-300 to-blue-500 text-white text-center relative z-10 rounded-t-3xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="/Icon-2.svg"
            alt="Al Madmoon"
            className="w-6 h-6 object-contain"
          />
          <span className="font-bold text-lg">Al Madmoon AI</span>
        </div>
        <p className="text-sm text-sky-50">
          Your personal AI betting analyst on WhatsApp
        </p>
      </div>
    </div>
  );
}
