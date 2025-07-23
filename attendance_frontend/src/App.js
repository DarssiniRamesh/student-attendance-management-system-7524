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

import AuthProvider, { useAuth } from './AuthContext';

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function UnauthedOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
        <Main theme={theme} toggleTheme={toggleTheme} />
      </Router>
    </AuthProvider>
  );
}

// Core app layout and routing
function Main({ theme, toggleTheme }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {isAuthenticated && <Sidebar />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
        <div style={{ flex: 1, padding: isAuthenticated ? "32px 24px" : 0 }}>
          <Routes>
            <Route
              path="/login"
              element={
                <UnauthedOnlyRoute>
                  <LoginPage />
                </UnauthedOnlyRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <ClassesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
