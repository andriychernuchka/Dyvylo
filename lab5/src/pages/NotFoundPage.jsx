import { Link, useLocation } from 'react-router-dom';
import { Badge, Button } from '../components/ui';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="container">
      <div className={styles.page} data-testid="not-found-page">
        <div className={styles.box}>
          <div className={styles.statusRow}>
            <Badge variant="danger">ПОМИЛКА 404</Badge>
            <Badge variant="default">ВУЗОЛ НЕ ЗНАЙДЕНО</Badge>
          </div>

          <div className={styles.code}>404</div>
          <h1 className={styles.title}>Такої сторінки не існує</h1>
          <p className={styles.text}>
            Шлюз не знайшов маршрут за адресою{' '}
            <code className={styles.path}>{location.pathname}</code>. Можливо,
            посилання застаріле або в адресі є помилка.
          </p>

          <div className={styles.actions}>
            <Link to="/">
              <Button variant="primary" size="md">
                ← На головну
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="outline" size="md">
                До каталогу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
