import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, logoutUser } from "../services/authService.js";

export const AuthContext = createContext(null);

const PUBLIC_PATHS = ["/login", "/request-access", "/register"];

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't call /auth/me on public pages
    const isPublic = PUBLIC_PATHS.includes(window.location.pathname);
    
    if (isPublic) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // even if it fails, clear user
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "DM Sans, sans-serif",
          color: "#64748b",
          fontSize: "16px",
          background: "var(--bg, #0f0f0f)",
        }}>
          Loading...
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};