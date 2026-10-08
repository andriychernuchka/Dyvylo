import { MediaCard } from '../features/catalog/components/MediaCard';
import { Badge, Button } from '../components/ui';
import { MOCK_RELEASES } from '../data/mockData';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const bookmarks = MOCK_RELEASES.slice(0, 4);

  return (
    <div className="container">
      <div className={styles.profile} data-testid="profile-page">
        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>O</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h1 className={styles.name}>@operator</h1>
                <Badge variant="live" liveDot>
                  АКТИВНИЙ ВУЗОЛ
                </Badge>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Шлюз: UA-KYIV-MIRROR-01 · SSD Cache: 128 GB
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
              <span className={styles.statVal}>{bookmarks.length} тайтли</span>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: 8,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Мої закладки (Обране)
              </h2>
            </div>
            <Button variant="ghost" size="sm">
              Очистити список
            </Button>
          </div>

          <div className={styles.grid}>
            {bookmarks.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
