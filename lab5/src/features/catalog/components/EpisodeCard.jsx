import { Link } from 'react-router-dom';
import styles from './EpisodeCard.module.css';

export function EpisodeCard({ episode, mediaId = 'house-of-the-dragon', thumb }) {
  return (
    <Link to={`/player/${mediaId}`} className={styles.card}>
      <div className={styles.thumbWrap}>
        <img
          src={thumb || 'https://static.tvmaze.com/uploads/images/original_untouched/627/1568449.jpg'}
          alt={episode.title}
          className={styles.thumb}
        />
        <span className={styles.durationBadge}>{episode.duration}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.num}>{episode.num}</span>
        <h4 className={styles.title}>{episode.title}</h4>
        <p className={styles.desc}>{episode.desc}</p>
        {episode.progress > 0 && (
          <div className={styles.progressWrap}>
            <div
              className={styles.progressFill}
              style={{ width: `${episode.progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

export default EpisodeCard;
