import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem("proctocare_token");
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch { localStorage.removeItem("proctocare_token"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("proctocare_token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("proctocare_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
