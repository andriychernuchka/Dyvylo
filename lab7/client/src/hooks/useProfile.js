import { useCallback, useEffect, useState } from "react";
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../api/profile";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchProfile());
    } catch (err) {
      setError(err.message || "Не вдалося завантажити профіль");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(async (patch) => {
    setError(null);
    try {
      const next = await updateProfile(patch);
      setProfile(next);
      return next;
    } catch (err) {
      setError(err.message || "Не вдалося оновити профіль");
      throw err;
    }
  }, []);

  const updatePassword = useCallback(async (payload) => {
    setError(null);
    try {
      return await changePassword(payload);
    } catch (err) {
      setError(err.message || "Не вдалося змінити пароль");
      throw err;
    }
  }, []);

  return {
    profile,
    loading,
    error,
    update,
    updatePassword,
    reload: load,
  };
}
