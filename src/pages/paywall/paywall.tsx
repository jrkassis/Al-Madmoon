import "./paywall.css";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Wallet, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// ─── Plan config ──────────────────────────────────────────────────────────────
// Replace the 4 lsUrl values with your real Lemon Squeezy checkout URLs.
// Find them at: LS Dashboard → Products → your product → Variants → Share

const PLAN_CONFIG = {
  pro: {
    name: "Pro",
    monthly: 19.99,
    annual: 189.99,
    lsMonthlyUrl: "https://YOUR_STORE.lemonsqueezy.com/checkout/buy/PRO_MONTHLY_VARIANT_ID",
    lsAnnualUrl: "https://YOUR_STORE.lemonsqueezy.com/checkout/buy/PRO_ANNUAL_VARIANT_ID",
  },
  ultimate: {
    name: "Ultimate",
    monthly: 34.99,
    annual: 334.99,
    lsMonthlyUrl: "https://YOUR_STORE.lemonsqueezy.com/checkout/buy/ULTIMATE_MONTHLY_VARIANT_ID",
    lsAnnualUrl: "https://YOUR_STORE.lemonsqueezy.com/checkout/buy/ULTIMATE_ANNUAL_VARIANT_ID",
  },
};

function generateExternalId() {
  return Date.now();
}

// Injects lemon.js once and wires up the overlay success event
function useLemonSqueezy(onSuccess) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://app.lemonsqueezy.com/js/lemon.js"]')) {
      //window.createLemonSqueezy?.();
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.onload = () => {
      //window.createLemonSqueezy?.();
      // @ts-ignore: LemonSqueezy might not be typed on window
      window.LemonSqueezy?.Setup({
        eventHandler: (e) => {
          if (e.event === "Checkout.Success") onSuccess();
        },
      });
      setReady(true);
    };
    document.body.appendChild(script);
  }, [onSuccess]);

  return ready;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Paywall() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planKey = searchParams.get("plan") ?? "pro";
  const billing = searchParams.get("billing") ?? "monthly";
  const plan = PLAN_CONFIG[planKey] ?? PLAN_CONFIG.pro;
  const isAnnual = billing === "annual";
  const price = isAnnual ? plan.annual : plan.monthly;
  const period = isAnnual ? "/year" : "/month";

  const [step, setStep] = useState("choose");   // "choose" | "whish-waiting" | "success" | "failed"
  const [activeMethod, setMethod] = useState(null);        // "ls" | "whish"
  const [whishLoading, setWLoad] = useState(false);
  const [error, setError] = useState(null);
  const [collectStatus, setCS] = useState("pending");

  const pollRef = useRef(null);
  const timeoutRef = useRef(null);

  const stopPolling = () => {
    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
  };

  useEffect(() => () => stopPolling(), []);

  const startPolling = (externalId) => {
    stopPolling();

    const poll = async () => {
      try {
        const res = await fetch("/api/whish-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ externalId }),
        });
        const data = await res.json();
        const s = data.collectStatus;
        setCS(s);
        if (s === "success") {
          stopPolling();
          setStep("success");
          // Auto-redirect to dashboard shortly after success
          setTimeout(() => navigate("/dashboard"), 1200);
        }
        if (s === "failed") { stopPolling(); setStep("failed"); }
      } catch {
        // network blip — keep polling
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setError("Payment timed out. Please try again.");
      setStep("failed");
    }, 300_000);
  };

  const lsReady = useLemonSqueezy(() => setStep("success"));

  const handleLemonSqueezy = () => {
    setMethod("ls");
    const url = isAnnual ? plan.lsAnnualUrl : plan.lsMonthlyUrl;
    // @ts-ignore: LemonSqueezy might not be typed on window
    window.LemonSqueezy?.Url?.Open(url);
  };

  const handleWhish = async () => {
    setMethod("whish");
    setWLoad(true);
    setError(null);
    const externalId = generateExternalId();

    try {
      const res = await fetch("/api/whish-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, billing, externalId }),
      });
      const data = await res.json();

      if (!res.ok || !data.collectUrl) {
        throw new Error(data.error ?? "Failed to start Whish payment.");
      }

      startPolling(externalId);
      setStep("whish-waiting");

      // Open Whish in the same tab (most reliable, avoids popup blockers)
      window.location.href = data.collectUrl;
    } catch (err) {
      setError(err.message ?? "Unexpected error. Please try again.");
    } finally {
      setWLoad(false);
    }
  };

  const resetToChoose = () => {
    stopPolling();
    setStep("choose");
    setMethod(null);
    setError(null);
    setCS("pending");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="pw-root">
      <AnimatePresence mode="wait">

        {/* ── Choose method ── */}
        {step === "choose" && (
          <motion.div
            key="choose"
            className="pw-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="pw-header">
              <Link to="/pricing" className="pw-back">
                <ArrowLeft size={14} /> Back to pricing
              </Link>

              {/* Plan summary pill */}
              <div className="pw-pill">
                <span className="pw-pill__name">{plan.name}</span>
                <span className="pw-pill__sep">·</span>
                <span className="pw-pill__price">${price.toFixed(2)}</span>
                <span className="pw-pill__period">{period}</span>
              </div>
            </div>

            <h1 className="pw-title">Choose your payment method.</h1>
            <p className="pw-sub">Select a payment method to activate your subscription.</p>

            <div className="pw-methods">

              {/* Lemon Squeezy */}
              <button
                className={`pw-method ${activeMethod === "ls" ? "pw-method--active" : ""} ${!lsReady ? "pw-method--disabled" : ""}`}
                onClick={handleLemonSqueezy}
                disabled={!lsReady}
              >
                <span className="pw-method__icon pw-method__icon--ls">
                  <CreditCard size={20} />
                </span>
                <span className="pw-method__body">
                  <span className="pw-method__name">Credit / Debit Card</span>
                  <span className="pw-method__desc">Visa, Mastercard & more.</span>
                </span>
                <span className="pw-method__tag pw-method__tag--whish">
                  {lsReady ? "Global" : <Loader2 size={13} className="pw-spin" />}
                </span>
              </button>

              {/* Whish Money */}
              <button
                className={`pw-method ${activeMethod === "whish" ? "pw-method--active" : ""} ${whishLoading ? "pw-method--disabled" : ""}`}
                onClick={handleWhish}
                disabled={whishLoading}
              >
                <span className="pw-method__icon pw-method__icon--whish">
                  <img src="/Whish-Logo.jpg" alt="Whish Money" width={20} height={20} />
                </span>
                <span className="pw-method__body">
                  <span className="pw-method__name">Whish Money</span>
                  <span className="pw-method__desc">Pay instantly with your Whish wallet balance</span>
                </span>
                <span className="pw-method__tag pw-method__tag--ls">
                  {whishLoading ? <Loader2 size={13} className="pw-spin" /> : "Local"}
                </span>
              </button>
            </div>

            {error && <p className="pw-error">{error}</p>}

            <p className="pw-legal">
              By completing your purchase you agree to our{" "}
              <Link to="/terms" className="pw-link">Terms of Service</Link>.
              {" "}Subscriptions renew automatically.
            </p>
          </motion.div>
        )}

        {/* ── Whish: waiting for payment ── */}
        {step === "whish-waiting" && (
          <motion.div
            key="waiting"
            className="pw-card pw-card--center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pw-ring">
              <div className="pw-ring__spin" />
              <Wallet size={22} className="pw-ring__icon" />
            </div>

            <h2 className="pw-title">Complete payment in Whish</h2>
            <p className="pw-sub">
              Finish the payment in the Whish tab that just opened.<br />
              This page updates automatically once confirmed.
            </p>

            <div className="pw-status-row">
              <span className="pw-dot" />
              <span className="pw-status-label">
                {collectStatus === "pending" ? "Waiting for payment…" : collectStatus}
              </span>
            </div>

            <button className="pw-ghost" onClick={resetToChoose}>Cancel</button>
          </motion.div>
        )}

        {/* ── Success ── */}
        {step === "success" && (
          <motion.div
            key="success"
            className="pw-card pw-card--center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pw-result-icon pw-result-icon--ok">
              <CheckCircle2 size={30} />
            </div>
            <h2 className="pw-title">You're all set!</h2>
            <p className="pw-sub">
              Your <strong>{plan.name}</strong> subscription is now active. Welcome aboard.
            </p>
            <button className="pw-cta" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </motion.div>
        )}

        {/* ── Failed ── */}
        {step === "failed" && (
          <motion.div
            key="failed"
            className="pw-card pw-card--center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pw-result-icon pw-result-icon--err">
              <XCircle size={30} />
            </div>
            <h2 className="pw-title">Payment failed</h2>
            <p className="pw-sub">
              {error ?? "Something went wrong. Please try a different method."}
            </p>
            <button className="pw-cta pw-cta--outline" onClick={resetToChoose}>
              Try Again
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}