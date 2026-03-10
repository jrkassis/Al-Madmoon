import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { MessageCircle, ArrowRight, CheckCircle2, Trophy, Activity, Zap, Star, BarChart3, Info, Shield, TrendingUp, Target, Globe, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhatsAppMockup } from '../components/ui/WhatsAppMockup';
import { HeroVisual } from '../components/ui/HeroVisual';
import './Home.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const testimonials = [
  {
    quote: "Al Madmoon completely changed how I bet on football. The insights are incredibly accurate and easy to understand.",
    author: "Ahmed S.",
    role: "Football Bettor",
    avatar: "A"
  },
  {
    quote: "The F1 predictions are spot on. It's like having a race strategist directly on my WhatsApp.",
    author: "Michael T.",
    role: "F1 Enthusiast",
    avatar: "M"
  },
  {
    quote: "Fast, reliable, and super easy to use. I just ask a question and get data-backed answers instantly.",
    author: "Sarah L.",
    role: "Casual Bettor",
    avatar: "S"
  }
];

const faqs = [
  {
    question: "How accurate are the AI predictions?",
    answer: "Our AI analyzes vast amounts of historical data, current news, and real-time odds to provide highly accurate probabilities. While no bet is guaranteed, our insights give you a significant data-driven edge."
  },
  {
    question: "Which betting platforms do you support?",
    answer: "We provide insights that can be used on any major platform."
  },
  {
    question: "Do I need to download an app?",
    answer: "No! Al Madmoon operates entirely through WhatsApp. Just save our number and start chatting."
  },
  {
    question: "How do I get started?",
    answer: "Simply save our WhatsApp number and send a message. Our AI will guide you through the process."
  },
  {
    question: "Is my data safe?",
    answer: "Yes, your data is safe with us. We use industry-standard security measures to protect your information."
  }
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container" >

      <div className="hero-background">
        {/* Hero Section */}
        <section
          className="section-base hero-section">
          {/* Background Decorators */}
          <div className="glow-orb primary orb-tl" />
          <div className="glow-orb secondary orb-br" />
          <div className="detail-dots dots-1" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hero-layout"
            style={{ position: 'relative', zIndex: 10 }}
          >
            {/* Hero Content (Left Column) */}
            <div className="hero-content">
              <motion.div variants={itemVariants} className="hero-badge">
                <span className="pulse-dot" />
                AI-Powered Sports Analyst
              </motion.div>

              <motion.h1 variants={itemVariants} className="hero-title">
                Your Personal <span className="text-gradient">Sports Analyst</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="hero-subtitle">
                Analyze any sport using real-time data, historical statistics, and AI prediction models directly through WhatsApp.
              </motion.p>

              <motion.div variants={itemVariants} className="hero-actions">
                <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="btn-icon btn-shadow w-75">
                    <MessageCircle size={20} />
                    Start on WhatsApp
                  </Button>
                </a>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="btn-icon w-75">
                    See How It Works
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="check-features">
                <div className="feature-pill">
                  <CheckCircle2 size={16} className="text-brand" />
                  Real-time analysis
                </div>
                <div className="feature-pill">
                  <CheckCircle2 size={16} className="text-brand" />
                  24/7 availability
                </div>
                <div className="feature-pill">
                  <CheckCircle2 size={16} className="text-brand" />
                  Data-driven
                </div>
              </motion.div>
            </div>

            {/* Hero Mockup (Right Column) */}
            <motion.div
              variants={itemVariants}
              className="hero-mockup-container"
            >
              {/* <HeroVisual /> */}
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Today's AI Picks Section */}
      <section className="section-base picks-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="section-header"
        >
          <motion.h2 variants={itemVariants} className="section-title">Today's AI Picks</motion.h2>
          <motion.p variants={itemVariants} className="section-desc">Sample predictions from our latest model execution.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="picks-grid"
        >
          {[
            { match: 'Man City vs Tottenham', bet: 'Over 2.5 Goals', confidence: '77%', odds: '1.65' },
            { match: 'Lakers vs Suns', bet: 'Lakers +5.5', confidence: '72%', odds: '1.91' }
          ].map((pick, i) => (
            <motion.div key={i} variants={itemVariants} className="pick-widget">
              <div className="pw-header">
                <span className="pw-match">{pick.match}</span>
                <div className="pw-confidence">{pick.confidence} Conf.</div>
              </div>
              <div className="pw-body">
                <div className="pw-bet-info">
                  <span className="pw-label">BEST BET</span>
                  <span className="pw-bet">{pick.bet}</span>
                </div>
                <div className="pw-odds">{pick.odds}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AI Example Section */}
      <section className="section-base whatsapp-section" style={{ position: 'relative' }}>
        {/* Background Decorators */}
        <div className="glow-orb primary orb-tl" style={{ opacity: 0.3 }} />
        <div className="glow-orb secondary orb-br" style={{ opacity: 0.25 }} />
        <div className="detail-dots dots-1" style={{ top: '20%', right: 'auto', left: '5%' }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="ai-layout"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title">Your Personal AI Betting Analyst</h2>
            <p className="hero-subtitle-2" style={{ textAlign: 'left', margin: '0 0 32px 0' }}>
              Simply send a match through WhatsApp and the AI instantly analyzes team form, odds movement, historical matchups, and statistical models to identify the best betting opportunities.
            </p>
            <ul className="ai-features-list">
              {[
                'Real-time match analysis',
                'AI probability calculations',
                'Best bet suggestions',
                'Works directly inside WhatsApp'
              ].map((item, i) => (
                <li key={i} className="ai-feature-item">
                  <CheckCircle2 size={20} className="text-brand" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <Link to="/features">
                <Button variant="outline" className="btn-icon">
                  View All Capabilities
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="ai-mockup-showcase">
            <WhatsAppMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Metrics Section */}
      <section className="section-base metrics-section sports-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="metrics-grid"
        >
          {[
            { label: 'Matches Analyzed', value: '2,300+' },
            { label: 'Predictions Generated', value: '18,500+' },
            { label: 'Active Bettors', value: '500+' },
            { label: 'Data Sources', value: '40+' }
          ].map((metric, i) => (
            <motion.div key={i} variants={itemVariants} className="metric-card">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="section-base how-it-works-section testimonials-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="section-header"
        >
          <motion.h2 variants={itemVariants} className="section-title">How It Works</motion.h2>
          <motion.p variants={itemVariants} className="section-desc">Three simple steps to professional-grade betting insights.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="how-it-works-grid"
        >
          {[
            {
              step: '01',
              title: 'Text Al Madmoon',
              desc: 'Simply send the match you want to analyze via WhatsApp.',
              example: '"Who wins Arsenal vs Chelsea tonight ?"'
            },
            {
              step: '02',
              title: 'AI analyzes the match',
              desc: 'Our solution analyzes form, historical data, odds movement, and models.',
              evaluates: ['Team Form', 'Historical Performance', 'Odds Movement', 'Statistical Models']
            },
            {
              step: '03',
              title: 'Get the best bet',
              desc: 'Receive a detailed breakdown and high-probability recommendation.',
              returns: ['Win Probability', 'Best Bet Suggestion', 'Confidence Score']
            }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="step-card">
              <div className="step-number">{item.step}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
              {item.example && <div className="step-example">{item.example}</div>}
              {item.evaluates && (
                <div className="step-list">
                  {item.evaluates.map((ev, idx) => (
                    <div key={idx} className="step-list-item"><span className="list-dot" /> {ev}</div>
                  ))}
                </div>
              )}
              {item.returns && (
                <div className="step-list">
                  {item.returns.map((ret, idx) => (
                    <div key={idx} className="step-list-item"><span className="list-dot" /> {ret}</div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Example Match Analysis Section */}
      {/* <section className="section-base match-analysis-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="section-header"
          >
            <motion.h2 variants={itemVariants} className="section-title">Example AI Match Analysis</motion.h2>
            <motion.p variants={itemVariants} className="section-desc">Our models identify value where bookmakers fail to price risk correctly.</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="analysis-showcase"
          >
            <motion.div variants={itemVariants} className="prediction-card static-card">
              <div className="pc-header">
                <div className="pc-match-info">
                  <span className="pc-live-tag"><span className="live-dot" /> COMPLETED ANALYSIS</span>
                  <h3 className="pc-match-title">Arsenal vs Chelsea</h3>
                  <p className="pc-league">Premier League</p>
                </div>
                <div className="pc-engine-badge">
                  <Activity size={14} />
                  AI Engine 4.0
                </div>
              </div>

              <div className="pc-content">
                <div className="pc-grid-row">
                  <div className="pc-section">
                    <div className="pc-section-header">
                      <BarChart3 size={16} />
                      <span>Win Probability</span>
                    </div>
                    <div className="pc-prob-bars">
                      <div className="pc-prob-item">
                        <div className="pc-prob-labels">
                          <span>Arsenal</span>
                          <span className="pc-prob-val highlight">61%</span>
                        </div>
                        <div className="pc-prob-track">
                          <div className="pc-prob-fill warriors" style={{ width: '61%' }} />
                        </div>
                      </div>
                      <div className="pc-prob-item">
                        <div className="pc-prob-labels">
                          <span>Chelsea</span>
                          <span className="pc-prob-val">39%</span>
                        </div>
                        <div className="pc-prob-track">
                          <div className="pc-prob-fill lakers" style={{ width: '39%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pc-mini-grid">
                    <div className="pc-mini-card">
                      <div className="pc-mini-label">BEST BET</div>
                      <div className="pc-mini-value highlight">Arsenal DNB</div>
                      <div className="pc-mini-sub">@ 1.58 Odds</div>
                    </div>
                    <div className="pc-mini-card">
                      <div className="pc-mini-label">CONFIDENCE</div>
                      <div className="pc-mini-value">High (79%)</div>
                      <div className="pc-confidence-bar">
                        <div className="pc-confidence-fill" style={{ width: '79%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pc-section">
                  <div className="pc-section-header">
                    <Info size={16} />
                    <span>Why the AI recommends this bet</span>
                  </div>
                  <ul className="pc-factors-list">
                    <li><Shield size={12} className="text-brand" /> Arsenal strong home performance</li>
                    <li><TrendingUp size={12} className="text-brand" /> Chelsea defensive injuries</li>
                    <li><Target size={12} className="text-brand" /> Historical head-to-head advantage</li>
                    <li><BarChart3 size={12} className="text-brand" /> AI model probability higher than bookmaker implied odds</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section> */}

      {/* Supported Sports / Leagues Section */}
      <section className="section-base">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="section-header"
        >
          <motion.h2 variants={itemVariants} className="section-title">Ask about any sport</motion.h2>
          <motion.p variants={itemVariants} className="section-desc">We cover all major global sports with deep analytical models for every league.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="leagues-grid"
        >
          {[
            { name: 'Football', icon: <Flag size={18} /> },
            { name: 'Basketball', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>🏀</div> },
            { name: 'MMA', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>🥊</div> },
            { name: 'F1', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>🏁</div> },
            { name: 'Tennis', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>🎾</div> },
            { name: 'Baseball', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>⚾</div> },
            { name: 'Golf', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>⛳</div> },
            { name: 'Rugby', icon: <div style={{ fontSize: 18, lineHeight: 1 }}>🏉</div> }
          ].map((league, i) => (
            <motion.div key={i} variants={itemVariants} className="league-card">
              <div className="league-icon">{league.icon}</div>
              <span>{league.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorators */}
        <div className="glow-orb secondary orb-tr" style={{ opacity: 0.2 }} />
        <div className="glow-orb primary orb-bl" style={{ opacity: 0.25 }} />
        <div className="detail-dots dots-2" style={{ bottom: '20%', left: 'auto', right: '5%' }} />

        <div className="testimonials-container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            style={{ textAlign: 'center' }}
          >
            <motion.h2 variants={itemVariants} className="section-title" style={{ marginBottom: '48px' }}>Trusted by Bettors</motion.h2>

            <motion.div variants={itemVariants} className="testimonials-carousel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="testimonial-slide"
                >
                  <div className="stars">
                    {[...Array(5)].map((_, i) => <Star key={i} />)}
                  </div>
                  <p className="quote">"{testimonials[currentTestimonial].quote}"</p>
                  <div className="author-info">
                    <div className="author-avatar">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="author-text">
                      <p className="author-name">{testimonials[currentTestimonial].author}</p>
                      <p className="author-role">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="dots-nav">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`dot ${i === currentTestimonial ? 'active' : ''}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" style={{ position: 'relative' }}>
        {/* Background Decorators */}
        <div className="glow-orb primary orb-tl" style={{ opacity: 0.2 }} />
        <div className="glow-orb secondary orb-br" style={{ opacity: 0.15 }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <motion.h2 variants={itemVariants} className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>Frequently Asked Questions</motion.h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={itemVariants} className="faq-item">
                <h4 className="faq-q">{faq.question}</h4>
                <p className="faq-a">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ position: 'relative' }}>
        {/* Background Decorators */}
        <div className="glow-orb secondary orb-tr" style={{ opacity: 0.3 }} />
        <div className="glow-orb primary orb-bl" style={{ opacity: 0.3 }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="cta-card"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="cta-bg">
            <div className="cta-blob-1" />
            <div className="cta-blob-2" />
          </div>

          <div className="cta-content">
            <motion.h2 variants={itemVariants} className="cta-title">Start Getting AI Betting Insights</motion.h2>
            <motion.p variants={itemVariants} className="cta-desc">
              Message AI Madmoon on WhatsApp and get real-time predictions for any match.<br />
            </motion.p>
            <motion.div variants={itemVariants}>
              <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="btn-icon cta-btn">
                  <MessageCircle size={20} />
                  Start on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
