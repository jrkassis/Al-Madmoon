import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { MessageCircle, CheckCircle2, Zap } from "lucide-react";
import "./Pricing.css";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Pricing() {
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
          One straightforward plan. Everything you need to make smarter betting
          decisions, delivered straight to your WhatsApp.
        </motion.p>
      </div>

      <motion.div variants={fadeIn} className="pricing-card-wrapper">
        <div className="pricing-card">
          <div className="pricing-badge">Most Popular</div>

          <div className="pricing-card-header">
            <div className="pricing-icon">
              <Zap size={24} />
            </div>
            <h2 className="pricing-plan-name">Monthly Plan</h2>
          </div>

          <div className="pricing-amount-wrapper">
            <span className="pricing-amount">$19.99</span>
            <span className="pricing-period">/month</span>
          </div>

          <p className="pricing-desc">
            Full access to Al Madmoon's AI betting assistant for 30 days. Cancel
            anytime.
          </p>

          <ul className="pricing-features">
            {[
              "1‑Month Full Access",
              "10 AI Betting Insights Daily",
              "Match Analysis & Win Probabilities In‑depth breakdowns for every game",
              "Wide Sports Coverage",
              "Personalized Recommendations",
              "24/7 WhatsApp Support ",
            ].map((feature, i) => (
              <li key={i} className="pricing-feature-item">
                <CheckCircle2
                  size={20}
                  className="text-brand"
                  style={{
                    color: "var(--color-brand-500)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a href="/onboarding" rel="noopener noreferrer">
            <Button variant="ghost" size="lg" className="btn-icon cta-btn">
              <MessageCircle size={16} />
              Start on WhatsApp
            </Button>
          </a>

          <p className="pricing-payment-note">
            Payment accepted via Whish Money or Stipe.
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="faq-wrapper">
        <h3 className="faq-title">Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4 className="faq-q">How do I pay?</h4>
            <p className="faq-a">
              We accept payments via Whish Money and Stripe. Once you message us
              on WhatsApp to subscribe, we will provide the payment details.
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
      </motion.div>
    </motion.div>
  );
}
