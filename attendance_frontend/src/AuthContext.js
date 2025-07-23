import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

// PUBLIC_INTERFACE
const AuthContext = createContext();

// Helper: Read JWT from storage
function getToken() {
  return localStorage.getItem("jwtToken");
}

/**
 * Attach Authorization header with JWT to fetch requests.
 * Usage: fetchWithAuth(url, options)
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to use auth context */
  return useContext(AuthContext);
}

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// PUBLIC_INTERFACE
function AuthProvider({ children }) {
  /**
   * AuthContext Provider for managing JWT tokens and authenticated user state.
   * Persists JWT in localStorage. Fetches /auth/me on mount if JWT exists.
   */
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);

  // On mount: if token, fetch user
  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("jwtToken");
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (username, password) => {
    // Obtains token by POSTing form data to /auth/login, then fetches /auth/me
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("jwtToken", data.access_token);

      const userRes = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (userRes.ok) {
        setUser(await userRes.json());
        return { success: true };
      }
      return { success: false, error: "Failed to fetch user profile" };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwtToken");
    // (Optionally, POST to /auth/logout but not needed for stateless JWT)
  }, []);

  // PUBLIC_INTERFACE
  const value = {
    loading,
    isAuthenticated: !!user,
    user,
    login,
    logout,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
