import React, { useState } from "react";

// PUBLIC_INTERFACE
function LoginPage({ onLogin }) {
  /**
   * User login page.
   * @param {Function} onLogin - Callback to authenticate user.
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Add fetch to backend. For now, onLogin is called immediately.

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth logic would go here, replaced with fake login for now.
    onLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--bg-secondary)",
          borderRadius: 12,
          boxShadow: "0 0 20px 4px rgba(0,0,0,0.055)",
          padding: "38px 30px 30px 30px",
          minWidth: 320,
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
          gap: 18
        }}
      >
        <h2 style={{ marginBottom: 12, color: "var(--text-primary)" }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={loginBtnStyle}>Login</button>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "#fff",
  border: "1px solid var(--border-color, #eee)",
  padding: "12px",
  borderRadius: 7,
  marginBottom: 0,
  fontSize: "1rem",
  color: "var(--text-primary)"
};

const loginBtnStyle = {
  background: "var(--button-bg, #1976d2)",
  color: "var(--button-text, #fff)",
  padding: "12px",
  border: "none",
  borderRadius: 7,
  fontWeight: 600,
  fontSize: "1rem",
  marginTop: 8,
  cursor: "pointer"
};

export default LoginPage;
