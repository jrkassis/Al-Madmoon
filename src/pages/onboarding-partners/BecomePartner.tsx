import React from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  DollarSign, Users, TrendingUp, Star, Crown, Award,
  Video, Image, FileText, ChevronRight, Check,
  Zap, Globe, Gift, Calendar, ArrowRight, Shield,
  BarChart3, Target, Megaphone,
} from "lucide-react";
import "./BecomePartner.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type partnerStep = "info" | "audience" | "strategy" | "finish";

export interface partnerFormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  phoneCountryCode: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  affiliateCode: string;
  website: string;
  socialProfiles: string;
  audienceSize: string;
  country: string;
  promotionStrategy: string;
  paypalEmail: string;
  otherPrograms: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { icon: DollarSign, title: "Passive Income", desc: "Earn recurring commissions every single month your referrals stay subscribed." },
  { icon: TrendingUp, title: "Growing Niche", desc: "AI-powered sports insights is one of the fastest growing niches in 2026." },
  { icon: Users, title: "High Conversion", desc: "Our landing pages and product convert, we do the selling, you do the sharing." },
  { icon: Video, title: "Free Creatives", desc: "Video scripts, short-form clips, screenshots all ready for you to publish." },
];

const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    icon: Award,
    color: "#cd7f32",
    colorLight: "#fdf6ec",
    colorBorder: "#f5d99a",
    referrals: 10,
    commission: 10,
    perks: [
      "Free Pro Account",
      "10% commission on every referral",
      "Access to creatives library",
    ],
    monthlyEst: { low: 20, mid: 120, high: 300 },
  },
  {
    id: "silver",
    name: "Silver",
    icon: Star,
    color: "#94a3b8",
    colorLight: "#f8fafc",
    colorBorder: "#cbd5e1",
    referrals: 50,
    commission: 12.5,
    perks: [
      "Free Ultimate Account",
      "12.5% commission on every referral",
      "Access to full creatives library",
      "Early access to new features",
    ],
    monthlyEst: { low: 125, mid: 750, high: 1500 },
    featured: true,
  },
  {
    id: "gold",
    name: "Gold",
    icon: Crown,
    color: "#d97706",
    colorLight: "#fffbeb",
    colorBorder: "#fcd34d",
    referrals: 100,
    commission: 15,
    perks: [
      "Free Ultimate Account",
      "15% commission on every referral",
      "Access to full creatives library",
      "Attend exclusive partner events",
      "Custom benefits: trips, merch & more",
    ],
    monthlyEst: { low: 300, mid: 1500, high: 4500 },
  },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Users, title: "Get Your Link", desc: "Fill out a short application and get your link instantly." },
  { step: "02", icon: Target, title: "Promote", desc: "Use our ready-made creatives or your own content to reach your audience." },
  { step: "03", icon: DollarSign, title: "Get Paid", desc: "Earn monthly commissions from your referrals." },
];

const EXPECTATIONS = [
  { icon: Shield, text: "Honest, authentic promotion of our product" },
  { icon: Zap, text: "No spamming, cold messaging, or misleading claims" },
];

const CREATIVES = [
  { icon: FileText, label: "Ready-Made Scripts", count: "20+", desc: "TikTok & Reels Scripts" },
  { icon: Video, label: "Short Videos", count: "15+", desc: "Branded clips you can post as-is" },
  { icon: Image, label: "Screenshots", count: "30+", desc: "Testimonials & result cards" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Earnings Calculator ──────────────────────────────────────────────────────

function EarningsCalculator() {
  const rows = [
    {
      id: "bronze-row",
      name: "Bronze",
      range: "10+",
      commission: "10%",
      earnings: "$20 - $300",
      yearly: "$240 - $3,600",
    },
    {
      id: "silver-row",
      name: "Silver",
      range: "50+",
      commission: "12.5%",
      earnings: "$125 - $1,500",
      yearly: "$1,500 - $18,000",
    },
    {
      id: "gold-row",
      name: "Gold",
      range: "100+",
      commission: "15%",
      earnings: "$300 - $4,500",
      yearly: "$3,600 - $54,000",
    },
  ];

  return (
    <div className="af-calc">
      <table
        className="af-calc__table"
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          marginBottom: 24,
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th className="af-calc__th">Tier</th>
            <th className="af-calc__th">Referrals / Month</th>
            <th className="af-calc__th">%</th>
            <th className="af-calc__th">Monthly</th>
            <th className="af-calc__th">Yearly</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f8fafc",
              }}
            >
              <td
                style={{
                  fontWeight: 700,
                  color: "#5876e4",
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                {row.name}
              </td>

              <td
                style={{
                  fontWeight: 600,
                  color: "#475569",
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                {row.range}
              </td>

              <td
                style={{
                  color: "#15803d",
                  fontWeight: 700,
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                {row.commission}
              </td>

              <td
                style={{
                  fontWeight: 800,
                  color: "#0ea5e9",
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                {row.earnings}
              </td>
              <td
                style={{
                  fontWeight: 800,
                  color: "#0ea5e9",
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                {row.yearly}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        className="af-calc__note"
        style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}
      >
        These are monthly estimates based on typical partner performance and plan distribution.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BecomePartner() {
  return (
    <div className="af-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="af-hero">
        <div className="af-hero__bg" />
        <div className="af-hero__content">
          <motion.div
            className="af-hero__eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Partner Program
          </motion.div>

          <motion.h1
            className="af-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Turn your audience into<br />
            <span className="af-hero__title-accent">monthly income</span>
          </motion.h1>

          <motion.p
            className="af-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Promote Al Madmoon on your platform and earn up to
            <strong> 15% recurring commission</strong> every month!
          </motion.p>

          <motion.div
            className="af-hero__cta-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/become-a-partner/apply" className="af-btn af-btn--primary af-btn--lg">
              Start Now <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            className="af-hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <div className="af-hero__stat">
              <span className="af-hero__stat-num">15%</span>
              <span className="af-hero__stat-label">Max commission</span>
            </div>
            <div className="af-hero__stat-sep" />
            <div className="af-hero__stat">
              <span className="af-hero__stat-num">Instant</span>
              <span className="af-hero__stat-label">Approval time</span>
            </div>
            <div className="af-hero__stat-sep" />
            <div className="af-hero__stat">
              <span className="af-hero__stat-num">Monthly</span>
              <span className="af-hero__stat-label">Payout schedule</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────────────── */}
      <section className="af-section af-section--white" id="tiers">
        <div className="af-container">
          <AnimatedSection className="af-section-header">
            <p className="af-section-eyebrow">Partner tiers</p>
            <h2 className="af-section-title">The more you refer, the more you earn</h2>
            <p className="af-section-sub">
              Tiers are recalculated monthly based on your active referral count.
              Climb automatically no manual requests needed.
            </p>
          </AnimatedSection>

          <div className="af-tiers">
            {TIERS.map((tier, i) => (
              <AnimatedSection delay={i * 0.1}>
                <div className={`af-tier-card ${tier.featured ? "af-tier-card--featured" : ""}`}
                  style={{ "--tier-color": tier.color, "--tier-light": tier.colorLight, "--tier-border": tier.colorBorder } as React.CSSProperties}
                >

                  <div className="af-tier-card__header">
                    <div className="af-tier-card__icon">
                      <tier.icon size={26} />
                    </div>
                    <div>
                      <h3 className="af-tier-card__name">{tier.name}</h3>
                      <p className="af-tier-card__threshold">{tier.referrals}+ referrals/month</p>
                    </div>
                    <div className="af-tier-card__commission">
                      <span className="af-tier-card__commission-num">{tier.commission}%</span>
                      <span className="af-tier-card__commission-label">commission</span>
                    </div>
                  </div>

                  <ul className="af-tier-card__perks">
                    {tier.perks.map((p, pIndex) => (
                      <li key={`${tier.id}-perk-${pIndex}`} className="af-tier-card__perk">
                        <Check size={15} />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="af-tier-card__est">
                    <span className="af-tier-card__est-label">Estimated monthly earnings</span>
                    <div className="af-tier-card__est-range">
                      <span className="af-tier-card__est-low">${tier.monthlyEst.low.toLocaleString()}</span>
                      <span className="af-tier-card__est-sep">–</span>
                      <span className="af-tier-card__est-high">${tier.monthlyEst.high.toLocaleString()}</span>
                    </div>
                    <div className="af-tier-card__est-bar">
                      <div className="af-tier-card__est-fill" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ──────────────────────────────────────────── */}
      <section className="af-section-5 af-section--brand">
        <div className="af-container af-container--narrow">
          <AnimatedSection className="af-section-header af-section-header--light">
            <p className="af-section-eyebrow af-section-eyebrow--light">Earnings calculator</p>
            <h2 className="af-section-title af-section-title--light">How much could you make?</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <EarningsCalculator />
          </AnimatedSection>
        </div>
      </section>

      <section>
        <h2 className="af-section-title--secondary af-section-title" style={{ marginTop: 128 }}>
          <strong style={{ fontSize: 40, fontWeight: 700 }}>Did you know?</strong> Our top partners consistently earn <span style={{ fontSize: 40, fontWeight: 700 }}>$3,900 +</span> every month.
        </h2>
        <h2 className="af-section-title--secondary af-section-title" style={{ marginTop: 32 }}>
          They have over <strong style={{ fontSize: 40, fontWeight: 700 }}>1,000 total</strong> referrals.
        </h2>
        <h2 className="af-section-title--secondary af-section-title" style={{ marginTop: 32, marginBottom: 128 }}>
          Thats <strong style={{ fontSize: 40, fontWeight: 700 }}>$46,000</strong> in a year.
        </h2>
      </section>

      <section className="af-cta-section">
        <div className="af-cta-section__bg" />
        <AnimatedSection className="af-cta-section__content">
          <div className="af-cta-section__badge">
            <Gift size={16} /> Limited spots available
          </div>
          <h2 className="af-cta-section__title">
            Get your link now
          </h2>
          <p className="af-cta-section__sub">
            Apply in 5 minutes. Get your link instantly. Start earning immediately.
          </p>
          <Link to="/become-a-partner/apply" className="af-btn af-btn--primary af-btn--xl">
            Get Started <ArrowRight size={20} />
          </Link>
        </AnimatedSection>
      </section>

      {/* ── CREATIVES LIBRARY ────────────────────────────────────────────── */}
      <section className="af-section af-section--subtle">
        <div className="af-container">
          <AnimatedSection className="af-section-header">
            <p className="af-section-eyebrow">Creatives library</p>
            <h2 className="af-section-title">Everything you need to post already made</h2>
            <p className="af-section-sub">
              We provide you with everything you need to start creating, all ready to go.
            </p>
          </AnimatedSection>

          <div className="af-creatives">
            {CREATIVES.map((c, i) => (
              <AnimatedSection delay={i * 0.08}>
                <div className="af-creative-card">
                  <c.icon size={28} className="af-creative-card__icon" />
                  <span className="af-creative-card__count">{c.count}</span>
                  <h4 className="af-creative-card__label">{c.label}</h4>
                  <p className="af-creative-card__desc">{c.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="af-section af-section--subtle">
        <div className="af-container">
          <AnimatedSection className="af-section-header">
            <p className="af-section-eyebrow">process</p>
            <h2 className="af-section-title">Simple from day one</h2>
          </AnimatedSection>

          <div className="af-steps">
            {HOW_IT_WORKS.map((s, i) => (
              <AnimatedSection delay={i * 0.1} className="af-step">
                <div className="af-step__num">{s.step}</div>
                <h3 className="af-step__title">{s.title}</h3>
                <p className="af-step__desc">{s.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="af-step__arrow"><ChevronRight size={20} /></div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="af-cta-section">
        <div className="af-cta-section__bg" />
        <AnimatedSection className="af-cta-section__content">
          <div className="af-cta-section__badge">
            <Gift size={16} /> Limited spots available
          </div>
          <h2 className="af-cta-section__title">
            Ready to start earning?
          </h2>
          <p className="af-cta-section__sub">
            Apply in 5 minutes. Get your link instantly. Start earning immediately.
          </p>
          <Link to="/become-a-partner/apply" className="af-btn af-btn--primary af-btn--xl">
            Get Commission Now <ArrowRight size={20} />
          </Link>
          <p className="af-cta-section__fine">
              Already a partner? <Link to="/auth/signin" className="af-cta-section__link">Sign in to your dashboard</Link>
          </p>
        </AnimatedSection>
      </section>

      {/* ── WHAT WE EXPECT ───────────────────────────────────────────────── */}
      <section className="af-section af-section--white">
        <div className="af-container">
          <AnimatedSection className="af-section-header">
            <p className="af-section-eyebrow">expectations</p>
            <h2 className="af-section-title">What we ask of you</h2>
            <p className="af-section-sub">
              We keep it simple and fair. A few ground rules to make sure the
              programme works well for everyone.
            </p>
          </AnimatedSection>

          <div className="af-expectations">
            {EXPECTATIONS.map((e, i) => (
              <AnimatedSection delay={i * 0.08}>
                <div className="af-expectation">
                  <div className="af-expectation__icon"><e.icon size={18} /></div>
                  <p className="af-expectation__text">{e.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}