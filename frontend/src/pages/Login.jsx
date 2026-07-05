import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Typewriter = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="cursor">_</span></span>;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const codeSnippet = `function initializeAI() {
  const mentor = new AICodingMentor();
  mentor.loadContext('React', 'JavaScript');
  
  if (developer.hasDoubt) {
    mentor.analyzeRootCause();
    mentor.provideOptimalSolution();
  }
  
  return success;
}`;

  return (
    <div className="auth-split-container">
      <div className="auth-animation-side">
        <div className="hero-text-container">
          <h1 className="hero-tagline">Code Smarter.<br/>Not Harder.</h1>
          <p className="hero-subtext">Your personal AI mentor is ready to debug, explain, and optimize your logic in real-time.</p>
        </div>
        <div className="glass-panel code-animation-panel">
          <div className="window-controls">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <pre className="animated-code">
            <code className="language-js">
              <Typewriter text={codeSnippet} delay={40} />
            </code>
          </pre>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div className="auth-card glass-panel">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to access AI Coding Mentor</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="glass-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block glow-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
