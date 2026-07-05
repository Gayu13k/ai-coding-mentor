import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user.token) return null; // Don't show navbar if not logged in

  return (
    <nav className="navbar">
      <div className="nav-brand-container">
        {location.pathname !== '/chat' && (
          <button className="btn btn-outline back-btn" onClick={() => navigate(-1)} title="Go Back">
            ←
          </button>
        )}
        <div className="nav-brand">AI Coding Mentor</div>
      </div>
      <div className="nav-links">
        <Link 
          to="/chat" 
          className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
        >
          Mentor Chat
        </Link>
        <Link 
          to="/review" 
          className={`nav-link ${location.pathname === '/review' ? 'active' : ''}`}
        >
          Code Review
        </Link>
        <Link 
          to="/doubt" 
          className={`nav-link ${location.pathname === '/doubt' ? 'active' : ''}`}
        >
          Doubt Solver
        </Link>
        <Link 
          to="/history" 
          className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          History
        </Link>
      </div>
      <div className="nav-user">
        {user.streak && (
          <div className="streak-badge" title="Daily Login Streak">
            🔥 {user.streak}
          </div>
        )}
        <button onClick={toggleTheme} className="btn btn-outline theme-toggle" title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <span className="user-name">Welcome, {user.name}</span>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
