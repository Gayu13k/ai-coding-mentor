import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MentorChat from './pages/MentorChat';
import CodeReview from './pages/CodeReview';
import History from './pages/History';
import DoubtSolver from './pages/DoubtSolver';
import Landing from './pages/Landing';

function App() {
  React.useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    const moveCursor = (e) => {
      if(cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <div id="custom-cursor" className="glow-cursor"></div>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <MentorChat />
                </ProtectedRoute>
              } />
              
              <Route path="/review" element={
                <ProtectedRoute>
                  <CodeReview />
                </ProtectedRoute>
              } />
              
              <Route path="/doubt" element={
                <ProtectedRoute>
                  <DoubtSolver />
                </ProtectedRoute>
              } />
              
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
          </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
