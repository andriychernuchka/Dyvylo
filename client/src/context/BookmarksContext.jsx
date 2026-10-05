import { useState, useEffect, useCallback } from 'react';
import { BookmarksContext, BOOKMARKS_KEY } from './bookmarksContextDef';
import { storageService } from '../services/storage/localStorageService';

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    return storageService.get(BOOKMARKS_KEY, []);
  });

  useEffect(() => {
    storageService.set(BOOKMARKS_KEY, bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id) => {
      if (!id) return false;
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks]
  );

  const addBookmark = useCallback((item) => {
    if (!item || !item.id) return;
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id) => {
    if (!id) return;
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleBookmark = useCallback(
    (item) => {
      if (!item || !item.id) return false;
      const exists = bookmarks.some((b) => b.id === item.id);
      if (exists) {
        removeBookmark(item.id);
        return false;
      }
      addBookmark(item);
      return true;
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        addBookmark,
        removeBookmark,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export default BookmarksProvider;
