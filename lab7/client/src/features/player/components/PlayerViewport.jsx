import { useEffect, useRef, useState } from "react";
import { Badge, Button } from "../../../components/ui";
import styles from "./PlayerViewport.module.css";

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function PlayerViewport({
  title = "Blade Runner 2049",
  backdrop,
  quality = "4K UHD",
  titleId,
  episodeId,
  durationSec = 0,
  initialPositionSec = 0,
  onSaveProgress,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [positionSec, setPositionSec] = useState(initialPositionSec);

  const persistRef = useRef(() => {});
  const positionRef = useRef(initialPositionSec);
  const dirtyRef = useRef(false);

  useEffect(() => {
    positionRef.current = positionSec;
  }, [positionSec]);

  useEffect(() => {
    setPositionSec(initialPositionSec || 0);
  }, [initialPositionSec, titleId, episodeId]);

  useEffect(() => {
    persistRef.current = (position = positionSec, keepalive = false) => {
      if (!onSaveProgress || !titleId) return;

      onSaveProgress(
        {
          titleId,
          episodeId: episodeId || null,
          positionSec: position,
          durationSec,
          completed: durationSec > 0 && position >= durationSec * 0.95,
        },
        { keepalive },
      );
    };
  }, [onSaveProgress, titleId, episodeId, positionSec, durationSec]);

  // Simulate playback so the progress API receives real timestamps.
  useEffect(() => {
    if (!isPlaying || !durationSec) return undefined;

    const timer = setInterval(() => {
      dirtyRef.current = true;
      setPositionSec((current) => Math.min(durationSec, current + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, durationSec]);

  // Save every 10 seconds of playback.
  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = setInterval(() => persistRef.current(), 10_000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Save when the tab is closed or the player unmounts.
  useEffect(() => {
    const handlePageHide = () => {
      if (dirtyRef.current) persistRef.current(positionRef.current, true);
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (dirtyRef.current) persistRef.current(positionRef.current, true);
    };
  }, []);

  useEffect(() => {
    if (durationSec > 0 && positionSec >= durationSec && isPlaying) {
      dirtyRef.current = true;
      setIsPlaying(false);
      persistRef.current(positionSec);
    }
  }, [positionSec, durationSec, isPlaying]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      dirtyRef.current = true;
      persistRef.current();
      setIsPlaying(false);
      return;
    }

    if (durationSec > 0 && positionSec >= durationSec) {
      setPositionSec(0);
    }

    setIsPlaying(true);
  };

  const progressPercent = durationSec > 0
    ? Math.min(100, (positionSec / durationSec) * 100)
    : 0;

  return (
    <div className={styles.playerWrap} data-testid="player-viewport">
      <img
        src={
          backdrop ||
          "https://image.tmdb.org/t/p/w1280/ilRyazdMJwN05exqhwK4tMKBYZs.jpg"
        }
        alt={title}
        className={styles.videoBackdrop}
      />
      <div className={styles.scanlineOverlay} />

      <div className={styles.topBadge}>
        <Badge variant="live" liveDot>
          ПОВНИЙ ПОТІК
        </Badge>
        <Badge variant="default">{quality}</Badge>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          {title}
        </span>
      </div>

      <div className={styles.hudOverlay}>
        <div
          className={styles.scrubber}
          onClick={(e) => {
            if (!durationSec) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const nextPosition = Math.round(
              Math.min(1, Math.max(0, clickPos)) * durationSec,
            );

            setPositionSec(nextPosition);
            dirtyRef.current = true;
            persistRef.current(nextPosition);
          }}
        >
          <div
            className={styles.scrubberFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlsLeft}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={togglePlayback}
              title={isPlaying ? "Пауза" : "Відтворити"}
            >
              {isPlaying ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <span className={styles.timecode}>
              {formatTime(positionSec)} / {formatTime(durationSec)}
            </span>

            <div className={styles.volumeGroup}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={toggleMute}
                title={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
              Аудіо: Офіційний дубляж
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
