import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Activity, Shield, Info, BarChart3 } from 'lucide-react';
import './HeroVisual.css';

export function HeroVisual() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        setMousePos({ x, y });
    };

    return (
        <div className="hero-visual-container" onMouseMove={handleMouseMove}>
            {/* Dynamic Glow Core */}
            <motion.div
                className="hero-glow-core"
                animate={{
                    x: mousePos.x * -30,
                    y: mousePos.y * -30,
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ scale: { repeat: Infinity, duration: 4 }, opacity: { repeat: Infinity, duration: 4 } }}
            />

            {/* Decorative Rotating Grid */}
            <div className="hero-orbital-grid" />

            {/* Main Centerpiece: AI Prediction Dashboard Card */}
            <motion.div
                className="prediction-card"
                animate={{
                    rotateX: mousePos.y * 8,
                    rotateY: mousePos.x * -8,
                    y: [-10, 10, -10]
                }}
                transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut" }, rotateX: { type: 'spring', stiffness: 75 }, rotateY: { type: 'spring', stiffness: 75 } }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="pc-header">
                    <div className="pc-match-info">
                        <span className="pc-live-tag"><span className="live-dot" /> LIVE ANALYSIS</span>
                        <h3 className="pc-match-title">Lakers vs Warriors</h3>
                        <p className="pc-league">NBA Regular Season</p>
                    </div>
                    <div className="pc-engine-badge">
                        <Activity size={14} />
                        AI Engine 4.0
                    </div>
                </div>

                <div className="pc-content">
                    {/* Win Probability Section */}
                    <div className="pc-section">
                        <div className="pc-section-header">
                            <BarChart3 size={16} />
                            <span>Win Probability</span>
                        </div>
                        <div className="pc-prob-bars">
                            <div className="pc-prob-item">
                                <div className="pc-prob-labels">
                                    <span>Warriors</span>
                                    <span className="pc-prob-val highlight">64%</span>
                                </div>
                                <div className="pc-prob-track">
                                    <motion.div
                                        className="pc-prob-fill warriors"
                                        initial={{ width: 0 }}
                                        animate={{ width: '64%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                            <div className="pc-prob-item">
                                <div className="pc-prob-labels">
                                    <span>Lakers</span>
                                    <span className="pc-prob-val">36%</span>
                                </div>
                                <div className="pc-prob-track">
                                    <motion.div
                                        className="pc-prob-fill lakers"
                                        initial={{ width: 0 }}
                                        animate={{ width: '36%' }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Bet & Confidence */}
                    <div className="pc-grid-row">
                        <div className="pc-mini-card">
                            <div className="pc-mini-label">BEST BET</div>
                            <div className="pc-mini-value highlight">Warriors ML</div>
                            <div className="pc-mini-sub">@ 1.72 Odds</div>
                        </div>
                        <div className="pc-mini-card">
                            <div className="pc-mini-label">CONFIDENCE</div>
                            <div className="pc-mini-value">High (82%)</div>
                            <div className="pc-confidence-bar">
                                <div className="pc-confidence-fill" style={{ width: '82%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Key Factors */}
                    <div className="pc-section">
                        <div className="pc-section-header">
                            <Info size={16} />
                            <span>Key Factors</span>
                        </div>
                        <ul className="pc-factors-list">
                            <li><Shield size={12} className="text-brand" /> Lakers missing two starters</li>
                            <li><TrendingUp size={12} className="text-brand" /> Warriors home win rate 71%</li>
                            <li><Target size={12} className="text-brand" /> Historical matchup advantage</li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Floating Analytical Widgets */}
            <motion.div
                className="alt-float-widget fw-top-right"
                animate={{ y: [-10, 10, -10], x: mousePos.x * 15 }}
                transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
            >
                <div className="fw-label">ODDS MOVEMENT</div>
                <div className="fw-chart">
                    <div className="chart-bar" style={{ height: '40%' }} />
                    <div className="chart-bar" style={{ height: '60%' }} />
                    <div className="chart-bar" style={{ height: '45%' }} />
                    <div className="chart-bar highlight" style={{ height: '80%' }} />
                </div>
            </motion.div>

            <motion.div
                className="alt-float-widget fw-bottom-left"
                animate={{ y: [15, -15, 15], x: mousePos.x * -15 }}
                transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 } }}
            >
                <div className="fw-stat">
                    <span className="fw-stat-label">EXPECTED VALUE</span>
                    <span className="fw-stat-val">+8.4%</span>
                </div>
            </motion.div>

            <motion.div
                className="alt-float-widget fw-top-left"
                animate={{ y: [8, -8, 8], x: mousePos.y * 10 }}
                transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 } }}
            >
                <div className="fw-label">LIVE DATA FEED</div>
                <div className="fw-feed-item">
                    <div className="feed-dot" />
                    <span>Scraping markets...</span>
                </div>
            </motion.div>

        </div>
    );
}

