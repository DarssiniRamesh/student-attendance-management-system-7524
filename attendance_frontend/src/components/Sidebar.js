import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// PUBLIC_INTERFACE
function Sidebar() {
  /**
   * Sidebar navigation for main pages.
   * Modern, minimal, and collapsible if needed.
   */
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Students", path: "/students", icon: "👨‍🎓" },
    { label: "Classes", path: "/classes", icon: "🏫" },
    { label: "Attendance", path: "/attendance", icon: "🗓️" },
    { label: "Reports", path: "/reports", icon: "📊" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Attendance Tracker</div>
      <ul className="sidebar-list">
        {navItems.map(item => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
