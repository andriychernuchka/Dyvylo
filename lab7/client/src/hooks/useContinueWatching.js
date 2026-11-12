import { useCallback, useEffect, useState } from "react";
import { fetchProgress } from "../api/player";

export function useContinueWatching(enabled, limit = 3) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchProgress(limit);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setItems([]);
      setError(err.message || "Не вдалося завантажити прогрес перегляду");
    } finally {
      setLoading(false);
    }
  }, [enabled, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}
