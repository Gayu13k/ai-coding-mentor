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

const Register = () => {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const codeSnippet = `async function registerUser(userData) {
  const auth = new AIAuthService();
  
  console.log("Initializing secure workspace...");
  const token = await auth.createAccount(userData);
  
  if (token.isValid) {
    workspace.unlockPremiumFeatures();
    workspace.startCodingSession();
  }
  
  return { status: 200, message: "Welcome." };
}`;

  return (
    <div className="auth-split-container">
      <div className="auth-animation-side">
        <div className="hero-text-container">
          <h1 className="hero-tagline">Master Your<br/>Craft.</h1>
          <p className="hero-subtext">Join developers worldwide leveling up their skills with instant AI-driven code reviews and conceptual guidance.</p>
        </div>
        <div className="glass-panel code-animation-panel">
          <div className="window-controls">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <pre className="animated-code">
            <code className="language-js">
              <Typewriter text={codeSnippet} delay={35} />
            </code>
          </pre>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div className="auth-card glass-panel">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join AI Coding Mentor today</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="glass-input"
                required
              />
            </div>
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
                placeholder="Create a password"
                className="glass-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block glow-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
