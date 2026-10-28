import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayerViewport } from '../features/player/components/PlayerViewport';
import { TelemetryCard } from '../features/player/components/TelemetryCard';
import { EpisodeCard } from '../features/catalog/components/EpisodeCard';
import { Badge, Button } from '../components/ui';
import { MOCK_RELEASES, MOCK_EPISODES, STREAM_NODES } from '../data/mockData';
import styles from './TitlePage.module.css';

export function TitlePage() {
  const { id } = useParams();
  const [selectedNode, setSelectedNode] = useState(STREAM_NODES[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find release by ID, default to first release
  const release =
    MOCK_RELEASES.find((r) => r.id === id) || MOCK_RELEASES[0];

  return (
    <div className="container">
      <div className={styles.page} data-testid="title-page">
        {/* Title Header */}
        <div className={styles.titleHeader}>
          <div className={styles.badges}>
            <Badge variant="primary">{release.quality}</Badge>
            <Badge variant="rating">★ {release.rating}</Badge>
            <Badge variant="default">{release.year}</Badge>
            <Badge variant="default">{release.studio}</Badge>
          </div>
          <h1 className={styles.mainTitle}>{release.title}</h1>
          <div className={styles.titleUk}>{release.titleUk}</div>
        </div>

        {/* Main Grid: Player + Specs & Telemetry */}
        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            {/* Embedded Player */}
            <PlayerViewport
              title={release.title}
              backdrop={release.backdrop || release.poster}
              quality={release.quality}
            />

            {/* Synopsis & Actions */}
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                {release.synopsis}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  variant={isFavorite ? 'outline' : 'secondary'}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? '✓ Збережено в обраному' : '+ Додати в обране'}
                </Button>
                <Link to="/catalog">
                  <Button variant="ghost">← Повернутися до каталогу</Button>
                </Link>
              </div>
            </div>

            {/* Episodes List (if series/anime) */}
            {release.type !== 'movies' && (
              <div className={styles.episodesSection}>
                <h3 className={styles.episodesHeader}>Список епізодів сезону</h3>
                <div className={styles.episodesList}>
                  {MOCK_EPISODES.map((ep) => (
                    <EpisodeCard
                      key={ep.id}
                      episode={ep}
                      mediaId={release.id}
                      thumb={release.backdrop}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            {/* Live Telemetry Card */}
            <TelemetryCard node={selectedNode.name} latency={selectedNode.ping} />

            {/* Technical Specs Card */}
            <div className={styles.specsCard}>
              <div className={styles.specsTitle}>Технічна специфікація</div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Формат</span>
                <span className={styles.specVal}>{release.quality}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Бітрейт</span>
                <span className={styles.specVal}>{release.bitrate}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Тривалість</span>
                <span className={styles.specVal}>{release.duration}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Студія дубляжу</span>
                <span className={styles.specVal}>{release.studio}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Режисер / Творець</span>
                <span className={styles.specVal}>{release.creator}</span>
              </div>
            </div>

            {/* Stream Gateway Selector */}
            <div className={styles.specsCard}>
              <div className={styles.specsTitle}>Шлюз ретрансляції</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STREAM_NODES.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: selectedNode.id === node.id ? 'var(--accent-dim)' : 'var(--bg-input)',
                      border: `1px solid ${selectedNode.id === node.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-xs)',
                      color: selectedNode.id === node.id ? 'var(--accent-primary)' : 'var(--text-main)',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{node.name}</span>
                    <span style={{ color: 'var(--status-live)' }}>● {node.ping}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitlePage;
