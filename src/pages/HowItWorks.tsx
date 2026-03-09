import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { MessageCircle, CreditCard, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: 'Subscribe via Whish',
      description: 'Send your payment securely via Whish Money to activate your 1-month subscription.',
      colorClass: 'step-color-blue'
    },
    {
      icon: CheckCircle,
      title: 'Get Access',
      description: 'Once payment is confirmed, our automated system instantly adds you to the Al Madmoon database.',
      colorClass: 'step-color-brand'
    },
    {
      icon: Smartphone,
      title: 'Chat with the AI',
      description: 'Open WhatsApp and start asking about matches, odds, predictions, or specific sports.',
      colorClass: 'step-color-sky'
    },
    {
      icon: MessageCircle,
      title: 'Get Recommendations',
      description: 'Receive personalized, AI-powered betting insights instantly, tailored to your queries.',
      colorClass: 'step-color-indigo'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="hiw-container"
    >
      <div className="hiw-header">
        <motion.h1 variants={fadeIn} className="hiw-title">
          How Al Madmoon Works
        </motion.h1>
        <motion.p variants={fadeIn} className="hiw-subtitle">
          A seamless, automated experience from payment to prediction. No apps to download, just smart insights delivered directly to your WhatsApp.
        </motion.p>
      </div>

      <div className="hiw-timeline-section">
        <div className="timeline-svg-container">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="timeline-svg">
            <path
              d="M 50 0 C 50 200, 80 250, 50 500 C 20 750, 50 800, 50 1000"
              fill="transparent"
              strokeWidth="2"
              stroke="var(--color-brand-200)"
              strokeDasharray="8 8"
            />
            <motion.path
              d="M 50 0 C 50 200, 80 250, 50 500 C 20 750, 50 800, 50 1000"
              fill="transparent"
              strokeLinecap="round"
              strokeWidth="4"
              stroke="url(#gradientPrimary)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 3, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-brand-600)" />
                <stop offset="100%" stopColor="var(--color-brand-300)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="timeline-steps">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`timeline-step-wrapper ${isEven ? 'step-left' : 'step-right'}`}
              >
                <div className={`step-3d-card ${step.colorClass}`}>
                  <div className="step-3d-card-inner">
                    <div className="step-icon-3d">
                      <step.icon size={32} />
                    </div>
                    <div className="step-content-3d">
                      <div className="step-label">Step 0{index + 1}</div>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-desc">{step.description}</p>
                    </div>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-node-inner" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div variants={fadeIn} className="arch-block">
        <div className="arch-text-content">
          <h2 className="arch-title">Powered by Advanced Automation</h2>
          <p className="arch-desc">
            Behind the scenes, Al Madmoon uses n8n automation workflows connected directly to OpenAI's powerful language models. This ensures every response is data-driven, personalized, and delivered in milliseconds.
          </p>
          <ul className="arch-features">
            {['Secure user database', 'Real-time odds processing', 'Personalized interaction history'].map((item, i) => (
              <li key={i} className="arch-feature-item">
                <CheckCircle size={20} className="text-brand" style={{ color: 'var(--color-brand-500)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="arch-visual">
          <div className="arch-circle">
            <div className="arch-circle-bg" />
            <div className="arch-nodes">
              <div className="arch-node-1">
                <span>n8n</span>
              </div>
              <ArrowRight size={24} className="arch-arrow" />
              <div className="arch-node-2">
                <span>AI</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="hiw-cta">
        <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="btn-icon btn-shadow" style={{ display: 'inline-flex' }}>
            <MessageCircle size={20} />
            Start on WhatsApp
          </Button>
        </a>
      </motion.div>
    </motion.div>
  );
}
