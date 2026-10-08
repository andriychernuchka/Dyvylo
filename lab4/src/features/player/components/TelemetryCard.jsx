import { Badge } from '../../../components/ui';
import styles from './TelemetryCard.module.css';

export function TelemetryCard({
  node = 'UA-KYIV-MIRROR-01',
  bitrate = '38.4 Mbps',
  latency = '18.2 ms',
  buffer = '45.0 s',
  fps = '59.94',
}) {
  return (
    <div className={styles.card} data-testid="telemetry-card">
      <div className={styles.header}>
        <span className={styles.title}>Телеметрія Edge-Вузла</span>
        <Badge variant="live" liveDot>
          ONLINE
        </Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>Шлюз потоку</span>
          <span className={`${styles.value} ${styles.liveValue}`}>{node}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Бітрейт</span>
          <span className={styles.value}>{bitrate}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Затримка (Ping)</span>
          <span className={styles.value}>{latency}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Буфер / FPS</span>
          <span className={styles.value}>{buffer} · {fps}fps</span>
        </div>
      </div>
    </div>
  );
}

export default TelemetryCard;
