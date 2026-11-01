// src/hooks/useBookmarks.js

import { useCallback, useEffect, useState } from "react";
import {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  clearBookmarks,
} from "../api/bookmarks";

/**
 * Business logic for the user's bookmarks:
 * - loads them from the API;
 * - adds / removes a title;
 * - clears the whole list;
 * - exposes loading and error state.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookmarks();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Не вдалося завантажити закладки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (item) => {
    setError(null);
    try {
      const created = await addBookmark(item);
      setBookmarks((prev) => {
        if (prev.some((bookmark) => bookmark.id === created.id)) return prev;
        return [...prev, created];
      });
      return created;
    } catch (err) {
      setError(err.message || "Не вдалося додати тайтл до закладок");
      throw err;
    }
  }, []);

  const remove = useCallback(async (id) => {
    setError(null);
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      setError(err.message || "Не вдалося видалити тайтл із закладок");
      throw err;
    }
  }, []);

  const clear = useCallback(async () => {
    setError(null);
    try {
      await clearBookmarks();
      setBookmarks([]);
    } catch (err) {
      setError(err.message || "Не вдалося очистити закладки");
      throw err;
    }
  }, []);

  const isBookmarked = useCallback(
    (id) => bookmarks.some((bookmark) => bookmark.id === id),
    [bookmarks],
  );

  return {
    bookmarks,
    loading,
    error,
    add,
    remove,
    clear,
    isBookmarked,
    reload: load,
  };
}
