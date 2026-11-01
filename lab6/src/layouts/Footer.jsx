import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} data-testid="site-footer">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <div className={styles.brandSquare}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className={styles.brandName}>ДИВИЛО.</span>
            </div>
            <p className={styles.desc}>
              Український стрімінг-агрегатор нового покоління. Ми не зберігаємо відеофайли,
              а виступаємо комфортним та швидким посередником для перегляду відкритих потоків
              без реклами з чистим плеєром та живою телеметрією.
            </p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Навігація</h4>
            <ul className={styles.links}>
              <li><Link to="/catalog">Головна каталогу</Link></li>
              <li><Link to="/catalog?type=movies">Фільми у 4K HDR</Link></li>
              <li><Link to="/catalog?type=series">Серіали та онґоїнґи</Link></li>
              <li><Link to="/catalog?type=anime">Культове аніме</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Студії озвучки</h4>
            <ul className={styles.links}>
              <li><Link to="/catalog">Цікава Ідея</Link></li>
              <li><Link to="/catalog">НеЗупиняйПродакшн</Link></li>
              <li><Link to="/catalog">В одне рило</Link></li>
              <li><Link to="/catalog">DniproFilm</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Шлюз та профіль</h4>
            <ul className={styles.links}>
              <li><Link to="/profile">Особистий кабінет</Link></li>
              <li><Link to="/auth">Вхід та реєстрація</Link></li>
              <li><a href="https://github.com/andriychernuchka/Dyvylo" target="_blank" rel="noreferrer">GitHub репозиторій</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© 2026 ДИВИЛО · УСІ ПРАВА НАЛЕЖАТЬ ПРАВОВЛАСНИКАМ · АГРЕГАТОР-ПОСЕРЕДНИК</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className={styles.telemetryBadge}>
              <span className={styles.dot} />
              <span>КИЇВ #1 ACTIVE</span>
            </span>
            <span>ПІНГ: 18.2 MS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
