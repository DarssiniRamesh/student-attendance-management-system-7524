import React from "react";
import "./Topbar.css";

// PUBLIC_INTERFACE
function Topbar({ theme, toggleTheme, isAuthenticated, onLogout }) {
  /**
   * Topbar for global actions (theme toggle, logout, etc.)
   */
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Placeholder for logo or application name on larger screens */}
      </div>
      <div className="topbar-actions">
        <button 
          className="topbar-btn theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {isAuthenticated && (
          <button className="topbar-btn logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Topbar;
