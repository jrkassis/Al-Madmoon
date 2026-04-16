import { Button } from "../../components/ui/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { CreditCard, Shield, Zap } from "lucide-react"; // added

export default function SignUp() {
  const defaultCountryCode = "961";
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const focusFieldWithError = (field: "email" | "phone", message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
    if (field === "email") {
      emailInputRef.current?.focus();
      return;
    }
    phoneInputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "phone") {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (name === 'referralCode') {
      const sanitizedReferralCode = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: sanitizedReferralCode }));
      return;
    }
    if (name === "phone") {
      const sanitizedPhone = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: sanitizedPhone }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhoneNumber = (
    selectedCountryCode: string,
    localPhone: string,
  ) => {
    const digitsOnlyCountryCode = selectedCountryCode.replace(/\D/g, "");
    let digitsOnlyPhone = localPhone.replace(/\D/g, "").replace(/^0+/, "");

    if (!digitsOnlyCountryCode || !digitsOnlyPhone) {
      return "";
    }

    // Prevent storing duplicated country code when users type it in the local number input.
    if (digitsOnlyPhone.startsWith(digitsOnlyCountryCode)) {
      digitsOnlyPhone = digitsOnlyPhone.slice(digitsOnlyCountryCode.length);
    }

    if (!digitsOnlyPhone) {
      return "";
    }

    return `${digitsOnlyCountryCode}${digitsOnlyPhone}`;
  };

  const normalizedPhone = normalizePhoneNumber(countryCode, formData.phone);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (!refFromUrl) return;

    const sanitizedReferralCode = refFromUrl
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 6);

    if (!sanitizedReferralCode) return;

    setFormData((prev) =>
      prev.referralCode === sanitizedReferralCode
        ? prev
        : { ...prev, referralCode: sanitizedReferralCode },
    );
  }, [searchParams]);

  const isReferralCodeValid =
    formData.referralCode.trim() === '' || /^[A-Z]{4,6}$/.test(formData.referralCode.trim());
  const isPasswordMismatch =
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password !== formData.confirmPassword;

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    normalizedPhone !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password === formData.confirmPassword &&
    isReferralCodeValid &&
    acceptedTerms;

  const getDashboardPathForRole = (role: string | null | undefined) => {
    if (role === "admin") return "/admin";
    return "/partner";
  };

  const applyDuplicateFieldError = (message: string) => {
    const lowered = message.toLowerCase();
    if (lowered.includes("email") && (lowered.includes("already") || lowered.includes("exists"))) {
      focusFieldWithError("email", "This email is already in use.");
      return true;
    }
    if (lowered.includes("phone") && (lowered.includes("already") || lowered.includes("exists"))) {
      focusFieldWithError("phone", "This phone number is already in use.");
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors({});
    setIsSubmitting(true);
    const phoneToSave = normalizePhoneNumber(countryCode, formData.phone);
    const referralCodeToSave = isReferralCodeValid
      ? formData.referralCode.trim() || null
      : null;

    if (!phoneToSave) {
      setErrorMessage("Please enter a valid phone number.");
      setIsSubmitting(false);
      return;
    }

    if (!isReferralCodeValid) {
      setErrorMessage('Referral code must be 4 to 6 uppercase letters (A-Z), or left empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const trimmedEmail = formData.email.trim();

      const { data: existingEmail, error: existingEmailError } = await supabase
        .from("users")
        .select("id")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (existingEmailError) {
        setErrorMessage(existingEmailError.message || "Could not validate email.");
        setIsSubmitting(false);
        return;
      }

      if (existingEmail?.id) {
        setErrorMessage("This email is already in use.");
        focusFieldWithError("email", "This email is already in use.");
        setIsSubmitting(false);
        return;
      }

      const { data: existingPhone, error: existingPhoneError } = await supabase
        .from("users")
        .select("id, email")
        .eq("phone", phoneToSave)
        .maybeSingle();

      if (existingPhoneError) {
        setErrorMessage(existingPhoneError.message || "Could not validate phone number.");
        setIsSubmitting(false);
        return;
      }

      if (existingPhone?.id && existingPhone.email) {
        setErrorMessage("This phone number is already in use.");
        focusFieldWithError("phone", "This phone number is already in use.");
        setIsSubmitting(false);
        return;
      }

      const signupPayload = {
        email: trimmedEmail,
        password: formData.password,
        full_name: formData.name.trim(),
        phone: phoneToSave,
        ref_code: referralCodeToSave,
      };

      let signupOk = false;
      let signupErrorMessage = "";
      let shouldFallbackToEdge = false;

      // Prefer local/serverless API route. In local dev this can be unavailable
      // if the separate dev API server is not running, so we fallback to the
      // Supabase edge function.
      try {
        const response = await fetch("/api/signup-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupPayload),
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok && data?.ok) {
          signupOk = true;
        } else if (response.status >= 500) {
          // Local API route is unavailable/broken in this environment.
          // Try Supabase edge function before failing the signup.
          shouldFallbackToEdge = true;
        } else {
          signupErrorMessage = String(data?.error || "Could not create account. Please try again.");
        }
      } catch {
        // Fallback to edge function below.
        shouldFallbackToEdge = true;
      }

      if (!signupOk && shouldFallbackToEdge) {
        const { data: fnData, error: fnError } = await supabase.functions.invoke("signup-user", {
          body: signupPayload,
        });
        if (!fnError && fnData?.ok) {
          signupOk = true;
        } else {
          signupErrorMessage = String(
            fnError?.message || fnData?.error || "Could not create account. Please try again."
          );
        }
      }

      setIsSubmitting(false);
      if (!signupOk) {
        const message = signupErrorMessage || "Could not create account. Please try again.";
        applyDuplicateFieldError(message);
        setErrorMessage(message);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (signInError) {
        setErrorMessage(
          signInError.message ||
          "Account created, but automatic sign-in failed. Please sign in manually.",
        );
        return;
      }

      // Referral attribution is handled on the server-side signup path.

      setSuccessMessage("Account created successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        referralCode: "",
        password: "",
        confirmPassword: "",
      });
      setAcceptedTerms(false);
      navigate("/pricing");
    } catch (invokeError: unknown) {
      setIsSubmitting(false);
      let parsedMessage = "Failed to send signup request.";

      if (invokeError instanceof Error) {
        parsedMessage = invokeError.message || parsedMessage;
      }

      // FunctionsHttpError keeps the actual response body in "context".
      const errorWithContext = invokeError as {
        context?: { json?: () => Promise<{ error?: string }>; text?: () => Promise<string> };
      };
      if (errorWithContext?.context?.json) {
        try {
          const payload = await errorWithContext.context.json();
          if (payload?.error) {
            parsedMessage = payload.error;
          }
        } catch {
          if (errorWithContext?.context?.text) {
            try {
              const textPayload = await errorWithContext.context.text();
              if (textPayload) parsedMessage = textPayload;
            } catch {
              // Keep default parsed message
            }
          }
        }
      }

      applyDuplicateFieldError(parsedMessage);
      setErrorMessage(parsedMessage);
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Left Side - Feature Showcase */}
      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-start p-12 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 opacity-40"></div>

        {/* Content */}
        <div className="z-10 max-w-md w-full pt-10 mb-0">
          {/* Main Icon - increased bottom margin */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <div className="rounded-3xl blur-2xl bg-white"></div>
              <div className="relative w-24 h-24 backdrop-blur-xl rounded-3xl flex items-center justify-center border-2 border-sky-200 shadow-xl">
                <img
                  src="/Icon-2.svg"
                  alt="Al Madmoon"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Headline - keep large bottom margin */}
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 pb-5">
            Start Your Winning Journey
          </h2>

          {/* Description - increased bottom margin to separate from first feature */}
          <p className="text-slate-600 text-lg pb-10">
            Get instant access to AI-powered betting insights, real-time
            analysis, and personalized recommendations—all on WhatsApp.
          </p>

          {/* Features Grid - keep vertical gap */}
          <div className="space-y-4">
            {/* Feature 1 - No Credit Card */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <CreditCard className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  All Credit Card Suported
                </h3>
                <p className="text-sm text-slate-600">
                  Create account in seconds
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 2 - 100% Secure */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <Shield className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  100% Secure
                </h3>
                <p className="text-sm text-slate-600">
                  Military-grade encryption protecting your data
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 3 - Instant Access */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <Zap className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Instant Access
                </h3>
                <p className="text-sm text-slate-600">
                  WhatsApp alerts 24/7 with AI insights
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* CTA - increased top margin */}
          <div className="mt-16 pt-8 border-t-2 border-sky-200 text-center">
            <p className="text-sm text-slate-600 pb-6">
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

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 mt-14 lg:mt-0">
        <div className="w-full max-w-md">
          {/* White Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-15 patternbg">
            {/* Brand Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-900 pb-6">
                Create Account
              </h1>
              <p className="text-slate-600 text-base">
                Join thousands of successful bettors using AI insights
              </p>
            </div>

            {/* Sign Up Form */}
            <form className="space-y-5 mb-8" onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                    placeholder="Full Name"
                  />
                  {/* User Icon SVG */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailInputRef}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pl-4 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-red-400 hover:border-red-500"
                        : "border-slate-200 focus:ring-sky-400 focus:border-transparent hover:border-slate-300"
                    }`}
                    placeholder="you@example.com"
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
              {fieldErrors.email && (
                <p className="mt-2 text-xs text-red-600">{fieldErrors.email}</p>
              )}

              {/* Phone Number Field */}
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900"
                  >
                    <option value="961">+961</option>
                    <option value="966">+966</option>
                    <option value="971">+971</option>
                    <option value="20">+20</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      ref={phoneInputRef}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 pl-4 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                        fieldErrors.phone
                          ? "border-red-500 focus:ring-red-400 hover:border-red-500"
                          : "border-slate-200 focus:ring-sky-400 focus:border-transparent hover:border-slate-300"
                      }`}
                      placeholder="03 123 456"
                    />
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
                        d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.74 2.966a2 2 0 01-.53 1.946l-1.29 1.29a16 16 0 006.566 6.566l1.29-1.29a2 2 0 011.946-.53l2.966.74A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
                {normalizedPhone && (
                  <p className="mt-2 text-xs text-slate-500">
                    Saved as: {normalizedPhone}
                  </p>
                )}
                {fieldErrors.phone && (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
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

              {/* Confirm Password Field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
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
                {isPasswordMismatch && (
                  <p className="mt-2 text-xs text-red-600">
                    Password and confirm password must match.
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="referralCode"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Code{" "}
                  <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="referralCode"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                    placeholder="ABCD"
                    maxLength={6}
                  />
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
                      d="M4 7h16M4 12h8m-8 5h10"
                    />
                  </svg>
                </div>
                {!isReferralCodeValid && (
                  <p className="mt-2 text-xs text-red-600">
                    Referral code must be 4 to 6 uppercase letters (A-Z).
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="w-4 h-4 mt-1 rounded border-slate-300 bg-white cursor-pointer accent-sky-500"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    to="/"
                    className="text-sky-500 font-semibold hover:text-sky-600"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/"
                    className="text-sky-500 font-semibold hover:text-sky-600"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
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
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pb-6 border-b border-slate-200">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/auth/signin"
                  className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden p-6 bg-linear-to-r from-sky-300 to-blue-500 text-white text-center relative z-10 rounded-t-3xl">
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
