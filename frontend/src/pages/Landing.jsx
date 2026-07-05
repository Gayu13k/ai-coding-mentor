import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1 className="landing-title">Elevate Your Code.<br/><span className="gradient-text">Master Your Craft.</span></h1>
        <p className="landing-subtitle">
          Experience the future of development with an AI Mentor that understands your architecture, reviews your code, and tracks your daily progress.
        </p>
        <div className="landing-actions">
          <Link to="/register" className="btn btn-primary glow-btn landing-btn">Start Coding Free</Link>
          <Link to="/login" className="btn landing-btn-outline">Login to Workspace</Link>
        </div>
      </div>
      
      <div className="landing-visuals">
        <div className="glass-panel floating-visual feature-card-1">
          <div className="feature-icon">🧠</div>
          <h3>Concept Theory</h3>
          <p>Understand the 'Why' behind complex architectures.</p>
        </div>
        <div className="glass-panel floating-visual feature-card-2">
          <div className="feature-icon">⚡</div>
          <h3>Code Logic</h3>
          <p>Generate highly optimized, production-ready syntax.</p>
        </div>
        <div className="glass-panel floating-visual feature-card-3">
          <div className="feature-icon">🔥</div>
          <h3>Gamification</h3>
          <p>Build your daily streak and level up your skills.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
