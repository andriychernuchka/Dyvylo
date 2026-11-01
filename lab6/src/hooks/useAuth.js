// src/hooks/useAuth.js

import { useCallback, useEffect, useState } from "react";
import * as authApi from "../api/auth";

/**
 * Authentication hook.
 * Login / register call the API through fetch, then persist the session.
 */
export function useAuth() {
  const [user, setUser] = useState(() => authApi.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authApi.isAuthenticated(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sync = () => {
      setUser(authApi.getStoredUser());
      setIsAuthenticated(authApi.isAuthenticated());
    };

    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message || "Не вдалося увійти");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(payload);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message || "Не вдалося зареєструватися");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}
