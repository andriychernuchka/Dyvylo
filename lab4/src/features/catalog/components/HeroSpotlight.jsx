import { useState } from 'react';
import { Badge, Button } from '../../../components/ui';
import styles from './HeroSpotlight.module.css';

export function HeroSpotlight({ release }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!release) return null;

  return (
    <section className={styles.hero} data-testid="hero-spotlight">
      <img
        src={release.backdrop || release.poster}
        alt={release.title}
        className={styles.bgPoster}
      />
      <div className={styles.content}>
        <div className={styles.badges}>
          <Badge variant="primary">НОВИЙ СЕЗОН</Badge>
          <Badge variant="live" liveDot>
            4K UHD MASTER
          </Badge>
          <Badge variant="rating">★ {release.rating}</Badge>
        </div>

        <h1 className={styles.title}>{release.title}</h1>
        <div className={styles.titleUk}>{release.titleUk}</div>

        <p className={styles.synopsis}>{release.synopsis}</p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span>Рік:</span>
            <span className={styles.metaValue}>{release.year}</span>
          </div>
          <div className={styles.metaItem}>
            <span>Студія:</span>
            <span className={styles.metaValue}>{release.studio}</span>
          </div>
          <div className={styles.metaItem}>
            <span>Бітрейт:</span>
            <span className={styles.metaValue}>{release.bitrate}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <a href="#player">
            <Button variant="primary" size="lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Дивитися зараз
            </Button>
          </a>
          <a href="#details">
            <Button variant="secondary" size="lg">
              Деталі та серії
            </Button>
          </a>
          <Button
            variant={isBookmarked ? 'outline' : 'ghost'}
            size="lg"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? '✓ В обраному' : '+ В обране'}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSpotlight;
