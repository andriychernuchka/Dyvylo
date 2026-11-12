import { useCallback, useEffect, useState } from "react";
import { fetchTitles } from "../api/titles";

/**
 * Loads a filtered page of titles from the API.
 */
export function useTitles({
  search = "",
  type = "all",
  sort = "rating",
  order = "desc",
  limit = 100,
} = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTitles({ search, type, sort, order, limit });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(data?.total || 0);
      setPage(data?.page || 1);
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(err.message || "Не вдалося завантажити каталог");
    } finally {
      setLoading(false);
    }
  }, [search, type, sort, order, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, total, page, loading, error, reload: load };
}
