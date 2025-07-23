import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import ClassesPage from './pages/ClassesPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  // TODO: Implement actual authentication logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Placeholder for authentication logic
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <div className="App" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
        {isAuthenticated && <Sidebar />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar 
            theme={theme}
            toggleTheme={toggleTheme}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          <div style={{ flex: 1, padding: isAuthenticated ? "32px 24px" : 0 }}>
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
              } />
              <Route path="/dashboard" element={
                isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
              } />
              <Route path="/students" element={
                isAuthenticated ? <StudentsPage /> : <Navigate to="/login" />
              } />
              <Route path="/classes" element={
                isAuthenticated ? <ClassesPage /> : <Navigate to="/login" />
              } />
              <Route path="/attendance" element={
                isAuthenticated ? <AttendancePage /> : <Navigate to="/login" />
              } />
              <Route path="/reports" element={
                isAuthenticated ? <ReportsPage /> : <Navigate to="/login" />
              } />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
