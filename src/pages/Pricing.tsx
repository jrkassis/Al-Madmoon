import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { MessageCircle, CheckCircle2, Zap, Crown, XCircle, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Pricing.css";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  const plans = useMemo(
    () => [
      {
        id: "pro",
        name: "Pro",
        icon: <Zap size={24} />,
        monthlyPrice: 19.99,
        annualPrice: 189.99,
        features: [
          { label: "Limited Access", available: true },
          { label: "300 AI Betting Queries", available: true },
          { label: "Match Analysis & Win Probabilities", available: true },
          { label: "All Sports Coverage", available: false },
          { label: "Access to our Most Advanced AI Model", available: false },
          { label: "Wider Sports Coverage + Priority Updates", available: false },
        ],
        badge: "",
      },
      {
        id: "ultimate",
        name: "Ultimate",
        icon: <Crown size={24} />,
        monthlyPrice: 34.99,
        annualPrice: 334.99,
        features: [
          { label: "Full Access", available: true },
          { label: "Up to 600+ AI Betting Queries", available: true },
          { label: "Access to our most Advanced AI Model", available: true },
          { label: "Advanced Match Analysis & Probabilities", available: true },
          { label: "Widest Sports Coverage + Priority Updates", available: true },
          { label: "Deep Personalization", available: true },
        ],
        badge: "Best Value",
      },
    ],
    []
  );

  const computePriceLabel = (monthlyPrice: number, annualPrice?: number) => {
    if (billing === "monthly") {
      return { amount: `$${monthlyPrice.toFixed(2)}`, period: "/month", originalAnnual: null };
    }
    const discounted = annualPrice ?? monthlyPrice * 12 * 0.8;
    const original = monthlyPrice * 12 + 0.12;
    return {
      amount: `$${discounted.toFixed(2)}`,
      period: "/year",
      originalAnnual: `$${original.toFixed(2)}`,
    };
  };

  const ctaTo = (planId: string) =>
    isAuthenticated
      ? `/paywall?plan=${planId}&billing=${billing}`
      : `/auth/signup?redirect=${encodeURIComponent(`/paywall?plan=${planId}&billing=${billing}`)}`;


  const ctaLabel = isAuthenticated ? "Upgrade" : "Subscribe";

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="pricing-container"
    >
      <div className="pricing-header">
        <motion.h1 variants={fadeIn} className="pricing-title">
          Simple, transparent pricing.
        </motion.h1>
        <motion.p variants={fadeIn} className="pricing-subtitle">
          Choose a plan and start getting AI-powered betting insights sent to your WhatsApp.
        </motion.p>

        <motion.div variants={fadeIn} className={`billing-toggle ${billing === "annual" ? "annual-selected" : ""}`} role="tablist" aria-label="Billing period">
          <button
            role="tab"
            aria-selected={billing === "monthly"}
            className={`toggle-option ${billing === "monthly" ? "active" : ""}`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={billing === "annual"}
            className={`toggle-option ${billing === "annual" ? "active best-focus" : ""}`}
            onClick={() => setBilling("annual")}
          >
            Annual <span className="save-pill">Save 20%</span>
          </button>
        </motion.div>
      </div>

      <motion.div variants={fadeIn} className="pricing-grid">
        {plans.map((plan) => {
          const price = computePriceLabel(plan.monthlyPrice, (plan as any).annualPrice);
          return (
            <div key={plan.id} className="pricing-card small">
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}

              <div className="pricing-card-header">
                <div className="pricing-icon">{plan.icon}</div>
                <h2 className="pricing-plan-name">{plan.name}</h2>
              </div>

              <div className={billing === "annual" ? "pricing-amount-wrapper-2" : "pricing-amount-wrapper"}>
                {billing === "annual" && price.originalAnnual && (
                  <span className="original-annual">{price.originalAnnual}</span>
                )}
                <div className="price-line">
                  <span className="pricing-amount">{price.amount}</span>
                  <span className="pricing-period">{price.period}</span>
                  {billing === "annual" && (
                    <span
                      className={`save-badge-blue ${plan.id === "ultimate" ? "ultimate" : "pro"}`}
                      aria-label={`Save ${plan.id === "ultimate" ? "$85" : "$50"}`}
                    >
                      Save {plan.id === "ultimate" ? "$85" : "$50"}
                    </span>
                  )}
                </div>
              </div>

              {billing === "annual" && <div className="off-badge">Equivalent to 20% off.</div>}

              <ul className="pricing-features">
                {plan.features.map((feature, i) => {
                  const isAvailable = typeof feature === "string" ? true : feature.available;
                  const label = typeof feature === "string" ? feature : feature.label;
                  return (
                    <li key={i} className="pricing-feature-item" style={{ opacity: isAvailable ? 1 : 0.75 }}>
                      {isAvailable ? (
                        <CheckCircle2
                          size={18}
                          className="text-brand"
                          style={{
                            color: "var(--color-brand-500)",
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <XCircle
                          size={18}
                          style={{
                            color: "#ef4444",
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>

              <Link to={ctaTo(plan.id)}>
                <Button variant="ghost" size="lg" className="btn-icon cta-btn">
                  <ArrowRight size={16} />
                  {ctaLabel}
                </Button>
              </Link>

              <p className="pricing-payment-note">
                Payment accepted via Whish Money
              </p>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeIn} className="faq-wrapper">
        <h3 className="faq-title">Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4 className="faq-q">How do I pay?</h4>
            <p className="faq-a">
              You can see all our plans on the pricing page. Choose the plan you want and click on the upgrade button. We accept payments via Whish Money.
            </p>
          </div>
          <div className="faq-item">
            <h4 className="faq-q">How long does activation take?</h4>
            <p className="faq-a">
              Once your payment is confirmed, our automated system
              activates your account instantly. You can start chatting with the
              AL Madmoon right away.
            </p>
          </div>
          <div className="faq-item">
            <h4 className="faq-q">Can I cancel my subscription?</h4>
            <p className="faq-a">
              Yes, you can choose not to renew your subscription at the end of
              the month. There are no long-term contracts.
            </p>
          </div>
        </div>
        <div className="faq-cta-wrapper">
          <Link to="/contact">
            <Button variant="outline" size="lg" className="btn-icon">
              <MessageCircle size={16} />
              More questions?
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
