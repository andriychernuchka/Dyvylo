import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui';
import styles from './MediaCard.module.css';

export function MediaCard({ item }) {
  if (!item) return null;

  return (
    <Link to={`/title/${item.id}`} className={styles.card} data-testid="media-card">
      <div className={styles.posterWrap}>
        <img
          src={item.poster}
          alt={item.title}
          className={styles.poster}
          loading="lazy"
        />
        <div className={styles.badgesOverlay}>
          <Badge variant="primary">{item.quality || '4K'}</Badge>
          <Badge variant="rating">★ {item.rating}</Badge>
        </div>
      </div>
      <div className={styles.info}>
        <h4 className={styles.title} title={item.title}>
          {item.title}
        </h4>
        <span className={styles.titleUk}>{item.titleUk || item.genre}</span>
        <div className={styles.meta}>
          <span>{item.year}</span>
          <span>{item.studio}</span>
        </div>
      </div>
    </Link>
  );
}

export default MediaCard;
