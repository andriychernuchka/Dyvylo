import { useState } from 'react';
import { Badge, Button } from '../../../components/ui';
import styles from './PlayerViewport.module.css';

export function PlayerViewport({ title = 'Трансляція', backdrop, quality = '4K UHD' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.playerWrap} data-testid="player-viewport">
      <img
        src={backdrop || 'https://static.tvmaze.com/uploads/images/original_untouched/627/1568449.jpg'}
        alt={title}
        className={styles.videoBackdrop}
      />
      <div className={styles.scanlineOverlay} />

      <div className={styles.topBadge}>
        <Badge variant="live" liveDot>
          ПОВНИЙ ПОТІК
        </Badge>
        <Badge variant="default">{quality}</Badge>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          {title}
        </span>
      </div>

      <div className={styles.hudOverlay}>
        <div
          className={styles.scrubber}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.round(clickPos * 100));
          }}
        >
          <div className={styles.scrubberFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlsLeft}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Пауза' : 'Відтворити'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <span className={styles.timecode}>24:18 / 66:00</span>

            <div className={styles.volumeGroup}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={toggleMute}
                title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
              >
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className={styles.volumeSlider}
              />
            </div>
          </div>

          <div className={styles.controlsRight}>
            <Badge variant="primary">HEVC 10-BIT</Badge>
            <Button variant="ghost" size="sm">
              Аудіо: Цікава Ідея
            </Button>
            <Button variant="ghost" size="sm">
              Субтитри: УКР
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerViewport;
