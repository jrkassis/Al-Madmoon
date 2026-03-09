import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { MessageCircle, BrainCircuit, LineChart, Globe, UserCheck, Zap, Server } from 'lucide-react';
import './Features.css';

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

export default function Features() {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI Betting Recommendations',
      description: 'Get data-backed suggestions for your next bet. Al Madmoon analyzes historical data, current form, and betting odds to find value.'
    },
    {
      icon: LineChart,
      title: 'Match Analysis',
      description: 'Request detailed breakdowns of upcoming matches. Understand the strengths, weaknesses, and key matchups before placing your wager.'
    },
    {
      icon: Globe,
      title: 'Multi-Sport Support',
      description: 'Whether it\'s the Premier League, NBA playoffs, or the Monaco Grand Prix, Al Madmoon provides insights across all major sports.'
    },
    {
      icon: UserCheck,
      title: 'Personalized Insights',
      description: 'The AI remembers your preferences and betting history, tailoring its advice to your specific style and favorite teams.'
    },
    {
      icon: Zap,
      title: 'Instant WhatsApp Chat',
      description: 'No apps to install, no complicated interfaces. Just send a message on WhatsApp and get an instant reply.'
    },
    {
      icon: Server,
      title: 'Automation & AI Intelligence',
      description: 'Powered by a robust n8n backend and OpenAI\'s advanced language models, ensuring reliable, fast, and intelligent responses 24/7.'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="features-container"
    >
      <div className="features-header">
        <motion.div variants={fadeIn} className="feature-pill-title">
          Powerful Capabilities
        </motion.div>
        <motion.h1 variants={fadeIn} className="features-title">
          Everything you need to bet smarter.
        </motion.h1>
        <motion.p variants={fadeIn} className="features-subtitle">
          Al Madmoon combines advanced AI with seamless automation to deliver actionable betting insights directly to your phone.
        </motion.p>
      </div>

      <div className="features-bento-grid">

        {/* Large Card: AI Recommendations */}
        <motion.div variants={fadeIn} className="bento-card bento-large">
          <div className="bento-content">
            <div className="feature-icon-wrapper">
              <BrainCircuit size={28} />
            </div>
            <h3 className="feature-card-title">AI Betting Recommendations</h3>
            <p className="feature-card-desc">Get data-backed suggestions for your next bet. Al Madmoon analyzes historical data, current form, and betting odds to find value.</p>
          </div>
          <div className="bento-visual bento-visual-ai">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="ai-node-core"
            />
            <div className="ai-node-ring ring-1"></div>
            <div className="ai-node-ring ring-2"></div>
            <div className="ai-node-ring ring-3"></div>
          </div>
        </motion.div>

        {/* Tall Card: Match Analysis */}
        <motion.div variants={fadeIn} className="bento-card bento-tall">
          <div className="bento-content">
            <div className="feature-icon-wrapper">
              <LineChart size={28} />
            </div>
            <h3 className="feature-card-title">Match Analysis</h3>
            <p className="feature-card-desc">Request detailed breakdowns of upcoming matches. Understand strengths, weaknesses, and key matchups before placing your wager.</p>
          </div>
          <div className="bento-visual bento-visual-chart">
            <div className="chart-bar-container">
              {[40, 70, 50, 90, 60, 85].map((height, i) => (
                <motion.div
                  key={i}
                  className="chart-bar"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Small Card: Multi-Sport */}
        <motion.div variants={fadeIn} className="bento-card bento-small">
          <div className="bento-content">
            <div className="feature-icon-wrapper">
              <Globe size={28} />
            </div>
            <h3 className="feature-card-title">Multi-Sport Support</h3>
            <p className="feature-card-desc">Insights across football, basketball, F1, and more.</p>
          </div>
        </motion.div>

        {/* Small Card: Personalized */}
        <motion.div variants={fadeIn} className="bento-card bento-small">
          <div className="bento-content">
            <div className="feature-icon-wrapper">
              <UserCheck size={28} />
            </div>
            <h3 className="feature-card-title">Personalized Insights</h3>
            <p className="feature-card-desc">The AI remembers your preferences and betting history.</p>
          </div>
        </motion.div>

        {/* Wide Card: Instant WhatsApp Chat */}
        <motion.div variants={fadeIn} className="bento-card bento-wide">
          <div className="bento-content">
            <div className="feature-icon-wrapper">
              <Zap size={28} />
            </div>
            <h3 className="feature-card-title">Instant WhatsApp Chat</h3>
            <p className="feature-card-desc">No apps to install, no complicated interfaces. Just send a message on WhatsApp and get an instant reply.</p>
          </div>
          <div className="bento-visual bento-visual-chat">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0 }}
              className="chat-pill chat-pill-left"
            >
              Analyze tonight's game
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              className="chat-pill chat-pill-right"
            >
              Processing odds...
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Backend Architecture Section */}
      <motion.div variants={fadeIn} className="infra-section">
        <div className="infra-bg-gradient" />

        <div className="infra-layout">
          <div>
            <h2 className="infra-title">Professional-Grade Infrastructure</h2>
            <p className="infra-desc">
              Al Madmoon isn't just a simple chatbot. It's a fully automated backend system designed for speed, accuracy, and personalization.
            </p>

            <div className="infra-list">
              <div className="infra-item">
                <div className="infra-number">
                  <span>1</span>
                </div>
                <div>
                  <h4 className="infra-item-title">User Database</h4>
                  <p className="infra-item-desc">Securely stores your subscription status and preferences.</p>
                </div>
              </div>
              <div className="infra-item">
                <div className="infra-number">
                  <span>2</span>
                </div>
                <div>
                  <h4 className="infra-item-title">n8n Automation</h4>
                  <p className="infra-item-desc">Routes messages, checks subscriptions, and triggers AI analysis instantly.</p>
                </div>
              </div>
              <div className="infra-item">
                <div className="infra-number">
                  <span>3</span>
                </div>
                <div>
                  <h4 className="infra-item-title">OpenAI Engine</h4>
                  <p className="infra-item-desc">Processes complex sports data and generates human-like, actionable insights.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="infra-code">
            <pre className="infra-pre">
              <code>
                {`{
  "user": "Joe",
  "status": "active",
  "query": "Best odds for F1 Monaco GP?",
  "processing": {
    "engine": "OpenAI-GPT4",
    "data_source": "Live Odds API",
    "latency": "450ms"
  },
  "response": "Generated successfully"
}`}
              </code>
            </pre>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="features-cta">
        <h2 className="features-cta-title">Experience the difference today.</h2>
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
