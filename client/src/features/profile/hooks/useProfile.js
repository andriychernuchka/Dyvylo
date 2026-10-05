import { useAuth } from '../../auth/hooks/useAuth';
import { useBookmarks } from '../../../hooks/useBookmarks';

export function useProfile() {
  const { user } = useAuth();
  const { bookmarks, removeBookmark, addBookmark, toggleBookmark, isBookmarked } =
    useBookmarks();

  return {
    user,
    bookmarks,
    removeBookmark,
    addBookmark,
    toggleBookmark,
    isBookmarked,
  };
}

export default useProfile;
