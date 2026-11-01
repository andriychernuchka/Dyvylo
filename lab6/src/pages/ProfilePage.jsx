import { MediaCard } from "../features/catalog/components/MediaCard";
import { Badge, Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useBookmarks } from "../hooks/useBookmarks";
import styles from "./ProfilePage.module.css";

export function ProfilePage() {
  const { user } = useAuth();
  const { bookmarks, loading, error, remove, clear } = useBookmarks();

  const displayName = user?.name || "operator";
  const avatarLetter = displayName[0].toUpperCase();

  const handleRemove = async (id) => {
    try {
      await remove(id);
    } catch {
      // The error is stored inside useBookmarks and rendered below.
    }
  };

  const handleClear = async () => {
    if (!bookmarks.length) return;
    try {
      await clear();
    } catch {
      // The error is stored inside useBookmarks and rendered below.
    }
  };

  return (
    <div className="container">
      <div className={styles.profile} data-testid="profile-page">
        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{avatarLetter}</div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <h1 className={styles.name}>@{displayName}</h1>
                <Badge variant="live" liveDot>
                  АКТИВНИЙ ВУЗОЛ
                </Badge>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Шлюз: UA-KYIV-MIRROR-01
              </p>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Переглянуто</span>
              <span className={styles.statVal}>38.5 год</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>В обраному</span>
              <span className={styles.statVal}>
                {loading ? "…" : `${bookmarks.length} тайтли`}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Аптайм</span>
              <span className={styles.statVal}>99.98%</span>
            </div>
          </div>
        </div>

        {/* Bookmarks Section */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: 8,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Мої закладки (Обране)
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={loading || bookmarks.length === 0}
            >
              Очистити список
            </Button>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: "var(--status-error, #ff4d6d)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}

          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Завантаження закладок...
            </p>
          ) : bookmarks.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border-subtle)",
                padding: 28,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              У вас ще немає закладок. Додайте тайтл зі сторінки релізу.
            </div>
          ) : (
            <div className={styles.grid}>
              {bookmarks.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
