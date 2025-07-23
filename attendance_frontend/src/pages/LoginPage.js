import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
function LoginPage() {
  /**
   * User login page.
   * Calls AuthContext.login(username, password); on success, navigates to dashboard.
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const result = await login(username, password);
    if (result.success) {
      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } else {
      setFormError(result.error || "Login failed. Try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
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
        {formError && (
          <span style={{
            color: "#d32f2f",
            fontSize: "0.98em",
            background: "#fff3f3",
            padding: "8px",
            borderRadius: 5,
            marginBottom: 5
          }}>{formError}</span>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
          disabled={isSubmitting}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
          disabled={isSubmitting}
          required
        />
        <button
          type="submit"
          style={loginBtnStyle}
          disabled={isSubmitting || !username || !password}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
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
