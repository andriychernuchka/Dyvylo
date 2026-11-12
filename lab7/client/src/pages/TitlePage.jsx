// src/pages/TitlePage.jsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { PlayerViewport } from '../features/player/components/PlayerViewport';
import { TelemetryCard } from '../features/player/components/TelemetryCard';
import { EpisodeCard } from '../features/catalog/components/EpisodeCard';
import { Badge, Button } from '../components/ui';
import styles from './TitlePage.module.css';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../hooks/useAuth';
import { useTitle } from '../hooks/useTitle';
import { useMirrors } from '../hooks/useMirrors';
import {
  fetchTitleProgress,
  saveProgress,
  saveProgressBeacon,
} from '../api/player';

export function TitlePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedEpisodeId = searchParams.get('episode');

  const {
    title: release,
    episodes,
    loading: titleLoading,
    error: titleError,
  } = useTitle(id);
  const { isAuthenticated } = useAuth();
  const {
    bookmarks,
    loading: bookmarksLoading,
    error: bookmarksError,
    add,
    remove,
  } = useBookmarks({ enabled: isAuthenticated });
  const {
    mirrors,
    selectedMirror,
    selectedMirrorId,
    selectMirror,
    error: mirrorsError,
  } = useMirrors(release?.id, isAuthenticated);

  const [notice, setNotice] = useState('');
  const [progress, setProgress] = useState(null);

  const selectedEpisode = useMemo(
    () =>
      requestedEpisodeId
        ? episodes.find((episode) => episode.id === requestedEpisodeId) || null
        : null,
    [episodes, requestedEpisodeId],
  );

  useEffect(() => {
    if (isAuthenticated) setNotice('');
  }, [isAuthenticated]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !release?.id) {
      setProgress(null);
      return undefined;
    }

    fetchTitleProgress(release.id, selectedEpisode?.id)
      .then((data) => {
        if (active) setProgress(data);
      })
      .catch(() => {
        if (active) setProgress(null);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, release?.id, selectedEpisode?.id]);

  const handleToggleFavorite = async () => {
    if (!release) return;

    if (!isAuthenticated) {
      setNotice('Додавати в закладки можна тільки після реєстрації');
      return;
    }

    setNotice('');
    try {
      if (bookmarks.some((bookmark) => bookmark.id === release.id)) {
        await remove(release.id);
      } else {
        await add(release);
      }
    } catch {
      // The error is stored inside useBookmarks and rendered below.
    }
  };

  const handleSaveProgress = useCallback(
    async (payload, { keepalive = false } = {}) => {
      if (!isAuthenticated) return;

      try {
        if (keepalive) {
          await saveProgressBeacon(payload);
        } else {
          await saveProgress(payload);
        }
      } catch {
        // Progress is best-effort: do not interrupt playback with an alert.
      }
    },
    [isAuthenticated],
  );

  if (titleLoading) {
    return (
      <div className="container">
        <p style={{ color: 'var(--text-muted)', padding: '40px 0' }}>
          Завантаження тайтла...
        </p>
      </div>
    );
  }

  if (titleError || !release) {
    return (
      <div className="container">
        <div style={{ padding: '40px 0' }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
            {titleError?.status === 404 ? 'Тайтл не знайдено' : 'Помилка завантаження'}
          </h1>
          <p
            role="alert"
            style={{
              color: 'var(--status-error, #ff4d6d)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {titleError?.message || 'Сервер не повернув дані тайтла'}
          </p>
          <Link to="/catalog">
            <Button variant="ghost">← Повернутися до каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = bookmarks.some((bookmark) => bookmark.id === release.id);
  const bookmarkMessage = notice || bookmarksError;
  const durationSec = selectedEpisode?.durationSec || release.durationSec || 0;

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
              title={
                selectedEpisode
                  ? `${release.title} · ${selectedEpisode.num}`
                  : release.title
              }
              backdrop={release.backdrop || release.poster}
              quality={release.quality}
              titleId={release.id}
              episodeId={selectedEpisode?.id || null}
              durationSec={durationSec}
              initialPositionSec={progress?.positionSec || 0}
              onSaveProgress={isAuthenticated ? handleSaveProgress : undefined}
            />

            {/* Synopsis & Actions */}
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                {release.synopsis}
              </p>
              {bookmarkMessage && (
                <p
                  role="alert"
                  style={{
                    color: 'var(--status-error, #ff4d6d)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    marginBottom: 12,
                  }}
                >
                  {bookmarkMessage}
                </p>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  variant={isFavorite ? 'outline' : 'secondary'}
                  onClick={handleToggleFavorite}
                  disabled={bookmarksLoading}
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
                {episodes.length > 0 ? (
                  <div className={styles.episodesList}>
                    {episodes.map((ep) => (
                      <EpisodeCard
                        key={ep.id}
                        episode={ep}
                        mediaId={release.id}
                        thumb={release.backdrop}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Для цього тайтла епізоди ще не додані.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            {/* Live Telemetry Card */}
            <TelemetryCard
              node={selectedMirror?.name || 'Шлюз не вибрано'}
              latency={selectedMirror?.ping || '—'}
            />

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
              {mirrorsError && (
                <p
                  role="alert"
                  style={{
                    color: 'var(--status-error, #ff4d6d)',
                    fontSize: 11,
                  }}
                >
                  {mirrorsError}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mirrors.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => selectMirror(node.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: selectedMirrorId === node.id ? 'var(--accent-dim)' : 'var(--bg-input)',
                      border: `1px solid ${selectedMirrorId === node.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-xs)',
                      color: selectedMirrorId === node.id ? 'var(--accent-primary)' : 'var(--text-main)',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{node.name}</span>
                    <span style={{ color: 'var(--status-live)' }}>● {node.ping}</span>
                  </button>
                ))}
              </div>
              {!isAuthenticated && (
                <p style={{ color: 'var(--text-dim)', fontSize: 11 }}>
                  Вибір зеркала збережеться після входу.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitlePage;
