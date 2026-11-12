import { useCallback, useEffect, useState } from "react";
import { fetchTitle } from "../api/titles";

export function useTitle(id) {
  const [title, setTitle] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTitle(id);
      setTitle(data);
      setEpisodes(Array.isArray(data?.episodes) ? data.episodes : []);
    } catch (err) {
      setTitle(null);
      setEpisodes([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { title, episodes, loading, error, reload: load };
}
