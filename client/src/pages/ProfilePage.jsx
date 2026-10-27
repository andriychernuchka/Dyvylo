import { useAuth } from '../features/auth/hooks/useAuth';
import { ProfileHeader } from '../features/profile/components/ProfileHeader';
import { BookmarksList } from '../features/profile/components/BookmarksList';
import { useBookmarks } from '../hooks/useBookmarks';

export function ProfilePage() {
  const { user } = useAuth();
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <section data-testid="profile-page">
      <h1>Особистий кабінет</h1>
      <ProfileHeader user={user} />
      <BookmarksList bookmarks={bookmarks} onRemove={removeBookmark} />
    </section>
  );
}

export default ProfilePage;
